import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';

import {
  getDashboardSummary,
  getInventorySummary,
  getRevenueSummary,
} from '../../api/statistics';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadCsv } from '../../utils/csv';
import { downloadWorkbook } from '../../utils/excel';
import { formatCurrency, formatDate } from '../../utils/formatters';

const EMPTY_DATE_RANGE = {
  startDate: '',
  endDate: '',
};

function getActiveDateFilter(dateRange) {
  if (!dateRange.startDate && !dateRange.endDate) {
    return null;
  }

  return {
    startDate: dateRange.startDate || null,
    endDate: dateRange.endDate || null,
  };
}

function buildReportFileName(prefix, dateRange) {
  const { startDate, endDate } = dateRange;

  if (startDate && endDate) {
    return `${prefix}-${startDate}-den-${endDate}.csv`;
  }

  if (startDate) {
    return `${prefix}-tu-${startDate}.csv`;
  }

  if (endDate) {
    return `${prefix}-den-${endDate}.csv`;
  }

  return `${prefix}-toan-bo.csv`;
}

function StatisticsPage() {
  const { token } = useAuth();
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [inventorySummary, setInventorySummary] = useState([]);
  const [revenueSummary, setRevenueSummaryState] = useState([]);
  const [filterForm, setFilterForm] = useState(EMPTY_DATE_RANGE);
  const [appliedDateRange, setAppliedDateRange] = useState(EMPTY_DATE_RANGE);
  const [errorMessage, setErrorMessage] = useState('');

  const activeDateFilter = useMemo(
    () => getActiveDateFilter(appliedDateRange),
    [appliedDateRange]
  );

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setErrorMessage('');
        const [dashboardData, inventoryData, revenueData] = await Promise.all([
          getDashboardSummary(token, activeDateFilter),
          getInventorySummary(token),
          getRevenueSummary(token, activeDateFilter),
        ]);

        if (!ignore) {
          setDashboardSummary(dashboardData);
          setInventorySummary(inventoryData);
          setRevenueSummaryState(revenueData);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error?.payload?.message || error.message);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [activeDateFilter, token]);

  const metrics = useMemo(
    () => [
      {
        label: 'Tổng mẫu máy',
        value: `${dashboardSummary?.totalProducts || 0} mẫu máy`,
      },
      {
        label: 'Biến thể đang quản lý',
        value: `${dashboardSummary?.totalVariants || 0} biến thể`,
      },
      {
        label: 'IMEI còn trong hệ thống',
        value: `${dashboardSummary?.totalInventoryItems || 0} IMEI`,
      },
      {
        label: 'Doanh thu đã ghi nhận',
        value: formatCurrency(dashboardSummary?.totalRevenue || 0),
      },
    ],
    [dashboardSummary]
  );

  const revenueChartOptions = useMemo(
    () => ({
      chart: {
        id: 'revenue-chart',
        toolbar: { show: false },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: revenueSummary.map((row) => formatDate(row.soldDate)),
      },
      yaxis: {
        labels: {
          formatter: (value) => formatCurrency(value),
        },
      },
      tooltip: {
        y: {
          formatter: (value) => formatCurrency(value),
        },
      },
      colors: ['#0f766e'],
    }),
    [revenueSummary]
  );

  const revenueChartSeries = useMemo(
    () => [
      {
        name: 'Doanh thu',
        data: revenueSummary.map((row) => row.totalRevenue),
      },
    ],
    [revenueSummary]
  );

  const inventoryStatusOptions = useMemo(
    () => ({
      chart: {
        id: 'inventory-status-chart',
      },
      labels: ['Còn kho', 'Đã bán', 'Dịch vụ'],
      legend: {
        position: 'bottom',
      },
      colors: ['#0f766e', '#f59e0b', '#dc2626'],
      dataLabels: {
        enabled: true,
      },
    }),
    []
  );

  const inventoryStatusSeries = useMemo(
    () => [
      dashboardSummary?.inStockItems || 0,
      dashboardSummary?.soldItems || 0,
      dashboardSummary?.inServiceItems || 0,
    ],
    [dashboardSummary]
  );

  const topStockRows = useMemo(
    () =>
      [...inventorySummary]
        .sort((left, right) => right.inStockItems - left.inStockItems)
        .slice(0, 5),
    [inventorySummary]
  );

  const topStockOptions = useMemo(
    () => ({
      chart: {
        id: 'top-stock-chart',
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: topStockRows.map((row) => row.variantCode),
      },
      colors: ['#1d4ed8'],
    }),
    [topStockRows]
  );

  const topStockSeries = useMemo(
    () => [
      {
        name: 'Tồn kho',
        data: topStockRows.map((row) => row.inStockItems),
      },
    ],
    [topStockRows]
  );

  const dateRangeLabel = useMemo(() => {
    if (appliedDateRange.startDate && appliedDateRange.endDate) {
      return `Doanh thu đang lọc từ ${formatDate(appliedDateRange.startDate)} đến ${formatDate(appliedDateRange.endDate)}.`;
    }

    if (appliedDateRange.startDate) {
      return `Doanh thu đang lọc từ ${formatDate(appliedDateRange.startDate)} đến hiện tại.`;
    }

    if (appliedDateRange.endDate) {
      return `Doanh thu đang lọc đến ${formatDate(appliedDateRange.endDate)}.`;
    }

    return 'Bộ lọc ngày áp dụng cho doanh thu và biểu đồ doanh thu. Báo cáo tồn kho luôn phản ánh trạng thái hiện tại.';
  }, [appliedDateRange]);

  function handleFilterFieldChange(event) {
    const { name, value } = event.target;

    setFilterForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleApplyFilter() {
    if (
      filterForm.startDate &&
      filterForm.endDate &&
      filterForm.startDate > filterForm.endDate
    ) {
      setErrorMessage('Khoảng thời gian không hợp lệ');
      return;
    }

    setErrorMessage('');
    setAppliedDateRange({
      startDate: filterForm.startDate,
      endDate: filterForm.endDate,
    });
  }

  function handleResetFilter() {
    setErrorMessage('');
    setFilterForm(EMPTY_DATE_RANGE);
    setAppliedDateRange(EMPTY_DATE_RANGE);
  }

  function handleExportRevenue() {
    downloadCsv(
      buildReportFileName('bao-cao-doanh-thu', appliedDateRange),
      ['Ngày bán', 'Số đơn', 'Doanh thu'],
      revenueSummary.map((row) => [
        formatDate(row.soldDate),
        row.totalOrders,
        row.totalRevenue,
      ])
    );
  }

  function handleExportInventory() {
    downloadCsv(
      buildReportFileName('bao-cao-ton-kho', appliedDateRange),
      ['Biến thể', 'Sản phẩm', 'Cấu hình', 'Tổng IMEI', 'Còn kho', 'Đã bán', 'Dịch vụ'],
      inventorySummary.map((row) => [
        row.variantCode,
        row.productName,
        `${row.ramGb} GB / ${row.romGb} GB / ${row.colorName}`,
        row.totalItems,
        row.inStockItems,
        row.soldItems,
        row.inServiceItems,
      ])
    );
  }

  function handleExportRevenueExcel() {
    downloadWorkbook(
      buildReportFileName('bao-cao-doanh-thu', appliedDateRange).replace('.csv', '.xlsx'),
      'Doanh thu',
      ['Ngày bán', 'Số đơn', 'Doanh thu'],
      revenueSummary.map((row) => [formatDate(row.soldDate), row.totalOrders, row.totalRevenue])
    );
  }

  function handleExportInventoryExcel() {
    downloadWorkbook(
      buildReportFileName('bao-cao-ton-kho', appliedDateRange).replace('.csv', '.xlsx'),
      'Ton kho',
      ['Biến thể', 'Sản phẩm', 'Cấu hình', 'Tổng IMEI', 'Còn kho', 'Đã bán', 'Dịch vụ'],
      inventorySummary.map((row) => [
        row.variantCode,
        row.productName,
        `${row.ramGb} GB / ${row.romGb} GB / ${row.colorName}`,
        row.totalItems,
        row.inStockItems,
        row.soldItems,
        row.inServiceItems,
      ])
    );
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Thống kê"
        description="Theo dõi tổng quan vận hành, báo cáo tồn kho theo biến thể và doanh thu bán hàng theo ngày."
      />

      {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}

      <section className="shell-panel statistics-filter-card">
        <div className="statistics-filter-grid">
          <FormField id="statistics-start-date" label="Từ ngày">
            <input
              id="statistics-start-date"
              data-testid="statistics-start-date"
              name="startDate"
              type="date"
              value={filterForm.startDate}
              onChange={handleFilterFieldChange}
            />
          </FormField>

          <FormField id="statistics-end-date" label="Đến ngày">
            <input
              id="statistics-end-date"
              data-testid="statistics-end-date"
              name="endDate"
              type="date"
              value={filterForm.endDate}
              onChange={handleFilterFieldChange}
            />
          </FormField>

          <div className="statistics-filter-actions">
            <button
              className="shell-button shell-button--primary"
              data-testid="statistics-apply-filter"
              type="button"
              onClick={handleApplyFilter}
            >
              Áp dụng bộ lọc
            </button>
            <button
              className="shell-button shell-button--ghost"
              type="button"
              onClick={handleResetFilter}
            >
              Đặt lại
            </button>
            <button
              className="shell-button shell-button--ghost"
              data-testid="statistics-export-revenue"
              type="button"
              onClick={handleExportRevenue}
            >
              Xuất doanh thu CSV
            </button>
            <button
              className="shell-button shell-button--ghost"
              type="button"
              onClick={handleExportRevenueExcel}
            >
              Xuất doanh thu Excel
            </button>
            <button
              className="shell-button shell-button--ghost"
              data-testid="statistics-export-inventory"
              type="button"
              onClick={handleExportInventory}
            >
              Xuất tồn kho CSV
            </button>
            <button
              className="shell-button shell-button--ghost"
              type="button"
              onClick={handleExportInventoryExcel}
            >
              Xuất tồn kho Excel
            </button>
          </div>
        </div>
        <p className="inline-hint">{dateRangeLabel}</p>
      </section>

      <section className="dashboard-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="shell-panel dashboard-card">
            <div className="dashboard-card__label">{metric.label}</div>
            <div className="dashboard-card__value">{metric.value}</div>
          </article>
        ))}
      </section>

      <section className="statistics-chart-grid">
        <article className="shell-panel statistics-chart-card">
          <h2>Biểu đồ doanh thu theo ngày</h2>
          <Chart type="line" height={320} options={revenueChartOptions} series={revenueChartSeries} />
        </article>

        <article className="shell-panel statistics-chart-card">
          <h2>Phân bổ trạng thái IMEI</h2>
          <Chart type="donut" height={320} options={inventoryStatusOptions} series={inventoryStatusSeries} />
        </article>

        <article className="shell-panel statistics-chart-card statistics-chart-card--wide">
          <h2>Top biến thể còn tồn kho</h2>
          <Chart type="bar" height={320} options={topStockOptions} series={topStockSeries} />
        </article>
      </section>

      <section className="shell-panel admin-table-card">
        <h2>Báo cáo tồn kho</h2>
        <DataTable
          ariaLabel="Báo cáo tồn kho"
          columns={[
            { key: 'variantCode', label: 'Biến thể' },
            { key: 'productName', label: 'Sản phẩm' },
            {
              key: 'config',
              label: 'Cấu hình',
              render: (row) => `${row.ramGb} GB / ${row.romGb} GB / ${row.colorName}`,
            },
            { key: 'totalItems', label: 'Tổng IMEI' },
            { key: 'inStockItems', label: 'Còn kho' },
            { key: 'soldItems', label: 'Đã bán' },
            { key: 'inServiceItems', label: 'Dịch vụ' },
          ]}
          rows={inventorySummary}
          emptyMessage="Chưa có dữ liệu tồn kho."
        />
      </section>

      <section className="shell-panel admin-table-card">
        <h2>Báo cáo doanh thu</h2>
        <DataTable
          ariaLabel="Báo cáo doanh thu"
          columns={[
            {
              key: 'soldDate',
              label: 'Ngày bán',
              render: (row) => formatDate(row.soldDate),
            },
            { key: 'totalOrders', label: 'Số đơn' },
            {
              key: 'totalRevenue',
              label: 'Doanh thu',
              render: (row) => formatCurrency(row.totalRevenue),
            },
          ]}
          rows={revenueSummary}
          emptyMessage="Chưa có dữ liệu doanh thu."
        />
      </section>
    </div>
  );
}

export default StatisticsPage;

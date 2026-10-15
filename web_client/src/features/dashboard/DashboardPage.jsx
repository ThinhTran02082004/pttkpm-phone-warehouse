import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';

import { getDashboardSummary, getRevenueSummary } from '../../api/statistics';
import { useAuth } from '../../app/providers/AuthProvider';
import { formatCurrency, formatDate } from '../../utils/formatters';

function DashboardPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [revenueSummary, setRevenueSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const displayName = user?.employee?.fullName || user?.account?.username || 'người dùng';

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setLoadError('');
        const [dashboardData, revenueData] = await Promise.all([
          getDashboardSummary(token),
          getRevenueSummary(token),
        ]);
        if (!ignore) {
          setStats(dashboardData);
          setRevenueSummary(revenueData);
        }
      } catch (error) {
        if (!ignore) {
          setLoadError(error?.message || 'Không tải được số liệu dashboard');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (token) {
      loadDashboard();
    }

    return () => {
      ignore = true;
    };
  }, [token]);

  const metrics = useMemo(
    () => [
      {
        label: 'Tổng mẫu máy',
        value: loading ? '...' : `${stats?.totalProducts || 0} mẫu máy`,
      },
      {
        label: 'Số biến thể',
        value: loading ? '...' : `${stats?.totalVariants || 0} biến thể`,
      },
      {
        label: 'Kho IMEI',
        value: loading ? '...' : `${stats?.totalInventoryItems || 0} IMEI`,
      },
      {
        label: 'Sẵn bán',
        value: loading ? '...' : `${stats?.inStockItems || 0} thiết bị`,
      },
    ],
    [loading, stats]
  );

  const revenueChartOptions = useMemo(
    () => ({
      chart: {
        id: 'dashboard-revenue-chart',
        toolbar: { show: false },
      },
      colors: ['#2563eb'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.42,
          opacityTo: 0.08,
        },
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
      grid: {
        borderColor: '#dbe6f2',
      },
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

  const statusChartOptions = useMemo(
    () => ({
      chart: {
        id: 'dashboard-status-chart',
      },
      labels: ['Còn kho', 'Đã bán', 'Dịch vụ'],
      legend: {
        position: 'bottom',
      },
      colors: ['#10b981', '#f59e0b', '#ef4444'],
      dataLabels: {
        enabled: true,
      },
    }),
    []
  );

  const statusChartSeries = useMemo(
    () => [stats?.inStockItems || 0, stats?.soldItems || 0, stats?.inServiceItems || 0],
    [stats]
  );

  return (
    <div className="shell-app">
      <section className="dashboard-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="shell-panel dashboard-card">
            <div className="dashboard-card__label">{metric.label}</div>
            <div className="dashboard-card__value">{metric.value}</div>
          </article>
        ))}
      </section>

      <section className="shell-panel dashboard-hero">
        <div>
          <div className="dashboard-hero__title">Bảng điều khiển</div>
          <p className="dashboard-hero__copy">
            Phiên làm việc của {displayName} đã được xác thực thành công. Dashboard đang đọc số
            liệu trực tiếp từ backend mới để phản ánh đúng lượng mẫu máy, IMEI tồn kho, thiết bị
            sẵn bán và doanh thu đã ghi nhận.
          </p>

          {loadError ? (
            <div className="shell-alert shell-alert--error" role="alert">
              {loadError}
            </div>
          ) : null}
        </div>

        <div className="dashboard-list">
          <div className="dashboard-list__item">
            <span>Doanh thu đã ghi nhận</span>
            <strong>{loading ? '...' : formatCurrency(stats?.totalRevenue)}</strong>
          </div>
          <div className="dashboard-list__item">
            <span>Thiết bị đang dịch vụ</span>
            <strong>{loading ? '...' : `${stats?.inServiceItems || 0} thiết bị`}</strong>
          </div>
          <div className="dashboard-list__item">
            <span>Phiếu dịch vụ đang mở</span>
            <strong>{loading ? '...' : `${stats?.totalServiceTickets || 0} phiếu dịch vụ`}</strong>
          </div>
          <div className="dashboard-list__item">
            <span>Đối tác và khách hàng</span>
            <strong>
              {loading ? '...' : `${stats?.totalSuppliers || 0} NCC • ${stats?.totalCustomers || 0} KH`}
            </strong>
          </div>
        </div>
      </section>

      <section className="dashboard-analytics">
        <article className="shell-panel dashboard-chart-card">
          <div className="dashboard-chart-card__header">
            <div>
              <h2>Doanh thu gần đây</h2>
              <p>Diễn biến doanh thu theo ngày từ các đơn hàng đã hoàn tất.</p>
            </div>
          </div>
          <Chart
            type="area"
            height={320}
            options={revenueChartOptions}
            series={revenueChartSeries}
          />
        </article>

        <article className="shell-panel dashboard-chart-card">
          <div className="dashboard-chart-card__header">
            <div>
              <h2>Tình trạng thiết bị</h2>
              <p>Tỷ trọng IMEI còn kho, đã bán và đang xử lý dịch vụ.</p>
            </div>
          </div>
          <Chart
            type="donut"
            height={320}
            options={statusChartOptions}
            series={statusChartSeries}
          />
        </article>
      </section>
    </div>
  );
}

export default DashboardPage;

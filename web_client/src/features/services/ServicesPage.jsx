import { useEffect, useMemo, useState } from 'react';

import { getInventoryItems } from '../../api/products';
import {
  createServiceTicket,
  getServiceTickets,
  updateServiceTicketStatus,
} from '../../api/services';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadWorkbook } from '../../utils/excel';

const initialFormState = {
  code: '',
  imei: '',
  ticketType: 'warranty',
  issueDescription: '',
  receivedAt: '',
};

const ticketTypeLabels = {
  warranty: 'Bảo hành',
  repair: 'Sửa chữa',
  return: 'Đổi trả',
  exchange: 'Đổi máy',
};

function formatDatetimeForApi(value) {
  if (!value) {
    return null;
  }

  return `${value.replace('T', ' ')}:00`;
}

function ServicesPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setErrorMessage('');
        const [ticketRows, inventoryRows] = await Promise.all([
          getServiceTickets(token),
          getInventoryItems(token),
        ]);

        if (!ignore) {
          setTickets(ticketRows);
          setInventoryItems(inventoryRows);
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
  }, [token]);

  const soldInventory = useMemo(
    () => inventoryItems.filter((item) => item.itemStatus === 'sold'),
    [inventoryItems]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const createdTicket = await createServiceTicket(token, {
        code: formState.code.trim(),
        imei: formState.imei,
        ticketType: formState.ticketType,
        issueDescription: formState.issueDescription.trim(),
        receivedAt: formatDatetimeForApi(formState.receivedAt),
      });

      setTickets((current) => [
        {
          ...createdTicket,
          customerName: current.find((ticket) => ticket.imei === formState.imei)?.customerName || '',
        },
        ...current,
      ]);
      setInventoryItems((current) =>
        current.map((item) =>
          item.imei === formState.imei ? { ...item, itemStatus: 'in_service' } : item
        )
      );
      setFormState(initialFormState);
      setSuccessMessage('Đã tạo phiếu dịch vụ mới.');
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  async function handleCompleteTicket(ticketId) {
    setErrorMessage('');
    setSuccessMessage('');
    const currentTicket = tickets.find((ticket) => ticket.id === ticketId);

    try {
      const updatedTicket = await updateServiceTicketStatus(token, ticketId, {
        status: 'completed',
        resolutionSummary: 'Hoàn tất xử lý và bàn giao máy',
        completedAt: formatDatetimeForApi(new Date().toISOString().slice(0, 16)),
      });

      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, ...updatedTicket } : ticket
        )
      );
      setInventoryItems((current) =>
        current.map((item) =>
          item.imei === currentTicket?.imei ? { ...item, itemStatus: 'sold' } : item
        )
      );
      setSuccessMessage(`Đã hoàn tất phiếu ${updatedTicket.code}.`);
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  function handleExportTickets() {
    downloadWorkbook(
      'danh-sach-phieu-dich-vu.xlsx',
      'Dich vu',
      ['Mã phiếu', 'IMEI', 'Loại phiếu', 'Trạng thái', 'Mô tả lỗi'],
      tickets.map((ticket) => [
        ticket.code,
        ticket.imei,
        ticketTypeLabels[ticket.ticketType] || ticket.ticketType,
        ticket.status,
        ticket.issueDescription || '',
      ])
    );
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Dịch vụ"
        description="Tiếp nhận bảo hành, sửa chữa, đổi trả theo IMEI đã bán và theo dõi trạng thái xử lý."
      />

      <div className="admin-grid">
        <section className="shell-panel admin-form-card">
          <h2>Tạo phiếu dịch vụ</h2>
          <p className="admin-form-card__hint">
            Chỉ các IMEI đã bán mới đủ điều kiện mở phiếu dịch vụ để bảo toàn chuỗi truy vết.
          </p>

          {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}
          {successMessage ? <AlertBanner type="success">{successMessage}</AlertBanner> : null}

          <form className="shell-form-grid" onSubmit={handleSubmit}>
            <FormField
              id="service-code"
              label="Mã phiếu dịch vụ"
              value={formState.code}
              onChange={(event) =>
                setFormState((current) => ({ ...current, code: event.target.value }))
              }
            />
            <FormField id="service-imei" label="IMEI tiếp nhận">
              <select
                id="service-imei"
                value={formState.imei}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, imei: event.target.value }))
                }
              >
                <option value="">Chọn IMEI đã bán</option>
                {soldInventory.map((item) => (
                  <option key={item.id} value={item.imei}>
                    {item.imei}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="service-ticket-type" label="Loại phiếu">
              <select
                id="service-ticket-type"
                value={formState.ticketType}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    ticketType: event.target.value,
                  }))
                }
              >
                {Object.entries(ticketTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField
              id="service-received-at"
              label="Thời điểm tiếp nhận"
              type="datetime-local"
              value={formState.receivedAt}
              onChange={(event) =>
                setFormState((current) => ({ ...current, receivedAt: event.target.value }))
              }
            />
            <FormField id="service-issue" label="Mô tả lỗi">
              <textarea
                id="service-issue"
                rows="4"
                value={formState.issueDescription}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    issueDescription: event.target.value,
                  }))
                }
              />
            </FormField>

            <button type="submit" className="shell-button shell-button--primary">
              Lưu phiếu dịch vụ
            </button>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách phiếu dịch vụ</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportTickets}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            ariaLabel="Danh sách phiếu dịch vụ"
            columns={[
              { key: 'code', label: 'Mã phiếu' },
              { key: 'imei', label: 'IMEI' },
              {
                key: 'ticketType',
                label: 'Loại phiếu',
                render: (row) => ticketTypeLabels[row.ticketType] || row.ticketType,
              },
              { key: 'status', label: 'Trạng thái' },
              { key: 'issueDescription', label: 'Mô tả lỗi' },
              {
                key: 'actions',
                label: 'Thao tác',
                render: (row) =>
                  row.status === 'completed' || row.status === 'rejected' || row.status === 'cancelled' ? (
                    'Đã khóa'
                  ) : (
                    <button
                      type="button"
                      className="shell-button shell-button--ghost"
                      aria-label={`Hoàn tất ${row.code}`}
                      onClick={() => handleCompleteTicket(row.id)}
                    >
                      Hoàn tất
                    </button>
                  ),
              },
            ]}
            rows={tickets}
            emptyMessage="Chưa có phiếu dịch vụ nào."
          />
        </section>
      </div>
    </div>
  );
}

export default ServicesPage;

import { useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../app/providers/AuthProvider';

function LoginPage() {
  const location = useLocation();
  const { signIn, status, isAuthenticated } = useAuth();
  const [formState, setFormState] = useState({
    username: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectTo = useMemo(
    () => location.state?.from?.pathname || '/dashboard',
    [location.state]
  );

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      await signIn(formState);
    } catch (error) {
      setErrorMessage(error?.payload?.message || error?.message || 'Đăng nhập thất bại');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell-auth">
      <div className="shell-panel shell-auth__card">
        <section className="shell-auth__intro">
          <div>
            <div className="shell-auth__eyebrow">Hệ thống quản lý kho điện thoại</div>
            <div className="shell-auth__headline">
              Giao diện vận hành mới cho toàn bộ vòng đời thiết bị.
            </div>
            <div className="shell-auth__copy">
              Quản lý tập trung sản phẩm, IMEI, nhập kho, xuất kho, bảo hành và thống kê
              trên cùng một nền tảng web dùng ReactJS, Node.js và MySQL.
            </div>
          </div>

          <div className="shell-auth__bullets">
            <div className="shell-auth__bullet">
              <strong>Kho IMEI tập trung</strong>
              Theo dõi từng máy theo trạng thái tồn, bán và dịch vụ.
            </div>
            <div className="shell-auth__bullet">
              <strong>Luồng nghiệp vụ chuẩn</strong>
              Nhập kho, xuất kho và hậu mãi đều đi qua transaction backend.
            </div>
            <div className="shell-auth__bullet">
              <strong>Phân quyền thật</strong>
              Quyền xem và thao tác được kiểm soát tại backend theo vai trò.
            </div>
            <div className="shell-auth__bullet">
              <strong>Thống kê tức thời</strong>
              Dashboard và báo cáo lấy trực tiếp từ dữ liệu giao dịch thật.
            </div>
          </div>
        </section>

        <section className="shell-auth__form">
          <div>
            <h2>Đăng nhập</h2>
            <p className="shell-auth__hint">
              Sử dụng tài khoản nội bộ để truy cập các module quản lý và vận hành hệ thống.
            </p>
          </div>

          {errorMessage ? (
            <div className="shell-alert shell-alert--error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <form className="shell-form-grid" onSubmit={handleSubmit}>
            <div className="shell-field">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                id="username"
                name="username"
                value={formState.username}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, username: event.target.value }))
                }
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div className="shell-field">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formState.password}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="shell-button shell-button--primary"
              disabled={submitting || status === 'checking'}
            >
              {submitting ? 'Đang xác thực...' : 'Vào hệ thống'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;

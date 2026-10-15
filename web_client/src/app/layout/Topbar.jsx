import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../providers/AuthProvider';

function Topbar({ isSidebarCollapsed, onToggleSidebar }) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const displayName = user?.employee?.fullName || user?.account?.username || 'Người dùng';
  const roleName = user?.role?.name || 'Tài khoản hệ thống';

  function handleLogout() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <header className="shell-topbar">
      <div className="shell-topbar__meta">
        <button
          type="button"
          className="shell-button shell-button--ghost shell-button--icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          <FontAwesomeIcon icon={faBarsStaggered} />
          <span>{isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}</span>
        </button>
        <div className="shell-topbar__title">Bảng điều khiển vận hành</div>
        <div className="shell-topbar__subtitle">
          Theo dõi dữ liệu kho, xuất bán, hậu mãi và các tác vụ nội bộ theo thời gian thực.
        </div>
      </div>

      <div className="shell-topbar__actions">
        <div className="shell-user-chip">
          {displayName} • {roleName}
        </div>
        <button type="button" className="shell-button shell-button--ghost" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

export default Topbar;

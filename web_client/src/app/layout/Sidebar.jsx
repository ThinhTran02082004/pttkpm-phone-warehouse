import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressBook,
  faArrowDown,
  faArrowUp,
  faChartPie,
  faGaugeHigh,
  faKey,
  faMobileScreenButton,
  faScrewdriverWrench,
  faSliders,
  faTruck,
  faUserShield,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../providers/AuthProvider';

const navItems = [
  { to: '/dashboard', label: 'Bảng điều khiển', icon: faGaugeHigh, moduleCode: 'dashboard' },
  { to: '/employees', label: 'Nhân viên', icon: faUsers, moduleCode: 'employees' },
  { to: '/roles', label: 'Vai trò', icon: faUserShield, moduleCode: 'roles' },
  { to: '/accounts', label: 'Tài khoản', icon: faKey, moduleCode: 'accounts' },
  { to: '/suppliers', label: 'Nhà cung cấp', icon: faTruck, moduleCode: 'suppliers' },
  { to: '/customers', label: 'Khách hàng', icon: faAddressBook, moduleCode: 'customers' },
  {
    to: '/attributes',
    label: 'Thuộc tính',
    icon: faSliders,
    moduleCode: 'product_attributes',
  },
  { to: '/products', label: 'Sản phẩm', icon: faMobileScreenButton, moduleCode: 'products' },
  { to: '/imports', label: 'Nhập kho', icon: faArrowDown, moduleCode: 'imports' },
  { to: '/exports', label: 'Xuất kho', icon: faArrowUp, moduleCode: 'exports' },
  { to: '/services', label: 'Dịch vụ', icon: faScrewdriverWrench, moduleCode: 'services' },
  { to: '/statistics', label: 'Thống kê', icon: faChartPie, moduleCode: 'statistics' },
];

function Sidebar({ collapsed = false }) {
  const { user } = useAuth();
  const permissions = Array.isArray(user?.permissions) ? user.permissions : null;
  const canFilterByPermission = Boolean(permissions?.length);

  const visibleNavItems = navItems.filter((item) => {
    if (!canFilterByPermission) {
      return true;
    }

    return permissions.some(
      (permission) =>
        permission.moduleCode === item.moduleCode && permission.actionCode === 'view'
    );
  });

  return (
    <aside className={collapsed ? 'shell-sidebar shell-sidebar--collapsed' : 'shell-sidebar'}>
      <div className="shell-brand">
        <div className="shell-brand__logo">PW</div>
        {!collapsed ? (
          <>
            <div className="shell-brand__title">Phone Warehouse</div>
            <div className="shell-brand__subtitle">
              Quản lý kho điện thoại theo luồng nhập, xuất, dịch vụ và thống kê.
            </div>
          </>
        ) : null}
      </div>

      <nav className="shell-nav" aria-label="Điều hướng chính">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'shell-nav__link active' : 'shell-nav__link'
            }
            title={item.label}
          >
            <FontAwesomeIcon icon={item.icon} className="shell-nav__icon" />
            {!collapsed ? <span className="shell-nav__label">{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

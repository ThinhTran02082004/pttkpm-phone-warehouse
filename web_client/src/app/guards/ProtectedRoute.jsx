import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../providers/AuthProvider';

function hasPermission(user, requiredPermission) {
  if (!requiredPermission) {
    return true;
  }

  const permissions = Array.isArray(user?.permissions) ? user.permissions : null;

  if (!permissions?.length) {
    return true;
  }

  return permissions.some(
    (permission) =>
      permission.moduleCode === requiredPermission.moduleCode &&
      permission.actionCode === requiredPermission.actionCode
  );
}

function ProtectedRoute({ requiredPermission = null, children = null }) {
  const { status, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (status === 'checking') {
    return (
      <div className="shell-auth">
        <div className="shell-panel shell-auth__card">
          <div className="shell-auth__form">
            <h2>Đang kiểm tra phiên đăng nhập</h2>
            <p className="shell-auth__hint">
              Hệ thống đang xác thực tài khoản trước khi tải giao diện làm việc.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasPermission(user, requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;

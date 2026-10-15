import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './guards/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import EmployeesPage from '../features/employees/EmployeesPage';
import RolesPage from '../features/roles/RolesPage';
import AccountsPage from '../features/accounts/AccountsPage';
import SuppliersPage from '../features/partners/SuppliersPage';
import CustomersPage from '../features/partners/CustomersPage';
import ProductAttributesPage from '../features/attributes/ProductAttributesPage';
import ProductsPage from '../features/products/ProductsPage';
import ImportsPage from '../features/imports/ImportsPage';
import ExportsPage from '../features/exports/ExportsPage';
import ServicesPage from '../features/services/ServicesPage';
import StatisticsPage from '../features/statistics/StatisticsPage';

function protectPage(moduleCode, element) {
  return (
    <ProtectedRoute requiredPermission={{ moduleCode, actionCode: 'view' }}>
      {element}
    </ProtectedRoute>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={protectPage('dashboard', <DashboardPage />)} />
          <Route path="/employees" element={protectPage('employees', <EmployeesPage />)} />
          <Route path="/roles" element={protectPage('roles', <RolesPage />)} />
          <Route path="/accounts" element={protectPage('accounts', <AccountsPage />)} />
          <Route path="/suppliers" element={protectPage('suppliers', <SuppliersPage />)} />
          <Route path="/customers" element={protectPage('customers', <CustomersPage />)} />
          <Route
            path="/attributes"
            element={protectPage('product_attributes', <ProductAttributesPage />)}
          />
          <Route path="/products" element={protectPage('products', <ProductsPage />)} />
          <Route path="/imports" element={protectPage('imports', <ImportsPage />)} />
          <Route path="/exports" element={protectPage('exports', <ExportsPage />)} />
          <Route path="/services" element={protectPage('services', <ServicesPage />)} />
          <Route path="/statistics" element={protectPage('statistics', <StatisticsPage />)} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export function RoutedOutlet() {
  return <Outlet />;
}

export default AppRouter;

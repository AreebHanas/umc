import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, DashboardLayout, AuthLayout, AdminLayout } from '../layouts';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Customers from '../pages/Customers/Customers';
import Meters from '../pages/Meters/Meters';
import Readings from '../pages/Readings/Readings';
import Bills from '../pages/Bills/Bills';
import Payments from '../pages/Payments/Payments';
import Unauthorized from '../pages/Unauthorized/Unauthorized';
import UserManagement from '../pages/Admin/UserManagement';
import AdminDashboard from '../pages/Admin/AdminDashboard';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with MainLayout (Public Pages) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Routes with AuthLayout (Login/Register) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Routes with DashboardLayout (Protected - Role-based) */}
        <Route element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'FieldOfficer', 'Cashier']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Customers - Admin, Manager, FieldOfficer */}
          <Route path="/customers" element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'FieldOfficer']}>
              <Customers />
            </ProtectedRoute>
          } />
          
          {/* Meters - Admin, Manager, FieldOfficer */}
          <Route path="/meters" element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'FieldOfficer']}>
              <Meters />
            </ProtectedRoute>
          } />
          
          {/* Readings - Admin, Manager, FieldOfficer */}
          <Route path="/readings" element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'FieldOfficer']}>
              <Readings />
            </ProtectedRoute>
          } />
          
          {/* Bills - Admin, Manager, Cashier */}
          <Route path="/bills" element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Cashier']}>
              <Bills />
            </ProtectedRoute>
          } />
          
          {/* Payments - Admin, Manager, Cashier */}
          <Route path="/payments" element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Cashier']}>
              <Payments />
            </ProtectedRoute>
          } />
        </Route>

        {/* Routes with AdminLayout (Admin Only) */}
        <Route element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/readings" element={<Readings />} />
          <Route path="/admin/meters" element={<Meters />} />
          <Route path="/admin/bills" element={<Bills />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/admin/reports" element={<div>Reports (Coming Soon)</div>} />
          <Route path="/admin/settings" element={<div>Settings (Coming Soon)</div>} />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

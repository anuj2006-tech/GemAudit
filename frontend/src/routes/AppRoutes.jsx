import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Platform Admin Page Imports
import SuperAdminDashboard from '../pages/superAdmin/SuperAdminDashboard';
import LegalAdminsPage from '../pages/superAdmin/LegalAdminsPage';
import OrganizationsPage from '../pages/superAdmin/OrganizationsPage';
import TenderListPage from '../pages/superAdmin/TenderListPage';
import AIDashboardPage from '../pages/superAdmin/AIDashboardPage';
import SettingsPage from '../pages/superAdmin/SettingsPage';
import UsersPage from '../pages/superAdmin/UsersPage';

// Company Owner Page Imports
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import ManageUsersPage from '../pages/owner/ManageUsersPage';

// Company Admin Page Imports
import AdminDashboard from '../pages/admin/AdminDashboard';


// Company Admin Sub-Pages (mapped to functional views from the legalAdmin folder)
import AssignedTendersPage from '../pages/legalAdmin/AssignedTendersPage';
import ReviewTenderPage from '../pages/legalAdmin/ReviewTenderPage';
import AISuggestionsPage from '../pages/legalAdmin/AISuggestionsPage';
import DocumentVerificationPage from '../pages/legalAdmin/DocumentVerificationPage';
import ProfilePage from '../pages/legalAdmin/ProfilePage';

// Employee Page Imports
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';

import NotFoundPage from '../pages/errors/NotFoundPage';

/**
 * Route protection wrapper evaluating user session and role authorization.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Bounce user to their matching dashboard
    if (role === 'PLATFORM_ADMIN') return <Navigate to="/super-admin/dashboard" replace />;
    if (role === 'COMPANY_OWNER') return <Navigate to="/owner/dashboard" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/employee/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* 1. PLATFORM_ADMIN (Super Admin) Scope */}
      <Route path="/super-admin/dashboard" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}><SuperAdminDashboard /></ProtectedRoute>
      } />
      <Route path="/super-admin/users" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}><UsersPage /></ProtectedRoute>
      } />
      <Route path="/super-admin/organizations" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}><OrganizationsPage /></ProtectedRoute>
      } />
      <Route path="/super-admin/legal-admins" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}><LegalAdminsPage /></ProtectedRoute>
      } />
      <Route path="/super-admin/tenders" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}><TenderListPage /></ProtectedRoute>
      } />
      <Route path="/super-admin/ai-analysis" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}><AIDashboardPage /></ProtectedRoute>
      } />
      <Route path="/super-admin/settings" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}><SettingsPage /></ProtectedRoute>
      } />

      {/* 2. COMPANY_OWNER Scope */}
      <Route path="/owner/dashboard" element={
        <ProtectedRoute allowedRoles={['COMPANY_OWNER']}><OwnerDashboard /></ProtectedRoute>
      } />
      {/* Manage Users under owner scope */}
      <Route path="/owner/users" element={
        <ProtectedRoute allowedRoles={['COMPANY_OWNER']}><ManageUsersPage /></ProtectedRoute>
      } />

      <Route path="/owner/departments" element={
        <ProtectedRoute allowedRoles={['COMPANY_OWNER']}><OwnerDashboard /></ProtectedRoute>
      } />
      <Route path="/owner/tenders" element={
        <ProtectedRoute allowedRoles={['COMPANY_OWNER']}><OwnerDashboard /></ProtectedRoute>
      } />
      <Route path="/owner/documents" element={
        <ProtectedRoute allowedRoles={['COMPANY_OWNER']}><OwnerDashboard /></ProtectedRoute>
      } />
      <Route path="/owner/ai-assistant" element={
        <ProtectedRoute allowedRoles={['COMPANY_OWNER']}><OwnerDashboard /></ProtectedRoute>
      } />
      <Route path="/owner/billing" element={
        <ProtectedRoute allowedRoles={['COMPANY_OWNER']}><OwnerDashboard /></ProtectedRoute>
      } />
      <Route path="/owner/settings" element={
        <ProtectedRoute allowedRoles={['COMPANY_OWNER']}><OwnerDashboard /></ProtectedRoute>
      } />

      {/* 3. COMPANY_ADMIN Scope */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/employees" element={
        <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/tenders" element={
        <ProtectedRoute allowedRoles={['ADMIN']}><AssignedTendersPage /></ProtectedRoute>
      } />
      <Route path="/admin/approvals" element={
        <ProtectedRoute allowedRoles={['ADMIN']}><ReviewTenderPage /></ProtectedRoute>
      } />
      <Route path="/admin/documents" element={
        <ProtectedRoute allowedRoles={['ADMIN']}><DocumentVerificationPage /></ProtectedRoute>
      } />
      <Route path="/admin/ai-assistant" element={
        <ProtectedRoute allowedRoles={['ADMIN']}><AISuggestionsPage /></ProtectedRoute>
      } />

      {/* 4. EMPLOYEE & STAFF Scope */}
      <Route path="/employee/dashboard" element={
        <ProtectedRoute allowedRoles={['BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'EMPLOYEE', 'VIEWER']}><EmployeeDashboard /></ProtectedRoute>
      } />
      <Route path="/employee/tenders" element={
        <ProtectedRoute allowedRoles={['BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'EMPLOYEE', 'VIEWER']}><EmployeeDashboard /></ProtectedRoute>
      } />
      <Route path="/employee/tasks" element={
        <ProtectedRoute allowedRoles={['BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'EMPLOYEE', 'VIEWER']}><EmployeeDashboard /></ProtectedRoute>
      } />
      <Route path="/employee/documents" element={
        <ProtectedRoute allowedRoles={['BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'EMPLOYEE', 'VIEWER']}><EmployeeDashboard /></ProtectedRoute>
      } />
      <Route path="/employee/ai-assistant" element={
        <ProtectedRoute allowedRoles={['BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'EMPLOYEE', 'VIEWER']}><EmployeeDashboard /></ProtectedRoute>
      } />
      <Route path="/employee/profile" element={
        <ProtectedRoute allowedRoles={['BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'EMPLOYEE', 'VIEWER']}><ProfilePage /></ProtectedRoute>
      } />

      {/* Error Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

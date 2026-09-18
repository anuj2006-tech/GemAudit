import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';

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
import CompanyBrainDashboard from '../pages/owner/CompanyBrainDashboard';
import CompanyBrainCategoryPage from '../pages/owner/CompanyBrainCategoryPage';
import TenderManagementPage from '../pages/owner/TenderManagementPage';
import CreateTenderPage from '../pages/owner/CreateTenderPage';
import TenderWorkspacePage from '../pages/owner/TenderWorkspacePage';

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

import TenderRegPage from '../pages/tenderReg/TenderRegPage';
import BidDocumentSuitePage from '../pages/bid/BidDocumentSuitePage';
import GeMCompliancePortal from '../pages/gemVerification/GeMCompliancePortal';
import GeMComplianceDashboard from '../pages/gemVerification/GeMComplianceDashboard';
import GeMOverviewDashboard from '../pages/gemVerification/GeMOverviewDashboard';
import GeMAnalyticsPage from '../pages/gemVerification/GeMAnalyticsPage';
import GeMAuditTrailPage from '../pages/gemVerification/GeMAuditTrailPage';
import GeMWorkflowPage from '../pages/gemVerification/GeMWorkflowPage';

import NotFoundPage from '../pages/errors/NotFoundPage';

// Route protection wrapper: direct open access without login gate
const ProtectedRoute = ({ children }) => {
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Navigate to="/gem-compliance-dashboard" replace />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/auth/login" element={<Navigate to="/gem-compliance-dashboard" replace />} />
      <Route path="/auth/register" element={<Navigate to="/gem-compliance-dashboard" replace />} />
      <Route path="/tender-reg" element={<TenderRegPage />} />

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
        <ProtectedRoute allowedRoles={['COMPANY_OWNER']}><DocumentVerificationPage /></ProtectedRoute>
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
        <ProtectedRoute allowedRoles={['ADMIN', 'COMPANY_ADMIN']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/employees" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'COMPANY_ADMIN']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/tenders" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'COMPANY_ADMIN']}><AssignedTendersPage /></ProtectedRoute>
      } />
      <Route path="/admin/approvals" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'COMPANY_ADMIN']}><ReviewTenderPage /></ProtectedRoute>
      } />
      <Route path="/admin/documents" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'COMPANY_ADMIN']}><DocumentVerificationPage /></ProtectedRoute>
      } />
      <Route path="/admin/ai-assistant" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'COMPANY_ADMIN']}><AISuggestionsPage /></ProtectedRoute>
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
        <ProtectedRoute allowedRoles={['BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'EMPLOYEE', 'VIEWER']}><DocumentVerificationPage /></ProtectedRoute>
      } />
      <Route path="/employee/ai-assistant" element={
        <ProtectedRoute allowedRoles={['BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'EMPLOYEE', 'VIEWER']}><EmployeeDashboard /></ProtectedRoute>
      } />
      <Route path="/employee/profile" element={
        <ProtectedRoute allowedRoles={['BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'EMPLOYEE', 'VIEWER']}><ProfilePage /></ProtectedRoute>
      } />

      {/* GeM Compliance Verification Engine Routes */}
      <Route path="/gem-compliance-dashboard" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'VIEWER']}><GeMOverviewDashboard /></ProtectedRoute>
      } />
      <Route path="/gem-compliance-fastapi" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'VIEWER']}><GeMComplianceDashboard /></ProtectedRoute>
      } />
      <Route path="/gem-compliance/analytics" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'VIEWER']}><GeMAnalyticsPage /></ProtectedRoute>
      } />
      <Route path="/gem-compliance/audit-trail" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'VIEWER']}><GeMAuditTrailPage /></ProtectedRoute>
      } />
      <Route path="/gem-compliance/workflow" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'VIEWER']}><GeMWorkflowPage /></ProtectedRoute>
      } />
      <Route path="/gem-compliance" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'VIEWER']}><GeMCompliancePortal /></ProtectedRoute>
      } />
      <Route path="/bid-documents" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'VIEWER']}><BidDocumentSuitePage /></ProtectedRoute>
      } />
      <Route path="/company-brain" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'VIEWER']}><CompanyBrainDashboard /></ProtectedRoute>
      } />
      <Route path="/company-brain/:category" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER', 'VIEWER']}><CompanyBrainCategoryPage /></ProtectedRoute>
      } />


      {/* Tender Workspace Routes */}
      <Route path="/tender-management" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN']}><TenderManagementPage /></ProtectedRoute>
      } />
      <Route path="/tender-management/new" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN']}><CreateTenderPage /></ProtectedRoute>
      } />
      <Route path="/tenders/:tenderId" element={
        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN']}><TenderWorkspacePage /></ProtectedRoute>
      } />

      {/* Error Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

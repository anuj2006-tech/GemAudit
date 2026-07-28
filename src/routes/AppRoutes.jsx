import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import SuperAdminDashboard from '../pages/superAdmin/SuperAdminDashboard';
import UsersPage from '../pages/superAdmin/UsersPage';
import LegalAdminsPage from '../pages/superAdmin/LegalAdminsPage';
import OrganizationsPage from '../pages/superAdmin/OrganizationsPage';
import TenderListPage from '../pages/superAdmin/TenderListPage';
import AIDashboardPage from '../pages/superAdmin/AIDashboardPage';
import ReportsPage from '../pages/superAdmin/ReportsPage';
import SettingsPage from '../pages/superAdmin/SettingsPage';
import LegalAdminDashboard from '../pages/legalAdmin/LegalAdminDashboard';
import AssignedTendersPage from '../pages/legalAdmin/AssignedTendersPage';
import ReviewTenderPage from '../pages/legalAdmin/ReviewTenderPage';
import AISuggestionsPage from '../pages/legalAdmin/AISuggestionsPage';
import DocumentVerificationPage from '../pages/legalAdmin/DocumentVerificationPage';
import LegalReportsPage from '../pages/legalAdmin/LegalReportsPage';
import ProfilePage from '../pages/legalAdmin/ProfilePage';
import NotFoundPage from '../pages/errors/NotFoundPage';

const ProtectedRoute = ({ children, role }) => {
  const { user, role: currentRole } = useAuth();
  if (!user) return <Navigate to="/auth/login" replace />;
  if (role && currentRole !== role) return <Navigate to={currentRole === 'super-admin' ? '/super-admin/dashboard' : '/legal-admin/dashboard'} replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />

      <Route path="/super-admin/dashboard" element={<ProtectedRoute role="super-admin"><SuperAdminDashboard /></ProtectedRoute>} />
      <Route path="/super-admin/users" element={<ProtectedRoute role="super-admin"><UsersPage /></ProtectedRoute>} />
      <Route path="/super-admin/legal-admins" element={<ProtectedRoute role="super-admin"><LegalAdminsPage /></ProtectedRoute>} />
      <Route path="/super-admin/organizations" element={<ProtectedRoute role="super-admin"><OrganizationsPage /></ProtectedRoute>} />
      <Route path="/super-admin/tenders" element={<ProtectedRoute role="super-admin"><TenderListPage /></ProtectedRoute>} />
      <Route path="/super-admin/ai-analysis" element={<ProtectedRoute role="super-admin"><AIDashboardPage /></ProtectedRoute>} />
      <Route path="/super-admin/reports" element={<ProtectedRoute role="super-admin"><ReportsPage /></ProtectedRoute>} />
      <Route path="/super-admin/settings" element={<ProtectedRoute role="super-admin"><SettingsPage /></ProtectedRoute>} />

      <Route path="/legal-admin/dashboard" element={<ProtectedRoute role="legal-admin"><LegalAdminDashboard /></ProtectedRoute>} />
      <Route path="/legal-admin/assigned-tenders" element={<ProtectedRoute role="legal-admin"><AssignedTendersPage /></ProtectedRoute>} />
      <Route path="/legal-admin/review" element={<ProtectedRoute role="legal-admin"><ReviewTenderPage /></ProtectedRoute>} />
      <Route path="/legal-admin/ai-suggestions" element={<ProtectedRoute role="legal-admin"><AISuggestionsPage /></ProtectedRoute>} />
      <Route path="/legal-admin/document-verification" element={<ProtectedRoute role="legal-admin"><DocumentVerificationPage /></ProtectedRoute>} />
      <Route path="/legal-admin/reports" element={<ProtectedRoute role="legal-admin"><LegalReportsPage /></ProtectedRoute>} />
      <Route path="/legal-admin/profile" element={<ProtectedRoute role="legal-admin"><ProfilePage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

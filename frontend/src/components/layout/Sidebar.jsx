import { LayoutDashboard, Users, Building2, FileText, Brain, BarChart3, Settings, Bell, FileCheck2, ScrollText, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const superAdminLinks = [
  { label: 'Dashboard', to: '/super-admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', to: '/super-admin/users', icon: Users },
  { label: 'Legal Admins', to: '/super-admin/legal-admins', icon: ShieldCheck },
  { label: 'Organizations', to: '/super-admin/organizations', icon: Building2 },
  { label: 'Tender Management', to: '/super-admin/tenders', icon: FileText },
  { label: 'AI Analysis', to: '/super-admin/ai-analysis', icon: Brain },
  { label: 'Reports', to: '/super-admin/reports', icon: BarChart3 },
  { label: 'Settings', to: '/super-admin/settings', icon: Settings },
];

const legalAdminLinks = [
  { label: 'Dashboard', to: '/legal-admin/dashboard', icon: LayoutDashboard },
  { label: 'Assigned Tenders', to: '/legal-admin/assigned-tenders', icon: FileCheck2 },
  { label: 'Review', to: '/legal-admin/review', icon: ScrollText },
  { label: 'AI Suggestions', to: '/legal-admin/ai-suggestions', icon: Brain },
  { label: 'Document Verification', to: '/legal-admin/document-verification', icon: FileText },
  { label: 'Reports', to: '/legal-admin/reports', icon: BarChart3 },
  { label: 'Profile', to: '/legal-admin/profile', icon: Users },
];

const Sidebar = () => {
  const location = useLocation();
  const { role, logout } = useAuth();
  const links = role === 'super-admin' ? superAdminLinks : legalAdminLinks;

  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-slate-200 bg-slate-950 p-6 text-slate-100 lg:flex">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">Tender AI</p>
        <h2 className="mt-2 text-xl font-semibold">Management Console</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map(({ label, to, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-800 pt-4">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-slate-800">
          <Bell size={18} /> Notifications
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 hover:bg-slate-800">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

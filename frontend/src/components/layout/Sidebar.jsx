import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Brain, 
  BarChart3, 
  Settings, 
  Bell, 
  FileCheck2, 
  ScrollText, 
  LogOut, 
  ShieldCheck,
  CreditCard,
  Network
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Platform Superadmin Navigation
const platformAdminLinks = [
  { label: 'Dashboard', to: '/super-admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', to: '/super-admin/users', icon: Users },
  { label: 'Organizations', to: '/super-admin/organizations', icon: Building2 },
  { label: 'Legal Admins', to: '/super-admin/legal-admins', icon: ShieldCheck },
  { label: 'Tenders View', to: '/super-admin/tenders', icon: FileText },
  { label: 'AI Metrics', to: '/super-admin/ai-analysis', icon: Brain },
  { label: 'Platform Settings', to: '/super-admin/settings', icon: Settings },
];


// Company Owner Navigation
const companyOwnerLinks = [
  { label: 'Dashboard', to: '/owner/dashboard', icon: LayoutDashboard },
  { label: 'Manage Users', to: '/owner/users', icon: Users },
  { label: 'Departments', to: '/owner/departments', icon: Network },
  { label: 'Tender Board', to: '/owner/tenders', icon: FileText },
  { label: 'Document Vault', to: '/owner/documents', icon: FileCheck2 },
  { label: 'AI Bid Evaluator', to: '/owner/ai-assistant', icon: Brain },
  { label: 'Billing & Plan', to: '/owner/billing', icon: CreditCard },
  { label: 'Company Settings', to: '/owner/settings', icon: Settings },
];

// Company Admin Navigation
const companyAdminLinks = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Employee Roster', to: '/admin/employees', icon: Users },
  { label: 'Tender Board', to: '/admin/tenders', icon: FileText },
  { label: 'Approvals & Review', to: '/admin/approvals', icon: ScrollText },
  { label: 'Documents', to: '/admin/documents', icon: FileCheck2 },
  { label: 'AI Bid Evaluator', to: '/admin/ai-assistant', icon: Brain },
];

// Employee Navigation (includes Bid Manager, Writer, Reviewer, Employee, Viewer views)
const employeeLinks = [
  { label: 'My Dashboard', to: '/employee/dashboard', icon: LayoutDashboard },
  { label: 'Assigned Tenders', to: '/employee/tenders', icon: FileCheck2 },
  { label: 'Tender Tasks', to: '/employee/tasks', icon: ScrollText },
  { label: 'Document Vault', to: '/employee/documents', icon: FileText },
  { label: 'AI Bid Assistant', to: '/employee/ai-assistant', icon: Brain },
  { label: 'My Profile', to: '/employee/profile', icon: Users },
];

const Sidebar = () => {
  const location = useLocation();
  const { role, logout, user } = useAuth();

  // Pick links list dynamically based on role
  let links = employeeLinks;
  if (role === 'PLATFORM_ADMIN') {
    links = platformAdminLinks;
  } else if (role === 'COMPANY_OWNER') {
    links = companyOwnerLinks;
  } else if (role === 'ADMIN') {
    links = companyAdminLinks;
  }

  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-slate-900 bg-slate-950 p-6 text-slate-100 lg:flex shrink-0 font-sans select-none">
      <div className="mb-8 border-b border-slate-900 pb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-500" />
          <span className="text-lg font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">TenderAI Console</span>
        </div>
        <p className="text-[10px] mt-1.5 font-bold uppercase tracking-[0.2em] text-slate-500">
          Role: <span className="text-blue-400">{role?.replace('_', ' ')}</span>
        </p>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {links.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition duration-200 ${
                active 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/30' 
                  : 'text-slate-400 border border-transparent hover:bg-slate-900/50 hover:text-white'
              }`}
            >
              <Icon size={18} className={active ? 'text-blue-400' : 'text-slate-500'} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1.5 border-t border-slate-900 pt-4 mt-auto">
        <div className="px-3 py-2 text-xs text-slate-500 flex justify-between items-center bg-slate-900/20 rounded-xl mb-2">
          <span className="truncate max-w-[120px] font-medium">{user?.name}</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <button 
          onClick={logout} 
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-400 border border-transparent hover:bg-red-950/20 hover:text-red-400 transition duration-200"
        >
          <LogOut size={18} className="text-slate-500 group-hover:text-red-400" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

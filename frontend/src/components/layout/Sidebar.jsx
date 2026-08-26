import { 
  LayoutDashboard, 
  FileText, 
  Brain, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Simplified Minimal Navigation - Core Workflow Stage Items per role
const platformAdminLinks = [
  { label: 'Dashboard', to: '/super-admin/dashboard', icon: LayoutDashboard },
  { label: 'GeM Verification', to: '/gem-compliance', icon: ShieldCheck },
  { label: 'Company Brain', to: '/company-brain', icon: Brain },
  { label: 'Tender Board', to: '/tender-reg', icon: FileText },
  { label: 'Platform Settings', to: '/super-admin/settings', icon: Settings }
];

const companyOwnerLinks = [
  { label: 'Dashboard', to: '/owner/dashboard', icon: LayoutDashboard },
  { label: 'GeM Verification', to: '/gem-compliance', icon: ShieldCheck },
  { label: 'Company Brain', to: '/company-brain', icon: Brain },
  { label: 'Tender Board', to: '/tender-reg', icon: FileText },
  { label: 'Settings', to: '/owner/settings', icon: Settings }
];

const companyAdminLinks = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'GeM Verification', to: '/gem-compliance', icon: ShieldCheck },
  { label: 'Company Brain', to: '/company-brain', icon: Brain },
  { label: 'Tender Board', to: '/tender-reg', icon: FileText }
];

const employeeLinks = [
  { label: 'Dashboard', to: '/employee/dashboard', icon: LayoutDashboard },
  { label: 'GeM Verification', to: '/gem-compliance', icon: ShieldCheck },
  { label: 'Company Brain', to: '/company-brain', icon: Brain },
  { label: 'Tender Board', to: '/tender-reg', icon: FileText }
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  let links = employeeLinks;
  if (role === 'PLATFORM_ADMIN') {
    links = platformAdminLinks;
  } else if (role === 'COMPANY_OWNER') {
    links = companyOwnerLinks;
  } else if (role === 'ADMIN') {
    links = companyAdminLinks;
  }

  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col border-r border-slate-200 bg-white text-slate-900 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-100 p-6 shrink-0 font-sans select-none sticky top-0 z-30 transition-colors duration-300">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Brain className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Tender<span className="gradient-accent">AI</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">Enterprise Console</span>
          </div>
        </Link>
        <div className="mt-4 flex items-center justify-between bg-slate-100 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</span>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/20">
            {role?.replace('_', ' ') || 'GUEST'}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {links.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold transition-all duration-200 ${
                active 
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-600/15 dark:text-indigo-300 dark:border-indigo-500/30 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900/60 dark:hover:text-white'
              }`}
            >
              <Icon size={18} className={active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
              <span>{label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-sm" />}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-200 dark:border-slate-800/80 pt-4 mt-auto">
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col truncate pr-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Dev User'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'dev@company.com'}</span>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
        </div>

        <button 
          onClick={handleLogout} 
          className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-transparent hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all duration-200 group"
        >
          <span className="flex items-center gap-2.5">
            <LogOut size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition" />
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

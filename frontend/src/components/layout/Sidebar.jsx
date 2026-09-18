import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  TrendingUp, 
  History, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  X, 
  Server, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Clean officer navigation structure (Dashboard, Tender Board, Analytics, Audit Trail)
export const NAV_LINKS = [
  { label: 'Dashboard', to: '/gem-compliance-dashboard', icon: LayoutDashboard },
  { label: 'Tender Board', to: '/gem-compliance-fastapi', icon: Layers },
  { label: 'Analytics', to: '/gem-compliance/analytics', icon: TrendingUp },
  { label: 'Audit Trail', to: '/gem-compliance/audit-trail', icon: History }
];

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between p-5 font-sans select-none bg-white text-slate-800">
      {/* Top Header & Brand */}
      <div>
        <div className="mb-6 border-b border-slate-100 pb-5 flex items-center justify-between">
          <Link 
            to="/gem-compliance-dashboard" 
            className="flex items-center gap-3 group"
            onClick={() => onMobileClose && onMobileClose()}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1">
                GeM<span className="text-indigo-600">Audit</span>
              </span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          {onMobileClose && (
            <button 
              onClick={onMobileClose} 
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Officer Role Indicator */}
        <div className="mb-5 flex items-center justify-between bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Officer Mode</span>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
            PROCUREMENT OFFICER
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 overflow-y-auto pr-1">
          {NAV_LINKS.map(({ label, to, icon: Icon }) => {
            const active = location.pathname === to || location.pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                onClick={() => onMobileClose && onMobileClose()}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs transition-all duration-200 group relative ${
                  active 
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon size={18} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'}`} />
                <span>{label}</span>
                {active && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-white shadow-xs" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Middle Widget: Live Statutory Portals Health */}
      <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-700 font-semibold flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-600" /> Statutory Engine
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            10/10 Online
          </span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-full rounded-full"></div>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">Automated API Setu Link</p>
      </div>

      {/* User Footer Card */}
      <div className="space-y-2 border-t border-slate-100 pt-4 mt-auto">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Anuj Officer'}</span>
              <span className="text-[11px] text-slate-500 font-medium truncate">{user?.email || 'anuj.officer@gem.gov.in'}</span>
            </div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white shrink-0" title="Active Session" />
        </div>

        <button 
          onClick={handleLogout} 
          className="flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border hover:border-rose-200 transition-all duration-150 group"
        >
          <span className="flex items-center gap-2.5">
            <LogOut size={16} className="text-slate-400 group-hover:text-rose-600 transition" />
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 flex-col border-r border-slate-200 bg-white text-slate-800 shrink-0 sticky top-0 z-30 shadow-xs transition-colors duration-200">
        {navContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
            onClick={onMobileClose}
          />

          {/* Slide-out Sidebar Surface */}
          <aside className="relative z-10 w-72 max-w-[85vw] h-full bg-white border-r border-slate-200 shadow-2xl flex flex-col transform transition-transform ease-in-out duration-300">
            {navContent}
          </aside>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {NAV_LINKS.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition ${
                active 
                  ? 'text-indigo-600 font-bold bg-indigo-50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${active ? 'text-indigo-600 stroke-[2.5]' : 'text-slate-400'}`} />
              <span className="truncate max-w-[55px]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;

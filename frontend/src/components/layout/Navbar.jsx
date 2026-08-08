import { Menu, Moon, Sun, Bell, Shield, Search } from 'lucide-react';
import ProfileMenu from '../common/ProfileMenu';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { darkMode, toggleTheme } = useTheme();
  const { notifications } = useNotifications();
  const { user } = useAuth();
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 text-slate-900 dark:border-slate-800/80 dark:bg-slate-950/80 dark:text-slate-100 px-4 py-3.5 backdrop-blur-xl lg:px-8 transition-colors duration-300">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar} 
            className="rounded-xl p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden transition border border-slate-200 dark:border-slate-800"
          >
            <Menu size={20} />
          </button>
          
          <div className="relative hidden sm:block w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search tenders, docs, RAG index..."
              className="w-full rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition placeholder:text-slate-400 dark:placeholder:text-slate-500 font-sans"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <Shield className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="font-mono text-[11px]">RLS ACTIVE</span>
          </div>

          <button 
            onClick={toggleTheme} 
            className="rounded-xl p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="relative">
            <button className="rounded-xl p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition relative">
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
              )}
            </button>
          </div>

          <div className="pl-2 border-l border-slate-200 dark:border-slate-800">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

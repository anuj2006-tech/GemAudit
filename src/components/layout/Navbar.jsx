import { Menu, Moon, Sun } from 'lucide-react';
import SearchBox from '../common/SearchBox';
import NotificationBadge from '../common/NotificationBadge';
import ProfileMenu from '../common/ProfileMenu';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = ({ onToggleSidebar }) => {
  const { darkMode, toggleTheme } = useTheme();
  const { notifications } = useNotifications();

  return (
    <header className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onToggleSidebar} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800">
          <Menu size={20} />
        </button>
        <div className="flex-1">
          <SearchBox />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <NotificationBadge count={notifications.filter((item) => !item.read).length} />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

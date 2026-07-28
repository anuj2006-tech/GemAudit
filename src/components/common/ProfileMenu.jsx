import { UserCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileMenu = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
      <UserCircle2 size={24} className="text-primary" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name || 'Guest'}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email || 'No account'}</p>
      </div>
      <button onClick={logout} className="text-xs font-medium text-danger">
        Logout
      </button>
    </div>
  );
};

export default ProfileMenu;

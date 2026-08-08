import { useAuth } from '../../context/AuthContext';

const ProfileMenu = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800/80 dark:bg-slate-900/60">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </div>
      <div className="min-w-0 flex flex-col">
        <p className="truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name || 'Dev User'}</p>
        <p className="truncate text-[10px] text-slate-500 dark:text-slate-400 font-mono">{user?.email || 'dev@company.com'}</p>
      </div>
    </div>
  );
};

export default ProfileMenu;

import { Bell } from 'lucide-react';

const NotificationBadge = ({ count }) => (
  <button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
    <Bell size={18} />
    {count > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-danger" />}
  </button>
);

export default NotificationBadge;

const DashboardCard = ({ title, value, subtitle, icon, accent = 'primary' }) => {
  const accents = {
    primary: 'from-primary/10 to-primary/5 text-primary',
    success: 'from-success/10 to-success/5 text-success',
    warning: 'from-warning/10 to-warning/5 text-warning',
    danger: 'from-danger/10 to-danger/5 text-danger',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className={`flex items-center justify-between rounded-xl bg-gradient-to-br ${accents[accent] || accents.primary} p-3`}>
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      {subtitle && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
};

export default DashboardCard;

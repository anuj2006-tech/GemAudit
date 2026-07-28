const StatisticsCard = ({ title, value, trend, icon }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <div className="text-primary">{icon}</div>
    </div>
    <div className="mt-4 flex items-end justify-between">
      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <span className="text-sm font-medium text-success">{trend}</span>
    </div>
  </div>
);

export default StatisticsCard;

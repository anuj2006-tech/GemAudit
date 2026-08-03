import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import DashboardCard from '../../components/cards/DashboardCard';
import StatisticsCard from '../../components/cards/StatisticsCard';
import Table from '../../components/tables/Table';
import { legalAdminStats, tenders, notifications, aiInsights } from '../../mock/data';
import { FileCheck2, Brain, ClipboardList, Clock3, AlertTriangle } from 'lucide-react';

const LegalAdminDashboard = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Legal Admin Dashboard" subtitle="Daily review workload and legal tender assistance" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {legalAdminStats.map((item, index) => (
          <DashboardCard key={item.title} title={item.title} value={item.value} subtitle={item.change} icon={item.icon} accent={index % 2 === 0 ? 'warning' : 'primary'} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Review Progress</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <StatisticsCard title="Review Progress" value="73%" trend="+8%" icon={<ClipboardList />} />
            <StatisticsCard title="Pending Reviews" value="7" trend="+1" icon={<Clock3 />} />
            <StatisticsCard title="Flagged Items" value="3" trend="-1" icon={<AlertTriangle />} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold">Recent Tasks</h2>
          <div className="space-y-3">
            {notifications.slice(0, 2).map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold">Today's Tasks</h2>
          <Table
            columns={[
              { key: 'title', label: 'Tender' },
              { key: 'organization', label: 'Organization' },
              { key: 'status', label: 'Status' },
            ]}
            rows={tenders.slice(0, 2)}
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold">AI Suggestions</h2>
          <div className="space-y-3">
            {aiInsights.map((item) => (
              <div key={item.id} className="rounded-xl bg-blue-50 p-3 dark:bg-slate-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Brain size={16} className="text-primary" />
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LegalAdminDashboard;

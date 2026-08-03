import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import DashboardCard from '../../components/cards/DashboardCard';
import StatisticsCard from '../../components/cards/StatisticsCard';
import Table from '../../components/tables/Table';
import { superAdminStats, tenders, notifications, aiInsights } from '../../mock/data';
import { FileText, Users, Brain, TrendingUp, Bell, AlertCircle } from 'lucide-react';

const SuperAdminDashboard = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Super Admin Dashboard" subtitle="Enterprise view of tenders, legal reviews, and AI analysis" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {superAdminStats.map((item, index) => (
          <DashboardCard key={item.title} title={item.title} value={item.value} subtitle={`${item.change} from last month`} icon={item.icon} accent={index % 2 === 0 ? 'primary' : 'success'} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Monthly Activity</h2>
            <TrendingUp className="text-primary" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <StatisticsCard title="Tender Status" value="68%" trend="+10%" icon={<FileText />} />
            <StatisticsCard title="AI Accuracy" value="93%" trend="+4%" icon={<Brain />} />
            <StatisticsCard title="User Growth" value="43" trend="+6" icon={<Users />} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Bell className="text-warning" />
          </div>
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Latest Tenders</h2>
          <Table
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'organization', label: 'Organization' },
              { key: 'status', label: 'Status' },
              { key: 'dueDate', label: 'Due Date' },
            ]}
            rows={tenders}
          />
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold">Pending Approvals</h2>
            <div className="space-y-3">
              {tenders.slice(0, 2).map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.organization}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold">AI Insights</h2>
            <div className="space-y-3">
              {aiInsights.map((item) => (
                <div key={item.id} className="rounded-xl bg-blue-50 p-3 dark:bg-slate-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.title}</p>
                    <span className="text-sm font-semibold text-primary">{item.score}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;

import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { aiInsights, tenders } from '../../mock/data';

const AIDashboardPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="AI Analysis" subtitle="Auto-generated insights and recommendations" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold">AI Insights</h2>
          <div className="space-y-3">
            {aiInsights.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{item.title}</p>
                  <span className="text-sm font-semibold text-primary">{item.score}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold">High-Confidence Tenders</h2>
          {tenders.map((item) => (
            <div key={item.id} className="mb-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-700">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{item.title}</p>
                <span className="text-sm font-semibold text-success">{item.aiScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIDashboardPage;

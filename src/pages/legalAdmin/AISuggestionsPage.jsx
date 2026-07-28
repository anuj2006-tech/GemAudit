import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { aiInsights } from '../../mock/data';

const AISuggestionsPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="AI Suggestions" subtitle="Suggested legal insights and risk recommendations" />
      <div className="space-y-4">
        {aiInsights.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <span className="text-sm font-semibold text-primary">{item.score}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{item.summary}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AISuggestionsPage;

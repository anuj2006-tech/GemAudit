import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Settings" subtitle="Platform configuration and automation preferences" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold">Automation Rules</h2>
          <p className="mt-2 text-sm text-slate-500">Tune AI review thresholds and escalation settings.</p>
          <div className="mt-4 flex gap-3">
            <Button>Save Preferences</Button>
            <Button variant="secondary">Reset</Button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="mt-2 text-sm text-slate-500">Control alert delivery and reviewer reminders.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

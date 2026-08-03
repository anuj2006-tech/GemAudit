import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const ProfilePage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Profile" subtitle="Manage your legal admin profile and preferences" />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500">Profile editing and account preferences are prepared for backend integration.</p>
        <div className="mt-4">
          <Button>Edit Profile</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;

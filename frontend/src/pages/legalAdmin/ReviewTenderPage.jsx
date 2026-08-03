import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const ReviewTenderPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Review Tender" subtitle="Assess legal and compliance details for the selected tender" />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold">Tender Review Summary</h2>
        <p className="mt-2 text-sm text-slate-500">This mock review screen includes key legal notes, AI suggestions, and approval actions.</p>
        <div className="mt-6 flex gap-3">
          <Button>Approve</Button>
          <Button variant="secondary">Request Changes</Button>
          <Button variant="danger">Reject</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReviewTenderPage;

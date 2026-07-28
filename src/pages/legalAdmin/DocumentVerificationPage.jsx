import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const DocumentVerificationPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Document Verification" subtitle="Verify compliance documents and supporting evidence" />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500">No documents are pending review in this mock view.</p>
        <div className="mt-4">
          <Button>Upload Evidence</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DocumentVerificationPage;

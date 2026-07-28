import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import { tenders } from '../../mock/data';
import StatusBadge from '../../components/common/StatusBadge';

const AssignedTendersPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Assigned Tenders" subtitle="All tenders currently assigned to your legal review queue" action={<Button>Review Selected</Button>} />
      <Table
        columns={[
          { key: 'title', label: 'Tender' },
          { key: 'organization', label: 'Organization' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          { key: 'dueDate', label: 'Due Date' },
        ]}
        rows={tenders}
      />
    </DashboardLayout>
  );
};

export default AssignedTendersPage;

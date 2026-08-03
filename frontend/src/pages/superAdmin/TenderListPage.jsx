import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import { tenders } from '../../mock/data';
import StatusBadge from '../../components/common/StatusBadge';

const TenderListPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Tender Management" subtitle="Review operational tenders and their lifecycle state" action={<Button>Export</Button>} />
      <Table
        columns={[
          { key: 'title', label: 'Tender' },
          { key: 'organization', label: 'Organization' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          { key: 'priority', label: 'Priority' },
          { key: 'dueDate', label: 'Due Date' },
        ]}
        rows={tenders}
      />
    </DashboardLayout>
  );
};

export default TenderListPage;

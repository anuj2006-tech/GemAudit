import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import { organizations } from '../../mock/data';
import StatusBadge from '../../components/common/StatusBadge';

const OrganizationsPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Organizations" subtitle="Track participating organizations and verification status" action={<Button>Add Organization</Button>} />
      <Table
        columns={[
          { key: 'name', label: 'Organization' },
          { key: 'sector', label: 'Sector' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
        ]}
        rows={organizations}
      />
    </DashboardLayout>
  );
};

export default OrganizationsPage;

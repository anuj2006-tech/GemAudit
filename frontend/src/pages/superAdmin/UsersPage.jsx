import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import { users } from '../../mock/data';
import StatusBadge from '../../components/common/StatusBadge';

const UsersPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Users" subtitle="Manage platform users and access roles" action={<Button>Add User</Button>} />
      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
        ]}
        rows={users}
      />
    </DashboardLayout>
  );
};

export default UsersPage;

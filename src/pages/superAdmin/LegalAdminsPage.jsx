import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import { users } from '../../mock/data';

const LegalAdminsPage = () => {
  const legalAdmins = users.filter((user) => user.role.includes('Legal'));

  return (
    <DashboardLayout>
      <PageHeader title="Legal Admins" subtitle="Review legal admin accounts and permissions" action={<Button>Add Legal Admin</Button>} />
      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'status', label: 'Status' },
        ]}
        rows={legalAdmins}
      />
    </DashboardLayout>
  );
};

export default LegalAdminsPage;

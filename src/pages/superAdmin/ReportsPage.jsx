import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import { reports } from '../../mock/data';

const ReportsPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Reports" subtitle="View operational and compliance reports" action={<Button>Generate Report</Button>} />
      <Table
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'type', label: 'Type' },
          { key: 'owner', label: 'Owner' },
          { key: 'date', label: 'Date' },
        ]}
        rows={reports}
      />
    </DashboardLayout>
  );
};

export default ReportsPage;

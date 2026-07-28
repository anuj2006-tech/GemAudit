import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import { reports } from '../../mock/data';

const LegalReportsPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Reports" subtitle="Legal review summaries and compliance reports" />
      <Table
        columns={[
          { key: 'title', label: 'Report' },
          { key: 'type', label: 'Type' },
          { key: 'owner', label: 'Owner' },
          { key: 'date', label: 'Created' },
        ]}
        rows={reports}
      />
    </DashboardLayout>
  );
};

export default LegalReportsPage;

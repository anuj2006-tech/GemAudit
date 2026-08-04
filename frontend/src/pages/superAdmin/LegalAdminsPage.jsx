import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { getCompanyAdmins, createCompanyAdmin, getCompanies } from '../../services/platformService';

const LegalAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdminsAndCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const [adminsRes, companiesRes] = await Promise.all([
        getCompanyAdmins(),
        getCompanies()
      ]);
      setAdmins(adminsRes.data);
      setCompanies(companiesRes.data);
    } catch (err) {
      console.error('Failed to fetch platform configuration data:', err);
      setError(err.response?.data?.error || 'Failed to fetch database information. Check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminsAndCompanies();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminName || !adminEmail || !adminPassword || !selectedCompanyId) {
      setModalError('All fields, including company association, are required.');
      return;
    }

    setModalError('');
    setSubmitting(true);

    try {
      await createCompanyAdmin(selectedCompanyId, {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
      });
      
      // Reset form and close modal
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      setSelectedCompanyId('');
      setIsModalOpen(false);
      
      // Refresh list
      fetchAdminsAndCompanies();
    } catch (err) {
      console.error('Failed to create admin:', err);
      setModalError(err.response?.data?.error || 'Failed to create company admin. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Company Admins" 
        subtitle="Review and provision administrator credentials associated with specific companies" 
        action={<Button onClick={() => setIsModalOpen(true)}>Add Company Admin</Button>} 
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
          <p className="font-semibold">Backend Connection Issue</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="text-slate-100 font-sans">
          <Table
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { 
                key: 'company', 
                label: 'Company Association',
                render: (row) => row.companies?.name || 'N/A'
              },
              { 
                key: 'created_at', 
                label: 'Created At', 
                render: (row) => new Date(row.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              },
              { 
                key: 'status', 
                label: 'Status', 
                render: () => (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    Active
                  </span>
                ) 
              },
            ]}
            rows={admins}
          />
        </div>
      )}

      {/* Modern Backdrop and Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => { if (!submitting) setIsModalOpen(false); }}
          ></div>
          
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 p-6 shadow-2xl transition-all text-slate-200">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">Add New Company Admin</h3>
              <p className="mt-1 text-xs text-slate-450">
                Credentials generated here will allow the new administrator to log in and manage their designated company workspace.
              </p>
            </div>

            {modalError && (
              <div className="mb-4 rounded-xl bg-red-950/30 border border-red-900/50 p-4 text-xs text-red-400">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <Input 
                label="Full Name" 
                type="text" 
                value={adminName} 
                onChange={(e) => setAdminName(e.target.value)} 
                placeholder="e.g. Noah Patel"
                required 
                disabled={submitting}
              />
              <Input 
                label="Email Address" 
                type="email" 
                value={adminEmail} 
                onChange={(e) => setAdminEmail(e.target.value)} 
                placeholder="e.g. noah@company.com"
                required 
                disabled={submitting}
              />
              <Input 
                label="Password" 
                type="password" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                placeholder="Minimum 6 characters"
                required 
                disabled={submitting}
              />

              {/* Company dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Associate Company</label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="">Select a company...</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  type="button"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Admin'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LegalAdminsPage;

import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { getLegalAdmins, createLegalAdmin } from '../../services/userService';

const LegalAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLegalAdmins();
      setAdmins(response.data);
    } catch (err) {
      console.error('Failed to fetch legal admins:', err);
      setError(err.response?.data?.error || 'Failed to fetch legal admins. Please ensure Supabase is configured.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminName || !adminEmail || !adminPassword) {
      setModalError('All fields are required.');
      return;
    }

    setModalError('');
    setSubmitting(true);

    try {
      await createLegalAdmin({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
      });
      
      // Reset form and close modal
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      setIsModalOpen(false);
      
      // Refresh list
      fetchAdmins();
    } catch (err) {
      console.error('Failed to create admin:', err);
      setModalError(err.response?.data?.error || 'Failed to create legal admin. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Legal Admins" 
        subtitle="Review legal admin accounts and permissions" 
        action={<Button onClick={() => setIsModalOpen(true)}>Add Legal Admin</Button>} 
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          <p className="font-semibold">Backend Connection Issue</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <Table
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
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
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                  Active
                </span>
              ) 
            },
          ]}
          rows={admins}
        />
      )}

      {/* Modern Backdrop and Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => { if (!submitting) setIsModalOpen(false); }}
          ></div>
          
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Add New Legal Admin</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Credentials generated here will allow the new administrator to access their workspace.
              </p>
            </div>

            {modalError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
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
                placeholder="e.g. noah@tender.ai"
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

              <div className="mt-6 flex justify-end space-x-3">
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
                  {submitting ? 'Creating...' : 'Create Credentials'}
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

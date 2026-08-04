import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { getUsers, createUser, getDepartments } from '../../services/organizationService';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleName, setRoleName] = useState('EMPLOYEE');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsersAndDepts = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, deptsRes] = await Promise.all([
        getUsers(),
        getDepartments().catch(() => ({ data: [] }))
      ]);
      setUsers(usersRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error('Failed to load company user roster:', err);
      setError(err.response?.data?.error || 'Failed to fetch team members. Ensure your workspace session is valid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndDepts();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !roleName) {
      setModalError('All credential fields are required.');
      return;
    }

    setModalError('');
    setSubmitting(true);

    try {
      await createUser({
        name,
        email,
        password,
        roleName,
        departmentId: selectedDeptId || null
      });

      // Clear states and close modal
      setName('');
      setEmail('');
      setPassword('');
      setRoleName('EMPLOYEE');
      setSelectedDeptId('');
      setIsModalOpen(false);

      // Refresh list
      fetchUsersAndDepts();
    } catch (err) {
      console.error('Failed to create company member:', err);
      setModalError(err.response?.data?.error || 'Failed to provision company user. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Manage Team Members" 
        subtitle="Review, audit, and provision new user accounts for your company workspace" 
        action={<Button onClick={() => setIsModalOpen(true)}>Add Team Member</Button>}
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
          <p className="font-semibold">Operation Error</p>
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
                key: 'role', 
                label: 'Role',
                render: (row) => (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    row.roles?.name === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' :
                    row.roles?.name === 'COMPANY_OWNER' ? 'bg-blue-500/10 text-blue-400' :
                    row.roles?.name === 'BID_MANAGER' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {row.roles?.name || 'EMPLOYEE'}
                  </span>
                )
              },
              { 
                key: 'department', 
                label: 'Department',
                render: (row) => row.departments?.name || 'Unassigned'
              },
              {
                key: 'created_at',
                label: 'Added On',
                render: (row) => new Date(row.created_at).toLocaleDateString()
              },
              {
                key: 'status',
                label: 'Status',
                render: () => (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    Active
                  </span>
                )
              }
            ]}
            rows={users}
          />
        </div>
      )}

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => { if (!submitting) setIsModalOpen(false); }}
          ></div>
          
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 p-6 shadow-2xl transition-all text-slate-200">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">Add Team Member</h3>
              <p className="mt-1 text-xs text-slate-450">
                Setup credentials for a new employee or administrator. They will log in using their email and password.
              </p>
            </div>

            {modalError && (
              <div className="mb-4 rounded-xl bg-red-950/30 border border-red-900/50 p-4 text-xs text-red-400">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <Input 
                label="Full Name" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Liam Garcia"
                required 
                disabled={submitting}
              />
              <Input 
                label="Login Email Address" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="e.g. liam@company.com"
                required 
                disabled={submitting}
              />
              <Input 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Minimum 6 characters"
                required 
                disabled={submitting}
              />

              {/* Role Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Access Role</label>
                <select
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                  <option value="BID_MANAGER">Bid Manager</option>
                  <option value="PROPOSAL_WRITER">Proposal Writer</option>
                  <option value="REVIEWER">Reviewer</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              </div>

              {/* Department Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Department (Optional)</label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="">Select department...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
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
                  {submitting ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageUsersPage;

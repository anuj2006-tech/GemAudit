import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { getUsers, getSubscription, getInvoices } from '../../services/organizationService';
import { getTenders } from '../../services/tenderService';
import { Users, FileText, Brain, CreditCard, Sparkles, Plus, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [usersCount, setUsersCount] = useState(0);
  const [tendersCount, setTendersCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [usersRes, subscriptionRes, invoicesRes, tendersRes] = await Promise.all([
          getUsers().catch(() => ({ data: [] })),
          getSubscription().catch(() => ({ data: null })),
          getInvoices().catch(() => ({ data: [] })),
          getTenders().catch(() => ({ data: [] }))
        ]);

        setUsersCount(usersRes.data.length);
        setSubscription(subscriptionRes.data);
        setInvoices(invoicesRes.data);
        setTendersCount(tendersRes.data.length);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader 
        title="Workspace Overview" 
        subtitle="Primary administrative metrics, user roster details, and billing nodes."
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          <span className="animate-pulse">Loading workspace analytics...</span>
        </div>
      ) : (
        <div className="space-y-6 text-slate-200 font-sans">
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Tenders KPI */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Tenders</span>
                <p className="text-3xl font-extrabold text-white mt-1">{tendersCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText className="h-6 w-6" />
              </div>
            </div>

            {/* Users KPI */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Team Size</span>
                <p className="text-3xl font-extrabold text-white mt-1">{usersCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* Subscription KPI */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Plan</span>
                <p className="text-xl font-extrabold text-blue-400 mt-1">
                  {subscription?.plans?.name || 'Starter'}
                </p>
                <span className="text-[10px] text-slate-500">Renews on period end</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>

            {/* AI Limit KPI */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Queries Limit</span>
                <p className="text-3xl font-extrabold text-white mt-1">
                  {subscription?.plans?.limits?.ai_requests || '100'}
                </p>
                <span className="text-[10px] text-slate-500">Monthly renewal</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Brain className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Panel */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-950 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Quick Workspace Tools
              </h3>
              <p className="text-sm text-slate-400 mb-6">Administrate operations, assign roles, manage plan thresholds and configure integrations.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-900 bg-slate-900/30 p-4 hover:border-slate-800 transition">
                  <h4 className="font-semibold text-sm text-white mb-1">Add Team Member</h4>
                  <p className="text-xs text-slate-500 mb-4">Provision a new user account with secure credentials.</p>
                  <Button size="sm" onClick={() => navigate('/owner/users')}>Add User</Button>
                </div>
                <div className="rounded-xl border border-slate-900 bg-slate-900/30 p-4 hover:border-slate-800 transition">
                  <h4 className="font-semibold text-sm text-white mb-1">Manage Billing Plan</h4>
                  <p className="text-xs text-slate-500 mb-4">Upgrade or degrade active SaaS pricing threshold limits.</p>
                  <Button size="sm" variant="secondary" onClick={() => navigate('/owner/billing')}>Go to Billing</Button>
                </div>
              </div>
            </div>

            {/* Invoices widget */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Invoices</h3>
              {invoices.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center text-slate-600">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <span className="text-xs">No invoices generated yet.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-900 text-xs">
                      <div>
                        <p className="font-bold text-white">{inv.currency} {inv.amount}</p>
                        <span className="text-[10px] text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {inv.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OwnerDashboard;

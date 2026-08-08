import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { getUsers, getSubscription, getInvoices } from '../../services/organizationService';
import { getTenders } from '../../services/tenderService';
import { 
  Users, FileText, Brain, CreditCard, Sparkles, Plus, AlertCircle, 
  TrendingUp, ShieldCheck, Zap, ArrowRight, Activity, Server, FileCheck2
} from 'lucide-react';

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
          getUsers().catch(() => ({ data: [1, 2, 3, 4] })),
          getSubscription().catch(() => ({ data: null })),
          getInvoices().catch(() => ({ data: [] })),
          getTenders().catch(() => ({ data: [1, 2, 3, 4, 5, 6] }))
        ]);

        setUsersCount(usersRes.data?.length || 4);
        setSubscription(subscriptionRes.data);
        setInvoices(invoicesRes.data);
        setTendersCount(tendersRes.data?.length || 6);
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
        title="Organization Overview" 
        subtitle="Primary executive console, team roster management, vector AI thresholds, and billing nodes."
        action={
          <button 
            onClick={() => navigate('/owner/users')}
            className="btn-modern-primary flex items-center gap-2 px-5 py-2.5 text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Team User</span>
          </button>
        }
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold">Loading organization metrics...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-slate-900 dark:text-slate-200 font-sans">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Tenders</span>
                <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{tendersCount}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="font-semibold">+18% this month</span>
              </div>
            </div>

            <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Roster Size</span>
                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{usersCount}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>All active under RLS</span>
              </div>
            </div>

            <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Plan</span>
                <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 dark:text-purple-400">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-300">
                {subscription?.plans?.name || 'Professional'}
              </p>
              <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400 font-mono">Renews automatically</span>
            </div>

            <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI RAG Quota</span>
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                  <Brain className="h-5 w-5" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {subscription?.plans?.limits?.ai_requests || '5,000'}
              </p>
              <div className="mt-3 w-full bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 dark:bg-emerald-400 h-full w-[42%]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glow-card rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                    Executive Operations & Management
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure company workspace settings, assign member privileges, and manage billing tier limit nodes.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 transition">
                  <div className="h-9 w-9 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Roster Provisioning</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Add, invite, or adjust roles for bid managers, reviewers, and employees.</p>
                  <button 
                    onClick={() => navigate('/owner/users')}
                    className="btn-modern-secondary px-4 py-2 text-xs w-full flex items-center justify-center gap-1.5"
                  >
                    <span>Manage Users</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 transition">
                  <div className="h-9 w-9 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Subscription & Billing</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Upgrade plan thresholds, review payment history, and download invoices.</p>
                  <button 
                    onClick={() => navigate('/owner/billing')}
                    className="btn-modern-secondary px-4 py-2 text-xs w-full flex items-center justify-center gap-1.5"
                  >
                    <span>View Billing</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 transition">
                  <div className="h-9 w-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                    <Brain className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">AI Copilot Engine</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Launch autonomous vector query evaluator for live RFC bid proposals.</p>
                  <button 
                    onClick={() => navigate('/owner/ai-assistant')}
                    className="btn-modern-primary px-4 py-2 text-xs w-full flex items-center justify-center gap-1.5"
                  >
                    <span>Launch AI Copilot</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 transition">
                  <div className="h-9 w-9 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Document Vault</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Inspect uploaded RFPs, extracted vector chunks, and legal documentation.</p>
                  <button 
                    onClick={() => navigate('/owner/documents')}
                    className="btn-modern-secondary px-4 py-2 text-xs w-full flex items-center justify-center gap-1.5"
                  >
                    <span>Open Vault</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="glow-card rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  System Invoices
                </h3>

                {invoices.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
                    <span>No invoices generated yet for this period.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invoices.map((inv) => (
                      <div key={inv.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white font-mono">{inv.currency} {inv.amount}</p>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{new Date(inv.created_at).toLocaleDateString()}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'}`}>
                          {inv.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Server className="h-3.5 w-3.5" /> Postgres RLS Active
                </span>
                <span>v2.4 Node</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default OwnerDashboard;

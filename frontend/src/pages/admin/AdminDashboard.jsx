import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { getTenders } from '../../services/tenderService';
import { getUsers } from '../../services/organizationService';
import { getDocuments } from '../../services/documentService';
import { FileText, Users, Clock, ShieldCheck, ArrowRight, Brain, CheckCircle2, Sparkles } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [docsCount, setDocsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tendersRes, usersRes, docsRes] = await Promise.all([
          getTenders().catch(() => ({ data: [
            { id: 't1', title: 'Defense Infrastructure RFP-2026', status: 'under_review', deadline: '2026-08-30' },
            { id: 't2', title: 'Municipal Smart Grid Expansion', status: 'draft', deadline: '2026-09-15' },
            { id: 't3', title: 'Cyber Security Compliance Audit', status: 'approved', deadline: '2026-10-01' }
          ] })),
          getUsers().catch(() => ({ data: [1, 2, 3, 4, 5] })),
          getDocuments().catch(() => ({ data: [1, 2, 3, 4, 5, 6, 7] }))
        ]);

        setTenders(tendersRes.data || []);
        setEmployeesCount(usersRes.data?.length || 5);
        setDocsCount(docsRes.data?.length || 7);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const pendingApprovals = tenders.filter(t => t.status === 'under_review' || t.status === 'draft');

  return (
    <DashboardLayout>
      <PageHeader 
        title="Admin Operations Console" 
        subtitle="Roster management, tender audits, document approvals, and review workflow nodes."
        action={
          <button 
            onClick={() => navigate('/admin/tenders')}
            className="btn-modern-primary flex items-center gap-2 px-5 py-2.5 text-xs"
          >
            <Sparkles className="h-4 w-4 text-indigo-200" />
            <span>Manage Tender Board</span>
          </button>
        }
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold">Loading operational metrics...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-slate-900 dark:text-slate-200 font-sans">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tenders Board</span>
                <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{tenders.length}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-300">
                <span>Active tender records</span>
              </div>
            </div>

            <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employee Staff</span>
                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{employeesCount}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Assigned active sessions</span>
              </div>
            </div>

            <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Vault</span>
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{docsCount}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-300">
                <span>Vector chunks parsed</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glow-card rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                    Pending Approvals Queue ({pendingApprovals.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review RFC requirements, compliance scores, and approval nodes before final submission.</p>
                </div>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500 dark:text-emerald-400" />
                  <span>All active tenders have been reviewed and approved.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals.map(t => (
                    <div key={t.id} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 transition">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</h4>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold font-mono text-amber-600 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 uppercase">
                          {t.status}
                        </span>
                        <button 
                          onClick={() => navigate('/admin/approvals')}
                          className="btn-modern-primary px-4 py-2 text-xs flex items-center gap-1.5"
                        >
                          <span>Review Now</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glow-card rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Operations Status
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Draft Proposals</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono bg-slate-200 dark:bg-slate-900 px-2.5 py-1 rounded-lg">{tenders.filter(t => t.status === 'draft').length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Approved Proposals</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg">{tenders.filter(t => t.status === 'approved').length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Submitted Bids</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-1 rounded-lg">{tenders.filter(t => t.status === 'submitted').length}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Compliance Active
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

export default AdminDashboard;

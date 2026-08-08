import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { getTenders } from '../../services/tenderService';
import { getDocuments } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, ClipboardList, FolderLock, User, Calendar, Brain, ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignedTenders, setAssignedTenders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tendersRes, docsRes] = await Promise.all([
          getTenders().catch(() => ({ data: [
            { id: 't1', title: 'RFC Defense Infrastructure Node', status: 'in_progress', deadline: '2026-08-25' },
            { id: 't2', title: 'Smart Grid Proposal Drafting', status: 'review_pending', deadline: '2026-09-02' }
          ] })),
          getDocuments().catch(() => ({ data: [
            { id: 'd1', name: 'RFP_Technical_Specs_v2.pdf', created_at: '2026-08-01' },
            { id: 'd2', name: 'Compliance_Matrix_Template.docx', created_at: '2026-08-03' }
          ] }))
        ]);

        const myTenders = tendersRes.data ? tendersRes.data.filter(t => !user?.id || t.assigned_to === user.id) : [];
        setAssignedTenders(myTenders.length ? myTenders : (tendersRes.data || []));
        setDocuments((docsRes.data || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  return (
    <DashboardLayout>
      <PageHeader 
        title={`Welcome Back, ${user?.name || 'Team Member'}`} 
        subtitle="Review your assigned tender tasks, upcoming submission deadlines, and RAG document templates."
        action={
          <button 
            onClick={() => navigate('/employee/ai-assistant')}
            className="btn-modern-primary flex items-center gap-2 px-5 py-2.5 text-xs"
          >
            <Brain className="h-4 w-4 text-indigo-200" />
            <span>Open AI Assistant</span>
          </button>
        }
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold">Loading employee workspace...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-slate-900 dark:text-slate-200 font-sans">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned Tenders</span>
                <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{assignedTenders.length}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-300">
                <span>Active action items</span>
              </div>
            </div>

            <div className="glow-card rounded-3xl p-6 relative overflow-hidden flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <User className="h-6 w-6" />
              </div>
              <div className="truncate">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Session Node</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{user?.email || 'dev@company.com'}</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" /> Standard Access
                </span>
              </div>
            </div>

            <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Targets</span>
                <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {assignedTenders.filter(t => t.deadline).length}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-300">
                <span>Submission deadlines</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glow-card rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Assigned Bidding Actions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tenders currently assigned to your profile for drafting, compliance review, or data extraction.</p>
                </div>
              </div>

              {assignedTenders.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500 dark:text-emerald-400" />
                  <span>No active tenders currently assigned to you.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedTenders.map(t => (
                    <div key={t.id} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 transition">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</h4>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold font-mono text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 uppercase">
                          {t.status || 'Active'}
                        </span>
                        <button 
                          onClick={() => navigate('/employee/tenders')}
                          className="btn-modern-secondary px-4 py-2 text-xs flex items-center gap-1.5"
                        >
                          <span>Open Tasks</span>
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
                  <FolderLock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Document Vault
                </h3>

                {documents.length === 0 ? (
                  <span className="text-xs text-slate-500 dark:text-slate-400 block text-center py-6">No documents uploaded.</span>
                ) : (
                  <div className="space-y-3 text-xs">
                    {documents.map(d => (
                      <div key={d.id} className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex justify-between items-center">
                        <span className="truncate max-w-[150px] font-semibold text-slate-900 dark:text-white">{d.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{d.created_at ? new Date(d.created_at).toLocaleDateString() : 'Recent'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate('/employee/documents')}
                className="mt-6 btn-modern-secondary w-full py-3 text-xs flex items-center justify-center gap-1.5"
              >
                <span>View Full Vault</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployeeDashboard;

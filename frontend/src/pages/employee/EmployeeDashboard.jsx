import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { getTenders } from '../../services/tenderService';
import { getDocuments } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';
import { FileText, ClipboardList, FolderLock, User, Calendar } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [assignedTenders, setAssignedTenders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tendersRes, docsRes] = await Promise.all([
          getTenders().catch(() => ({ data: [] })),
          getDocuments().catch(() => ({ data: [] }))
        ]);

        // Filter tenders assigned to the currently logged in employee
        const myTenders = tendersRes.data.filter(t => t.assigned_to === user.id);
        setAssignedTenders(myTenders);
        setDocuments(docsRes.data.slice(0, 5)); // show top 5 recent documents
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user.id]);

  return (
    <DashboardLayout>
      <PageHeader 
        title={`Welcome Back, ${user?.name}`} 
        subtitle="Review your assigned tender tasks, deadlines, and upload documentation templates."
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          <span className="animate-pulse">Loading employee workspace...</span>
        </div>
      ) : (
        <div className="space-y-6 text-slate-200 font-sans">
          {/* Top Info row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* My Tenders card */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">My Assigned Tenders</span>
                <p className="text-3xl font-extrabold text-white mt-1">{assignedTenders.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText className="h-6 w-6" />
              </div>
            </div>

            {/* Profile Brief Card */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <User className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Profile Node</span>
                <p className="text-sm font-bold text-white mt-0.5">{user?.email}</p>
                <span className="text-[10px] text-slate-500">Standard Member Session</span>
              </div>
            </div>

            {/* Deadlines Card */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Upcoming Deadlines</span>
                <p className="text-sm font-bold text-white mt-1">
                  {assignedTenders.filter(t => t.deadline).length} Active Targets
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tenders assigned list */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-950 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-500" />
                Assigned Bidding Actions
              </h3>
              {assignedTenders.length === 0 ? (
                <div className="flex h-36 flex-col items-center justify-center text-slate-600 bg-slate-900/10 rounded-xl border border-slate-900 border-dashed">
                  <span className="text-xs">No active tenders assigned to you yet.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignedTenders.map(t => (
                    <div key={t.id} className="flex justify-between items-center border border-slate-900 bg-slate-900/30 p-4 rounded-xl text-xs hover:border-slate-800 transition">
                      <div>
                        <h4 className="font-bold text-sm text-white mb-1">{t.title}</h4>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{t.status}</span>
                      </div>
                      <span className="text-slate-500 font-medium">Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'None'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Document Vault Widget */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FolderLock className="h-5 w-5 text-indigo-500" />
                Recent Documents
              </h3>
              {documents.length === 0 ? (
                <span className="text-xs text-slate-650 block text-center py-6">No documents uploaded.</span>
              ) : (
                <div className="space-y-3 text-xs">
                  {documents.map(d => (
                    <div key={d.id} className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 flex justify-between items-center">
                      <span className="truncate max-w-[150px] font-medium text-white">{d.name}</span>
                      <span className="text-[10px] text-slate-500">{new Date(d.created_at).toLocaleDateString()}</span>
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

export default EmployeeDashboard;

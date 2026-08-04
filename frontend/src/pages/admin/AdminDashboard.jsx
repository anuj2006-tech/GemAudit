import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { getTenders } from '../../services/tenderService';
import { getUsers } from '../../services/organizationService';
import { getDocuments } from '../../services/documentService';
import { FileText, Users, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [docsCount, setDocsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tendersRes, usersRes, docsRes] = await Promise.all([
          getTenders().catch(() => ({ data: [] })),
          getUsers().catch(() => ({ data: [] })),
          getDocuments().catch(() => ({ data: [] }))
        ]);

        setTenders(tendersRes.data);
        setEmployeesCount(usersRes.data.length);
        setDocsCount(docsRes.data.length);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const pendingApprovals = tenders.filter(t => t.status === 'under_review');

  return (
    <DashboardLayout>
      <PageHeader 
        title="Admin Operations Console" 
        subtitle="Roster management, tender audits, document approvals, and review workflow nodes."
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          <span className="animate-pulse">Loading operational metrics...</span>
        </div>
      ) : (
        <div className="space-y-6 text-slate-200 font-sans">
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tenders Count */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tenders Board</span>
                <p className="text-3xl font-extrabold text-white mt-1">{tenders.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText className="h-6 w-6" />
              </div>
            </div>

            {/* Employees Count */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Staff Count</span>
                <p className="text-3xl font-extrabold text-white mt-1">{employeesCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* Documents Count */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Vault Files</span>
                <p className="text-3xl font-extrabold text-white mt-1">{docsCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Approvals Board */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-950 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Pending Approvals ({pendingApprovals.length})
              </h3>
              {pendingApprovals.length === 0 ? (
                <div className="flex h-36 flex-col items-center justify-center text-slate-650 bg-slate-900/10 rounded-xl border border-slate-900 border-dashed">
                  <span className="text-sm font-medium">No tenders awaiting approval.</span>
                  <span className="text-xs text-slate-500 mt-1">All active tenders are fully aligned.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.map(t => (
                    <div key={t.id} className="flex justify-between items-center border border-slate-900 bg-slate-900/30 p-4 rounded-xl text-xs hover:border-slate-800 transition">
                      <div>
                        <h4 className="font-bold text-sm text-white mb-1">{t.title}</h4>
                        <p className="text-slate-500">Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <Button size="sm" className="flex items-center gap-1.5">
                        Review Now
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Side summary panel */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Operations Summary</h3>
              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-500">Draft Tenders</span>
                  <span className="font-bold text-white">{tenders.filter(t => t.status === 'draft').length}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-500">Approved Tenders</span>
                  <span className="font-bold text-green-400">{tenders.filter(t => t.status === 'approved').length}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-500">Submitted Bids</span>
                  <span className="font-bold text-blue-400">{tenders.filter(t => t.status === 'submitted').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Bids Won</span>
                  <span className="font-bold text-emerald-400">{tenders.filter(t => t.status === 'won').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;

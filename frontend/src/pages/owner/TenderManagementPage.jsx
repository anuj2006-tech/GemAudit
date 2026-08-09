import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { getTenders, deleteTender } from '../../services/tenderService';
import { 
  Plus, Calendar, Building, MapPin, Tag, Trash2, 
  ChevronRight, RefreshCw, AlertCircle, FileText, CheckCircle2
} from 'lucide-react';

const TenderManagementPage = () => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTenders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getTenders();
      setTenders(res.data || []);
    } catch (err) {
      console.error('Failed to load tenders:', err);
      setError('Could not fetch active tenders. Showing local mock database.');
      // Local mock fallback
      setTenders([
        {
          id: 'mock-t-1',
          title: 'Highway CCTV Construction Project',
          reference_number: 'NHAI/2026/CCTV-123',
          issuing_authority: 'National Highways Authority of India (NHAI)',
          category: 'IT Infrastructure',
          location: 'New Delhi, India',
          submission_deadline: '2026-08-20T17:30:00.000Z',
          estimated_value: 150000000,
          status: 'READY',
          overall_score: 87
        },
        {
          id: 'mock-t-2',
          title: 'Smart City IT Infrastructure Integration',
          reference_number: 'MUM/MUNICIPAL/2026/887',
          issuing_authority: 'Mumbai Municipal Corporation',
          category: 'CCTV & Networking',
          location: 'Mumbai, India',
          submission_deadline: '2026-08-25T17:30:00.000Z',
          estimated_value: 120000000,
          status: 'ANALYZING',
          overall_score: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenders();
  }, []);

  const handleDeleteTender = async (e, id) => {
    e.stopPropagation(); // prevent navigation on card click
    if (!window.confirm('Are you sure you want to delete this tender and all its associated documents, requirements, and analysis?')) return;
    try {
      await deleteTender(id);
      loadTenders();
    } catch (err) {
      console.error('Delete tender failed:', err);
      alert('Failed to delete tender workspace.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'READY':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3" />
            Ready
          </span>
        );
      case 'ANALYZING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wider animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Analyzing
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 uppercase tracking-wider animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Processing
          </span>
        );
      case 'REVIEW_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-rose-500 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 uppercase tracking-wider">
            <AlertCircle className="h-3 w-3" />
            Review Needed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 bg-slate-500/10 px-2.5 py-1 rounded-full border border-slate-500/20 uppercase tracking-wider">
            Draft
          </span>
        );
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '--';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="📑 Tender Management" 
        subtitle="Workspace registry for live RFPs. Create tender workspaces, upload bid specifications, and evaluate candidate eligibility records against your Company Brain."
        action={
          <button 
            onClick={() => navigate('/tender-management/new')}
            className="btn-modern-primary flex items-center gap-2 px-5 py-2.5 text-xs font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Tender</span>
          </button>
        }
      />

      {error && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 text-xs font-semibold text-amber-300 flex items-center gap-3 mb-6">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold">Syncing tender workspaces...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 font-sans">
            {tenders.length === 0 ? (
            <div className="glow-card rounded-3xl p-12 text-center border border-slate-800 bg-slate-950/40">
              <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No active tender workspaces</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">
                Get started by creating a dedicated tender workspace to upload RFP details and analyze compliance checklists.
              </p>
              <button 
                onClick={() => navigate('/tender-management/new')}
                className="btn-modern-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Create Your First Tender</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header for Desktop Grid */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-extrabold uppercase font-mono tracking-widest text-slate-500 border-b border-slate-900/60 mb-2">
                <div className="col-span-5">Tender Description / Authority</div>
                <div className="col-span-2">Estimated Value</div>
                <div className="col-span-2">Deadline</div>
                <div className="col-span-2 text-center">Compliance Match</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Rows */}
              <div className="grid grid-cols-1 gap-3.5">
                {tenders.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => navigate(`/tenders/${t.id}`)}
                    className="glow-card rounded-2xl p-5 border border-slate-850 bg-slate-950/10 hover:bg-slate-950/30 hover:border-indigo-500/40 transition duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
                  >
                    {/* Tender Title/Authority */}
                    <div className="col-span-1 lg:col-span-5 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] font-extrabold uppercase font-mono tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          {t.reference_number || 'No Ref'}
                        </span>
                        {getStatusBadge(t.status)}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white hover:text-indigo-400 transition truncate pr-4">
                          {t.title}
                        </h3>
                        <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-1 font-sans">
                          <Building className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{t.issuing_authority || 'Unknown Authority'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="col-span-1 lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between lg:justify-center border-t lg:border-0 border-slate-850/50 pt-3 lg:pt-0">
                      <span className="lg:hidden text-[10px] text-slate-500 font-mono uppercase font-bold">Value</span>
                      <span className="text-xs font-bold font-mono text-white">{formatCurrency(t.estimated_value)}</span>
                    </div>

                    {/* Deadline */}
                    <div className="col-span-1 lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between lg:justify-center border-t lg:border-0 border-slate-850/50 pt-3 lg:pt-0">
                      <span className="lg:hidden text-[10px] text-slate-500 font-mono uppercase font-bold">Deadline</span>
                      <span className="text-xs font-bold font-mono text-orange-400 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        {t.submission_deadline ? new Date(t.submission_deadline).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="col-span-1 lg:col-span-2 flex lg:flex-col items-center justify-between lg:justify-center border-t lg:border-0 border-slate-850/50 pt-3 lg:pt-0">
                      <span className="lg:hidden text-[10px] text-slate-500 font-mono uppercase font-bold">Match Score</span>
                      {t.overall_score !== null && t.overall_score !== undefined ? (
                        <span className="text-sm font-black text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-2xl">
                          {t.overall_score}%
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-2xl">
                          --
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 lg:col-span-1 flex items-center justify-end border-t lg:border-0 border-slate-850/50 pt-3 lg:pt-0 gap-3">
                      <button 
                        onClick={(e) => handleDeleteTender(e, t.id)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                        title="Delete Workspace"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <ChevronRight className="h-4 w-4 text-slate-650 hidden lg:block" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </DashboardLayout>
  );
};

export default TenderManagementPage;

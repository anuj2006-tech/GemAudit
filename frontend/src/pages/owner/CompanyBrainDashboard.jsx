import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { getCompanyBrainHealth } from '../../services/companyBrainService';
import { 
  Building2, TrendingUp, Award, ScrollText, Users, 
  Brain, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, Sparkles
} from 'lucide-react';

const CATEGORIES_CONFIG = [
  {
    key: 'company_profile',
    title: 'Company Profile',
    description: 'Basic company information, locations, and core operational areas.',
    icon: Building2,
    colorClass: 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
  },
  {
    key: 'financial',
    title: 'Financial Capability',
    description: 'Turnover, net worth, and working capital details.',
    icon: TrendingUp,
    colorClass: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    key: 'experience',
    title: 'Past Project Experience',
    description: 'Previous project execution history, clients, values, and scopes.',
    icon: Award,
    colorClass: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    key: 'certification',
    title: 'Certifications & Licenses',
    description: 'Accreditations, ISO audits, MSME registrations, and expiry dates.',
    icon: ScrollText,
    colorClass: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'
  },
  {
    key: 'technical',
    title: 'Technical Capability',
    description: 'Manpower, engineering experience, equipment, and core infrastructure.',
    icon: Users,
    colorClass: 'text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20'
  }
];

const CompanyBrainDashboard = () => {
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHealthData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getCompanyBrainHealth();
      setHealthData(res.data);
    } catch (err) {
      console.error('Failed to load Company Brain health metrics:', err);
      setError('Could not connect to the Company Brain API. Showing offline sandbox mode.');
      // Load sandbox mock data in case of connection failure
      setHealthData({
        healthScore: 0,
        completedCategoriesCount: 0,
        totalCategories: 5,
        categories: {
          company_profile: { docCount: 0, factCount: 0, status: 'pending' },
          financial: { docCount: 0, factCount: 0, status: 'pending' },
          experience: { docCount: 0, factCount: 0, status: 'pending' },
          certification: { docCount: 0, factCount: 0, status: 'pending' },
          technical: { docCount: 0, factCount: 0, status: 'pending' }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
            <CheckCircle2 className="h-3 w-3" />
            Complete
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-rose-500 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase">
            <AlertCircle className="h-3 w-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20 uppercase">
            Pending Upload
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="🧠 Company Brain" 
        subtitle="Your company's centralized knowledge base. Upload capability records, financial audits, and project experience to compile tenant facts for automated tender matching."
        action={
          <button 
            onClick={loadHealthData}
            className="btn-modern-secondary flex items-center gap-2 px-4 py-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync Brain</span>
          </button>
        }
      />

      {error && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 text-xs font-semibold text-amber-300 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold">Syncing Company Brain health...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-8 font-sans">
          
          {/* Health Summary Card */}
          <div className="glow-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 bg-slate-950/40">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="h-6 w-6 text-orange-400 animate-pulse" />
                Company Brain Health
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your company profile is being analyzed and cataloged. Complete all 5 categories to reach 100% capacity. Once completed, the AI Copilot can cross-reference these capability facts instantly to verify open tender requirements.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Tenant Isolation Mode: Row-Level Security Active</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="relative flex items-center justify-center h-28 w-28">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    className="stroke-slate-200 dark:stroke-slate-800" 
                    strokeWidth="8" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    className="stroke-orange-500 transition-all duration-1000" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * (healthData?.healthScore || 0)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-white">{healthData?.healthScore}%</span>
                </div>
              </div>
              <span className="mt-3 text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {healthData?.completedCategoriesCount || 0} / 5 COMPLETE
              </span>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES_CONFIG.map(cat => {
              const metric = healthData?.categories?.[cat.key] || { docCount: 0, factCount: 0, status: 'pending' };
              const Icon = cat.icon;

              return (
                <div 
                  key={cat.key} 
                  className="glow-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border ${cat.colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {getStatusBadge(metric.status)}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{cat.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{cat.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-200 dark:border-slate-800/80 text-xs font-mono">
                      <div>
                        <span className="block text-[10px] uppercase text-slate-500 dark:text-slate-500">Documents</span>
                        <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                          {metric.docCount || 0} File{metric.docCount === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-slate-500 dark:text-slate-500">Extracted Facts</span>
                        <span className="font-bold text-orange-500 mt-0.5 block">
                          {metric.factCount || 0} Record{metric.factCount === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <button 
                      onClick={() => navigate(`/company-brain/${cat.key}`)}
                      className="btn-modern-secondary flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200"
                    >
                      <span>Manage Category</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default CompanyBrainDashboard;

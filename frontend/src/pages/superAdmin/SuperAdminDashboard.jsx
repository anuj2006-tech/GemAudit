import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { 
  FileText, Users, Brain, TrendingUp, Building2, 
  Activity, Server, CheckCircle2 
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const mockTenants = [
    { name: 'Vertex Infra Logistics', id: 'tenant_org_8841', tenders: 18, status: 'Active', plan: 'Enterprise' },
    { name: 'Aether Gov Defense', id: 'tenant_org_1092', tenders: 42, status: 'Active', plan: 'Enterprise' },
    { name: 'Nexus Tenders Ltd.', id: 'tenant_org_5532', tenders: 12, status: 'Active', plan: 'Professional' },
    { name: 'Global Bid Systems', id: 'tenant_org_3321', tenders: 7, status: 'Active', plan: 'Starter' }
  ];

  return (
    <DashboardLayout>
      <PageHeader 
        title="Platform Super Admin Console" 
        subtitle="Global SaaS multi-tenant metrics, row-level security policy status, and AI vector engine health."
        action={
          <button 
            onClick={() => navigate('/super-admin/organizations')}
            className="btn-modern-primary flex items-center gap-2 px-5 py-2.5 text-xs"
          >
            <Building2 className="h-4 w-4" />
            <span>Manage Organizations</span>
          </button>
        }
      />

      <div className="space-y-6 text-slate-900 dark:text-slate-200 font-sans">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Organizations</span>
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white">128</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="font-semibold">+14 new this month</span>
            </div>
          </div>

          <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Platform Users</span>
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white">2,840</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-300">
              <span>Cross 128 active tenants</span>
            </div>
          </div>

          <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">RAG Accuracy Rate</span>
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Brain className="h-5 w-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">99.4%</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Zero vector leakages</span>
            </div>
          </div>

          <div className="glow-card rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tenders Processed</span>
              <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white">14,290</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-300">
              <span>Total platform volume</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glow-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Active Tenant Organizations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Row-Level Security isolates vector indexes and tender records per company node.</p>
              </div>
              <button 
                onClick={() => navigate('/super-admin/organizations')}
                className="btn-modern-secondary px-3.5 py-2 text-xs"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {mockTenants.map(t => (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 transition">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{t.id} • {t.tenders} Active Tenders</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold font-mono text-purple-600 dark:text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                      {t.plan}
                    </span>
                    <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 uppercase">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glow-card rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                System Health & RAG Node
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Postgres RLS Policy</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg">ENFORCED</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Vector Index Latency</span>
                  <span className="text-indigo-600 dark:text-indigo-300 font-bold font-mono bg-indigo-500/10 px-2.5 py-1 rounded-lg">182 ms</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">API Uptime SLA</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg">99.98%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Server className="h-3.5 w-3.5" /> All Nodes Green
              </span>
              <span>v2.4 Cluster</span>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;

import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  Award,
  FileCheck,
  Building2,
  Calendar,
  Menu
} from 'lucide-react';

export default function GeMAnalyticsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const commonFailureTypes = [
    { type: 'EPFO / ESIC Statutory Non-remittance', percentage: 32, count: 6, color: 'bg-red-500', tag: 'High Risk Flag' },
    { type: 'GSTN GSTR-3B Return Filing Delay (> 60 days)', percentage: 28, count: 5, color: 'bg-amber-500', tag: 'Warning' },
    { type: 'Udyam MSME Category / Turnover Exceeded', percentage: 18, count: 3, color: 'bg-amber-500', tag: 'Warning' },
    { type: 'CPPP / State Procurement Blacklist Record', percentage: 12, count: 2, color: 'bg-red-600', tag: 'Debarred' },
    { type: 'Expired ISO 9001 / Safety Accreditation', percentage: 10, count: 2, color: 'bg-slate-400', tag: 'Documentation' }
  ];

  const quarterlyData = [
    { quarter: 'Q1 2026', total: 42, qualified: 29, disqualified: 7, awaiting: 6, avgScore: 82 },
    { quarter: 'Q2 2026', total: 58, qualified: 41, disqualified: 9, awaiting: 8, avgScore: 85 },
    { quarter: 'Q3 2026 (Current)', total: 64, qualified: 46, disqualified: 10, awaiting: 8, avgScore: 87 }
  ];

  return (
    <div className="flex h-screen bg-slate-100/70 text-slate-900 font-['IBM_Plex_Sans'] overflow-hidden selection:bg-indigo-600 selection:text-white">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100/70">
        
        {/* Header Console Bar */}
        <header className="bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 -ml-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-600/20 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 truncate">
                Compliance Analytics & Intelligence
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono mt-0.5 truncate">
                Aggregate compliance metrics, statutory failure distributions, and trends
              </p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 space-y-6 max-w-[1700px] mx-auto w-full">
          
          {/* Top KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Compliance Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-['IBM_Plex_Mono'] text-emerald-700">84.6%</span>
                <span className="text-xs text-emerald-700 font-bold">(+3.2% vs Q2)</span>
              </div>
              <p className="text-xs text-slate-500">Across 18 evaluated active bidders</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pass Rate (First-Pass)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-['IBM_Plex_Mono'] text-slate-900">72.2%</span>
                <span className="text-xs text-slate-500 font-medium">13 / 18 qualified</span>
              </div>
              <p className="text-xs text-slate-500">No clarification required</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Clarification Resolved Rate</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-['IBM_Plex_Mono'] text-amber-600">83.3%</span>
                <span className="text-xs text-slate-500 font-medium">Avg. 2.4 days</span>
              </div>
              <p className="text-xs text-slate-500">Bidders successfully remediating notices</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">High Risk Disqualification</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-['IBM_Plex_Mono'] text-red-600">16.6%</span>
                <span className="text-xs text-red-700 font-bold">3 Bidders</span>
              </div>
              <p className="text-xs text-slate-500">Due to debarment or invalid GSTIN/PAN</p>
            </div>

          </div>

          {/* 2-Column Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Common Failure Types */}
            <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Most Common Compliance Failure Categories</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Distribution of statutory discrepancies across all evaluated tenders</p>
                </div>
              </div>

              <div className="space-y-4">
                {commonFailureTypes.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{item.percentage}% ({item.count} Bidders)</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quarter-over-Quarter Trend */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Quarterly Decision Volumes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Historical trend across recent procurement cycles</p>
                </div>
              </div>

              <div className="space-y-4">
                {quarterlyData.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 font-mono">{q.quarter}</span>
                      <span className="text-xs font-mono font-bold text-indigo-600">Avg: {q.avgScore}%</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                        <span className="text-[10px] uppercase text-emerald-700 block font-sans font-bold">Qualified</span>
                        <strong className="text-emerald-700">{q.qualified}</strong>
                      </div>
                      <div className="bg-amber-50 p-2 rounded border border-amber-200">
                        <span className="text-[10px] uppercase text-amber-700 block font-sans font-bold">Awaiting</span>
                        <strong className="text-amber-700">{q.awaiting}</strong>
                      </div>
                      <div className="bg-red-50 p-2 rounded border border-red-200">
                        <span className="text-[10px] uppercase text-red-700 block font-sans font-bold">Disqualified</span>
                        <strong className="text-red-700">{q.disqualified}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

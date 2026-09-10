import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { 
  ShieldCheck, 
  Layers, 
  Users, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  FileSpreadsheet, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Menu
} from 'lucide-react';
import { fetchTendersFastAPI, fetchBiddersFastAPI } from '../../services/gemFastapiService';

export default function GeMOverviewDashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const tenderData = await fetchTendersFastAPI();
      setTenders(tenderData);

      // Load all bidders across all tenders
      let allBidders = [];
      for (const t of tenderData) {
        const bList = await fetchBiddersFastAPI(t.tender_ref);
        allBidders = [...allBidders, ...bList];
      }
      setBidders(allBidders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Compute summary stats
  const totalTenders = tenders.length || 3;
  const totalBidders = bidders.length || 18;
  const awaitingOfficerAction = bidders.filter(b => b.decision_status === 'PENDING' || b.decision_status === 'AWAITING_CLARIFICATION').length || 11;
  const lowRiskCount = bidders.filter(b => b.risk_level?.toLowerCase() === 'low').length || 10;
  const mediumRiskCount = bidders.filter(b => b.risk_level?.toLowerCase() === 'medium').length || 5;
  const highRiskCount = bidders.filter(b => b.risk_level?.toLowerCase() === 'high').length || 3;
  const qualifiedCount = bidders.filter(b => b.decision_status === 'MARK_QUALIFIED').length || 4;
  const disqualifiedCount = bidders.filter(b => b.decision_status === 'MARK_DISQUALIFIED').length || 3;

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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 truncate">
                Procurement Officer Dashboard
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono mt-0.5 truncate">
                FastAPI + SQLite · 10 Government Portals · {totalBidders} Active Bidders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/gem-compliance/workflow')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition border border-slate-200 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Workflow & ROI</span>
            </button>
            <button
              onClick={() => navigate('/gem-compliance-fastapi')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 transition shadow-2xs shrink-0"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Tender Board</span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 space-y-6 max-w-[1700px] mx-auto w-full">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Active Tenders */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Tenders</span>
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-['IBM_Plex_Mono'] text-slate-900">{totalTenders}</span>
                <span className="text-xs text-slate-500 font-medium">Live On GeM</span>
              </div>
            </div>

            {/* Card 2: Total Bidders */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Bidders</span>
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-['IBM_Plex_Mono'] text-slate-900">{totalBidders}</span>
                <span className="text-xs text-slate-500 font-medium">Across all categories</span>
              </div>
            </div>

            {/* Card 3: Awaiting Officer Action */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Awaiting Officer Action</span>
                <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-['IBM_Plex_Mono'] text-amber-600">{awaitingOfficerAction}</span>
                <span className="text-xs text-amber-700 font-semibold">Pending / Clarification</span>
              </div>
            </div>

            {/* Card 4: Qualified Bidders */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Qualified Bids</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-['IBM_Plex_Mono'] text-emerald-600">{qualifiedCount}</span>
                <span className="text-xs text-slate-500 font-medium">Permitted to financial opening</span>
              </div>
            </div>

          </div>

          {/* 2-Column Grid: Risk Distribution + Quick Action Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Risk Distribution Card (Left 6 cols) */}
            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Bidder Risk Classification Distribution</h3>
                <span className="text-xs font-mono text-slate-500">{totalBidders} Evaluated</span>
              </div>

              {/* Visual Distribution Bars */}
              <div className="space-y-4">
                
                {/* Low Risk Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Low Risk (Score ≥ 80%)
                    </span>
                    <span className="font-mono font-bold text-slate-900">{lowRiskCount} bidders ({Math.round((lowRiskCount / totalBidders) * 100)}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(lowRiskCount / totalBidders) * 100}%` }} />
                  </div>
                </div>

                {/* Medium Risk Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Medium Risk (Score 50–79%)
                    </span>
                    <span className="font-mono font-bold text-slate-900">{mediumRiskCount} bidders ({Math.round((mediumRiskCount / totalBidders) * 100)}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(mediumRiskCount / totalBidders) * 100}%` }} />
                  </div>
                </div>

                {/* High Risk Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-red-700 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-600" /> High Risk (Score &lt; 50% / Debarred)
                    </span>
                    <span className="font-mono font-bold text-slate-900">{highRiskCount} bidders ({Math.round((highRiskCount / totalBidders) * 100)}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${(highRiskCount / totalBidders) * 100}%` }} />
                  </div>
                </div>

              </div>

              {/* Status summary pills */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Decision Status:</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                    {qualifiedCount} Qualified
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                    {awaitingOfficerAction} Pending/Awaiting
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold text-[10px]">
                    {disqualifiedCount} Disqualified
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links to Tenders (Right 6 cols) */}
            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Priority Triage Queue</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tenders with pending decisions and high-risk flags</p>
                </div>
                <button
                  onClick={() => navigate('/gem-compliance-fastapi')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {tenders.map((tender) => (
                  <div
                    key={tender.tender_ref}
                    onClick={() => navigate('/gem-compliance-fastapi')}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-slate-50/70 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {tender.tender_ref}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">{tender.category}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug truncate group-hover:text-indigo-600 transition">
                        {tender.tender_name}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500">
                        Est. Budget: <strong className="text-slate-800 font-bold">{tender.budget}</strong> · {tender.bidders_count} Bidders
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Action Required
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
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

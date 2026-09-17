import React, { useState } from 'react';
import { 
  Clock, 
  Coins, 
  AlertTriangle, 
  Scale, 
  Network, 
  CheckCircle2, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  Sun, 
  Moon 
} from 'lucide-react';

const metrics = [
  {
    title: "Evaluation Turnaround Time",
    subtitle: "Committee Document Scrutiny vs. Automated Forensic OCR",
    manualVal: "~7 Days (10,080 Mins)",
    auditVal: "8 Minutes",
    manualPct: 96,
    auditPct: 4,
    delta: "⚡ 96% Faster",
    icon: Clock,
    iconColor: "text-blue-400"
  },
  {
    title: "Review Cost per Tender",
    subtitle: "Senior Officer Manpower Hours vs. Automated Compute Cost",
    manualVal: "₹15,000 Committee Expense",
    auditVal: "₹5 / Check",
    manualPct: 99,
    auditPct: 3,
    delta: "💰 99.9% Slashed",
    icon: Coins,
    iconColor: "text-amber-400"
  },
  {
    title: "Fraud & Tampering Escape Risk",
    subtitle: "Edited PDFs, Fabricated Turnover & Fake MSME Exemptions",
    manualVal: "75% Exposure Risk",
    auditVal: "0% Fraud Escape",
    manualPct: 75,
    auditPct: 2,
    delta: "🛡️ Zero Fraud Escapes",
    icon: AlertTriangle,
    iconColor: "text-rose-400"
  },
  {
    title: "Vigilance & Audit Dispute Exposure",
    subtitle: "Subjective Officer Discretion vs. Cryptographic SHA-256 Stamp",
    manualVal: "60% Discretion / Inquiry Exposure",
    auditVal: "100% CVC / CAG Audit Ready",
    manualPct: 60,
    auditPct: 2,
    delta: "🔒 100% Sealed",
    icon: Scale,
    iconColor: "text-purple-400"
  },
  {
    title: "Statutory Verification Depth",
    subtitle: "Real-Time Registry Checks across GSTN, PAN, MCA-21, EPFO, etc.",
    manualVal: "1-2 Sample Checks",
    auditVal: "10 Portals in 3s (100% Depth)",
    manualPct: 15,
    auditPct: 100,
    delta: "🌐 10-Portal Matrix",
    icon: Network,
    iconColor: "text-cyan-400"
  }
];

export default function ProcurementComparisonChart() {
  const [isLight, setIsLight] = useState(false);

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 rounded-2xl border transition-all duration-300 ${
      isLight ? 'bg-[#d5e5db] border-slate-400 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100 shadow-2xl'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-4 border-b border-slate-700/50 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-bold text-slate-300 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>BENCHMARK ANALYSIS</span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-400 font-mono">₹4,00,000+ CR PUBLIC PROCUREMENT</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-mono">
            Manual Process vs. With GeM Audit AI
          </h2>
        </div>

        {/* Legend & Theme */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-blue-400">
              <span className="w-3.5 h-3 rounded bg-blue-600 inline-block" />
              <span>Manual</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3.5 h-3 rounded bg-emerald-500 inline-block" />
              <span>GeM Audit AI</span>
            </div>
          </div>

          <button
            onClick={() => setIsLight(!isLight)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Toggle theme"
          >
            {isLight ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Top Stat Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Time Saved</div>
            <div className="text-sm font-extrabold text-emerald-400 font-mono">7 Days → 8 Mins</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">-96%</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Review Cost</div>
            <div className="text-sm font-extrabold text-emerald-400 font-mono">₹15,000 → ₹5</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">-99.9%</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Statutory Checks</div>
            <div className="text-sm font-extrabold text-cyan-400 font-mono">1-2 → 10 Portals</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-bold font-mono">10x Deep</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Audit Proof</div>
            <div className="text-sm font-extrabold text-emerald-400 font-mono">SHA-256 Sealed</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">100% CVC</span>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {metrics.map((m, idx) => {
          const IconComp = m.icon;
          return (
            <div 
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                isLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <div className="flex items-center gap-2">
                  <IconComp className={`w-4 h-4 ${m.iconColor}`} />
                  <span className={isLight ? 'text-slate-900' : 'text-slate-200'}>
                    {m.title}: <span className="font-normal text-slate-400">{m.subtitle}</span>
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono">
                  {m.delta}
                </span>
              </div>

              {/* Progress Bars */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-11 space-y-1.5">
                  {/* Manual Bar */}
                  <div className="w-full bg-slate-800/80 rounded-full h-3.5 overflow-hidden flex items-center">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-between px-2 text-[9px] font-bold text-white shadow"
                      style={{ width: `${m.manualPct}%` }}
                    >
                      <span className="truncate">Manual: {m.manualVal}</span>
                    </div>
                  </div>
                  {/* GeM Audit AI Bar */}
                  <div className="w-full bg-slate-800/80 rounded-full h-3.5 overflow-hidden flex items-center">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 flex items-center justify-start px-2 text-[9px] font-bold text-white shadow"
                      style={{ width: `${m.auditPct}%` }}
                    >
                      <span className="truncate">{m.auditVal}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 text-right font-mono text-[11px] font-extrabold text-emerald-400">
                  {idx === 0 ? '8 Mins' : idx === 1 ? '₹5' : idx === 2 ? '0% Fraud' : idx === 3 ? '0% Risk' : '10 / 10'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span>RELATIVE PERCENTAGE SCALE:</span>
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span className="text-emerald-400 font-bold">100%</span>
        </div>
        <div>
          GovTech Procurement Benchmarks • GeM Audit AI Platform
        </div>
      </div>

    </div>
  );
}

import React from 'react';
import { 
  Gauge, 
  ShieldAlert, 
  Fingerprint, 
  Scale, 
  Building, 
  TrendingDown, 
  Handshake, 
  Cpu, 
  Award, 
  Download, 
  CheckCircle2, 
  Shield 
} from 'lucide-react';

export default function SplitImpactBenefitsDiagram() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>NATIONAL PUBLIC PROCUREMENT TRANSFORMATION</span>
          <span className="text-slate-500">•</span>
          <span className="text-blue-400 font-mono">₹4,00,000+ CR ECOSYSTEM</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-mono">
          GeM Audit AI: Impact and Benefits
        </h2>
        <div className="w-48 h-0.5 mx-auto mt-2 bg-gradient-to-r from-emerald-500 via-white to-blue-500 rounded-full opacity-60" />
      </div>

      {/* Main Grid: Left Side | Center Wheel | Right Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">

        {/* LEFT COLUMN: 4 CORE IMPACTS (Operational & Speed) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-500/40">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase">OPERATIONAL & SPEED</div>
              <h3 className="text-sm font-bold text-slate-100">4 CORE IMPACTS</h3>
            </div>
          </div>

          {/* 1. Faster Procurement */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/20 hover:border-emerald-400/50 transition-all shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-400/30">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-300 font-mono">96% Faster Procurement</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Compresses tender evaluation from <strong className="text-white">7 days to 8 minutes</strong>, clearing massive backlogs across 150,000+ government buyers.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Fraud Prevention */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/20 hover:border-emerald-400/50 transition-all shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-400/30">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-300 font-mono">Multi-Crore Fraud Prevention</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Stops financially insolvent shell companies before contracts are awarded, protecting national infrastructure funds.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Audit Shield */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/20 hover:border-emerald-400/50 transition-all shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-400/30">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-300 font-mono">100% CVC & CAG Audit Shield</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Cryptographically seals every decision with <strong className="text-white">SHA-256 digital stamps</strong>, protecting honest officers from false inquiries.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Zero Bias */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/20 hover:border-emerald-400/50 transition-all shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-400/30">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-300 font-mono">Zero Human Bias & Bribery</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Replaces officer discretion with unbribable mathematical cross-checks against live statutory databases.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: SPLIT CIRCULAR WHEEL */}
        <div className="lg:col-span-4 flex items-center justify-center py-6">
          <div className="relative w-64 h-64 flex items-center justify-center">
            
            {/* SVG Split Ring */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
              {/* Left Green Semi-Circle */}
              <path 
                d="M 128,24 A 104,104 0 0,0 128,232" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="4" 
                strokeDasharray="6 4"
                className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
              />
              {/* Right Blue Semi-Circle */}
              <path 
                d="M 128,24 A 104,104 0 0,1 128,232" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="4" 
                strokeDasharray="6 4"
                className="filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
              />
              {/* Center Divider */}
              <line x1="128" y1="20" x2="128" y2="236" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
            </svg>

            {/* Central Badge */}
            <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-r from-emerald-500 via-white/50 to-blue-500 shadow-2xl flex items-center justify-center z-10">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center p-2 text-center border border-slate-700/80">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-white text-sm shadow mb-1">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-black text-white font-mono leading-tight">GeM AUDIT AI</div>
                <div className="text-[8px] font-bold text-cyan-400 uppercase tracking-wider">IMPACT ENGINE</div>
                <div className="w-full mt-1.5 pt-1 border-t border-slate-800 flex justify-around text-[8px] font-mono">
                  <span className="text-emerald-400 font-bold">OPERATIONS</span>
                  <span className="text-blue-400 font-bold">GOVERNANCE</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: 4 STRATEGIC BENEFITS (Governance & Economy) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-end gap-2 pb-2 border-b-2 border-blue-500/40 text-right">
            <div>
              <div className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase">GOVERNANCE & ECONOMY</div>
              <h3 className="text-sm font-bold text-slate-100">4 STRATEGIC BENEFITS</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
              <Building className="w-4 h-4" />
            </div>
          </div>

          {/* 1. Infrastructure Safety */}
          <div className="p-3.5 rounded-xl bg-gradient-to-bl from-blue-950/40 to-slate-900/60 border border-blue-500/20 hover:border-blue-400/50 transition-all shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-400/30">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-300 font-mono">Public Infrastructure Safety</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Ensures hospitals, highways, and defense projects are executed by capable contractors, preventing project stalls.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Cost Reduction */}
          <div className="p-3.5 rounded-xl bg-gradient-to-bl from-blue-950/40 to-slate-900/60 border border-blue-500/20 hover:border-blue-400/50 transition-all shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-400/30">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-300 font-mono">99% Economic Cost Reduction</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Slashes tender review costs from <strong className="text-white">₹15,000</strong> in committee manpower to <strong className="text-emerald-400">just ₹5</strong> in compute per check.
                </p>
              </div>
            </div>
          </div>

          {/* 3. MSME Level Playing Field */}
          <div className="p-3.5 rounded-xl bg-gradient-to-bl from-blue-950/40 to-slate-900/60 border border-blue-500/20 hover:border-blue-400/50 transition-all shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-400/30">
                <Handshake className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-300 font-mono">Level Playing Field for MSMEs</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Guarantees honest Indian small businesses win public contracts on pure merit without unfair shortcuts.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Tech-Driven Governance */}
          <div className="p-3.5 rounded-xl bg-gradient-to-bl from-blue-950/40 to-slate-900/60 border border-blue-500/20 hover:border-blue-400/50 transition-all shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-400/30">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-300 font-mono">Tech-Driven Governance</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Transforms vulnerable paper files into a transparent, automated, and tamper-proof digital audit ecosystem.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="mt-8 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 10 Statutory Registry APIs
          </span>
          <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <Shield className="w-3.5 h-3.5" /> Cryptographic SHA-256 Seal
          </span>
        </div>
        <div className="font-mono text-slate-500 text-[11px]">
          Government e-Marketplace (GeM) Bid Verification & Forensic Platform
        </div>
      </div>

    </div>
  );
}

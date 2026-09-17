import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  ShieldCheck, 
  Scale, 
  TrendingDown, 
  Building2, 
  Handshake, 
  Gears, 
  ClipboardCheck, 
  Award, 
  Play, 
  Pause, 
  Sun, 
  Moon, 
  Download 
} from 'lucide-react';

const nodeData = [
  {
    id: 1,
    title: "Faster Procurement",
    metric: "96% Faster Evaluation (7 Days → 8 Mins)",
    desc: "Automates multi-page document OCR & 10 statutory portal checks in under 3 seconds per tender.",
    icon: ShoppingCart,
    bgType: "peach",
    colorTag: "text-rose-400 bg-rose-500/10 border-rose-500/30"
  },
  {
    id: 2,
    title: "Fraud Prevention",
    metric: "Zero Fraudulent Bid Escapes",
    desc: "Catches photoshopped balance sheets, fake MSME exemptions, and 77%+ GST turnover inflation.",
    icon: ShieldCheck,
    bgType: "white",
    colorTag: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  },
  {
    id: 3,
    title: "Zero Bias",
    metric: "100% Objective Algorithmic Scoring",
    desc: "Eliminates subjective human discretionary bias, officer bribery risks, and tender rigging.",
    icon: Scale,
    bgType: "white",
    colorTag: "text-amber-400 bg-amber-500/10 border-amber-500/30"
  },
  {
    id: 4,
    title: "Cost Reduction",
    metric: "₹1,200 Cr Saved in Evaluation Costs",
    desc: "Slashes manual legal verification overhead and eliminates litigation delays across ministries.",
    icon: TrendingDown,
    bgType: "white",
    colorTag: "text-blue-400 bg-blue-500/10 border-blue-500/30"
  },
  {
    id: 5,
    title: "Tech-Driven Governance",
    metric: "100% Paperless Digital Ecosystem",
    desc: "Seamlessly converts physical paper files and legacy PDFs into a structured API data highway.",
    icon: Building2,
    bgType: "white",
    colorTag: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30"
  },
  {
    id: 6,
    title: "Level Playing Field",
    metric: "Guaranteed MSME Fair Competition",
    desc: "Validates genuine Udyam & StartUp India credentials so honest SMBs win contracts fairly.",
    icon: Handshake,
    bgType: "peach",
    colorTag: "text-pink-400 bg-pink-500/10 border-pink-500/30"
  },
  {
    id: 7,
    title: "Infrastructure Safety",
    metric: "0 Non-Performing Shell Companies",
    desc: "Filters out insolvent contractors before award, ensuring high-quality public project execution.",
    icon: Gears,
    bgType: "peach",
    colorTag: "text-orange-400 bg-orange-500/10 border-orange-500/30"
  },
  {
    id: 8,
    title: "Audit Shield",
    metric: "Tamper-Evident SHA-256 Proof",
    desc: "Locks every verification decision in a cryptographic ledger to protect honest officers from CVC inquiries.",
    icon: ClipboardCheck,
    bgType: "peach",
    colorTag: "text-purple-400 bg-purple-500/10 border-purple-500/30"
  }
];

export default function ProcurementImpactWheel() {
  const [activeNode, setActiveNode] = useState(null);
  const [isTouring, setIsTouring] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTouring) {
      interval = setInterval(() => {
        setTourIndex((prev) => {
          const next = (prev + 1) % nodeData.length;
          setActiveNode(nodeData[next]);
          return next;
        });
      }, 2500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTouring]);

  const currentDisplay = activeNode || null;

  return (
    <div className={`w-full p-6 transition-colors duration-400 rounded-2xl border ${
      isLightTheme ? 'bg-[#d5e5db] border-slate-400 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-mono">GeM Audit AI Impact Wheel</h3>
            <p className="text-xs text-slate-400">8 Strategic Pillars of Public Procurement Transformation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              if (!isTouring) {
                setActiveNode(nodeData[0]);
                setTourIndex(0);
              } else {
                setActiveNode(null);
              }
              setIsTouring(!isTouring);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-700 text-slate-200 shadow-sm"
          >
            {isTouring ? <Pause className="w-3.5 h-3.5 text-rose-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            {isTouring ? 'Pause Tour' : 'Auto Tour'}
          </button>

          <button 
            onClick={() => setIsLightTheme(!isLightTheme)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-700 text-slate-200 shadow-sm"
          >
            {isLightTheme ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            {isLightTheme ? 'Dark Mode' : 'Light Pastel'}
          </button>
        </div>
      </div>

      {/* Main Wheel Area */}
      <div className="relative w-full h-[520px] flex items-center justify-center">
        {/* SVG Ring */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 520">
          <circle 
            cx="400" cy="260" r="190" 
            stroke={isLightTheme ? "#0f172a" : "#38bdf8"} 
            strokeWidth="3" 
            strokeDasharray="8 6" 
            className="animate-[spin_60s_linear_infinite] origin-center opacity-80" 
          />
        </svg>

        {/* Center Hub */}
        <div className={`z-20 w-[240px] h-[240px] rounded-full flex flex-col items-center justify-center p-5 text-center border shadow-2xl transition-all duration-300 ${
          isLightTheme ? 'bg-white/95 border-slate-400 text-slate-900' : 'bg-slate-800/90 border-slate-700 text-slate-100 backdrop-blur-md'
        }`}>
          {currentDisplay ? (
            <div className="flex flex-col items-center animate-fadeIn">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg mb-2 ${currentDisplay.colorTag}`}>
                <currentDisplay.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">PILLAR 0{currentDisplay.id}</span>
              <h4 className="font-bold text-sm leading-snug mb-1">{currentDisplay.title}</h4>
              <p className="text-xs font-semibold text-cyan-400 mb-1">{currentDisplay.metric}</p>
              <p className="text-[11px] text-slate-400 leading-tight px-1">{currentDisplay.desc}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-black text-sm tracking-tight mb-1">GeM AUDIT AI</h4>
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">8 Core Pillars</p>
              <p className="text-[11px] text-slate-400 leading-tight">Hover or tap any pillar around the wheel to inspect impact metrics.</p>
            </div>
          )}
        </div>

        {/* 8 Outer Nodes */}
        {nodeData.map((node, index) => {
          const IconComp = node.icon;
          const isSelected = currentDisplay?.id === node.id;
          
          return (
            <div 
              key={node.id}
              onClick={() => setActiveNode(node)}
              onMouseEnter={() => !isTouring && setActiveNode(node)}
              onMouseLeave={() => !isTouring && setActiveNode(null)}
              className="absolute z-30 flex items-center gap-2 cursor-pointer group"
              style={{
                left: index === 0 ? '14%' : index === 1 ? '70%' : index === 2 ? '78%' : index === 3 ? '70%' : index === 4 ? '68%' : index === 5 ? '16%' : index === 6 ? '10%' : '11%',
                top: index === 0 ? '12%' : index === 1 ? '12%' : index === 2 ? '44%' : index === 3 ? '76%' : index === 4 ? '88%' : index === 5 ? '88%' : index === 6 ? '64%' : '38%'
              }}
            >
              {(index === 0 || index === 5 || index === 6 || index === 7) && (
                <div className="text-right max-w-[160px]">
                  <div className={`font-bold text-xs group-hover:text-cyan-400 transition-colors ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>{node.title}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{node.desc}</div>
                </div>
              )}

              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 shadow-lg transition-transform duration-300 ${
                isSelected ? 'scale-125 border-cyan-400 ring-4 ring-cyan-400/30' : ''
              } ${
                node.bgType === 'peach' ? 'bg-[#e4b8a7] text-slate-900 border-slate-900' : 'bg-white text-slate-900 border-slate-900'
              }`}>
                <IconComp className="w-5 h-5" />
              </div>

              {(index === 1 || index === 2 || index === 3 || index === 4) && (
                <div className="text-left max-w-[160px]">
                  <div className={`font-bold text-xs group-hover:text-cyan-400 transition-colors ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>{node.title}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{node.desc}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

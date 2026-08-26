import React, { useState } from 'react';
import { FileText, X, Download, Sparkles, CheckCircle } from 'lucide-react';

export function BidDocumentGeneratorModal({ isOpen, onClose, tender }) {
  const [generating, setGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = (docType) => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedDoc({
        title: `${docType} - ${tender?.title || 'Tender Proposal'}`,
        content: `OFFICIAL COMPLIANCE DECLARATION & BID PROPOSAL\n\nRef Tender: ${tender?.id || 'GEM/2026/B/894120'}\nDate: ${new Date().toLocaleDateString()}\n\nWe hereby confirm compliance with all technical, statutory, and local content parameters outlined in the tender notice.`,
        generatedAt: new Date().toISOString()
      });
      setGenerating(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" /> AI Bid Document Generator
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Generate customized statutory certificates and bid compliance letters:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleGenerate('Make in India Declaration')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-500 transition"
            >
              <span className="text-xs font-bold block text-slate-900 dark:text-white">MII Declaration</span>
              <span className="text-[10px] text-slate-500">Local Content Undertaking</span>
            </button>

            <button
              onClick={() => handleGenerate('MSME EMD Exemption Letter')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-500 transition"
            >
              <span className="text-xs font-bold block text-slate-900 dark:text-white">EMD Exemption</span>
              <span className="text-[10px] text-slate-500">Udyam Registration Claim</span>
            </button>
          </div>

          {generating && (
            <div className="p-4 text-center text-xs font-bold text-indigo-600 animate-pulse flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Generating document with AI...
            </div>
          )}

          {generatedDoc && (
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Document Ready
                </span>
                <button
                  onClick={() => alert('Downloading generated document...')}
                  className="bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
              <pre className="text-[10px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                {generatedDoc.content}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

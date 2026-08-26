import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare } from 'lucide-react';

export default function TenderAnalystChatbot({ tender, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your AI Tender & Bid Analyst. Ask me anything about compliance requirements, EMD exemptions, MSME eligibility, or local content criteria for ${tender?.title || 'this tender'}.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let aiText = "Based on current GeM & GFR 2017 procurement guidelines, bidders with valid MSME (Udyam) or Startup India (DPIIT) registration are eligible for EMD exemption under Rule 170/173.";
      if (input.toLowerCase().includes('local content') || input.toLowerCase().includes('mii')) {
        aiText = "Under the Make in India Policy, Class-I Local Suppliers (≥50% local content) receive purchase preference over Class-II and Non-Local suppliers.";
      } else if (input.toLowerCase().includes('turnover') || input.toLowerCase().includes('experience')) {
        aiText = "Startups recognized by DPIIT get relaxation in prior turnover and experience criteria, subject to meeting quality and technical specifications.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden font-sans">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider">AI Tender Analyst Chatbot</h3>
            <span className="text-[10px] text-indigo-200 block">Intelligent Procurement Assistant</span>
          </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 h-80 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-medium ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-[11px] text-slate-400 font-medium animate-pulse flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AI Analyst is thinking...
          </div>
        )}
      </div>

      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask a compliance or tender question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

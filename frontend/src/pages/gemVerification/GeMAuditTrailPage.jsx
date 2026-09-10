import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { 
  History, 
  Search, 
  Filter, 
  RefreshCw, 
  ShieldCheck, 
  Lock, 
  Clock, 
  FileText,
  UserCheck,
  Menu
} from 'lucide-react';
import { fetchAuditLogsFastAPI } from '../../services/gemFastapiService';

export default function GeMAuditTrailPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchAuditLogsFastAPI();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.performed_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details_json?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action?.toUpperCase().includes(actionFilter);
    return matchesSearch && matchesAction;
  });

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
              <History className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 truncate">
                Statutory Compliance Audit Trail
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono mt-0.5 truncate">
                Immutable log of verifications, officer decisions, and notices
              </p>
            </div>
          </div>

          <button
            onClick={loadAuditLogs}
            disabled={loading}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-2xs shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Trail</span>
          </button>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 space-y-6 max-w-[1700px] mx-auto w-full">
          
          {/* Filter Bar & Search */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit actions, officer names, details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-['IBM_Plex_Mono'] placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Action Filter:</span>
              <div className="flex items-center border border-slate-300 bg-slate-100 p-0.5 rounded-lg text-xs">
                {['ALL', 'VERIFY', 'DECISION', 'NOTICE'].map(act => (
                  <button
                    key={act}
                    onClick={() => setActionFilter(act)}
                    className={`px-3 py-1 text-[11px] font-semibold transition rounded-md ${
                      actionFilter === act 
                        ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Audit Trail Log Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700 border-collapse">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Action Executed</th>
                    <th className="p-3.5">Performed By</th>
                    <th className="p-3.5">Audit Payload & Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 text-xs">
                        No audit events match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5 font-['IBM_Plex_Mono'] text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-mono">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-900 whitespace-nowrap">
                          {log.performed_by}
                        </td>
                        <td className="p-3.5 font-['IBM_Plex_Mono'] text-[11px] text-slate-600 max-w-xl truncate">
                          {log.details_json}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

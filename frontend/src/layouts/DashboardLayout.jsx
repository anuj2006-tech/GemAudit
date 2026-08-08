import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Breadcrumb from '../components/common/Breadcrumb';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen font-sans selection:bg-orange-400 selection:text-white relative overflow-x-hidden transition-colors duration-300 ${
      darkMode ? 'dark bg-[#100e0c] text-slate-100' : 'dashboard-light bg-slate-50 text-slate-900'
    }`}>
      {darkMode && (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none animate-ambient-1" />
          <div className="fixed top-1/3 right-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none animate-ambient-2" />
          <div className="fixed inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
        </>
      )}

      <div className="flex relative z-10">
        <Sidebar />
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

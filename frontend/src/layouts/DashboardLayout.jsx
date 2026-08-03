import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Breadcrumb from '../components/common/Breadcrumb';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex">
        <Sidebar />
        {sidebarOpen && <div className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <div className="flex-1">
          <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
          <main className="p-4 lg:p-6">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

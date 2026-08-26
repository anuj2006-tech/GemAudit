import React from 'react';
import Sidebar from '../../components/layout/Sidebar';

export default function BidDocumentSuitePage() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-xl font-bold">Bid Document Suite</h1>
        <p className="text-sm text-slate-500 mt-2">Generate and manage bid compliance documentation.</p>
      </main>
    </div>
  );
}

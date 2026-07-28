const StatusBadge = ({ status }) => {
  const styles = {
    'Pending Review': 'bg-warning/10 text-warning',
    Approved: 'bg-success/10 text-success',
    Rejected: 'bg-danger/10 text-danger',
    Active: 'bg-success/10 text-success',
    Pending: 'bg-warning/10 text-warning',
    Verified: 'bg-success/10 text-success',
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
};

export default StatusBadge;

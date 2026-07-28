export const superAdminStats = [
  { title: 'Total Tenders', value: '184', change: '+12.4%', icon: '📄' },
  { title: 'Pending Review', value: '27', change: '+4', icon: '⏳' },
  { title: 'Approved', value: '112', change: '+8.2%', icon: '✅' },
  { title: 'Rejected', value: '9', change: '-1.1%', icon: '❌' },
  { title: 'Active Users', value: '43', change: '+6', icon: '👥' },
  { title: 'AI Processed', value: '156', change: '+18%', icon: '🤖' },
];

export const legalAdminStats = [
  { title: 'Assigned Tenders', value: '18', change: '+2', icon: '📋' },
  { title: 'Pending Reviews', value: '7', change: '+1', icon: '📝' },
  { title: 'Completed Reviews', value: '11', change: '+3', icon: '✔️' },
  { title: 'AI Recommendations', value: '24', change: '+5', icon: '💡' },
  { title: 'Flagged Documents', value: '3', change: '-1', icon: '🚩' },
];

export const tenders = [
  { id: 1, title: 'Cloud Infrastructure Modernization', organization: 'Northwind', status: 'Pending Review', priority: 'High', dueDate: '2026-08-03', aiScore: 89 },
  { id: 2, title: 'Public Safety Analytics Platform', organization: 'BluePeak', status: 'Approved', priority: 'Medium', dueDate: '2026-08-05', aiScore: 94 },
  { id: 3, title: 'Digital Procurement Portal', organization: 'Aster Labs', status: 'Rejected', priority: 'Low', dueDate: '2026-08-10', aiScore: 72 },
];

export const users = [
  { id: 1, name: 'Ava Chen', email: 'ava@tender.ai', role: 'Super Admin', status: 'Active' },
  { id: 2, name: 'Noah Patel', email: 'noah@tender.ai', role: 'Legal Admin', status: 'Active' },
  { id: 3, name: 'Mina Alvarez', email: 'mina@tender.ai', role: 'Legal Admin', status: 'Pending' },
];

export const organizations = [
  { id: 1, name: 'Northwind', sector: 'Government', status: 'Verified' },
  { id: 2, name: 'BluePeak', sector: 'Healthcare', status: 'Pending' },
  { id: 3, name: 'Aster Labs', sector: 'Education', status: 'Verified' },
];

export const reports = [
  { id: 1, title: 'Quarterly Compliance Report', type: 'PDF', owner: 'Ava Chen', date: '2026-07-20' },
  { id: 2, title: 'AI Accuracy Summary', type: 'Excel', owner: 'Noah Patel', date: '2026-07-24' },
];

export const notifications = [
  { id: 1, title: 'New review request', detail: 'Tender #1024 needs legal review', time: '10 min ago' },
  { id: 2, title: 'AI analysis ready', detail: 'Tender #1042 completed with 92% confidence', time: '1 hr ago' },
];

export const aiInsights = [
  { id: 1, title: 'Risk flag', summary: 'Clause mismatch detected in section 7', score: '92%' },
  { id: 2, title: 'Opportunity', summary: 'High similarity with previous successful bid', score: '88%' },
];

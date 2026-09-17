import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-6xl font-semibold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">The page you’re looking for doesn’t exist or has moved.</p>
        <Link to="/gem-compliance-dashboard" className="mt-6 inline-block">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

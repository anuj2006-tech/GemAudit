import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const crumbs = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      <Link to="/" className="hover:text-primary">Home</Link>
      {crumbs.map((crumb, index) => {
        const href = '/' + crumbs.slice(0, index + 1).join('/');
        const label = crumb.replace(/-/g, ' ');
        return (
          <span key={href} className="flex items-center gap-2">
            <span>/</span>
            <Link to={href} className="capitalize hover:text-primary">
              {label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;

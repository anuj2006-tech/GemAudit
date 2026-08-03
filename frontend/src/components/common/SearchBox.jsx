import { Search } from 'lucide-react';

const SearchBox = () => (
  <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
    <Search size={16} />
    <input placeholder="Search" className="w-full bg-transparent outline-none" />
  </label>
);

export default SearchBox;

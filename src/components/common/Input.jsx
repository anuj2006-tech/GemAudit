const Input = ({ label, ...props }) => (
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
    {label && <span className="mb-1 block">{label}</span>}
    <input
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-primary dark:border-slate-700 dark:bg-slate-800"
      {...props}
    />
  </label>
);

export default Input;

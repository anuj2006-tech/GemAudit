/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#1E40AF',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        background: '#F8FAFC',
        card: '#FFFFFF',
      },
    },
  },
  plugins: [],
};

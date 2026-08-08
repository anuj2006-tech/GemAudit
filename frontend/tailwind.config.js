/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Claude brand orange (#DA7756) scale — overrides Tailwind's default
        // 'orange' so every existing orange-* utility class renders on-brand.
        orange: {
          50: '#fcf5f2',
          100: '#f9e7e2',
          200: '#f2d0c4',
          300: '#eab29f',
          400: '#e29379',
          500: '#da7756', // exact Claude brand hex
          600: '#cb542d',
          700: '#a64524',
          800: '#7c331b',
          900: '#562413',
          950: '#35160c',
        },
        // Tailwind's default 'slate' is a cool blue-gray, which is what was
        // giving the app its blue cast. Override it with a warm/neutral gray
        // (Tailwind 'stone' scale) so every existing bg/text/border-slate-*
        // class renders neutral instead of blue-tinted.
        slate: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#100e0c',
        },
        primary: '#DA7756',
        secondary: '#000000',
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

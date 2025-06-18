/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Aktiverar dark mode via en klass
  theme: {
    extend: {
      colors: {
        // Standardfärger (ljust läge)
        primary: '#1E293B',    // Mörk marinblå
        secondary: '#475569',  // Blågrå
        accent: '#4B5563',     // Mellangrå
        background: '#F3F4F6', // Ljusgrå bakgrund
        surface: '#FFFFFF',    // Vit för ytor
        muted: '#94A3B8',      // Ljusblågrå
        highlight: '#3B82F6',  // Klar blå
        error: '#EF4444',      // Röd
        success: '#10B981',    // Grön
        warning: '#F59E0B',    // Orange
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const colors = theme('colors');

      addUtilities({
        '.dark .bg-background': { backgroundColor: colors.primary },
        '.dark .text-primary': { color: colors.surface },
        '.dark .bg-surface': { backgroundColor: colors.secondary },
        '.dark .text-accent': { color: colors.accent },
        '.dark .hover\\:bg-accent:hover': { backgroundColor: colors.highlight },
        '.dark .border-muted': { borderColor: colors.muted },
        '.dark .shadow-light': { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' },
      });
    },
  ],
};

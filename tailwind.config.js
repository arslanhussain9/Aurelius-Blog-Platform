/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        auralis: {
          bg: "#0B0E14",
          card: "#111622",
          cardHover: "#161D2D",
          border: "#1E2738",
          borderGlow: "#3B82F6",
          accent: "#6366F1",
          accentCyan: "#06B6D4",
          accentPink: "#EC4899",
          textMuted: "#94A3B8",
          textLight: "#F1F5F9",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
};

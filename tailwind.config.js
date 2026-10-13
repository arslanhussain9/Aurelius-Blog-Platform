/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f9f9f9",
        "surface-container": "#eeeeee",
        "surface-container-low": "#f3f3f3",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#444748",
        outline: "#747878",
        "outline-variant": "#e2e2e2",
        primary: "#000000",
        "on-primary": "#ffffff",
        secondary: "#5e5e5e",
        tertiary: "#000000",
        "tertiary-container": "#07006c",
        "auralis-bg": "#f9f9f9",
        "auralis-card": "#ffffff",
        "auralis-cardHover": "#f5f5f5",
        "auralis-border": "#e2e2e2",
        "auralis-textMuted": "#5e5e5e",
        "auralis-textLight": "#1a1c1c",
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'stitch': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'stitch-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
};

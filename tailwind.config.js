/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#030305',
        obsidian: '#08080c',
        surface: '#0d0e14',
        cobalt: '#3b82f6',
        electric: '#60a5fa',
        violet: '#8b5cf6',
        silver: '#d4d4d8',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        signature: ['"Alex Brush"', '"Great Vibes"', '"Cormorant Garamond"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};

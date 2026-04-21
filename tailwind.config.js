/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
        },
        dark: {
          DEFAULT: '#0F172A',
          card: '#1E293B',
        },
        light: {
          bg: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
}

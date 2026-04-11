/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          light: '#a52a2a',
          DEFAULT: '#800000',
          dark: '#5a0000',
        },
        black: {
          light: '#1a1a1a',
          DEFAULT: '#000000',
          dark: '#050505',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(128, 0, 0, 0.5), 0 0 20px rgba(128, 0, 0, 0.3)',
        'neon-hover': '0 0 15px rgba(128, 0, 0, 0.8), 0 0 30px rgba(128, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

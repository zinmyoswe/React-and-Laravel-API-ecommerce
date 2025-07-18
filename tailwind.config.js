/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        adihaus: ['"AdihausDIN"', 'sans-serif'],
        adineue: ['"AdineuePRO"', 'sans-serif'],
        adidasfg: ['"adidasFG"', 'sans-serif'],
        denton: ['"Denton"', 'sans-serif'],
        nike: ['"Helvetica Now Text Medium"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-scrollbar'),
  ],
}


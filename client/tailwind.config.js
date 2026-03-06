/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#75e9e1',
          400: '#81e4f8',
          500: '#63f1ef',
          600: '#3bdee6',
          700: '#36c3d6',
          800: '#40b8dc',
          900: '#312e81',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
    },
  },
  plugins: [],
};

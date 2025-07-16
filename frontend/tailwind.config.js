/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'from-yellow-400',
    'via-orange-500',
    'to-red-500',
    'from-gray-400',
    'via-gray-500',
    'to-gray-600',
    'from-blue-600',
    'via-blue-700',
    'to-blue-800',
    'from-purple-600',
    'via-purple-700',
    'to-purple-800',
    'from-blue-200',
    'via-blue-300',
    'to-blue-400',
    'from-gray-300',
    'via-gray-400',
    'to-gray-500',
    'from-blue-400',
    'via-blue-500',
    'to-blue-600',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

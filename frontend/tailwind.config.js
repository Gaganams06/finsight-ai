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
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        obsidian: {
          700: '#23232c',
          750: '#1d1d24',
          800: '#16161d',
          850: '#121218',
          900: '#0e0e13',
          950: '#08080b',
        },
        gold: {
          50: '#fffdf5',
          100: '#fef9e2',
          200: '#fef0b8',
          300: '#fde182',
          400: '#f9cb46',
          500: '#d4af37', // Classic metallic gold
          600: '#b89224',
          700: '#946f19',
          800: '#7a5a18',
          900: '#674a18',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

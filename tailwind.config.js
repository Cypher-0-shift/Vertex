/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B2D72',
          dark: '#04152F',
          light: '#071B44'
        },
        cyan: {
          DEFAULT: '#0AC4E0',
          dark: '#0992C2'
        },
        accent: {
          cyan: '#0AC4E0',
          blue: '#0992C2',
          green: '#34d399',
          red: '#fca5a5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      transitionDuration: {
        '250': '250ms'
      }
    },
  },
  plugins: [],
}

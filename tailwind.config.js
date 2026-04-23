/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cipherra-primary': '#00ffaa',
        'cipherra-secondary': '#0126A0',
        'cipherra-blue': '#0126A0',
        'cipherra-blue-dark': '#011a7a',
        'cipherra-blue-light': '#e6edff',
        'cipherra-blue-lighter': '#f0f4ff',
        'instaml-green': '#00e676',
        'instaml-green-light': '#69f0ae',
        'instaml-green-dark': '#00b248',
        'instaml-green-dim': 'rgba(0,230,118,0.15)',
        'instaml-bg': '#050b07',
        'instaml-card': '#0d1a12',
        'instaml-card-light': '#112218',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


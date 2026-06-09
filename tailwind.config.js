/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#fcfcfc',
        foreground: '#171717',
        primary: '#e78821', // Custom warm orange/yellow accent
        secondary: '#666666',
        border: '#eaeaea',
        brandTeal: '#e78821', // Map brandTeal to the new accent color
        brandYellow: '#FFDC00',
        brandRed: '#FF4D6D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

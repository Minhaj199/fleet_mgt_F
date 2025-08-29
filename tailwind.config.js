
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(214, 32%, 91%)',
        input: 'hsl(214, 32%, 91%)',
        ring: 'hsl(221, 83%, 53%)',
        background: 'white',
        foreground: 'hsl(222, 47%, 11%)',
        primary: { DEFAULT: 'hsl(221, 83%, 53%)', foreground: 'white' },
        secondary: { DEFAULT: 'hsl(210, 40%, 96%)', foreground: 'hsl(222, 47%, 11%)' },
      },
      borderRadius: { lg: '12px', md: '10px', sm: '8px' }
    },
  },
  plugins: [],
}

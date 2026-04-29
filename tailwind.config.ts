import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FDF6EE',
          100: '#FAE9D0',
          200: '#F5CE96',
          400: '#E8A24A',
          500: '#C97D1A',
          600: '#A46214',
          700: '#7D4A0E',
          800: '#573309',
          900: '#331E05',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

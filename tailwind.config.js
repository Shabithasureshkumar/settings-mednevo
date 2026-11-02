/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          // Mednevo brand theme — Linear gradient #5C24FF (0%) → #A67EF9 (100%)
          50: '#F3EEFF',
          100: '#E8DEFF',
          200: '#D4C3FF',
          300: '#BDA0FC',
          400: '#A67EF9', // gradient end
          500: '#5C24FF', // gradient start / primary
          600: '#4A14E8', // hover / pressed
          700: '#5C24FF',
          deep: '#5C24FF',
          ink: '#5C24FF',
        },
        navy: '#0F1B33',
        danger: '#B91C1C',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #5C24FF 0%, #A67EF9 100%)',
        'brand-gradient-v': 'linear-gradient(180deg, #5C24FF 0%, #A67EF9 100%)',
        'brand-gradient-diag': 'linear-gradient(135deg, #5C24FF 0%, #A67EF9 100%)',
      },
      boxShadow: {
        card: '0 4px 20px rgba(17, 12, 46, 0.05)',
        soft: '0 10px 30px rgba(92, 36, 255, 0.25)',
        btn: '0 8px 20px rgba(92, 36, 255, 0.35)',
        brand: '0 8px 18px rgba(92, 36, 255, 0.3)',
      },
    },
  },
  plugins: [],
}

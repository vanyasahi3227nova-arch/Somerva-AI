/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFCF8',
          100: '#FAF8F2',
          200: '#F5F1E8',
          300: '#EDE7D9',
          400: '#E0D8C8',
        },
        sage: {
          100: '#E8EDE8',
          200: '#C8D8C4',
          300: '#A8C4A0',
          400: '#88A880',
          500: '#6B8F62',
          600: '#527048',
        },
        teal: {
          100: '#E0EEEC',
          200: '#B8D8D4',
          300: '#8ABFB8',
          400: '#5CA09A',
          500: '#3D8078',
          600: '#2C6660',
        },
        warm: {
          100: '#F5EDE0',
          200: '#EAD8BC',
          300: '#D9BE94',
          400: '#C4A06C',
          500: '#A8834A',
        },
        stone: {
          750: '#44403C',
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'soft-lg': '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        'soft-xl': '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
        'inner-soft': 'inset 0 1px 4px rgba(0,0,0,0.06)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-18px) rotate(3deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-2deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

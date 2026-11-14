/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#F8F7F2', // Primary background
          200: '#EDEBE1',
          300: '#E2DFD0',
          400: '#C7C2AC',
        },
        charcoal: {
          900: '#141517',
          800: '#202124', // Primary text
          700: '#3C4043',
          600: '#5F6368',
          500: '#80868B',
          400: '#9AA0A6',
          300: '#BDC1C6',
          200: '#E8EAED',
          100: '#F1F3F4',
        },
        coral: {
          50: '#FFF5F2',
          100: '#FFE6E0',
          200: '#FFCCC2',
          400: '#FF8F75',
          500: '#FF7657', // Accent
          600: '#E85B3A',
          700: '#C94425',
        },
        lavender: {
          50: '#F6F4FC',
          100: '#ECE7F9',
          200: '#DDD5F4',
          300: '#C8BAEE',
          400: '#B8A8E8', // Secondary accent
          500: '#9C84DF',
          600: '#7F64CC',
        },
        sage: {
          50: '#F2F8F4',
          100: '#DDEFE3',
          500: '#38A169', // Success
          600: '#2E7D32',
          700: '#225E25',
        },
        crimson: {
          50: '#FDF2F2',
          100: '#FDE2E2',
          500: '#E53E3E', // Error
          600: '#C53030',
          700: '#9B1C1C',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -1px rgba(32, 33, 36, 0.04), 0 1px 3px -1px rgba(32, 33, 36, 0.03)',
        'soft': '0 4px 20px -2px rgba(32, 33, 36, 0.06), 0 2px 6px -2px rgba(32, 33, 36, 0.04)',
        'soft-lg': '0 12px 32px -4px rgba(32, 33, 36, 0.08), 0 4px 12px -2px rgba(32, 33, 36, 0.05)',
        'coral-glow': '0 4px 16px -2px rgba(255, 118, 87, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}

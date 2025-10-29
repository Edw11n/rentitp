/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#818CF8',   // para gradientes
          DEFAULT: '#4F46E5', // color principal
          dark: '#4338CA',
        },
        secondary: {
          light: '#60A5FA',
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        gray: {
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#a0a0a0',
          600: '#64748B',
          700: '#4a5568',
          800: '#2d3748',
          900: '#2c3e50',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.05)',
        cardHover: '0 8px 15px rgba(0, 0, 0, 0.1)',
        buttonHover: '0 8px 15px rgba(79, 70, 229, 0.2)',
        inputFocus: '0 0 0 3px rgba(129, 140, 248, 0.2)',
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        full: '9999px',
      },
      spacing: {
        '4rem': '4rem',
        '3rem': '3rem',
      },
      backdropBlur: {
        xs: '5px',
        sm: '10px',
      },
      maxWidth: {
        container: '1200px',
      },
      screens: {
        lg: '1024px',
        md: '768px',
      },
    },
  },
  plugins: [],
}

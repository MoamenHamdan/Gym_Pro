import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep charcoal base
        charcoal: {
          DEFAULT: '#0D0D0D',
          50: '#1a1a1a',
          100: '#262626',
          200: '#333333',
          300: '#404040',
          400: '#4d4d4d',
        },
        // Neon accent colors
        neon: {
          purple: '#8D42FB',
          pink: '#FF3366',
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
        // Gradient combinations
        gradient: {
          purple: '#8D42FB',
          pink: '#FF3366',
          blue: '#3B82F6',
          slate: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF UI Display', 'Poppins', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'tilt': 'tilt 10s infinite linear',
        'shimmer': 'shimmer 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseNeon: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(141, 66, 251, 0.5), 0 0 40px rgba(255, 51, 102, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(141, 66, 251, 0.8), 0 0 80px rgba(255, 51, 102, 0.6)',
          },
        },
        glow: {
          '0%': { 
            textShadow: '0 0 20px rgba(141, 66, 251, 0.5), 0 0 40px rgba(255, 51, 102, 0.3)',
          },
          '100%': { 
            textShadow: '0 0 40px rgba(141, 66, 251, 0.8), 0 0 80px rgba(255, 51, 102, 0.6)',
          },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(141, 66, 251, 0.5), 0 0 40px rgba(141, 66, 251, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 51, 102, 0.5), 0 0 40px rgba(255, 51, 102, 0.3)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(141, 66, 251, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config


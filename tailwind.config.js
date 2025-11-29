/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ["IBM Plex Sans", "sans-serif"],
      mono: ["IBM Plex Mono", "monospace"],
      serif: ["IBM Plex Serif", "serif"],
    },
    extend: {
      colors: {
        gray: colors.neutral,
        primary: {
          DEFAULT: '#373737',
          hover: '#343434',
        },
        danger: {
          DEFAULT: '#b92424',
        },
        dark: {
          bg: '#0a0a0a',
          elevated: '#1a1a1a',
          hover: '#2a2a2a',
          border: '#2d2d2d',
          header: '#151515',
        },
      },
      dropShadow: {
        "3xl": "0 35px 35px rgba(0, 0, 0, 0.25)",
        "4xl": [
          "0 35px 35px rgba(0, 0, 0, 0.25)",
          "0 45px 65px rgba(0, 0, 0, 0.15)",
        ],
        ps1: "0 0px 15px  rgba(0, 0, 0, 0.2)",
        aps1: "0 0px 25px rgba(0, 0, 0, 0.3)",
        ps2: "0 0px 50px rgba(0, 0, 0, 0.8)",
        aps2: "0 0px 13px rgba(0, 0, 0, 0.8)",
        ps3: "0 0px 35px rgba(0, 0, 0, 0.4)",
        aps3: "0 0px 45px rgba(0, 0, 0, 0.5)",
        ps4: "0 0px 45px rgba(0, 0, 0, 0.5)",
        aps4: "0 0px 55px rgba(0, 0, 0, 0.6)",
        "dark-ps1": "0 0 12px rgba(255, 255, 255, 0.08)",
        "dark-aps1": "0 0 18px rgba(255, 255, 255, 0.12)",
        "dark-ps2": "0 0 30px rgba(255, 255, 255, 0.15)",
        "dark-aps2": "0 0 20px rgba(255, 255, 255, 0.12)",
        "dark-ps3": "0 0 25px rgba(255, 255, 255, 0.1)",
        "dark-aps3": "0 0 30px rgba(255, 255, 255, 0.13)",
        "dark-ps4": "0 0 30px rgba(255, 255, 255, 0.12)",
        "dark-aps4": "0 0 35px rgba(255, 255, 255, 0.15)",
        "dark-3xl": "0 0 40px rgba(255, 255, 255, 0.1)",
        "dark-4xl": [
          "0 0 40px rgba(255, 255, 255, 0.1)",
          "0 0 60px rgba(255, 255, 255, 0.06)",
        ],
      },
      boxShadow: {
        gb1: [
          "0px 2px 10px rgba(0, 0, 0, 0.05)",
        ],
        gba1: [
          "3px 6px 20px rgba(0, 0, 0, 0.05)",
        ],
        gbp1: [
          "inset 1px 1px 4px rgba(255, 255, 255, 1)",
          "0px 2px 6px rgba(0, 0, 0, 0.05)",
        ],
        gb2: ["0px 2px 4px rgba(0, 0, 0, 0.05)"],
        gba2: ["3px 6px 10px rgba(0, 0, 0, 0.05)"],
        gbp2: [
          "inset 1px 1px 4px rgba(255, 255, 255, 1)",
          "0px 2px 6px rgba(0, 0, 0, 0.05)",
        ],
        ga1: [
          "inset 0px 0px 10px rgba(255, 255, 255, 1)",
          "0px 2px 10px rgba(0, 0, 0, 0.05)",
        ],
        gah1: [
          "inset 1px 1px 4px rgba(255, 255, 255, 1)",
          "3px 6px 20px rgba(0, 0, 0, 0.05)",
        ],
        "dark-gb1": [
          "inset 1px 1px 2px rgba(255, 255, 255, 0.02)",
          "0px 0px 10px rgba(255, 255, 255, 0.03)",
        ],
        "dark-gb2": "0 0 8px rgba(255, 255, 255, 0.03)",
        "dark-gba1": [
          "inset 1px 1px 2px rgba(255, 255, 255, 0.03)",
          "0px 0px 20px rgba(255, 255, 255, 0.06)",
        ],
        "dark-gba2": "0 0 15px rgba(255, 255, 255, 0.06)",
        "dark-gbp1": "0 0 10px rgba(255, 255, 255, 0.04)",
        "dark-gbp2": "0 0 8px rgba(255, 255, 255, 0.03)",
        "dark-ga1": "0 0 15px rgba(255, 255, 255, 0.05)",
        "dark-gah1": "0 0 25px rgba(255, 255, 255, 0.08)",
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.transition-smooth': {
          transition: 'all 300ms ease-in-out',
        },
        '.active-scale': {
          transition: 'transform 200ms ease-in-out',
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
        '.hover-scale': {
          transition: 'transform 200ms ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      })
    }
  ],
};

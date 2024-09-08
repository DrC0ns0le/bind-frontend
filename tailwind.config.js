/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["IBM Plex Sans", "sans-serif"],
      mono: ["IBM Plex Mono", "monospace"],
      serif: ["IBM Plex Serif", "serif"],
    },
    extend: {
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
      },
      boxShadow: {
        gb1: [
          "inset 10px 10px 10px rgba(255, 255, 255, 1)",
          "0px 2px 10px rgba(0, 0, 0, 0.05)",
        ],
        gba1: [
          "inset 1px 1px 4px rgba(255, 255, 255, 1)",
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
      },
    },
  },
  plugins: [],
};

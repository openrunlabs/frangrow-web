import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#D0190F",
          black: "#111111",
          grayBg: "#FAFAFA",
          border: "#EBEBEB",
          muted: "#71717A",
        }
      },
      borderRadius: {
        brand: '3px'
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
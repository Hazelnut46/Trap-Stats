/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neonPurple: '#b300ff',
        darkBg: "#0A0A0A",
      },
    },
  },
  plugins: [],
}


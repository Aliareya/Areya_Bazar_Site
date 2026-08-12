/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f5138",
        orang : '#ebb00c',
        brand: {
          DEFAULT: "#1f5138", // Your requested green
          light: "#2a6b4b",   // Slightly lighter for hover states
          dark: "#163c29",    // Darker for active states
        },
      },
    },
  },
  plugins: [],
};
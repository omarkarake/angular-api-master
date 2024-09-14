/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "blue-color": "#00BDD6", // For buttons and input hovers
        "text-black": "#000000", // For general text
        "text-secondary": "#9095A0", // For some text in cards
        "footer-text": "#323842", // For footer text
        "bg-primary": "#FFFFFF", // For primary background
        "bg-secondary": "#FAFAFB", // For secondary background
      },
      fontFamily: {
        epilogue: ["Epilogue", "sans-serif"],
      },
      fontSize: {
        "heading-large": ["48px", "1.2"], // Heading size 68px, bold
        "text-medium": ["20px", "1.5"], // Medium text 20px, bold
        "text-small": ["14px", "1.4"], // Card and footer text 14px, regular
      },
      fontWeight: {
        bold: "700",
        regular: "400",
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       screens: {
//         xs: '320px',
//         sm: '425px',
//         md: '768px',
//         lg: '1024px',
//         xl: '1440px'
//       }
//     },
//   },
//   plugins: [],
// }
// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4a90e2", // 새로운 메인 색상
        secondary: "#f85a40", // 새로운 보조 색상
        background: "#f0f4f8", // 새로운 배경 색상
        surface: "#ffffff",
        textPrimary: "#333333",
        textSecondary: "#888888",
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        lg: "16px",
        xl: "24px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        96: "24rem",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", ],
  theme: {
    extend: { backgroundImage: {
      bgLogin: "url('./assets/images/bg_login.png')",
    },},
  },
  plugins: [],
}


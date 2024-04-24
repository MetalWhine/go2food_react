/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
          'nav-sidebar-openmenu': {
            '0%' : {opacity: 0},
            '100%': {opacity: 1}
          },
      },
      animation: {
        'nav-sidebar-openmenu': 'nav-sidebar-openmenu 0.5s ease-in-out forwards',
      }
    }
  },
  plugins: [],
}
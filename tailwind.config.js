/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'inter-light': ['InterLight'],
        'inter-regular': ['InterRegular'],
        'inter-medium': ['InterMedium'],
        'inter-semibold': ['InterSemibold'],
        'inter-bold': ['InterBold'],
        'inter-black': ['InterBlack'],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'geist-thin': ['GeistThin'],
        'geist-extralight': ['GeistExtraLight'],
        'geist-light': ['GeistLight'],
        'geist-regular': ['GeistRegular'],
        'geist-medium': ['GeistMedium'],
        'geist-semibold': ['GeistSemibold'],
        'geist-bold': ['GeistBold'],
        'geist-extrabold': ['GeistExtraBold'],
        'geist-black': ['GeistBlack'],
      },
    },
  },
  plugins: [],
};

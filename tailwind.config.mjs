/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        botanical: '#2C423F',
        ivory: '#F9F8F3',
        sage: '#8BA88E',
      },
    },
  },
  plugins: [],
}
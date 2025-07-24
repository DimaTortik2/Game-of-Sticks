/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}', // Это указывает Tailwind, где искать ваши классы
	],
	theme: {
		extend: {
			colors: {
				'custom-dark': '#212121',
				'custom-light-gray': '#D9D9D9',
				'custom-button-text': '#e8e8e8',
			},
		},
	},
	plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				tetromino0: "#808080",
				tetromino1: "#ff44ff",
				tetromino2: "#ffff44",
				tetromino3: "#44ff44",
				tetromino4: "#bd0000",
				tetromino5: "#44ffff",
				tetromino6: "#ff8800",
				tetromino7: "#0000f0",
				tetromino8: "#000000",
				tetromino11: "#bf62bf",
				tetromino12: "#bfbf62",
				tetromino13: "#62bf62",
				tetromino14: "#9e4040",
				tetromino15: "#62bfbf",
				tetromino16: "#bf8440",
				tetromino17: "#4040b8",
			},
			transitionDuration: {
				2500: "2500ms",
			},
			height: {
				"19/20": "95%",
			},
		},
	},
	plugins: [],
	safelist: [
		{
			pattern: /(bg|text)-tetromino\d/,
		},
	],
};

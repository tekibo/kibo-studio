import type { ElectrobunConfig } from "electrobun";

export default {
	app: {
		name: "kibo-studio",
		identifier: "kibostudio.tekibo.in",
		version: "0.0.1",
	},
	build: {
		// Vite builds to dist/, we copy from there
		copy: {
			"dist/index.html": "views/mainview/index.html",
			"dist/assets": "views/mainview/assets",
			"dist/icon.png": "views/mainview/icon.png",
		},
		// Ignore Vite output in watch mode — HMR handles view rebuilds separately
		watchIgnore: ["dist/**"],
		mac: {
			bundleCEF: false,
		},
		linux: {
			bundleCEF: false,
		},
		win: {
			bundleCEF: false,
			icon: "icon.ico"
		},
	},
} satisfies ElectrobunConfig;

import type { ElectrobunConfig } from "electrobun";

export default {
	app: {
		name: "kibo-studio",
		identifier: "kibostudio.tekibo.in",
		version: "0.0.4",
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
	// Updater configuration — checks GitHub Releases for new versions
	// Electrobun compares the local buildId/version against GitHub Releases.
	release: {
		// GitHub Releases URL — Electrobun fetches <baseUrl>/<channel>-<platform>-update.json
		baseUrl: "https://github.com/tekibo/kibo-studio/releases/latest/download",
	},
} satisfies ElectrobunConfig;

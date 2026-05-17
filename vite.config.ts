import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";
import tailwindcss from '@tailwindcss/vite'

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	plugins: [react(), tailwindcss(),],
	root: "src/mainview",
	resolve: {
		alias: {
			"@": resolve(__dirname, "src/mainview"),
			"#store": resolve(__dirname, "src/mainview/store"),
			"#components": resolve(__dirname, "src/mainview/components"),
			"#lib": resolve(__dirname, "src/mainview/lib"),
			"#pages": resolve(__dirname, "src/mainview/pages"),
		},
	},
	build: {
		outDir: "../../dist",
		emptyOutDir: true,
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom', 'zustand', 'lucide-react', '@base-ui/react'],
				},
			},
		},
	},
	server: {
		port: 5173,
		strictPort: true,
	},
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		proxy: {
			// Proxy /api requests to your production backend to avoid CORS during local testing.
			// Change target to DEV API if you run backend locally.
			'/api': {
				target: 'https://borrow-box-five.vercel.app',
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/api/, '/api'),
			},
		},
	},
});

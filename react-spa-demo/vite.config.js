import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: 'http://react-spa-demo.test:5173',
    port: 5173,
    host: 'http://react-spa-demo.test', // Replace with your desired domain
    allowedHosts: ['react-spa-demo.test'], // Optional: Allows subdomains
  },
});

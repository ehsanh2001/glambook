import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend server
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true,
        secure: false, // Set to true if your server uses HTTPS
      },
    },
  },
});

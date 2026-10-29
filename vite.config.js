import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://catalogue-enquiry-backend.onrender.com",
        changeOrigin: true,
        secure: true,
        // no rewrite: the backend already expects /api/...
      },
    },
  },
  build: { sourcemap: false, chunkSizeWarningLimit: 600 },
  test: { environment: "node", include: ["src/**/*.test.js"] },
});

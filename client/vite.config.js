import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // In development, forward /api calls to the Node backend so no CORS setup is needed.
    proxy: { "/api": "http://localhost:5000" },
  },
});

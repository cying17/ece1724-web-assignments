import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This file configures Vite, our frontend development server and build tool
// Please do NOT modify this file as it has been configured for this assignment
// You could visit https://vite.dev/config/ for more details of configuring Vite
export default defineConfig({
  // Plugins extend Vite's functionality. The react() plugin adds React-specific features
  plugins: [react()],

  // Server configuration for development
  server: {
    // Proxy configuration for API requests
    // During development:
    // - Frontend runs at http://localhost:5173
    // - Backend runs at http://localhost:3000
    // Browsers block requests between different domains/ports for security
    // This proxy setting forwards all "/api/*" requests from frontend to backend:
    // Example: fetch("/api/papers") from frontend → http://localhost:3000/api/papers on backend
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});

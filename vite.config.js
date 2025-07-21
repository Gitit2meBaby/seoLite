import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { wpScripts } from "@kucrut/vite-for-wp";

export default defineConfig({
  plugins: [
    react(),
    wpScripts({
      input: {
        admin: "assets/js/admin.jsx",
        frontend: "assets/js/frontend.js",
      },
      outDir: "dist",
    }),
  ],
  resolve: {
    alias: {
      "@": "/assets/js",
      "@css": "/assets/css",
    },
  },
});

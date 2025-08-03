import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "assets/js"),
      "@css": path.resolve(__dirname, "assets/css"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        admin: path.resolve(__dirname, "assets/js/admin.jsx"),
        frontend: path.resolve(__dirname, "assets/js/frontend.js"),
      },
      output: {
        // Use consistent filenames instead of hashed ones
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: (assetInfo) => {
          // Keep CSS files with simple names
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "[name].css";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
});

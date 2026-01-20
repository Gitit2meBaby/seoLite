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
      },
      output: {
        // Use IIFE format for WordPress compatibility
        format: "iife",
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
        // Tell Vite to use WordPress's global React
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJSXRuntime",
        },
      },
      // CRITICAL: Don't bundle React - WordPress provides it
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});

import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    target: "es2020",
    // three.js lives in its own lazily-loaded chunk, so the warning limit is
    // raised to avoid noise; the initial (non-3D) bundle stays small.
    chunkSizeWarningLimit: 1200,
  },
  server: {
    host: true,
  },
});

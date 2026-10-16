import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  resolve: {
    alias: { "@": decodeURIComponent(new URL(".", import.meta.url).pathname) },
  },
  plugins: [react(), tailwindcss()],
  server: { proxy: { "/api": "http://127.0.0.1:5180", "/uploads": "http://127.0.0.1:5180" } },
  preview: { proxy: { "/api": "http://127.0.0.1:5180", "/uploads": "http://127.0.0.1:5180" } },
});

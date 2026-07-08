import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        studio: resolve(process.cwd(), "studio.html")
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});

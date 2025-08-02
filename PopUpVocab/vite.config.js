import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background/background.js"),
        content: resolve(__dirname, "src/content/content.js"),
        popup: resolve(__dirname, "src/action/popup.html"),
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]", // css тоже окажется в dist
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  publicDir: "public",
});

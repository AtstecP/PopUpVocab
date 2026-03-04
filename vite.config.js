import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background/background.js"),
        content: resolve(__dirname, "src/content/content.js"),
        action: resolve(__dirname, "src/action/action.js"),
        // 1. Tell Vite to bundle our new JavaScript file
        "add-word": resolve(__dirname, "src/action/add-word.js"), 
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") return "background/[name].js";
          if (chunk.name === "content") return "content/[name].js";
          if (chunk.name === "action" || chunk.name === "add-word") return "action/[name].js";
          return "[name].js";
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            if (assetInfo.name.includes("content")) return "content/[name].[ext]";
            if (assetInfo.name.includes("background")) return "background/[name].[ext]";
            if (assetInfo.name.includes("action") || assetInfo.name.includes("add-word")) return "action/[name].[ext]";
          }
          return "[name].[ext]";
        },
         format: 'es',
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  publicDir: "public",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/action/action.html",
          dest: "action",
        },
        {
          src: "src/action/add-word.html",
          dest: "action",
        },
      ],
    }),
  ],
  json: {
    namedExports: true,
    stringify: false, 
  },
});
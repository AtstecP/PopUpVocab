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
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") return "background/[name].js";
          if (chunk.name === "content") return "content/[name].js";
          if (chunk.name === "action") return "action/[name].js";
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            if (assetInfo.name.includes("content")) return "content/[name].[ext]";
            if (assetInfo.name.includes("background")) return "background/[name].[ext]";
            if (assetInfo.name.includes("action")) return "action/[name].[ext]";
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
      ],
    }),
  ],
  json: {
    namedExports: true,
    stringify: false, 
  },
});

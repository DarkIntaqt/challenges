import { reactRouter } from "@react-router/dev/vite";
import * as path from "node:path";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

export default defineConfig({
   plugins: [
      babel({
         include: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
         babelConfig: {
            presets: ["@babel/preset-typescript"],
            plugins: ["babel-plugin-react-compiler"],
            generatorOpts: {
               compact: true, // silence file size warns
            },
         },
      }),
      !process.env.VITEST && reactRouter(),
   ],
   resolve: {
      tsconfigPaths: true,
      alias: {
         "@cgg": path.resolve(import.meta.dirname, "app"),
      },
   },
   css: {
      modules: {
         generateScopedName:
            process.env.NODE_ENV === "production"
               ? "[hash:base64:8]"
               : "[name]_[local]_[hash:base64:4]",
      },
   },
   build: {
      sourcemap: false,
      rollupOptions: {
         output: {
            entryFileNames: `chunks/component.[hash].js`,
            chunkFileNames: `chunks/chunk.[hash].js`,
            assetFileNames: `assets/[name].[hash][extname]`,
         },
      },
   },
});

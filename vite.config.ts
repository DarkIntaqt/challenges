import { reactRouter } from "@react-router/dev/vite";
import * as path from "node:path";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
   plugins: [
      !process.env.VITEST && reactRouter(),
      tsconfigPaths(),
      babel({
         filter: /\.[jt]sx?$/,
         babelConfig: {
            presets: ["@babel/preset-typescript"],
            plugins: ["babel-plugin-react-compiler"],
            generatorOpts: {
               compact: true, // silence file size warns
            },
         },
      }),
   ],
   test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./tests/setup.ts"],
   },
   resolve: {
      alias: {
         "@cgg": path.resolve(__dirname, "app"),
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

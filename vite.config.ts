import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
   plugins: [!process.env.VITEST && reactRouter(), tsconfigPaths()],
   test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./tests/setup.ts"],
   },
   css: {
      preprocessorOptions: {
         scss: {
            additionalData: `@use "styles/config" as config;\n@use "styles/colors" as color;\n\n`,
            loadPaths: ["./app"],
         },
      },
   },
});

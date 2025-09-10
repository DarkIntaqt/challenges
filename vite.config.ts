import { reactRouter } from "@react-router/dev/vite";
import * as path from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
   plugins: [!process.env.VITEST && reactRouter(), tsconfigPaths()],
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
});

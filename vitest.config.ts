import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
   test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./tests/setup.ts"],
   },
   resolve: {
      alias: {
         "@cgg": path.resolve(import.meta.dirname, "app"),
      },
   },
});

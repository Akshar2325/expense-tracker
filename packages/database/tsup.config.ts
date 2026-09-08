import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
  // The generated Prisma client and adapter are runtime deps — keep them external
  external: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  outDir: "dist",
});

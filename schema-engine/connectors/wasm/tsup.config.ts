import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src-js/node.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  platform: "node",
});

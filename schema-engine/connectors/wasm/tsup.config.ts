import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src-js/node.ts", "src-js/cli.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  platform: "node",
});

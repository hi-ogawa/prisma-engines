import unocss from "unocss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { themeScriptPlugin } from "@hiogawa/theme-script/dist/vite";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    unocss(),
    react(),
    themeScriptPlugin({
      defaultTheme: "dark",
      storageKey: "prisma-schema-diff-wasm:theme",
    }),
  ],
});

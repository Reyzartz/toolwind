import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";
import manifest from "./src/manifest";

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest,
      contentScripts: {
        injectCss: true,
      },
    }),
  ],
});

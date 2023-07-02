import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

const [major, minor, patch, label = "0"] = packageJson.version
  .replace(/[^\d.-]+/g, "")
  .split(/[.-]/);

const manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: packageJson.displayName ?? packageJson.name,
  version: `${major}.${minor}.${patch}.${label}`,
  description: packageJson.description,
  background: { service_worker: "src/pages/background/index.ts" },
  action: {
    default_popup: "index.html",
    default_icon: {
      "16": "icons/logo-16.png",
      "24": "icons/logo-24.png",
      "32": "icons/logo-32.png",
    },
  },
  permissions: ["activeTab", "tabs", "storage"],
  icons: {
    "16": "icons/logo-16.png",
    "32": "icons/logo-32.png",
    "48": "icons/logo-48.png",
    "128": "icons/logo-128.png",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/main.tsx"],
    },
  ],
  web_accessible_resources: [
    {
      resources: ["assets/js/*.js", "assets/css/*.css", "assets/img/*"],
      matches: ["*://*/*"],
    },
  ],
}));

export default manifest;

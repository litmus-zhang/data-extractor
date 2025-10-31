import { type Manifest } from "@bedframe/core";
import pkg from "../../package.json";

export const baseManifest = {
  // Required
  // - - - - - - - - -
  name: pkg.name,
  version: pkg.version,
  manifest_version: 3,

  // Recommended
  // - - - - - - - - -
  description: pkg.description,
  icons: {
    16: "assets/icons/icon-16x16.png",
    32: "assets/icons/icon-32x32.png",
    48: "assets/icons/icon-48x48.png",
    128: "assets/icons/icon-128x128.png",
  },
  action: {
    default_icon: {
      16: "assets/icons/icon-16x16.png",
      32: "assets/icons/icon-32x32.png",
      48: "assets/icons/icon-48x48.png",
      128: "assets/icons/icon-128x128.png",
    },
    default_title: pkg.name,
    default_popup: "pages/main.html",
  },

  // Optional
  // - - - - - - - - -
  author: {
    email: pkg.author.email,
  },
  background: {
    service_worker: "scripts/service-worker.ts",
    type: "module",
  },
  options_ui: {
    page: "pages/options.html",
    open_in_tab: false,
  },
  web_accessible_resources: [
    {
      resources: ["assets/*", "pages/*"],
      matches: ["<all_urls>"],
    },
  ],
  content_scripts: [
    {
      matches: [
        "https://www.onthemarket.com/*",
        "https://www.zillow.com/*",
        "https://www.bayut.com/",
        "https://jiji.ng/*",
      ],
      js: ["scripts/content-scripts.ts"]

    }
  ],
  commands: {
    _execute_action: {
      suggested_key: {
        default: "Ctrl+Shift+1",
        mac: "Ctrl+Shift+1",
        linux: "Ctrl+Shift+1",
        windows: "Ctrl+Shift+1",
        chromeos: "Ctrl+Shift+1",
      },
    },
  },
  permissions: [
    "activeTab",
    "storage",
    "tabs",
    "scripting"],
  host_permissions: [
    "https://www.onthemarket.com/*",
    "https://www.zillow.com/*",
    "https://www.bayut.com/",
    "https://jiji.ng/*"
  ],

} satisfies Manifest;

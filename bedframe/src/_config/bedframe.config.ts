import { createBedframe } from "@bedframe/core";
import { chrome } from "../manifests/chrome";

export default createBedframe({
  browser: [chrome.browser],
  extension: {
    type: "popup",
    options: "embedded",
    manifest: [chrome],
    pages: {},
  },
  development: {
    template: {
      config: {
        framework: "react",
        language: "typescript",
        packageManager: "bun",
        style: {
          framework: "tailwind",
          components: "shadcn",
          theme: "new-york",
          fonts: [
            {
              name: "Inter",
              local: "Inter",
              src: "./assets/fonts/inter/*.ttf",
              weights: {
                "Inter-Regular": 400,
                "Inter-SemiBold": 600,
                "Inter-Bold": 700,
                "Inter-ExtraBold": 800,
              },
            },
          ],
        },
        lintFormat: true,
        tests: {
          globals: true,
          setupFiles: ["./_config/tests.config.ts"],
          environment: "happy-dom",
          coverage: {
            provider: "istanbul",
            reporter: ["text", "json", "html"],
            reportsDirectory: "../coverage",
          },
          watch: false,
        },
      },
    },
  },
});

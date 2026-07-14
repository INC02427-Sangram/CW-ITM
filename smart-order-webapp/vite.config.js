import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(() => {
  const sharedProxyConfigDev = {
    "/WorkUtilsServices": {
      target: "https://cw-caf-idm-services.cfapps.eu10-004.hana.ondemand.com/",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/WorkUtilsServices/, "/rest"),
      headers: {
        Authorization: `Bearer `,
      },
    },
    "/WorkRulesServices": {
      target: "https://cw-caf-idm-services.cfapps.eu10-004.hana.ondemand.com/",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/WorkRulesServices/, "/rest"),
      headers: {
        Authorization: `Bearer `,
      },
    },
    "/IDMServices": {
      target:
        "https://cw-caf-idm-services-v3.cfapps.eu10-004.hana.ondemand.com/",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/IDMServices/, "idm"),
      secure: true,
      headers: {
        Authorization: `Bearer `,
      },
    },
    "/WorkRuleEngineServices": {
      target: "https://cw-caf-idm-services.cfapps.eu10-004.hana.ondemand.com/",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/WorkRuleEngineServices/, "/rest"),
    },
    "/IWAApi": {
      target:
        "https://incture-cherrywork-dev-cw-caf-dev-cw-caf-iwa-services.cfapps.eu10-004.hana.ondemand.com",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/IWAApi/, ""),
      secure: true,
      headers: {
        Authorization: `Bearer `,
      },
    },
    "/NativeWorkflowServices": {
      target:
        "https://caf-native-workflow-dev.cfapps.eu10-004.hana.ondemand.com/",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/NativeWorkflowServices/, ""),
      headers: {
        Authorization: `Bearer `,
      },
    },
    "/CrudServices": {
      target: "https://cw-caf-crudapi-dev.cfapps.eu10-004.hana.ondemand.com/",
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/CrudServices/, ""),
      headers: {
        Authorization: `Bearer `,
        // env: "itm",
        // "Content-Type": "application/json",
      },
    },
  };
  return {
    define: {
      global: "window",
    },
    build: {
      outDir: "dist",
    },
    server: {
      proxy: sharedProxyConfigDev,
    },
    plugins: [
      react(),
      visualizer({
        filename: "./dist/stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
  };
});

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
        "https://cw-caf-idm-services-v3.cfapps.eu10-004.hana.ondemand.com",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/IDMServices/, "/idm"),
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
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJqaWQiOiJ4RTVJK3MwN1ZJc3UxMDEraURYL3IvU0pWbXdBTEwwSmhSZ09BUi9hTkRBPSIsImFsZyI6IlJTMjU2Iiwiamt1IjoiaHR0cHM6Ly9pbmN0dXJlLWNoZXJyeXdvcmstZGV2LmF1dGhlbnRpY2F0aW9uLmV1MTAuaGFuYS5vbmRlbWFuZC5jb20vdG9rZW5fa2V5cyIsImtpZCI6ImRlZmF1bHQtand0LWtleS0xNjg2MTk3NTczIn0.eyJzdWIiOiJhNDRhMzQxMy00NGNmLTQ4ZjEtYTUyNy1jZDE5MTMzMTNlYmEiLCJ4cy51c2VyLmF0dHJpYnV0ZXMiOnt9LCJ1c2VyX25hbWUiOiJzYW5ncmFtLm1vaGFwYXRyYUBpbmN0dXJlLmNvbSIsIm9yaWdpbiI6ImFpaWhhMWt3dy5hY2NvdW50cy5vbmRlbWFuZC5jb20iLCJpc3MiOiJodHRwczovL2luY3R1cmUtY2hlcnJ5d29yay1kZXYuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS9vYXV0aC90b2tlbiIsInhzLnN5c3RlbS5hdHRyaWJ1dGVzIjp7InhzLnNhbWwuZ3JvdXBzIjpbIkNXRF9JT01fSVRfQURNSU4iLCJDV1FfSU9NX0lUX0FETUlOIiwiQ1dfSU9NX0lUX0FETUlOIiwiQ1dfREVNT19XT1JLRkxPV19BRE1JTiJdLCJ4cy5yb2xlY29sbGVjdGlvbnMiOlsiWjpJTkNfQ1dEX0RFU1RJTkFUSU9OX1ZJRVdFUiIsIlo6Q1dEX0lPTV9JVF9BRE1JTiJdfSwicmV2b2NhYmxlIjp0cnVlLCJnaXZlbl9uYW1lIjoiU2FuZ2FtIiwiY2xpZW50X2lkIjoic2ItY3ctY2FmLXhzdWFhIXQxOTc4MDYiLCJleHRfYXR0ciI6eyJlbmhhbmNlciI6IlhTVUFBIiwic3ViYWNjb3VudGlkIjoiZDMzNGExNjctY2FjMC00OTAyLWIxN2MtY2UwNmQ2NzgwZTA1IiwiemRuIjoiaW5jdHVyZS1jaGVycnl3b3JrLWRldiIsIm9pZGNJc3N1ZXIiOiJhaWloYTFrd3cuYWNjb3VudHMub25kZW1hbmQuY29tIn0sInVzZXJfdXVpZCI6IjIzZDFlNTJiLWFkYWMtNDBiMi1hOGZmLTQ5ZTM5ODQ4MDRmZCIsInppZCI6ImQzMzRhMTY3LWNhYzAtNDkwMi1iMTdjLWNlMDZkNjc4MGUwNSIsImdyYW50X3R5cGUiOiJ1c2VyX3Rva2VuIiwidXNlcl9pZCI6ImE0NGEzNDEzLTQ0Y2YtNDhmMS1hNTI3LWNkMTkxMzMxM2ViYSIsImF6cCI6InNiLWN3LWNhZi14c3VhYSF0MTk3ODA2Iiwic2NvcGUiOlsib3BlbmlkIiwidWFhLnVzZXIiXSwiYXV0aF90aW1lIjoxNzg2MTAxMDIxLCJleHAiOjE3ODYxNDQyMjEsImZhbWlseV9uYW1lIjoiTW9oYXBhdHJhIiwiaWF0IjoxNzg2MTAxMDIxLCJqdGkiOiIxOTg3NWQxMWVlN2E0OGQ3YjFkMzRlNmQ4NTNiNmRhOCIsImVtYWlsIjoic2FuZ3JhbS5tb2hhcGF0cmFAaW5jdHVyZS5jb20iLCJyZXZfc2lnIjoiODNjNzNjNTEiLCJjaWQiOiJzYi1jdy1jYWYteHN1YWEhdDE5NzgwNiJ9.CgT9pTciakExhrX85xPrc_SVwgsGQ1ySiH544WHnBgiHeOJCcuxGNDZC4tvwgwYOuNt5aHPjaR84HDGKKpxBEdSgDAtgbLoNOqOhhC9CTrUMGvyOjCTYuipiaKwRpeeglyxJDhy55HNguRWeD8UBtxUir4TsfneX6VenUyZaaoqnxr6OEIy70QmqAQfU49EWWveUB9Y-DwnXEczHmqc0FKBK1jBlHeLfClsmAN0S4sdNK3D__VDlH1hCxDOIw8mhcU_fjGQjRPdjgAqHOIOLwWKhXG3I-0-lsc8324u_3Sndc3RaPhKhHiBrO4NU73BDyP9HO5HdNd44OLpEWb0iMQ`,
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

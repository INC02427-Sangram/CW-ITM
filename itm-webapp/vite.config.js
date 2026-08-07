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
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJqaWQiOiJleGVpbHk1S1FoTFdVOGphVjgrZnExNVFHaTAxRmluUXVXRlhORFlCRlVFPSIsImFsZyI6IlJTMjU2Iiwiamt1IjoiaHR0cHM6Ly9pbmN0dXJlLWNoZXJyeXdvcmstZGV2LmF1dGhlbnRpY2F0aW9uLmV1MTAuaGFuYS5vbmRlbWFuZC5jb20vdG9rZW5fa2V5cyIsImtpZCI6ImRlZmF1bHQtand0LWtleS0xNjg2MTk3NTczIn0.eyJzdWIiOiI5NTE2NjNmYy0zNGVhLTQzZTAtODUxMS0zMzc2MDUzOGY3ODkiLCJ4cy51c2VyLmF0dHJpYnV0ZXMiOnt9LCJ1c2VyX25hbWUiOiJjaGlsYWthbGEuc2FpdGFydW5AaW5jdHVyZS5jb20iLCJvcmlnaW4iOiJhaWloYTFrd3cuYWNjb3VudHMub25kZW1hbmQuY29tIiwiaXNzIjoiaHR0cHM6Ly9pbmN0dXJlLWNoZXJyeXdvcmstZGV2LmF1dGhlbnRpY2F0aW9uLmV1MTAuaGFuYS5vbmRlbWFuZC5jb20vb2F1dGgvdG9rZW4iLCJ4cy5zeXN0ZW0uYXR0cmlidXRlcyI6eyJ4cy5zYW1sLmdyb3VwcyI6WyJDV1FfSVdBX1VTRVJfUk8iLCJDRl9DUElfQURNSU4iLCJDV0RfSVdBX1VTRVJfUk8iXSwieHMucm9sZWNvbGxlY3Rpb25zIjpbIlo6Q1dEX0lXQV9VU0VSX1JPIl19LCJyZXZvY2FibGUiOnRydWUsImdpdmVuX25hbWUiOiJDaGlsYWthbGEiLCJjbGllbnRfaWQiOiJzYi1jdy1jYWYteHN1YWEhdDE5NzgwNiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiJkMzM0YTE2Ny1jYWMwLTQ5MDItYjE3Yy1jZTA2ZDY3ODBlMDUiLCJ6ZG4iOiJpbmN0dXJlLWNoZXJyeXdvcmstZGV2Iiwib2lkY0lzc3VlciI6ImFpaWhhMWt3dy5hY2NvdW50cy5vbmRlbWFuZC5jb20ifSwidXNlcl91dWlkIjoiZThjNmRhZWQtM2Q1NC00Y2JhLWJhYTUtODE3OWU0N2Q4NzgwIiwiemlkIjoiZDMzNGExNjctY2FjMC00OTAyLWIxN2MtY2UwNmQ2NzgwZTA1IiwiZ3JhbnRfdHlwZSI6InVzZXJfdG9rZW4iLCJ1c2VyX2lkIjoiOTUxNjYzZmMtMzRlYS00M2UwLTg1MTEtMzM3NjA1MzhmNzg5IiwiYXpwIjoic2ItY3ctY2FmLXhzdWFhIXQxOTc4MDYiLCJzY29wZSI6WyJvcGVuaWQiLCJ1YWEudXNlciJdLCJhdXRoX3RpbWUiOjE3ODYwOTgyNzgsImV4cCI6MTc4NjE0MTQ3OCwiZmFtaWx5X25hbWUiOiJTYWkgVGFydW4iLCJpYXQiOjE3ODYwOTgyNzgsImp0aSI6IjRlYjUzNWQ0YjE5NTQ0NWY4ZGE4MzE4YWY2ZGZlMWQ5IiwiZW1haWwiOiJjaGlsYWthbGEuc2FpdGFydW5AaW5jdHVyZS5jb20iLCJyZXZfc2lnIjoiMTNlYzE2MWEiLCJjaWQiOiJzYi1jdy1jYWYteHN1YWEhdDE5NzgwNiJ9.Xvxx_VF7jrIcEkjLnVm7iU7bsNSMxl26njVwEXQcgaLZEFCpg3fDvSFWfPjy8aKi5Uv9Aq0wgXqp-rB9WssxOH3Hv3FNvZU07151cOOjcLgleKMJW1K-FwcT7YvRqHOxGPT143JkdAfZmqGuEimWj0-2ZBL7H34qrKOwyJ5e6yc5zZrQPc8sX1zd0RgDOspdGKG50BnFy6dMXpI_AQ1gzGLTGb7vts7J2Q8UkOeiG2V2aGTuSgGYB-DlzJyhFjJPPHt5Ozr_ZI8oHnlUwj22bKJgZRALh0MIW4eFpmhALco_b75LbtaUgrmVmZOWzG_C1-kXoUWG70Hamc3JmslSOw`,
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

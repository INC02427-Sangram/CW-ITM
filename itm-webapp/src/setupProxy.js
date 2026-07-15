const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/JavaServices_Oauth/(.*)$",
    createProxyMiddleware({
      target: "https://rustoleumordersautomation.cfapps.us21.hana.ondemand.com/",
      changeOrigin: true,
      authenticationType: "xsuaa",
      // pathRewrite: { "^/COMJavaServices_Oauth": "$1" },
    })
  );
};


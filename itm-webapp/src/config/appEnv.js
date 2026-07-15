const RAW_ENV = import.meta.env.VITE_APP_ENV;

const ENV_MAP = {
  dev: {
    MODELING_ENV: "DEV",
    PLATFORM_ENV: "dev",
    APP_ID: "501",
    CRUD_API_ENV: "soa_dev",
    CHERRYBOT_URL: "https://cw-agent-cherry-backend-sbx.cfapps.eu10-004.hana.ondemand.com",
    CONSUMING_APP: "IOM",
  },

  qa: {
    MODELING_ENV: "QA",
    PLATFORM_ENV: "qa",
    APP_ID: "502",
    CRUD_API_ENV: "soa_qa",
    CHERRYBOT_URL: "https://cw-agent-cherry-backend-qa.cfapps.eu10-004.hana.ondemand.com",
    CONSUMING_APP: "IOM",
  },

  demo: {
    MODELING_ENV: "DEMO",
    PLATFORM_ENV: "demo",
    APP_ID: "503",
    CRUD_API_ENV: "soa_demo",
    CHERRYBOT_URL: "https://cw-agent-cherry-backend-sbx-demo.cfapps.eu10-004.hana.ondemand.com",
    CONSUMING_APP: "IOM",
  },
};

if (!ENV_MAP[RAW_ENV]) {
  throw new Error(`Invalid VITE_APP_ENV value: ${RAW_ENV}`);
}

export default ENV_MAP[RAW_ENV];

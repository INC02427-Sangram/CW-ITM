import { CherryBotPlus } from "@cw/cherrybot-plus";
import { useSelector } from "react-redux";
import appEnv from "../../config/appEnv";
import useAppTheme from "../../hooks/useAppTheme";

const CherryBot = () => {
  const { isDark } = useAppTheme();

  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const token = userDetails?.token || "";

  const isLocalEnv = import.meta.env.VITE_IS_LOCAL === "true";

  const destinationData = {
    CRUD_API_ENV: appEnv.CRUD_API_ENV,
    SERVICE_BASE_URL: [
      {
        Description: "",
        Name: "cw_caf_cherrybot_services",
        URL: appEnv.CHERRYBOT_URL,
      },
    ],
  };

  const faqs = [
    { question: "What can I do here?", answer: "You can ask CherryBot about order details!" },
    { question: "Who built CherryBot?", answer: "CherryBot is built by the CAF team." },
  ];

  const promptResponses = {
    generate_so_update_template: "Submitting SO update template",
  };

  return (
    <div
      className="cherrybot-container"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 99999,
        "--background-cherrybot": isDark ? "#1f1f1f" : "#ffffffff",
        "--text-primary": isDark ? "#eaeaea" : "#111111",
        "--text-secondary": isDark ? "#a0a0a0" : "#6b6b6b",
        "--background-default": isDark ? "#000000ff" : "#ffffff",
        "--background-paper": isDark ? "#181818" : "#fafafa",
        "--background-read-only": isDark ? "#2a2a2a" : "#f0f0f0",
      }}
    >
      <CherryBotPlus
        userToken={token}
        useWorkAccess={isLocalEnv}// true for local, false for deployment
        useConfigServerDestination={isLocalEnv} // true for local, false for deployment
        destinationData={destinationData}
        promptResponses={{
          ...promptResponses,
          _fallback: "Please submit the updated PO",
        }}
        compact={true}
        faqs={faqs}
        enableTokenExchange={false}
        // navigate={navigateConfig}
      />
    </div>
  );
};

export default CherryBot;
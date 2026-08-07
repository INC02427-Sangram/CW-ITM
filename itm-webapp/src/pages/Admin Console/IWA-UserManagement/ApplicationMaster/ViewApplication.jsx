import { useNavigate, useParams } from "react-router-dom";
import { ViewApplication } from "@cw/viewapplication";
import { Box } from "@mui/material";

const APPLICATION_MASTER_BASE_PATH = "/admin-console/iwa/application-master";

const ViewApplicationPage = () => {
  const navigate = useNavigate();
  const { appId: applicationId } = useParams();

  const selectedEnvironment = String(import.meta.env.VITE_APP_ENV || "");

  const viewApplicationNavigate = (action) => {
    if (action === "home") navigate(APPLICATION_MASTER_BASE_PATH);

    if (action === "edit") {
      navigate(
        `${APPLICATION_MASTER_BASE_PATH}/editApplication/${applicationId}`,
      );
    }
  };

  const dateTimeConfig = {
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24hr",
    snackbarTime: 7000,
  };

  const platformConfig = {
    env: selectedEnvironment,
    consumingApp: "ITM",
    platformName: "btp",
    platformUrl: "https://cw-iwa-dev.cherrywork.com/IWAApi/",
  };

  return (
    <Box className="outermost-container">
      <ViewApplication
        appId={applicationId}
        viewApplicationNavigate={viewApplicationNavigate}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </Box>
  );
};

export default ViewApplicationPage;

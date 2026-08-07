import { useNavigate, useParams } from "react-router-dom";
import { EditApplication } from "@cw/editapplication";
import { Box } from "@mui/material";

const APPLICATION_MASTER_BASE_PATH = "/admin-console/iwa/application-master";

const EditApplicationPage = () => {
  const navigate = useNavigate();
  const { appId: applicationId } = useParams();

  const selectedEnvironment = import.meta.env.VITE_APP_ENV;

  const onCreateApplicationActionClick = (action) => {
    if (action === "applicationSummary" || action === "home") {
      navigate(APPLICATION_MASTER_BASE_PATH);
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
      <EditApplication
        dateTimeConfig={dateTimeConfig}
        onCreateApplicationActionClick={onCreateApplicationActionClick}
        appId={applicationId}
        platformConfig={platformConfig}
      />
    </Box>
  );
};

export default EditApplicationPage;

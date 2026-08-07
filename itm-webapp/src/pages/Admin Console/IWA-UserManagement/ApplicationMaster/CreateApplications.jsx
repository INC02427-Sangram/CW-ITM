import { useNavigate } from "react-router-dom";
import { CreateApplication } from "@cw/createapplication";
import { Box } from "@mui/material";

const APPLICATION_MASTER_BASE_PATH = "/admin-console/iwa/application-master";

const CreateApplicationPage = () => {
  const navigate = useNavigate();

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
      <CreateApplication
        onCreateApplicationActionClick={onCreateApplicationActionClick}
        platformConfig={platformConfig}
        dateTimeConfig={dateTimeConfig}
      />
    </Box>
  );
};

export default CreateApplicationPage;

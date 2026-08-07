import { Routes, Route, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { ApplicationSummary } from "@cw/applicationsummary";
import { iwaApplicationMasterRoutes } from "../../../../config/adminConsole.routes.config";

const APPLICATION_MASTER_BASE_PATH = "/admin-console/iwa/application-master";

const ApplicationSummaryPage = () => {
  const navigate = useNavigate();

  const selectedEnvironment = String(import.meta.env.VITE_APP_ENV || "");

  const onApplicationSummaryActionClick = (action, applicationId) => {
    const actionMap = {
      view: () =>
        applicationId &&
        navigate(
          `${APPLICATION_MASTER_BASE_PATH}/viewApplication/${applicationId}`,
        ),
      edit: () =>
        applicationId &&
        navigate(
          `${APPLICATION_MASTER_BASE_PATH}/editApplication/${applicationId}`,
        ),
      createApplication: () =>
        navigate(`${APPLICATION_MASTER_BASE_PATH}/createApplication`),
    };

    if (typeof action === "string") {
      actionMap[action.trim()]?.();
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

  const applicationSummaryView = (
    <Box className="outermost-container">
      <ApplicationSummary
        onApplicationSummaryActionClick={onApplicationSummaryActionClick}
        dateTimeConfig={dateTimeConfig}
        app="IWA"
        platformConfig={platformConfig}
      />
    </Box>
  );

  return (
    <Routes>
      <Route index element={applicationSummaryView} />
      {iwaApplicationMasterRoutes.map((route) => (
        <Route key={route.id} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
};

export default ApplicationSummaryPage;

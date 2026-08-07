import { useLocation, useNavigate } from "react-router-dom";
import { CreateRole } from "@cw/createrole";
import { Box } from "@mui/material";

const ROLES_BASE_PATH = "/admin-console/iwa/roles";

const CreateRolePage = () => {
  const navigate = useNavigate();
  const reactRouterLocation = useLocation();

  const selectedEnvironment = String(import.meta.env.VITE_APP_ENV || "");

  const responseData = reactRouterLocation.state?.response;
  const specificCreatedRoleRequest =
    reactRouterLocation.state?.specificCreatedRoleRequest;

  const preSelectedInfo = {
    application: {
      applicationId: responseData?.application?.applicationId,
      applicationName: responseData?.application?.applicationName,
      idmApplicationId: responseData?.application?.idmApplicationId || "",
    },
    specificCreatedRoleRequest: specificCreatedRoleRequest || false,
  };

  const onCreateRoleActionClick = (action) => {
    if (action === "roleSummary" || action === "home") {
      navigate(ROLES_BASE_PATH);
    }

    if (action === "application-view") {
      navigate("/admin-console/iwa/application-master");
    }
  };

  const platformConfig = {
    env: selectedEnvironment,
    consumingApp: "ITM",
    platformName: "btp",
  };

  const dateTimeConfig = {
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24hr",
    snackbarTime: 7000,
  };

  return (
    <Box className="outermost-container">
      <CreateRole
        onCreateRoleActionClick={onCreateRoleActionClick}
        app="IWA"
        preSelectedInfo={preSelectedInfo}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </Box>
  );
};

export default CreateRolePage;

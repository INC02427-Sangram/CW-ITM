import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { EditUser } from "@cw/edituser";
import { Box } from "@mui/material";

const USERS_BASE_PATH = "/admin-console/iwa/users";

const EditUserPage = () => {
  const { userId } = useParams();

  const navigate = useNavigate();
  const { preferences } = useSelector((state) => state.user);

  const selectedEnvironment = import.meta.env.VITE_APP_ENV;

  const editUserNavigate = (action) => {
    if (action === "home") navigate(USERS_BASE_PATH);
  };

  const userDetailsVisibility = {
    "basic-details": true,
    "official-details": true,
    "data-level-access": true,
    roles: true,
    "additional-info": true,
    "user-preferences": true,
    "connected-systems": true,
    "activity-log": true,
  };

  const dateTimeConfig = {
    dateFormat: preferences.dateFormat,
    timeFormat: preferences.timeFormat,
    snackbarTime: "5000",
  };

  const platformConfig = {
    env: selectedEnvironment,
    consumingApp: "ITM",
    platformName: "btp",
    platformUrl: "https://cw-iwa-dev.cherrywork.com/IWAApi/",
  };

  return (
    <Box className="outermost-container">
      <EditUser
        userId={userId}
        editUserNavigate={editUserNavigate}
        app="ITM"
        attributeMasterAppName="WORKRULES"
        userDetailsVisibility={userDetailsVisibility}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </Box>
  );
};

export default EditUserPage;

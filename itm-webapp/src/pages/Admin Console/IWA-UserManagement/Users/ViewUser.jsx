import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ViewUser } from "@cw/viewuser";
import { Box } from "@mui/material";

const USERS_BASE_PATH = "/admin-console/iwa/users";

const ViewUserPage = () => {
  const { userId } = useParams();

  const navigate = useNavigate();
  const { preferences } = useSelector((state) => state.user);

  const selectedEnvironment = import.meta.env.VITE_APP_ENV;

  const viewUserNavigate = (action, targetUserId) => {
    if (action === "home") navigate(USERS_BASE_PATH);

    if (action === "edit") {
      navigate(`${USERS_BASE_PATH}/editUser/${targetUserId}`);
    }
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
      <ViewUser
        userId={userId}
        viewUserNavigate={viewUserNavigate}
        app="ITM"
        userDetailsVisibility={userDetailsVisibility}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </Box>
  );
};

export default ViewUserPage;

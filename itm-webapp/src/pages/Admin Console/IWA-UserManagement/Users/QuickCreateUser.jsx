import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { QuickAddUser } from "@cw/quickadduser";
import { Box } from "@mui/material";

const USERS_BASE_PATH = "/admin-console/iwa/users";

const QuickCreateUserPage = () => {
  const navigate = useNavigate();
  const { preferences } = useSelector((state) => state.user);

  const selectedEnvironment = import.meta.env.VITE_APP_ENV;

  const onUserActionClick = (action) => {
    if (action === "home" || action === "usersummary") {
      navigate(USERS_BASE_PATH);
    }
  };

  const platformConfig = {
    env: selectedEnvironment,
    consumingApp: "ITM",
    platformName: "btp",
    platformUrl: "https://cw-iwa-dev.cherrywork.com/IWAApi/",
  };

  const dateTimeConfig = {
    dateFormat: preferences.dateFormat,
    timeFormat: preferences.timeFormat,
    snackbarTime: "5000",
  };

  return (
    <Box className="outermost-container">
      <QuickAddUser
        onUserActionClick={onUserActionClick}
        platformConfig={platformConfig}
        dateTimeConfig={dateTimeConfig}
      />
    </Box>
  );
};

export default QuickCreateUserPage;

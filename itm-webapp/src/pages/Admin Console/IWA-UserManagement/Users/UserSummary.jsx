import { Routes, Route, useNavigate } from "react-router-dom";
import { UserSummary } from "@cw/usersummary";
import { iwaUsersRoutes } from "../../../../config/adminConsole.routes.config";
import { Box } from "@mui/material";

const USERS_BASE_PATH = "/admin-console/iwa/users";

const UserSummaryPage = () => {
  const navigate = useNavigate();

  const selectedEnvironment = String(import.meta.env.VITE_APP_ENV || "");

  const onUserSummaryActionClick = (action, userId) => {
    console.log("action =", action);
    console.log("action type =", typeof action);
    console.log("userId =", userId);
    console.log("userId type =", typeof userId);

    const actionMap = {
      view: () => userId && navigate(`${USERS_BASE_PATH}/viewUser/${userId}`),
      edit: () => userId && navigate(`${USERS_BASE_PATH}/editUser/${userId}`),
      adduser: () => navigate(`${USERS_BASE_PATH}/createUser`),
      quickadduser: () => navigate(`${USERS_BASE_PATH}/quickCreateUser`),
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

  const userSummaryView = (
    <Box className="outermost-container">
      <UserSummary
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
        onUserSummaryActionClick={onUserSummaryActionClick}
        app={"IWA"}
      />
    </Box>
  );

  return (
    <Routes>
      <Route index element={userSummaryView} />
      {iwaUsersRoutes.map((route) => (
        <Route
          key={route.id}
          path={route.path}
          element={<route.component />}
        />
      ))}
    </Routes>
  );
};

export default UserSummaryPage;

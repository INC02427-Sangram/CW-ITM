import { Routes, Route, useNavigate } from "react-router-dom";
import { GroupSummary } from "@cw/groupsummary";
import { Box } from "@mui/material";
import { iwaGroupsRoutes } from "../../../../config/adminConsole.routes.config";

const GROUPS_BASE_PATH = "/admin-console/iwa/groups";

const GroupSummaryPage = () => {
  const navigate = useNavigate();

  const selectedEnvironment = String(import.meta.env.VITE_APP_ENV || "");

  const onGroupSummaryActionClick = (action, groupId) => {
    const actionMap = {
      view: () =>
        groupId && navigate(`${GROUPS_BASE_PATH}/viewGroup/${groupId}`),
      edit: () =>
        groupId && navigate(`${GROUPS_BASE_PATH}/editGroup/${groupId}`),
      addgroup: () => navigate(`${GROUPS_BASE_PATH}/createGroup`),
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
  };

  const groupSummaryView = (
    <Box className="outermost-container">
      <GroupSummary
        onGroupSummaryActionClick={onGroupSummaryActionClick}
        app="IWA"
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </Box>
  );

  return (
    <Routes>
      <Route index element={groupSummaryView} />
      {iwaGroupsRoutes.map((route) => (
        <Route
          key={route.id}
          path={route.path}
          element={<route.component />}
        />
      ))}
    </Routes>
  );
};

export default GroupSummaryPage;

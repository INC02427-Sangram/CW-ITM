import { Box } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import { RoleSummary } from "@cw/rolesummary";
import { iwaRolesRoutes } from "../../../../config/adminConsole.routes.config";

const ROLES_BASE_PATH = "/admin-console/iwa/roles";

const RoleSummaryPage = () => {
  const navigate = useNavigate();

  const selectedEnvironment = String(import.meta.env.VITE_APP_ENV || "");

  const isVisible = {
    isCreateRoleVisible: true,
    isCopyCreateWithReferenceVisible: true,
    isDeleteVisible: true,
    isInActiveAndActiveVisible: true,
    isExportVisible: true,
    isSimpleRoleVisible: true,
    isModuleFeatureRoleVisible: true,
  };

  const onRoleSummaryActionClick = (action, data) => {
    if (action === "createRole") {
      navigate(`${ROLES_BASE_PATH}/createRole`);
      return;
    }

    if (
      (action === "viewRole" || action === "editRole") &&
      data?.roleId &&
      data?.roleVersionNo &&
      data?.roleSegment
    ) {
      navigate(
        `${ROLES_BASE_PATH}/${action}/${data.roleId}/${data.roleVersionNo}/${data.roleSegment}`,
        { state: { status: data?.status } },
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
  };

  const roleSummaryView = (
    <Box className="outermost-container">
      <RoleSummary
        isVisible={isVisible}
        onRoleSummaryActionClick={onRoleSummaryActionClick}
        app="IWA"
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </Box>
  );

  return (
    <Routes>
      <Route index element={roleSummaryView} />
      {iwaRolesRoutes.map((route) => (
        <Route
          key={route.id}
          path={route.path}
          element={<route.component />}
        />
      ))}
    </Routes>
  );
};

export default RoleSummaryPage;

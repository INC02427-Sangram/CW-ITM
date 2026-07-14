import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import SalesOrder from "../Sales Order/SalesOrder";
import Dashboard from "../Dashboard/Dashboard";
import AdminConsole from "../Admin Console/AdminConsole";
import applicationConfig from "../../dataStore/applicationConfig";
import DetailsScreen from "../Sales Order/DetailsScreen";
import ExceptionMatchView from "../Sales Order/Exception Match/ExceptionMatchView";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { setCurrentModule } from "../../redux/reducers/appReducer";
import { getModuleNameFromPathName } from "../../utility/utilityFunctions";
import { Typography, Box } from "@mui/material";
//Added ProtectedRoute component to handle authorization based on module access
const Unauthorized = () => (
  <Box sx={{ textAlign: "center", mt: "15%", px: 2 }}>
    <Typography variant="h4" fontWeight={700} gutterBottom>
      Unauthorized
    </Typography>
    <Typography variant="body1" color="text.secondary">
      You do not have access to this module. Please contact your administrator.
    </Typography>
  </Box>
);


//Added ProtectedRoute component to handle authorization based on module access
const ProtectedRoute = ({ moduleKey, children }) => {
  const moduleAccess = useSelector((state) => state.appReducer.moduleAccess);
  // For admin console, check if any admin sub-module is accessible
  if (moduleKey === "adminConsole") {
    const adminKeys = [
      "Config Cockpit", "User Management", "System Config", "Business Rules",
      "Notification Config", "Manual Review Config", "Order Block Config",
      "Receiver Email Config", "Feature Config", "Workspace", "Workflow Builder",
      "DMS Clean Up", "Sync Up", "Active Material Config", "Customer Data Config"
    ];const hasAdminAccess = adminKeys.some((key) => moduleAccess[key] === true);
    if (!hasAdminAccess) return <Unauthorized />;
    return children;
  }
  if (moduleAccess[moduleKey] !== true) return <Unauthorized />;
  return children;
};

const MainContainer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const moduleName = getModuleNameFromPathName(location?.pathname);

  const currentModule = useSelector((state) => state.appReducer.currentModule);
  if (!currentModule) {
    dispatch(setCurrentModule(moduleName));
  }
  const currentModuleMetaData = applicationConfig(t)?.modules.filter(
    (item) => item.moduleName === currentModule
  );
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/salesOrder" />} />
        <Route
          exact
          path="/dashboard"
          element={<ProtectedRoute moduleKey="Dashboard"><Dashboard metaData={currentModuleMetaData?.at(0)} /></ProtectedRoute>}
        />
        <Route
          exact
          path="/salesOrder"
          element={<ProtectedRoute moduleKey="Sales Order"><SalesOrder metaData={currentModuleMetaData?.at(0)} /></ProtectedRoute>}
        />
        <Route
          exact
          path="/salesOrder/:orderHeaderId"
          element={<ProtectedRoute moduleKey="Sales Order"><DetailsScreen /></ProtectedRoute>}
        />
        <Route
          path="/salesOrderExceptionMatch/:orderHeaderId"
          element={<ProtectedRoute moduleKey="Sales Order"><ExceptionMatchView /></ProtectedRoute>}
        />
        <Route
          path="/adminConsole/*"
          element={<ProtectedRoute moduleKey="adminConsole"><AdminConsole metaData={currentModuleMetaData?.at(0)} /></ProtectedRoute>}
        />
      </Routes>
    </>
  );
};

export default MainContainer;
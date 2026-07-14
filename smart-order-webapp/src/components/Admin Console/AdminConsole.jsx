import Header from "./Header";
import "./Style.css";
import React,{ useEffect, useState, useMemo } from "react";
import { setFilterOptions } from "../../redux/reducers/appReducer";
import ManualReview from "./ManualReview/ManualReview";
import { useTranslation } from "react-i18next";
import BusyIndicator from "../../utility/BusyIndicator";
import { useDispatch, useSelector } from "react-redux";
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import { setCurrentPayload } from "../../redux/reducers/appReducer";
import { setMessageToastForAdminConsole } from "../../redux/reducers/appReducer";
import NotificationConfig from "./NotificationConfig";
import OrderBlock from "./OrderBlock/OrderBlock";
import ReceiverEmail from "./ReceiverEmail/ReceiverEmail";
import SystemConfig from "./SystemConfig/SystemConfig";
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import ConfigUpload from "./ConfigUpload";
import { useTheme } from "@mui/material/styles";
import DmsCleanup from "./DMS Cleanup/DmsCleanup";
import HanaSyncUp from "./HanaSyncUp";
import AddMaterialConfig from "./AddMaterialConfig";
import CustomerDataConfig from "./CustomerDataConfig";

import CreateGroupContainer from "./IWA/Groups/CreateGroupContainer";
import GroupSummaryContainer from "./IWA/Groups/GroupSummary";
import EditGroupContainer from "./IWA/Groups/EditGroup";
import ViewGroupContainer from "./IWA/Groups/ViewGroup";

import ApplicationSummaryContainer from "./IWA/ApplicationMaster/ApplicationSummary";
import CreateApplicationContainer from "./IWA/ApplicationMaster/CreateApplication";
import EditApplicationContainer from "./IWA/ApplicationMaster/EditApplication";
import ViewApplicationContainer from "./IWA/ApplicationMaster/ViewApplication";

import CreateRoleContainer from "./IWA/Roles/CreateRoleContainer";
import RoleSummaryContainer from "./IWA/Roles/RoleSummary";
import EditandViewRole from "./IWA/Roles/EditandViewRole";

import EditUserContainer from "./IWA/Users/EditUser";
import UserDetails from "./IWA/Users/ViewUser";
import QuickCreateUser from "./IWA/Users/QuickCreateUser";
import CreateUser from "./IWA/Users/CreateUser";
import UserSummaryContainer from "./IWA/Users/UserSummary";

import TextRulesComp from "./IDM/TextRulesComp";
import ModellingComp from "./IDM/ModellingComp";

import CustomWorkflowBuilder from "./CustomWorkflowBuilder";
import WorkspaceScreen from "../Workspace/Workspace";

import IDMAdminConsole from "./IDM/IDMAdminConsole";
import DragDropFeatureConfig from "./FeatureConfig/FeatureConfig";

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

  const hasAccess = moduleAccess?.[moduleKey];

  return hasAccess ? children : <Unauthorized />;
};

const withAccess = (moduleKey, element) => (
  <ProtectedRoute moduleKey={moduleKey}>
    {element}
  </ProtectedRoute>
);

const AdminConsole = (metaData) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const busyIndicatorForAdminConsole = useSelector(
    (state) => state.appReducer.busyIndicatorForAdminConsole
  );

  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
const theme = useTheme();
  const salesOrgObject = useSelector(
    (state) => state.appReducer.salesOrgObject
  );

   const moduleAccess = useSelector((state) => state.appReducer.moduleAccess);
 
  // Ordered list of admin tabs matching SubSideNav order
  const adminTabOrder = useMemo(() => [
    { label: "Receiver Email Config", path: "receiver-email" },
    { label: "Manual Review Config", path: "manual-review" },
    { label: "DMS Clean Up", path: "dms-cleanup" },
    { label: "Sync Up", path: "hana-sync-up" },
    { label: "Active Material Config", path: "addMaterialConfig" },
    { label: "Customer Data Config", path: "customer-data-config" },
    { label: "Notification Config", path: "notification-config" },
    { label: "Order Block Config", path: "order-block" },
    { label: "System Config", path: "system-config" },
    { label: "Feature Config", path: "feature-config" },
    { label: "Business Rules", path: "text-rules" },
    { label: "Workspace", path: "workspace" }, 
    { label: "Workflow Builder", path: "workflow-builder" }, 
    { label: "User Management", path: "users" },
  ], []);
 
  const firstAccessibleTab = useMemo(() => {
    const tab = adminTabOrder.find((t) => moduleAccess[t.label] === true);
    return tab ? tab.path : "receiver-email";
  }, [moduleAccess, adminTabOrder]);

  const messageToastForAdminConsole = useSelector(
    (state) => state.appReducer.messageToastForAdminConsole
  );
  const [anchorPosition, setAnchorPosition] = useState({
    vertical: "bottom",
    horizontal: "center",
  });
  const [open, setOpen] = useState(false);
  const [isInValidInput, setIsInvalidInput] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(
        setMessageToastForAdminConsole({
          visiblity: false,
          message: null,
        })
      );
    };
  }, []);

  // Function to get page title and description based on current route
  const getPageInfo = () => {
    const pathname = location.pathname;
    const pageInfo = {
      '/adminConsole/receiver-email': {
        title: t("Receiver Email Configurations"),
        description: t("Manage Email Configurations.")
      },
      '/adminConsole/manual-review': {
        title: t("Manual Review Configurations"),
        description: t("Manage Manual review and Email Scheduler.")
      },
      '/adminConsole/dms-cleanup': {
        title: t("DMS Clean Up"),
        description: t("Manage DMS.")
      },
      '/adminConsole/addMaterialConfig': {
        title: t("Add Active Material Configurations"),
        description: t("Manage Add Material operations.")
      },
      '/adminConsole/hana-sync-up': {
        title: t("Sync Up"),
        description: t("Manage S4/Hana synchronization operations.")
      },
       '/adminConsole/customer-data-config': {
        title: t("Customer Data Configuration"),
        description: t("Manage Customer data related configurations.")
      },
      '/adminConsole/notification-config': {
        title: t("Notification Configurations"),
        description: t("Set up notification preferences for Sales Order Creation.")
      },
      '/adminConsole/order-block': {
        title: t("Order Block Configurations"),
        description: t("Manage your order processing blocks with Priorities and Descriptions")
      },
      '/adminConsole/text-rules': {
        title: t("Text Rules Configurations"),
        description: t("Configure and manage text-based business rules.")
      },
      '/adminConsole/modelling': {
        title: t("Modelling Configurations"),
        description: t("Set up and configure modeling parameters.")
      },
      '/adminConsole/idm-admin-console': {
        title: t("IDM Admin Console"),
        description: t("Manage IDM related configurations and settings.")
      },
      '/adminConsole/system-config': {
        title: t("System Configurations"),
        description: t("Set up system preferences.")
      },
      '/adminConsole/feature-config': {
        title: t("Feature Configurations"),
        description: t("Set up feature preferences.")
      },
      '/adminConsole/workflow-builder': {
        title: t("Workflow Builder"),
        description: t("Manage and configure custom workflows.")
      },
    };
    return pageInfo[pathname] || { title: "", description: "" };
  };

  const currentPageInfo = getPageInfo();

  return (
    <>
      {isInValidInput && (
        <CustomMessageToast
          open={isInValidInput}
          setOpen={setIsInvalidInput}
          messageType={"warning"}
          messageDescription={"Please Enter a valid Input"}
          anchorPosition={anchorPosition}
        />
      )}
      {messageToastForAdminConsole.visiblity && (
        <CustomMessageToast
          open={messageToastForAdminConsole.visiblity}
          setOpen={setOpen}
          messageType={messageToastForAdminConsole.type}
          messageDescription={messageToastForAdminConsole?.message}
          anchorPosition={anchorPosition}
        />
      )}

      {busyIndicatorForAdminConsole && <BusyIndicator />}

      <div>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "left",
            padding: "20px",
            fontFamily: "'Roboto', sans-serif",
            marginBottom: "4px",
          }}
        >
          {currentPageInfo.title}
        </Typography>

        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "200",
            color: theme.palette.text.secondary,
            textAlign: "left",
            padding: "0px 10px 0px 21px",
            fontFamily: "'Roboto', sans-serif",
            display: "block",
            marginTop: "-30px",
          }}
        >
          {currentPageInfo.description}
        </Typography>
      </div>

      <div className="admin-console-content">
        <Routes>
          <Route
            path="receiver-email"
            element={
              <ProtectedRoute moduleKey="Receiver Email Config">
                <ReceiverEmail
                  isInValidInput={isInValidInput}
                  setIsInvalidInput={setIsInvalidInput}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="manual-review"
            element={
              <ProtectedRoute moduleKey="Manual Review Config">
                <ManualReview
                  isInValidInput={isInValidInput}
                  setIsInvalidInput={setIsInvalidInput}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="dms-cleanup"
            element={
              <ProtectedRoute moduleKey="DMS Clean Up">
                <DmsCleanup
                  isInValidInput={isInValidInput}
                  setIsInvalidInput={setIsInvalidInput}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="hana-sync-up"
            element={
              <ProtectedRoute moduleKey="Sync Up">
                <HanaSyncUp />
              </ProtectedRoute>
            }
          />
          <Route
            path="addMaterialConfig"
            element={
              <ProtectedRoute moduleKey="Active Material Config">
                <AddMaterialConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="customer-data-config"
            element={
              <ProtectedRoute moduleKey="Customer Data Config">
                <CustomerDataConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="notification-config"
            element={
              <ProtectedRoute moduleKey="Notification Config">
                <NotificationConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="order-block"
            element={
              <ProtectedRoute moduleKey="Order Block Config">
                <OrderBlock />
              </ProtectedRoute>
            }
          />
          <Route
            path="text-rules"
            element={withAccess("Business Rules", <TextRulesComp />)}
          />
          <Route
            path="modelling"
            element={withAccess("Business Rules", <ModellingComp />)}
          />
          <Route
            path="idm-admin-console"
            element={withAccess("Business Rules", <IDMAdminConsole />)}
          />

          <Route
            path="system-config"
            element={
              <ProtectedRoute moduleKey="System Config">
                <SystemConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="feature-config"
            element={
              <ProtectedRoute moduleKey="Feature Config">
                <DragDropFeatureConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="workspace"
            element={
              <ProtectedRoute moduleKey="Workspace">
                <WorkspaceScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="workflow-builder"
            element={withAccess("Workflow Builder", <CustomWorkflowBuilder />)}
          />
          <Route
            path="users"
            element={withAccess("User Management", <UserSummaryContainer />)}
          />
          <Route
            path="roles"
            element={withAccess("User Management", <RoleSummaryContainer />)}
          />
          <Route
            path="groups"
            element={withAccess("User Management", <GroupSummaryContainer />)}
          />
          <Route
            path="groups/createGroup"
            element={withAccess("User Management", <CreateGroupContainer />)}
          />
          <Route
            path="groups/editGroup/:groupId"
            element={withAccess("User Management", <EditGroupContainer />)}
          />
          <Route
            path="groups/viewGroup/:groupId"
            element={withAccess("User Management", <ViewGroupContainer />)}
          />
          <Route
            path="applicationMaster"
            element={withAccess("User Management", <ApplicationSummaryContainer />)}
          />
          <Route
            path="applicationMaster/createApplication"
            element={withAccess("User Management", <CreateApplicationContainer />)}
          />
          <Route
            path="applicationMaster/editApplication/:applicationId"
            element={withAccess("User Management", <EditApplicationContainer />)}
          />
          <Route
            path="applicationMaster/viewApplication/:applicationId"
            element={withAccess("User Management", <ViewApplicationContainer />)}
          />
          <Route
            path="roles/createRole"
            element={withAccess("User Management", <CreateRoleContainer />)}
          />
          <Route
            path="roles/viewRole/:roleId/:roleVersionNo/:roleSegment"
            element={withAccess("User Management", <EditandViewRole />)}
          />
          <Route
            path="roles/editRole/:roleId/:roleVersionNo/:roleSegment"
            element={withAccess("User Management", <EditandViewRole />)}
          />
          <Route
            path="users/quickAddUser"
            element={withAccess("User Management", <QuickCreateUser />)}
          />
          <Route
            path="users/adduser"
            element={withAccess("User Management", <CreateUser />)}
          />
          <Route
            path="users/view/:userId"
            element={withAccess("User Management", <UserDetails />)}
          />
          <Route
            path="users/edit/:userId"
            element={withAccess("User Management", <EditUserContainer />)}
          />

          {/* Default route - redirect to receiver-email or show a dashboard */}
          <Route
            path=""
            element={<Navigate to={firstAccessibleTab} replace />}
          />
        </Routes>
      </div>
    </>
  );
};

export default AdminConsole;
import React, { useMemo,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../node_modules/@cw/cherrywork-iwm-workspace/dist/shared/styles.css";
import { Box, Typography } from "@mui/material";
import Workspace from "@cw/cherrywork-iwm-workspace/Workspace";
import configData from "./ConfigData";
import { useSelector, useDispatch } from "react-redux";
import {
  setMessagePopoverStatus,
  setMessagePopoverVisibility,
  setWorkflowTaskDetails
} from "../../redux/reducers/appReducer";
import CustomMessagePopover from "../../utility/Custom Components/CustomMessagePopover";
import { checkIsCSR } from "../../dataStore/userRoles";

const WorkspaceScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const queryParams = new URLSearchParams(location.search);
  const currentType = queryParams.get("type") || "MY_TASKS";

  const messageStatus = useSelector(
    (state) => state.appReducer.messagePopoverStatus
  );

  const isMessageVisible = useSelector(
    (state) => state.appReducer.messagePopoverVisibility
  );

  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const userRole = userDetails?.roles || [];
  const isCSR = checkIsCSR(userRole);
  const userList = useSelector((state) => state.appReducer.userList);
  const groupList = useSelector((state) => state.appReducer.groupList);
  const accessToken = userDetails?.token || "";

  useEffect(() => {
    if (
      isCSR &&
      (currentType === "ADMIN_TASKS" ||
        currentType === "ADMIN_COMPLETED_TASKS")
    ) {
      navigate("/adminConsole/workspace?type=MY_TASKS", { replace: true });
    }
  }, [isCSR, currentType, navigate]);

  const userData = {
    user_id: userDetails?.emailId || userDetails?.email,
    firstName: userDetails?.firstName,
    lastName: userDetails?.lastName,
    emailId: userDetails?.emailId || userDetails?.email,
    displayName: `${userDetails?.firstName || ""} ${userDetails?.lastName || ""}`,
  };

  const workspaceConfig = useMemo(() => {
    switch (currentType) {
      case "MY_TASKS":
        return {
          key: "MY_TASKS",
          label: "Open Tasks",
          apiDriven: false,
          subInboxTypeKey: ""
        };
      case "MY_COMPLETED_TASKS":
        return {
          key: "MY_COMPLETED_TASKS",
          label: "Completed Tasks",
          apiDriven: false,
          subInboxTypeKey: ""
        };
      case "ADMIN_TASKS":
        return {
          key: "ADMIN_TASKS",
          label: "Admin Tasks",
          apiDriven: true,
          subInboxTypeKey: ""
        };
      case "ADMIN_COMPLETED_TASKS":
        return {
          key: "ADMIN_COMPLETED_TASKS",
          label: "Admin Completed Tasks",
          apiDriven: true,
          subInboxTypeKey: "COMPLETED"
        };
      default:
        return {
          key: "MY_TASKS",
          label: "Open Tasks",
          apiDriven: false,
          subInboxTypeKey: ""
        };
    }
  }, [currentType]);

  const destinationData = {
    CRUD_API_ENV: "itm",
    DB_TYPE: "hana",
    SERVICE_BASE_URL: [
      {
        Description: "",
        Name: "ITMJavaServices",
        URL: "https://cherryworkproducts-itm-java-dev.cfapps.eu10-004.hana.ondemand.com",
      },
      {
        Description: "",
        Name: "WorkNetServices",
        URL: "https://cherryworkproducts-worknet-dev.cfapps.eu10-004.hana.ondemand.com",
      },
      {
        Description: "",
        Name: "CrudApiServices",
        URL: "https://cw-caf-crudapi-dev.cfapps.eu10-004.hana.ondemand.com",
      },
    ],
  };

  const onTaskClick = (task) => {
    console.log("task clicked", task);

    const inboxType = workspaceConfig.key; // MY_TASKS / ADMIN_TASKS

    const ownerId = JSON.parse(task?.owners || "[]")?.[0]?.ownerId?.toLowerCase();

    // ------------------ CSR Shortcut ------------------
    if (isCSR && task?.ATTRIBUTE_1) {
      navigate(`/salesOrder/${task.ATTRIBUTE_1}`);
      return;
    }

    // ================== MY TASKS ==================
    if (inboxType === "MY_TASKS") {

      if (task?.taskNature === "Single-User") {
        navigate(`/salesOrder/${task?.ATTRIBUTE_1}`);
      }

      else if (task?.taskNature === "Group" && task?.itmStatus === "Open") {
        dispatch(setMessagePopoverStatus({
          status: "Info",
          message: "Kindly Claim The Task To Proceed",
        }));
        dispatch(setMessagePopoverVisibility(true));
      }

      else {
        navigate(`/salesOrder/${task?.ATTRIBUTE_1}`);
      }
    }

    // ================== ADMIN TASKS ==================
    else if (inboxType === "ADMIN_TASKS") {

      if (task?.taskNature === "Single-User") {
        dispatch(setMessagePopoverStatus({
          status: "Info",
          message: "Kindly Claim The Task To Proceed",
        }));
        dispatch(setMessagePopoverVisibility(true));
      }

      else if (task?.taskNature === "Group" && task?.itmStatus === "Open") {
        dispatch(setMessagePopoverStatus({
          status: "Info",
          message: "Kindly Claim The Task To Proceed",
        }));
        dispatch(setMessagePopoverVisibility(true));
      }

      else if (
        task?.taskNature === "Group" &&
        task?.itmStatus === "In Progress" &&
        userData?.emailId?.toLowerCase() === ownerId
      ) {
        navigate(`/salesOrder/${task?.ATTRIBUTE_1}`);
      }

      else {
        dispatch(setMessagePopoverStatus({
          status: "Warning",
          message: "This task has been already claimed",
        }));
        dispatch(setMessagePopoverVisibility(true));
      }
    }

    // ================== OTHER ==================
    else {
      dispatch(setMessagePopoverStatus({
        status: "Info",
        message: "This task is not actionable",
      }));
      dispatch(setMessagePopoverVisibility(true));
    }
  };

  const onTaskLinkClick = () => {
    console.log("task line clicked");
  }

  const onActionComplete = () => {
    console.log("onActionComplete triggered");
  };

  const fetchFilterViewList = () => {
    console.log("fetchFilterViewList triggered");
  };

  const clearFilterView = () => {
    console.log("clearFilterView triggered");
  };

  const handleCustomActionApis = () => {
    console.log("handleCustomActionApis triggered");
  };

  const handleTaskActionRedirect = () => {
    console.log("handleTaskActionRedirect triggered");
  };

  const userPermissions = {
    APPLICATION_PERMISSIONS: ["INBOX"],
    PERMISSIONS: {
      MY_TASKS: ["ASSIGNED_TO_ME_TASKS", "SUBSTITUTED_FOR_ME_TASKS"],
      INBOX: ["CREATED_TASKS", "MY_TASKS", "SUBSTITUTION_TASKS"],
    },
  };

  const userPreferences = {
    ColumnPreferences: {
      DEFAULT: {
        columns: [
          {
            shouldRedirect: false,
            isSortable: false,
            label: "",
            sortingParams: [],
            enabled: true,
            accessorKey: "selection_pinning",
          },
          {
            shouldRedirect: false,
            isSortable: false,
            label: "Task Name",
            sortingParams: ["referenceId", "taskDesc"],
            enabled: true,
            accessorKey: "taskName",
          },
          {
            shouldRedirect: false,
            isSortable: false,
            label: "Created By",
            sortingParams: ["referenceId", "taskDesc"],
            enabled: true,
            accessorKey: "createdBy",
          },
          {
            shouldRedirect: false,
            isSortable: false,
            label: "Process ID",
            sortingParams: ["itmProcessId"],
            enabled: false,
            accessorKey: "itmProcessId",
          },
          {
            shouldRedirect: false,
            isSortable: true,
            label: "System & Process",
            sortingParams: ["processDisplayName"],
            enabled: true,
            accessorKey: "system_process",
          },
          {
            shouldRedirect: false,
            isSortable: true,
            label: "Process Description",
            sortingParams: ["processDesc"],
            enabled: false,
            accessorKey: "processDesc",
          },
          {
            shouldRedirect: false,
            isSortable: true,
            label: "Created On",
            sortingParams: ["createdOn"],
            enabled: true,
            accessorKey: "createdOn",
          },
          {
            shouldRedirect: false,
            isSortable: true,
            label: "Assigned To",
            sortingParams: ["owners"],
            enabled: false,
            accessorKey: "owners",
          },
          {
            shouldRedirect: false,
            isSortable: true,
            label: "Due Date",
            sortingParams: ["compDeadline"],
            enabled: true,
            accessorKey: "dueDate",
          },
          {
            shouldRedirect: false,
            isSortable: true,
            label: "Status",
            sortingParams: ["itmStatus", "technicalStatus"],
            enabled: true,
            accessorKey: "status",
          },
          {
            shouldRedirect: false,
            isSortable: false,
            label: "Actions",
            sortingParams: [],
            enabled: true,
            accessorKey: "actions",
          },
        ],
      },
    },

  };



  const selectedFilterView = () => {
    console.log("selectedFilterView triggered");
  };

  const filterViewList = () => {
    console.log("filterViewList triggered");
  };

  const externalSystemsList = () => {
    console.log("externalSystemsList triggered");
  };

  const forwardTaskData = {};
  const languageTranslationData = {};

  const isLocalEnv = import.meta.env.VITE_IS_LOCAL === "true";

  return (
    <Box sx={{ padding: 1, height: "calc(100vh - 64px)", overflow: "auto", backgroundColor: "#FFFFFF" }}>
      <Workspace
        // customTheme={customTheme}
        token={accessToken}
        configData={configData}
        destinationData={destinationData}
        userData={userData}
        userPermissions={userPermissions}
        userPreferences={userPreferences}
        userList={userList}
        groupList={groupList}
        userListBySystem={{}}
        useWorkAccess={isLocalEnv}//true for local,false for destination data
        useConfigServerDestination={isLocalEnv}//true for local,false for destination data           
        inboxTypeKey={workspaceConfig.key}
        workspaceLabel={workspaceConfig.label}
        workspaceFiltersByAPIDriven={workspaceConfig.apiDriven}//false for my tasks and for admin tassks it will be true
        subInboxTypeKey={workspaceConfig.subInboxTypeKey}//to identify the completed tasks in admin completed tasks
        onTaskClick={onTaskClick}//fn handler
        onTaskLinkClick={onTaskLinkClick}
        onActionComplete={onActionComplete}
        selectedFilterView={selectedFilterView}
        isFilterView={selectedFilterView?.filterData?.length > 0 ? true : false}
        fetchFilterViewList={fetchFilterViewList}
        savedFilterViewData={selectedFilterView?.filterData}
        clearFilterView={clearFilterView}
        filterViewList={filterViewList}
        selectedTabId={null}
        externalSystems={externalSystemsList ?? []}
        handleCustomActionApis={handleCustomActionApis}
        handleTaskActionRedirect={handleTaskActionRedirect}
        forwardTaskData={forwardTaskData}
        languageTranslationData={languageTranslationData}
        isProcessAdmin={true}
        displayOwnersColumn={false}
        cachingBaseUrl={"https://cherryworkproducts-itm-java-dev.cfapps.eu10-004.hana.ondemand.com"}
      />
      {isMessageVisible && (
        <CustomMessagePopover popOverMessageObj={messageStatus} />
      )}
    </Box>
  );
};

export default WorkspaceScreen;
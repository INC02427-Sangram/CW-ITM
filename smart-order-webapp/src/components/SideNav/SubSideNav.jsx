import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import "./SubSideNav.css";
import {
  Mail,
  PauseNotification,
  CircleOff,
  ScrollText,
  Hierarchy,
  MessageSquareText,
  Matching,
  UpArrow,
  Dropdown,
  Profile,
  Workspace,
  UserSetting,
  RefreshCircle,
  Setting,
  Trash,
  Admin,
  Upload,
} from "@cw/rds/icons";
import { WorkspacesOutlined } from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useUserAccess } from "../../utility/useUserAccess";
import {checkIsCSR} from "../../dataStore/userRoles";

const SubSideNav = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});
  const moduleAccess = useSelector((s) => s.appReducer.moduleAccess);
  const { userRoles, isAdmin } = useUserAccess();
  const isCSR = checkIsCSR(userRoles); 
  const currentModule = useSelector((s) => s.appReducer.currentModule);
  const adminTabs = [
    {
      id: "receiver-email",
      label: "Receiver Email Config",
      icon: <Mail />,
      path: "/adminConsole/receiver-email"
    },
    {
      id: "manual-review",
      label: "Manual Review Config",
      icon: <MessageSquareText />,
      path: "/adminConsole/manual-review"
    },
    {
      id: "dms-cleanup",
      label: "DMS Clean Up",
      icon: <Trash />,
      path: "/adminConsole/dms-cleanup"
    },
    {
      id: "hana-sync-up",
      label: "Sync Up",
      icon: <RefreshCircle />,
      path: "/adminConsole/hana-sync-up"
    },
    { 
      id: "notification-config", 
      label: "Notification Config", 
      icon: <PauseNotification />,
      path: "/adminConsole/notification-config"
    },
    {
      id: "order-block",
      label: "Order Block Config",
      icon: <CircleOff />,
      path: "/adminConsole/order-block"
    },
    {
      id: "business-rules",
      label: "Business Rules",
      icon: <Matching />,
      isDropdown: true,
      children: [
        {
          id: "text-rules",
          label: "Text Rules",
          icon: <ScrollText />,
          path: "/adminConsole/text-rules"
        },
        {
          id: "modelling",
          label: "Modelling",
          icon: <Hierarchy />,
          path: "/adminConsole/modelling"
        },
        {
          id: "idm-admin-console",
          label: "IDM Admin Console",
          icon: <Admin />,
          path: "/adminConsole/idm-admin-console"
        },
      ],
    },
    {
      id: "system-config",
      label: "System Config",
      icon: <Setting />,
      path: "/adminConsole/system-config"
    },
    {
      id: "feature-config",
      label: "Feature Config",
      icon: <Setting />,
      path: "/adminConsole/feature-config"
    },
    {
      id: "workspace",
      label: "Workspace",
      icon: <WorkspacesOutlined />,
      isDropdown: true,
      children: [
        {
          id: "MY_TASKS",
          label: "Open Tasks",
          path: "/adminConsole/workspace?type=MY_TASKS"
        },
        {
          id: "MY_COMPLETED_TASKS",
          label: "Completed Tasks",
          path: "/adminConsole/workspace?type=MY_COMPLETED_TASKS"
        },
        {
          id: "ADMIN_TASKS",
          label: "Admin Tasks",
          path: "/adminConsole/workspace?type=ADMIN_TASKS"
        },
        {
          id: "ADMIN_COMPLETED_TASKS",
          label: "Admin Completed Tasks",
          path: "/adminConsole/workspace?type=ADMIN_COMPLETED_TASKS"
        },
      ],
    },
    {
      id: "workflow-builder",
      label: "Workflow Builder",
      icon: <Hierarchy />, 
      path: "/adminConsole/workflow-builder"
    },
    {
      id: "user-management",
      label: "User Management",
      icon: <UserSetting />,
      isDropdown: true,
      children: [
        {
          id: "users",
          label: "Users",
          icon: <Profile />,
          path: "/adminConsole/users"
        },
        {
          id: "roles",
          label: "Roles",
          icon: <Workspace />,
          path: "/adminConsole/roles"
        },
        {
        id: "groups",
        label: "Groups",
        icon: <WorkspacesOutlined />, // Using the already imported icon
        path: "/adminConsole/groups"
      },
        {
          id: "applicationMaster",
          label: "Application Master",
          icon: <Admin />,
          path: "/adminConsole/applicationMaster"
        },
      ],
    },
  ];

  // Filter tabs based on moduleAccess flags
  const filteredAdminTabs = useMemo(() => {
    const allow = (label) => moduleAccess[label] === true;

    const base = adminTabs
      .filter((tab) => {
        if (tab.isDropdown) {
          // Show dropdown only if its parent label is allowed
          return allow(tab.label);
        }
        return allow(tab.label);
      })
      .map((tab) => {
        if (!tab.isDropdown) return tab;
        // Parent allowed: ignore child flags, keep all original children

        if (tab.id === "workspace") {
          const filteredChildren = (tab.children || []).filter((child) => {
            if (
              child.id === "ADMIN_TASKS" ||
              child.id === "ADMIN_COMPLETED_TASKS"
            ) {
              return !isCSR;
            }
            return true;
          });
  
          return { ...tab, children: filteredChildren };
        }

        return { ...tab, children: tab.children || [] };
      });
    return base;
  }, [adminTabs, moduleAccess, userRoles]);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Close the side nav after navigation
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || (location.pathname + location.search) === path;
  };

  const isDropdownActive = (children) => {
    return children.some((child) => isActiveRoute(child.path));
  };
  
  const isNeutralHeader = (id) =>
    id === "business-rules" || id === "user-management";
  return (
    <>
      {/* overlay + single sidenav with header + options */}
      <div
        className={`content-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
        style={{
          zIndex: "20",
        }}
      ></div>

      <Box
        className={`sub-side-nav ${isOpen ? "open" : ""}`}
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          zIndex: "20",
        }}
      >
        {/* Header */}
        <div
          className="sub-nav-header"
          style={{
            // display: "flex",
            // flexDirection: "rows",
            alignItems: "center",
            // gap: 6,
            // padding: "4px 12px 12px",
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <div
            className="sub-nav-header-icon"
            style={{
              width: 30,
              height: 20,
              display: "grid",
              placeItems: "center",
              marginLeft: "-100px",
              background: theme.palette.background.default,
            }}
          >
            <Admin />
          </div>
          <div
            className="sub-nav-header-title"
            style={{ fontWeight: 800, fontFamily: "'Roboto', sans-serif", fontWeight: "bold", fontSize: 12, color: theme.palette.text.primary }}
          >
            {t("Config Cockpit")}
          </div>
        </div>

        {/* Options */}
        <div className="sub-nav-options">
          {filteredAdminTabs.map((tab) => {
            
            // Logic for styling
            const isActive = tab.isDropdown 
              ? isDropdownActive(tab.children) 
              : isActiveRoute(tab.path);
            
            const isNeutral = tab.isDropdown ? isNeutralHeader(tab.id) : false;

            return (
              <React.Fragment key={tab.id}>
                {!tab.isDropdown ? (
                  <Box
                    className={`sub-nav-option ${isActive ? "active" : ""}`}
                    onClick={() => handleNavigation(tab.path)}
                    sx={{
                      // Dynamic styles from theme
                      backgroundColor: isActive
                        ? theme.palette.background.rowclicked
                        : "transparent",
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      paddingLeft: "4px",
                      cursor: "pointer",
                      fontWeight: isActive ? 700 : 400,
                      // Hover state
                      "&:hover": {
                        backgroundColor: isActive
                          ? theme.palette.background.rowclicked
                          : theme.palette.action.hover,
                      },
                    }}
                  >
                    <div style={{ width: 8 }} />
                    <div className="sub-nav-label">{t(tab.label)}</div>
                  </Box>
                ) : (
                  <>
                    <Box
                      className={`sub-nav-option dropdown-header ${
                        isActive ? "active" : ""
                      } ${isNeutral ? "neutral" : ""} ${
                        openDropdowns[tab.id] ? "open" : ""
                      }`}
                      onClick={(e) => toggleDropdown(tab.id, e)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        paddingLeft: "0px",
                        cursor: "pointer",
                        // Dynamic styles from theme
                        backgroundColor: isActive
                          ? theme.palette.background.rowclicked
                          : "transparent",
                        // Special logic for "neutral" active items
                        color: (isActive && !isNeutral)
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                        fontWeight: (isActive && !isNeutral) ? 700 : 400,
                        // Hover state
                        "&:hover": {
                          backgroundColor: isActive
                            ? theme.palette.background.rowclicked
                            : theme.palette.action.hover,
                        },
                      }}
                    >
                      <div className="dropdown-arrow" style={{ width: 8 }}>
                        {openDropdowns[tab.id] ? <UpArrow size="small" /> : <Dropdown size="small" />}
                      </div>
                      <div className="sub-nav-label">{t(tab.label)}</div>
                    </Box>

                    {/* Dropdown Children */}
                    {openDropdowns[tab.id] && (
                      <div className="dropdown-content">
                        {tab.children.map((child) => {
                          const isChildActive = isActiveRoute(child.path);
                          return (
                            <Box
                              key={child.id}
                              className={`sub-nav-option sub-option ${
                                isChildActive ? "active" : ""
                              }`}
                              onClick={() => handleNavigation(child.path)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px 8px 16px", // Indent
                                cursor: "pointer",
                                // Dynamic styles from theme
                                backgroundColor: isChildActive
                                  ? theme.palette.background.rowclicked
                                  : "transparent",
                                color: isChildActive
                                  ? theme.palette.primary.main
                                  : theme.palette.text.primary,
                                fontWeight: isChildActive ? 700 : 400,
                                // Hover state
                                "&:hover": {
                                  backgroundColor: isChildActive
                                    ? theme.palette.background.rowclicked
                                    : theme.palette.action.hover,
                                },
                              }}
                            >
                              <div className="sub-nav-label">
                                {t(child.label)}
                              </div>
                            </Box>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Box>
    </>
  );
};

export default SubSideNav;
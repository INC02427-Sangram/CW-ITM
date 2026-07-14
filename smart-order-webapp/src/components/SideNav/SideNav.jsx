import { useEffect, useState } from "react";
import sideNavContents from "../../dataStore/sideNavData";
import "./SideNav.css";
import { sideNavModuleNames } from "../../dataStore/sideNavData";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { setCurrentModule } from "../../redux/reducers/appReducer";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { WorkspacesOutlined } from "@mui/icons-material";
import { getPathNameFromModuleName } from "../../utility/utilityFunctions";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SubSideNav from "./SubSideNav";
import { Setting, Dashboard, DocumentNew, Folder, Admin } from "@cw/rds/icons";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
const SideNav = () => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubNavOpen, setIsSubNavOpen] = useState(false);
  // State to track last active module before admin console
  const [previousModule, setPreviousModule] = useState("");
  // Current tab in Admin Console
  const [currentAdminTab, setCurrentAdminTab] = useState(0);

  let visibleOptions;
  let currentModule = useSelector((state) => state.appReducer.currentModule);
  const userRoles = useSelector((state) => state.appReducer.userRoles);
  const moduleAccess = useSelector((state) => state.appReducer.moduleAccess);

  visibleOptions = sideNavContents(t, userRoles, moduleAccess)
    .map((item, idx) => ({ ...item, __index: idx }))
    .filter((sideNav) => sideNav?.visiblity);

  useEffect(() => {
    if (currentModule !== t("adminConsole") && currentModule) {
      setPreviousModule(currentModule);
    }
  }, [currentModule, t]);

  // Check URL for tab parameter on component mount and when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam !== null) {
      const tabIndex = parseInt(tabParam, 10);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 5) {
        setCurrentAdminTab(tabIndex);
      }
    }
  }, [location]);

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/adminConsole")) {
      dispatch(setCurrentModule("Config Cockpit"));
      // setIsSubNavOpen(true);
    } else if (path.startsWith("/dashboard")) {
      dispatch(setCurrentModule("Dashboard"));
      setIsSubNavOpen(false);
    } else if (path.startsWith("/salesOrder")) {
      dispatch(setCurrentModule("Sales Order"));
      setIsSubNavOpen(false);
    } else if (path.startsWith("/documentManagement")) {
      dispatch(setCurrentModule("Document Management"));
      setIsSubNavOpen(false);
    }
  }, [location.pathname]);

  const renderIcon = (iconLabel, isSelected) => {
    const iconColor = isSelected
      ? theme.palette.primary.main
      : theme.palette.text.primary; // Change color dynamically

    switch (iconLabel) {
      case t("dashboard"):
        return (
          <Dashboard
            style={{ height: "1.5rem", width: "1.5rem", color: iconColor }}
          />
        );
      case t("salesOrder"):
        return (
          <BusinessCenterOutlinedIcon
            style={{ height: "1.5rem", width: "1.5rem", color: iconColor }}
          />
        );
      case t("documentManagement"):
        return (
          <Folder
            style={{ height: "1.5rem", width: "1.5rem", color: iconColor }}
          />
        );
      case t("adminConsole"):
        return (
          <Admin
            style={{ height: "1.5rem", width: "1.5rem", color: iconColor }}
          />
        );
      default:
        return <DescriptionOutlinedIcon style={{ color: iconColor }} />;
    }
  };

  const onSelectModule = (oEvent) => {
    const moduleId = Number(oEvent.currentTarget.id);
    const clickedModule = sideNavModuleNames[moduleId];

    // Handle Admin Console click
    if (
      clickedModule === "Config Cockpit" ||
      t("configCockpit") === clickedModule
    ) {
      // Always show sub navigation when Config Cockpit is clicked
      setIsSubNavOpen(true);
      dispatch(setCurrentModule(clickedModule));

      // // Store the current module to return to if needed
      if (!location.pathname.includes("/adminConsole")) {
        setPreviousModule(currentModule);
      }

      // // Navigate to admin console if not already there
      // if (!location.pathname.includes("/adminConsole")) {
      //   navigate("/adminConsole/receiver-email");
      // }
    } else if (clickedModule === t("adminConsole")) {
      // Always show sub navigation when Admin Console is clicked
      setIsSubNavOpen(true);
      dispatch(setCurrentModule(clickedModule));

      // Store the current module to return to if needed
      if (!location.pathname.includes("/adminConsole")) {
        setPreviousModule(currentModule);
      }

      // If we're already on an admin page, keep the current tab
      if (!location.pathname.includes("/adminConsole")) {
        navigate("/adminConsole/receiver-email");
      }
    } else {
      // For other modules, navigate normally but use fixed paths
      dispatch(setCurrentModule(clickedModule));

      // Use a mapping to ensure consistent paths regardless of language
      const pathMap = {
        Dashboard: "/dashboard",
        "Sales Order": "/salesOrder",
        "Document Management": "/documentManagement",
        // Add other modules as needed
      };

      // Get the English module name for consistent routing
      const englishModuleName = sideNavModuleNames[moduleId];
      navigate(
        pathMap[englishModuleName] ||
          `/${getPathNameFromModuleName(clickedModule)}`,
      );
      setIsSubNavOpen(false);
    }
  };

  // Handle sub nav tab selection
  const handleTabSelect = (tabId) => {
    setCurrentAdminTab(tabId);
    setIsSubNavOpen(false); // Close the sub nav
    dispatch(setCurrentModule("Config Cockpit"));
    navigate(`/adminConsole?tab=${tabId}`);
  };

  // Handle closing sub nav without making a selection
  const handleCloseSubNav = () => {
    setIsSubNavOpen(false);
    // Revert to previous module if we haven't committed to Admin Console yet
    if (!location.pathname.includes("/adminConsole")) {
      dispatch(setCurrentModule(previousModule));
    }
  };

  return (
    <>
      <div
        className="sideNav"
        style={{
          borderRight: `1px solid ${theme.palette.divider}`,
          "--color-primary": theme.palette.primary.main,
          "--color-text-primary": theme.palette.text.primary,
        }}
      >
        {visibleOptions.map((content) => {
          const isSelected = true;

          const isConfigCockpit =
            content?.label === "Config Cockpit" ||
            content?.label === t("configCockpit");
          const isOnAdminRoute = location.pathname.startsWith("/adminConsole");
          const shouldShowPending =
            isConfigCockpit && isSubNavOpen && !isOnAdminRoute;

          const isWide =
            content?.label === "Document Management" ||
            content?.label === t("documentManagement") ||
            (isSelected &&
              (content?.label === "Config Cockpit" ||
                content?.label === t("configCockpit")));

          return (
            <Box
              className={`sideNavOptionTile ${isSelected ? "selectedOption" : ""} ${isWide ? "wide" : ""} ${shouldShowPending ? "pendingSelection" : ""}`}
              key={content?.label}
              onClick={onSelectModule}
              id={content.__index}
              sx={{
                color: theme.palette.text.primary,
                gap:1,
                "&:not(.selectedOption):hover": {
                  background: "transparent !important",
                  "& .iconBadge": {
                    background:
                      theme.palette.mode === "light"
                        ? "#EDEBFF"
                        : theme.palette.background.datagridHeader,
                  },
                  // Override icon color on hover
                  "& .sideNavOptionIcon, & .MuiSvgIcon-root": {
                    color: `${theme.palette.primary.main} !important`,
                  },
                },

                // Override selected styles
                "&.selectedOption": {
                  // background: `${theme.palette.background.default} !important`, // Use theme background
                  "& .iconBadge": {
                    // Use theme-aware background for selected
                    background:
                      theme.palette.mode === "light"
                        ? "#EDEBFF"
                        : theme.palette.background.datagridHeader,
                  },
                  // Override icon color when selected (fixes renderIcon override)
                  "& .sideNavOptionIcon, & .MuiSvgIcon-root": {
                    color: `${theme.palette.primary.main} !important`,
                  },
                  // Override text color when selected
                  "& p, & .sideNavLabel, &:hover p, &:hover .sideNavLabel": {
                    fontWeight: "700 !important",
                  },
                },

                // Override pending styles
                "&.pendingSelection": {
                  // background: `${theme.palette.background.default} !important`,
                  "& .iconBadge": {
                    background: `${theme.palette.action.hover} !important`,
                  },
                },
              }}
            >
              <div className="iconBadge">
                {renderIcon(content?.label, isSelected)}
              </div>
              <p className="sideNavLabel">{content?.label}</p>
            </Box>
          );
        })}
      </div>

      <SubSideNav
        isOpen={isSubNavOpen}
        onClose={handleCloseSubNav}
        onTabSelect={handleTabSelect}
        currentTabValue={currentAdminTab}
      />
    </>
  );
};

export default SideNav;

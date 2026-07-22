import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "./SideNav.css";
import { Box } from "@mui/material";
import { getSideNavItems } from "../../config/sidenav.config";

// TODO: replace with actual theme from @mui/material useTheme
const theme = {
  palette: {
    mode: "light",
    text: { primary: "#fff" },
    primary: { main: "#0019ae" },
    background: { default: "#1F2A44", datagridHeader: "#1e1e2e" },
    divider: "#e0e0e0",
    action: { hover: "#f5f5f5" },
  },
};

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentModule, setCurrentModule] = useState("");

  // Get navigation items from sideNavData
  const navigationItems = getSideNavItems();

  // Track current module based on pathname
  useEffect(() => {
    const path = location.pathname;

    // Find matching navigation item based on path
    const matchedItem = navigationItems.find((item) => {
      // Remove /* wildcard from path for matching
      const cleanPath = item.path.replace("/*", "");
      // Check for exact match or path starts with the nav item path
      return path === cleanPath || path.startsWith(cleanPath + "/") || path.startsWith(cleanPath);
    });

    if (matchedItem) {
      setCurrentModule(matchedItem.moduleName);
    }
  }, [location.pathname, navigationItems]);

  const onSelectModule = (navItem) => {
    setCurrentModule(navItem.moduleName);
    // Remove /* wildcard from path for navigation
    const cleanPath = navItem.path.replace("/*", "");
    navigate(cleanPath);
  };

  const renderIcon = (IconComponent) => {
    if (!IconComponent) return <span className="icon"></span>;
    return (
      <span className="icon">
        <IconComponent />
      </span>
    );
  };

  return (
    <>
      <div
        className="sideNav"
        style={
          {
            // backgroundColor: theme.palette.background.default,
            // borderRight: `1px solid ${theme.palette.divider}`,
            // "--color-primary": theme.palette.primary.main,
            // "--color-text-primary": theme.palette.text.primary,
          }
        }
      >
        {navigationItems.map((navItem) => {
          const isSelected = currentModule === navItem.moduleName;
          const translatedLabel = t(navItem.label);

          return (
            <Box
              className={`sideNavOptionTile ${isSelected ? "selectedOption" : ""}`}
              key={navItem.id}
              onClick={() => onSelectModule(navItem)}
              sx={{
                // color: theme.palette.text.primary,
                cursor: "pointer",
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
                  background: `${theme.palette.background.default} !important`, // Use theme background
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
                    color: `${theme.palette.text.primary} !important`, // Overrides #000 !important
                    fontWeight: "700 !important",
                  },
                },
              }}
            >
              <div className="iconBadge">{renderIcon(navItem.icon)}</div>
              <p className="sideNavLabel">{translatedLabel}</p>
            </Box>
          );
        })}
      </div>
    </>
  );
}

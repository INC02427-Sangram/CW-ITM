import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import "./SideNav.css";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { getSideNavItems } from "../../config/sidenav.config";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  // states for managing navbar overflow
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(9); // Number of items to show before overflow
  const [hasOverflow, setHasOverflow] = useState(false);

  // Get navigation items from sideNavData
  const navigationItems = getSideNavItems();

  // useEffect to check if the navigation items exceed the container height
  useEffect(() => {
    const checkOverflow = () => {
      const el = containerRef.current;
      if (!el) return;

      const containerHeight = el.clientHeight;
      const navElement = el.querySelector('.sideNav');
      if (!navElement) return;

      const children = Array.from(navElement.children);
      if (children.length === 0) return;

      // Get actual height of first child (all items should be same height)
      const itemHeight = children[0]?.offsetHeight || 60;
      const footerHeight = itemHeight; // Space for "+N more" button (same as item height)
      const availableHeight = containerHeight - footerHeight;

      // Calculate how many items can fit
      let totalHeight = 0;
      let visibleItemCount = 0;

      for (let i = 0; i < navigationItems.length; i++) {
        totalHeight += itemHeight;
        if (totalHeight <= availableHeight) {
          visibleItemCount++;
        } else {
          break;
        }
      }

      const calculatedVisible = Math.max(1, visibleItemCount);
      setVisibleCount(calculatedVisible);
      console.log("Calculated visible items:", calculatedVisible, "Total items:", navigationItems.length);
      setHasOverflow(navigationItems.length > calculatedVisible);
    };

    // Delay to ensure DOM is rendered
    const timer = setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [navigationItems]);

  // Track current module based on pathname
  useEffect(() => {
    const path = location.pathname;

    // Find matching navigation item based on path
    const matchedItem = navigationItems.find((item) => {
      // Remove /* wildcard from path for matching
      const cleanPath = item.path.replace("/*", "");
      // Check for exact match or path starts with the nav item path
      return (
        path === cleanPath ||
        path.startsWith(cleanPath + "/") ||
        path.startsWith(cleanPath)
      );
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
    setDrawerOpen(false); // Close drawer when navigating
  };

  const renderIcon = (IconComponent) => {
    if (!IconComponent) return <span className="sideNavOptionIcon"></span>;
    return (
      <span className="sideNavOptionIcon">
        <IconComponent />
      </span>
    );
  };

  const renderNavItem = (navItem, isInDrawer = false) => {
    const isSelected = currentModule === navItem.moduleName;
    const translatedLabel = t(navItem.label);

    return (
      <Box
        className={`sideNavOptionTile ${isSelected ? "selectedOption" : ""}`}
        key={navItem.id}
        onClick={() => onSelectModule(navItem)}
        sx={{
          cursor: "pointer",
          width: isInDrawer ? "auto" : "95%",
          minWidth: isInDrawer ? "120px" : "auto",
          "&:not(.selectedOption):hover": {
            background: "transparent !important",
            "& .iconBadge": {
              background:
                theme.palette.mode === "light"
                  ? "#EDEBFF"
                  : theme.palette.background.datagridHeader,
            },
            "& .sideNavOptionIcon, & .MuiSvgIcon-root": {
              color: `${theme.palette.primary.main} !important`,
            },
          },
          "&.selectedOption": {
            background: `${theme.palette.background.default} !important`,
            "& .iconBadge": {
              background:
                theme.palette.mode === "light"
                  ? "#EDEBFF"
                  : theme.palette.background.datagridHeader,
            },
            "& .sideNavOptionIcon, & .MuiSvgIcon-root": {
              color: `${theme.palette.primary.main} !important`,
            },
            "& p, & .sideNavLabel, &:hover p, &:hover .sideNavLabel": {
              color: `${theme.palette.text.primary} !important`,
              fontWeight: "700 !important",
            },
          },
        }}
      >
        <div className="iconBadge">{renderIcon(navItem.icon)}</div>
        <p className="sideNavLabel">{translatedLabel}</p>
      </Box>
    );
  };

  const visibleItems = hasOverflow ? navigationItems.slice(0, visibleCount) : navigationItems;
  const overflowItems = hasOverflow ? navigationItems.slice(visibleCount) : [];

  return (
    <>
      <Box
        className="sideNavContainer"
        ref={containerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        <div className="sideNav" style={{ overflowY: "hidden" }}>
          {visibleItems.map((navItem) => renderNavItem(navItem))}

          {/* Show "+N more" button if there's overflow */}
          {hasOverflow && (
            <Box
              className="sideNavOptionTile"
              onClick={() => setDrawerOpen(true)}
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                cursor: "pointer",
                width: "95%",
                "&:hover": {
                  background: "transparent !important",
                  "& .iconBadge": {
                    background:
                      theme.palette.mode === "light"
                        ? "#EDEBFF"
                        : theme.palette.background.datagridHeader,
                  },
                  "& .iconBadge span": {
                    color: `${theme.palette.primary.main} !important`,
                  },
                },
              }}
            >
              <div className="iconBadge" style={{ 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center",
                padding: "4px"
              }}>
                <span style={{ fontSize: "10px", fontWeight: "700", color: "#fff", textAlign: "center", lineHeight: "1.2" }}>
                  +{overflowItems.length} more
                </span>
              </div>
            </Box>
          )}
        </div>
      </Box>

      {/* Drawer for overflow items */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "15%",
            backgroundColor: theme.palette.background.default,
            marginLeft: "6rem", // Offset by sidebar width
            padding: "16px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: theme.palette.text.primary,marginLeft:"auto" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {overflowItems.map((navItem) => renderNavItem(navItem, true))}
        </Box>
      </Drawer>
    </>
  );
}

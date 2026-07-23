import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef, useCallback } from "react";
import "./SideNav.css";
import { Box, IconButton, Typography } from "@mui/material";
import { getSideNavItems } from "../../config/sidenav.config";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import { MoreApps } from "@cw/rds/icons";
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

// Tracks the position/size of a hovered nav item's icon badge so a single
// indicator can slide smoothly between items instead of each badge
// independently snapping its own highlight on and off
function useSlideHighlight() {
  const itemRefs = useRef({});
  const [style, setStyle] = useState({ top: 0, left: 0, width: 0, height: 0, opacity: 0 });

  const moveTo = useCallback((id) => {
    const el = itemRefs.current[id];
    if (!el) return;
    setStyle({
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight,
      opacity: 1,
    });
  }, []);

  const hide = useCallback(() => {
    setStyle((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return { itemRefs, style, moveTo, hide };
}

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentModule, setCurrentModule] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sliding hover highlight, tracked separately for the main list and the drawer list
  const mainHighlight = useSlideHighlight();
  const drawerHighlight = useSlideHighlight();

  // Closing the drawer slides it out from under the pointer via a CSS
  // transform, which never fires a natural mouseleave — reset the drawer's
  // highlight explicitly so a stale highlight doesn't reappear on reopen
  useEffect(() => {
    if (!drawerOpen) drawerHighlight.hide();
  }, [drawerOpen, drawerHighlight.hide]);

  // states for managing navbar overflow
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(8); // Number of items to show before overflow
  const [hasOverflow, setHasOverflow] = useState(false);

  // Get navigation items from sideNavData
  const navigationItems = getSideNavItems();

  // Custom ordering so selecting an item from the overflow drawer promotes it
  // into the visible list, swapping places with the last visible item
  const [orderedIds, setOrderedIds] = useState(() =>
    navigationItems.map((item) => item.id),
  );

  useEffect(() => {
    setOrderedIds((prevIds) => {
      const currentIds = navigationItems.map((item) => item.id);
      const sameSet =
        prevIds.length === currentIds.length &&
        prevIds.every((id) => currentIds.includes(id));
      return sameSet ? prevIds : currentIds;
    });
  }, [navigationItems]);

  const orderedNavigationItems = orderedIds
    .map((id) => navigationItems.find((item) => item.id === id))
    .filter(Boolean);

  // useEffect to check if the navigation items exceed the container height
  useEffect(() => {
    const checkOverflow = () => {
      const el = containerRef.current;
      if (!el) return;

      const containerHeight = el.clientHeight;
      const navElement = el.querySelector(".sideNav");
      if (!navElement) return;

      const children = Array.from(navElement.children);
      if (children.length === 0) return;

      // Get actual height of first child (all items should be same height)
      const firstNavItem = navElement.querySelector(".sideNavOptionTile");
      const itemHeight = firstNavItem?.offsetHeight || 60;
      const footerHeight = itemHeight; // Space for "+N more" button (same as item height)
      const availableHeight = containerHeight - footerHeight;

      // Calculate how many items can fit
      let totalHeight = 0;
      let visibleItemCount = 0;

      for (let i = 0; i < orderedNavigationItems.length; i++) {
        totalHeight += itemHeight;
        if (totalHeight <= availableHeight) {
          visibleItemCount++;
        } else {
          break;
        }
      }

      const calculatedVisible = Math.max(1, visibleItemCount);
      setVisibleCount(calculatedVisible);
      console.log(
        "Calculated visible items:",
        calculatedVisible,
        "Total items:",
        orderedNavigationItems.length,
      );
      setHasOverflow(orderedNavigationItems.length > calculatedVisible);
    };

    // Delay to ensure DOM is rendered
    const timer = setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [orderedNavigationItems]);

  // Track current module based on pathname
  useEffect(() => {
    const path = location.pathname;

    // Find matching navigation item based on path
    const matchedItem = navigationItems.find((item) => {
      // Remove /* wildcard from path for matching
      const cleanPath = item.path.replace("/*", "");
      // Exact match, or a real sub-path (not just a string prefix - e.g.
      // "/admin-console2" must not match the "/admin-console" item)
      return path === cleanPath || path.startsWith(cleanPath + "/");
    });

    if (matchedItem) {
      setCurrentModule(matchedItem.moduleName);
    }
  }, [location.pathname, navigationItems]);

  const onSelectModule = (navItem, isInDrawer = false) => {
    setCurrentModule(navItem.moduleName);
    // Remove /* wildcard from path for navigation
    const cleanPath = navItem.path.replace("/*", "");
    navigate(cleanPath);
    setDrawerOpen(false); // Close drawer when navigating

    if (isInDrawer) {
      // Promote the selected item into the visible list, swapping it with
      // the last currently-visible item, which moves into the drawer
      setOrderedIds((prevIds) => {
        const ids = [...prevIds];
        const selectedIndex = ids.indexOf(navItem.id);
        const lastVisibleIndex = visibleCount - 1;
        if (selectedIndex <= lastVisibleIndex) return ids;

        [ids[lastVisibleIndex], ids[selectedIndex]] = [
          ids[selectedIndex],
          ids[lastVisibleIndex],
        ];
        return ids;
      });
    }
  };

  const renderIcon = (IconComponent) => {
    if (!IconComponent) return <span className="sideNavOptionIcon"></span>;
    return (
      <span className="sideNavOptionIcon">
        <IconComponent />
      </span>
    );
  };

  const renderNavItem = (navItem, isInDrawer = false, highlight = null) => {
    const isSelected = currentModule === navItem.moduleName;
    const translatedLabel = t(navItem.label);

    return (
      <Box
        className={`sideNavOptionTile ${isSelected ? "selectedOption" : ""}`}
        key={navItem.id}
        onClick={() => onSelectModule(navItem, isInDrawer)}
        onMouseEnter={() => highlight?.moveTo(navItem.id)}
        sx={{
          cursor: "pointer",
          width: isInDrawer ? "auto" : "95%",
          minWidth: isInDrawer ? "120px" : "auto",
          "&:not(.selectedOption):hover": {
            background: "transparent !important",
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
        <div
          className="iconBadge"
          ref={(el) => {
            if (highlight) highlight.itemRefs.current[navItem.id] = el;
          }}
        >
          {renderIcon(navItem.icon)}
        </div>
        <p className="sideNavLabel">{translatedLabel}</p>
      </Box>
    );
  };

  const renderHoverHighlight = (highlight) => (
    <Box
      className="sideNavHoverHighlight"
      sx={{
        position: "absolute",
        top: highlight.style.top,
        left: highlight.style.left,
        width: highlight.style.width,
        height: highlight.style.height,
        opacity: highlight.style.opacity,
        backgroundColor: "#EDEBFF",
        borderRadius: "12px",
        transition: "top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease, opacity 0.15s ease",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );

  const visibleItems = hasOverflow
    ? orderedNavigationItems.slice(0, visibleCount)
    : orderedNavigationItems;
  const overflowItems = hasOverflow
    ? orderedNavigationItems.slice(visibleCount)
    : [];

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
        <div
          className="sideNav"
          style={{ overflowY: "hidden" }}
          onMouseLeave={mainHighlight.hide}
        >
          {renderHoverHighlight(mainHighlight)}
          {visibleItems.map((navItem) => renderNavItem(navItem, false, mainHighlight))}

          {/* Show "+N more" button if there's overflow */}
          {hasOverflow && (
            <Box
              className="sideNavOptionTile"
              onClick={() => setDrawerOpen(true)}
              sx={{
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
              <div className="iconBadge">
                <MoreApps />
              </div>
              <p className="sideNavLabel">+{overflowItems.length} more</p>
            </Box>
          )}
        </div>
      </Box>

      {/* Backdrop + sliding panel for overflow items, anchored past the sidebar */}
      <Box
        onClick={() => setDrawerOpen(false)}
        sx={{
          position: "fixed",
          top: "3.75rem",
          left: "6rem",
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1199,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 225ms ease",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: "3.75rem",
          left: "6rem",
          bottom: 0,
          width: "15%",
          overflow: "hidden",
          zIndex: 1200,
          pointerEvents: drawerOpen ? "auto" : "none",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "100%",
            backgroundColor: theme.palette.background.default,
            padding: "16px",
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.3)",
            transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 225ms ease",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
            onMouseLeave={drawerHighlight.hide}
          >
            {renderHoverHighlight(drawerHighlight)}
            {overflowItems.map((navItem) =>
              renderNavItem(navItem, true, drawerHighlight),
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

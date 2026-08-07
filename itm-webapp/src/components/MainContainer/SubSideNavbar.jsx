import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./SubSideNavbar.css";

const isPathMatch = (itemPath, pathname) => {
  const cleanPath = itemPath.replace("/*", "");
  return pathname === cleanPath || pathname.startsWith(cleanPath + "/");
};

/**
 * Secondary drawer for nested side navigation (e.g. Admin Console → IDM / IWA).
 * Items with `children` render as accordion dropdowns.
 */
export default function SubSideNavbar({
  open,
  onClose,
  title,
  items = [],
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  // Auto-expand accordion sections that match the current route
  useEffect(() => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      items.forEach((item) => {
        if (
          item.children?.length &&
          (isPathMatch(item.path, location.pathname) ||
            item.children.some((child) =>
              isPathMatch(child.path, location.pathname),
            ))
        ) {
          next.add(item.id);
        }
      });
      return next;
    });
  }, [location.pathname, items, open]);

  const isItemSelected = (item) => isPathMatch(item.path, location.pathname);

  const isParentActive = (item) =>
    isPathMatch(item.path, location.pathname) ||
    item.children?.some((child) => isPathMatch(child.path, location.pathname));

  const toggleAccordion = (itemId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const onSelectLeaf = (item) => {
    navigate(item.path.replace("/*", ""));
    onClose?.();
  };

  const onSelectItem = (item) => {
    if (item.children?.length) {
      toggleAccordion(item.id);
      return;
    }
    onSelectLeaf(item);
  };

  const renderLeafButton = (item, { nested = false, selected = false } = {}) => {
    const IconComponent = item.icon;
    return (
      <button
        key={item.id}
        type="button"
        className={`subSideNavOptionTile ${nested ? "nestedOption" : ""} ${selected ? "selectedOption" : ""}`}
        onClick={() => onSelectLeaf(item)}
      >
        <span className="subSideNavIconBadge">
          {IconComponent ? <IconComponent /> : null}
        </span>
        <span className="subSideNavLabel">{t(item.label)}</span>
      </button>
    );
  };

  return (
    <>
      <Box
        className="subSideNavBackdrop"
        onClick={onClose}
        sx={{
          position: "fixed",
          top: "3.75rem",
          left: "6rem",
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          zIndex: 1199,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 225ms ease",
        }}
      />

      <Box
        className="subSideNavShell"
        sx={{
          position: "fixed",
          top: "3.75rem",
          left: "6rem",
          bottom: 0,
          width: "15.5rem",
          overflow: "hidden",
          zIndex: 1200,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <Box
          className="subSideNavPanel"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#1F2A44",
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.3)",
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 225ms ease",
            overflowY: "auto",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box className="subSideNavHeader">
            <Typography className="subSideNavTitle" variant="subtitle2">
              {t(title)}
            </Typography>
            <IconButton
              size="small"
              aria-label="Close sub navigation"
              onClick={onClose}
              sx={{ color: "#fff", padding: "4px" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box className="subSideNavList">
            {items.map((item) => {
              const hasChildren = item.children?.length > 0;
              const expanded = expandedIds.has(item.id);
              const parentActive = hasChildren && isParentActive(item);
              const IconComponent = item.icon;

              if (!hasChildren) {
                return renderLeafButton(item, {
                  selected: isItemSelected(item),
                });
              }

              return (
                <div key={item.id} className="subSideNavAccordion">
                  <button
                    type="button"
                    className={`subSideNavOptionTile accordionHeader ${parentActive ? "parentActive" : ""} ${expanded ? "expanded" : ""}`}
                    aria-expanded={expanded}
                    onClick={() => onSelectItem(item)}
                  >
                    <span className="subSideNavIconBadge">
                      {IconComponent ? <IconComponent /> : null}
                    </span>
                    <span className="subSideNavLabel">{t(item.label)}</span>
                    <ExpandMoreIcon
                      className={`subSideNavChevron ${expanded ? "expanded" : ""}`}
                    />
                  </button>

                  <div
                    className={`subSideNavAccordionPanel ${expanded ? "expanded" : ""}`}
                  >
                    <div className="subSideNavAccordionInner">
                      {item.children.map((child) =>
                        renderLeafButton(child, {
                          nested: true,
                          selected: isItemSelected(child),
                        }),
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
}

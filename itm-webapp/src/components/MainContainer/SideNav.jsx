import { useState } from "react";
import "./SideNav.css";
import { Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SettingsIcon from "@mui/icons-material/Settings";
// TODO: replace with actual i18n hook (e.g. useTranslation)
const t = (key) => key;

// TODO: replace with actual location from react-router-dom useLocation
const location = { pathname: "/" };

// TODO: replace with actual icon renderer
const renderIcon = (_label, _isSelected) => {
  switch (_label) {
    case "Dashboard":
      return (
        <span className="icon">
          <DashboardIcon />
        </span>
      );
    case "Back-to-Back":
      return (
        <span className="icon">
          <PublishedWithChangesIcon />
        </span>
      );
    case "Purchase Trading":
      return (
        <span className="icon">
          {" "}
          <ShoppingCart />
        </span>
      );
    case "Sales Trading":
      return (
        <span className="icon">
          <ReceiptIcon />
        </span>
      );
    case "Invoices":
      return (
        <span className="icon">
          <DescriptionIcon />
        </span>
      );
    case "Outbound Delivery":
      return (
        <span className="icon">
          <LocalShippingIcon />
        </span>
      );
    case "Admin Console":
      return (
        <span className="icon">
          <SettingsIcon />
        </span>
      );
    default:
      return <span className="icon"></span>;
  }
};

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

const visibleOptions = [
  { __index: 0, id: "dashboard", label: "Dashboard" },
  { __index: 1, id: "back-to-back-trading", label: "Back-to-Back" },
  { __index: 2, id: "purchase-to-stock", label: "Purchase Trading" },
  { __index: 3, id: "sell-from-stock", label: "Sales Trading" },
  { __index: 4, id: "outboundDelivery", label: "Outbound Delivery" },
  { __index: 5, id: "invoices", label: "Invoices" },
  { __index: 6, id: "admin-console", label: "Admin Console" },
];

const sideNavModuleNames = Object.fromEntries(
  visibleOptions.map((o) => [o.__index, o.id]),
);

export default function SideNav({ active, onNavigate }) {

  const currentModule = active;

  const [isSubNavOpen] = useState(false);

  const onSelectModule = (e) => {
    const index = parseInt(e.currentTarget.id, 10);
    onNavigate(sideNavModuleNames[index]);
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
        {visibleOptions.map((content) => {
          const isSelected = content.id === active;

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
                // color: theme.palette.text.primary,

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

                // Override pending styles
                "&.pendingSelection": {
                  background: `${theme.palette.background.default} !important`,
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
    </>
  );
}

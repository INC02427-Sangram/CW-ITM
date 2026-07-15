import { useState } from "react";
import {
  Stack,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  IconButton as MuiIconButton,
  Box,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import "./AppHeader.css";
import CherryWork from "../../assets/cherrywork_logo.png";

// TODO: replace with actual custom icon components
const Setting = () => null;
const ClipboardPlus = () => null;
const Bell = () => null;
const BellFilled = () => null;

// TODO: replace with actual custom components
const HeaderButton = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);
const CustomAvatar = ({ name, ...props }) => (
  <span {...props}>{name?.[0]}</span>
);

export default function AppHeader() {
  const user = { displayName: "Dev User", roles: ["TRADE_ADMIN"] };

  const displayName = user?.displayName ?? "";

  const getDisplayRole = () => {
    const role = user?.roles?.[0] ?? "";
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const [appearanceAnchorEl, setAppearanceAnchorEl] = useState(null);
  const isAppearanceOpen = Boolean(appearanceAnchorEl);

  const [themeMode, setThemeMode] = useState("light");
  const [, setThemeCustomizerOpen] = useState(false);
  const resetCurrentMode = () => setThemeMode("light");

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadCount = 0;

  const handleSettingsOpen = (event) =>
    setAppearanceAnchorEl(event.currentTarget);
  const handleHealthOpen = () => {};
  const handleNotificationsOpen = () => setIsNotificationsOpen((prev) => !prev);
  const fnProfileClickHandler = () => {};

  return (
    <>
      <header className="appHeader">
        <Box
          className="header-brand"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 2,
          }}
        >
          <img
            className="header-brand-logo"
            src={CherryWork}
            style={{ verticalAlign: "middle" }}
            alt=" "
            height={"36px"}
            width="auto"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography
              className="header-brand-title"
              sx={{
                // color: (theme) => theme.palette.text.primary,
                fontFamily: "Roboto, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "normal",
                letterSpacing: "0.36px",
              }}
            >
              Intelligent Trade Management
            </Typography>
            <Typography
              className="header-brand-subtitle"
              sx={{
                // color: (theme) => theme.palette.text.secondary,
                fontFamily: "Roboto, sans-serif",
                fontSize: "10px",
                fontStyle: "italic",
                fontWeight: "400",
                lineHeight: "15px",
              }}
            >
              Trades Simplified
            </Typography>
          </Box>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          className="header-right"
          gap={1.5}
        >
          <Tooltip title="Settings" arrow placement="bottom">
            <MuiIconButton
              onClick={handleSettingsOpen}
              aria-label="notifications"
              size="medium"
              sx={{
                // color: "#666",
                "&:hover": {
                  backgroundColor: "#eae9ff !important",
                },
              }}
            >
              <Setting />
            </MuiIconButton>
          </Tooltip>

          <Menu
            anchorEl={appearanceAnchorEl}
            open={isAppearanceOpen}
            onClose={() => setAppearanceAnchorEl(null)}
          >
            <MenuItem
              disabled={themeMode !== "light"}
              onClick={() => {
                setAppearanceAnchorEl(null);
                setThemeCustomizerOpen(true);
              }}
            >
              <ListItemIcon>
                <TuneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Customize Light…</ListItemText>
            </MenuItem>

            <MenuItem
              disabled={themeMode !== "light"}
              onClick={() => {
                setAppearanceAnchorEl(null);
                resetCurrentMode();
              }}
            >
              <ListItemIcon>
                <RestartAltIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reset</ListItemText>
            </MenuItem>
          </Menu>

          <Tooltip title="System Health" arrow placement="bottom">
            <MuiIconButton
              onClick={handleHealthOpen}
              aria-label="notifications"
              size="medium"
              sx={{
                // color: green[600],
                "&:hover": {
                  backgroundColor: "#eae9ff !important",
                },
              }}
            >
              <ClipboardPlus />
            </MuiIconButton>
          </Tooltip>

          <Tooltip title="Notifications" arrow placement="bottom">
            <MuiIconButton
              onClick={handleNotificationsOpen}
              aria-label="notifications"
              size="medium"
              sx={{
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#eae9ff !important",
                },
              }}
            >
              <Badge color="error" variant="dot" invisible={unreadCount === 0}>
                {isNotificationsOpen ? (
                  <BellFilled color="#0019ae" />
                ) : (
                  <Bell />
                )}
              </Badge>
            </MuiIconButton>
          </Tooltip>
          <Tooltip title="User Profile" arrow placement="bottom">
            <MuiIconButton
              className="styleUserProfile"
              disableFocusRipple
              disableRipple
              onClick={(event) => fnProfileClickHandler(event)}
            >
              <Stack
                direction="row"
                spacing={0}
                justifyContent="center"
                alignItems="center"
              >
                <HeaderButton
                  sx={{
                    padding: "0 !important",
                    width: "max-content",
                    // borderRadius: "25px",
                    backgroundColor: "theme.pallete.background.default",
                    border: "1px solid #e9ecef",
                    textTransform: "none",
                    height: 38,
                  }}
                  aria-haspopup="true"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CustomAvatar
                      className={"wbAvatar wbMR8"}
                      size="small"
                      src={""}
                      name={displayName}
                      gutterBottom
                      sx={{ height: 38 }}
                    />
                    <Typography
                      className="header-user-role"
                      variant="body2"
                      color="text.secondary"
                    >
                      {getDisplayRole()}
                    </Typography>
                  </Stack>
                </HeaderButton>
              </Stack>
            </MuiIconButton>
          </Tooltip>
          {/* <Box display="flex" sx={{ marginRight: "-10px" }}>
            <HealthMonitor />
          </Box> */}
        </Stack>
      </header>
    </>
  );
}

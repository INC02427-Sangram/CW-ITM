import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Stack,
  Typography,
  Tooltip,
  Badge,
  IconButton as MuiIconButton,
  Box,
  Avatar,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import "./AppHeader.css";
import CherryWork from "../../assets/cherrywork_logo.png";
import UserProfilePopover from "../Common/UserProfilePopover";
import NotificationsPopover from "../Common/NotificationsPopover";
import SystemHealthPopover from "../Common/SystemHealthPopover";
import ApplicationSettingsPopover from "../Common/ApplicationSettingsPopover";
export default function AppHeader() {
  // Get user info from Redux store
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);

  const displayName =
    isAuthenticated && userInfo
      ? `${userInfo.firstName} ${userInfo.lastName}`
      : "Guest";

  // Notifications popover state
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const isNotificationsOpen = Boolean(notificationsAnchorEl);
  const unreadCount = 3; // Dummy unread count

  // System health popover state
  const [healthAnchorEl, setHealthAnchorEl] = useState(null);
  const isHealthOpen = Boolean(healthAnchorEl);

  // Profile popover state
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const isProfileOpen = Boolean(profileAnchorEl);

  // Application settings click handler
  const [appSettingsAnchorEl, setAppSettingsAnchorEl] = useState(null);
  const isAppSettingsOpen = Boolean(appSettingsAnchorEl);

  const handleHealthClick = (event) => setHealthAnchorEl(event.currentTarget);
  const handleAppSettingsClick = (event) => {
    setAppSettingsAnchorEl(event.currentTarget);
    console.log("App Settings clicked");
  };
  const handleHealthClose = () => setHealthAnchorEl(null);
  const handleNotificationsClick = (event) =>
    setNotificationsAnchorEl(event.currentTarget);
  const handleNotificationsClose = () => setNotificationsAnchorEl(null);
  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

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
          <Tooltip title="Application Settings" arrow placement="bottom">
            <MuiIconButton
              onClick={handleAppSettingsClick}
              aria-label="app-settings"
              size="medium"
              sx={{
                color: "#666",
                "&:hover": {
                  backgroundColor: "#eae9ff !important",
                  color: "#3730c7",
                },
              }}
            >
              <SettingsIcon />
            </MuiIconButton>
          </Tooltip>

          <Tooltip title="System Health" arrow placement="bottom">
            <MuiIconButton
              onClick={handleHealthClick}
              aria-label="system health"
              size="medium"
              sx={{
                color: "#666",
                "&:hover": {
                  backgroundColor: "#eae9ff !important",
                  color: "#3730c7",
                },
              }}
            >
              <AssessmentIcon />
            </MuiIconButton>
          </Tooltip>

          <Tooltip title="Notifications" arrow placement="bottom">
            <MuiIconButton
              onClick={handleNotificationsClick}
              aria-label="notifications"
              size="medium"
              sx={{
                color: "#666",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#eae9ff !important",
                  color: "#3730c7",
                },
              }}
            >
              <Badge color="error" badgeContent={unreadCount} max={9}>
                <NotificationsIcon />
              </Badge>
            </MuiIconButton>
          </Tooltip>
          <Tooltip title="User Profile" arrow placement="bottom">
            <MuiIconButton
              onClick={handleProfileClick}
              sx={{
                p: 0.5,
                "&:hover": {
                  backgroundColor: "#eae9ff !important",
                },
              }}
            >
              <Avatar
                src={userInfo?.avatar}
                alt={displayName}
                sx={{
                  width: 40,
                  height: 40,
                  fontSize: 16,
                  fontWeight: 600,
                  bgcolor: "#123db8",
                  cursor: "pointer",
                }}
              >
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
            </MuiIconButton>
          </Tooltip>

          <ApplicationSettingsPopover
            anchorEl={appSettingsAnchorEl}
            open={isAppSettingsOpen}
            onClose={() => setAppSettingsAnchorEl(null)}
          />

          <SystemHealthPopover
            anchorEl={healthAnchorEl}
            open={isHealthOpen}
            onClose={handleHealthClose}
          />

          <NotificationsPopover
            anchorEl={notificationsAnchorEl}
            open={isNotificationsOpen}
            onClose={handleNotificationsClose}
          />

          <UserProfilePopover
            anchorEl={profileAnchorEl}
            open={isProfileOpen}
            onClose={handleProfileClose}
          />
          {/* <Box display="flex" sx={{ marginRight: "-10px" }}>
            <HealthMonitor />
          </Box> */}
        </Stack>
      </header>
    </>
  );
}

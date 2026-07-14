import React from "react";
import {
  Popover,
  ClickAwayListener,
  Stack,
  Grid,
  Typography,
  Divider,
  Switch,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import CustomAvatar from "../../utility/Custom Components/CustomAvatar";
import { useDispatch, useSelector } from "react-redux";
import { getUserNameFromEmailId } from "../../utility/utilityFunctions";
import { useTranslation } from "react-i18next";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkIcon from "@mui/icons-material/Work";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import InfoIcon from "@mui/icons-material/Info";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import { setThemeMode, logoutUser } from "../../redux/reducers/appReducer";
import { CircleInfo, LogoutIcon, Moon, Profile, ProfileSetting } from "@cw/rds/icons";
import { Chip } from "@cw/rds";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 38,
  height: 22,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(1px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(17px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 20,
    height: 20,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '16px',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 22 / 2,
  },
}));


const UserProfile = (props) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Theme mode from Redux
  const themeMode = useSelector((state) => state.appReducer.themeMode);

  const { firstName, lastName, email, emailId } = props.userDetails || {};
  const roles = Array.isArray(props.roles)
    ? props.roles
    : Array.isArray((props.userDetails || {}).roles)
      ? (props.userDetails || {}).roles
      : [];
  const toTitleCase = (str = "") =>
    str
      // .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const fullNameRaw = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  const displayEmail = emailId || email || "";
  const username = toTitleCase(fullNameRaw || getUserNameFromEmailId(displayEmail));
  const rolesString = roles.length ? roles.join(", ") : "";
  const userId = "";
  const applicationVersion = "v1.0.0"; // hardcoded (example)

  const [openUserDetails, setOpenUserDetails] = React.useState(false);
  const selectLightDefault = () => {
    dispatch(setThemeMode("light"));
    dispatch({ type: "PALETTE/UPDATE", payload: null });
  };

  const selectDark = () => {
    dispatch(setThemeMode("dark"));
  };
  const handleClickUserDetails = () => {
    setOpenUserDetails(!openUserDetails);
  };

  // Dark Mode toggle (from AppHeader logic)
  const handleDarkModeToggle = (event) => {
    if (event.target.checked) {
      dispatch(selectDark());
    } else {
      dispatch(selectLightDefault());
    }
  };

  const fnSignOut = () => {
    dispatch(logoutUser());
    navigate("/");
    props.setShowUserProfile(false);
    props.setUserProfileAnchorElement(null);
    window.location.href = "/do/logout";
  };

  return (
    <Popover
      open={props.showUserProfile}
      anchorEl={props.userProfileAnchorElement}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={() => props.setShowUserProfile(false)}
      slotProps={{
        paper: {
          sx: {
            width: '340px',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          },
        },
      }}
    >

      <Stack sx={{ width: "100%" }} direction="column">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            pb: 1,
            gap: 2,
            borderBottom: "1px solid #eee",
          }}
        >
          <CustomAvatar
            name={username}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {displayEmail}
            </Typography>
          </Box>
        </Box>

        {/* User Details */}
        <ListItemButton onClick={handleClickUserDetails} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            {/* <AccountCircleIcon /> */}
            <ProfileSetting />
          </ListItemIcon>
          <ListItemText
            primary={<Typography fontWeight="medium">User Details</Typography>}
          />
          {openUserDetails ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openUserDetails} timeout="auto" unmountOnExit>
          <Box
            sx={(theme) => ({
              px: 2,
              pb: 2,
              backgroundColor: theme.palette?.background?.hover,
              borderRadius: "0 0 8px 8px",
            })}
          >
            {/* Username */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                pl: 2,
                pr: 2,
                mb: 2,
                "&:last-child": { mb: 0 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: "0 0 50%",
                  pr: 1,
                }}
              >
                <PersonIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Username
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: "0 0 50%",
                  pl: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {username}
                </Typography>
              </Box>
            </Box>

            {/* User ID */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                pl: 2,
                pr: 2,
                mb: 2,
                "&:last-child": { mb: 0 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: "0 0 50%",
                  pr: 1,
                }}
              >
                <BadgeIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  User ID
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: "0 0 50%",
                  pl: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {userId}
                </Typography>
              </Box>
            </Box>

            {/* Role */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                pl: 2,
                pr: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: "0 0 50%",
                  pr: 1,
                }}
              >
                <WorkIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Role
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: "0 0 50%",
                  pl: 1,
                }}
              >
                {roles && roles.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "flex-end" }}>
                    {roles.map((role, index) => {
                      const formatRole = (r) => toTitleCase(String(r).replace(/_/g, " "));
                      return (
                        <Chip
                          key={index}
                          label={formatRole(role)}
                          size="small"
                          variant="filled"
                          sx={{
                            height: 20,
                            borderRadius: '2px',
                            px: 0,

                            backgroundColor: '#F4F3FF !important',
                            color: '#3B30C8 !important',

                            border: 'none !important',
                            boxShadow: 'none !important',
                            outline: 'none',
                            '&.MuiChip-outlined': { border: 'none !important' },
                            '& .MuiChip-label': {
                              px: '8px',
                              fontSize: '0.725rem',   // ~10px
                              lineHeight: '18px',
                              fontWeight: 600,
                            },

                            '&:hover, &.Mui-focusVisible': {
                              backgroundColor: '#EBE9FF !important',
                              border: 'none !important',
                              boxShadow: 'none !important',
                            },

                            '&.rds-chip--outlined': { border: 'none !important' },
                          }}
                        />

                      );
                    })}

                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">—</Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Collapse>

        <Divider sx={{ my: 0 }} />

        {/* Dark Mode Toggle */}
        <ListItemButton sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Moon />
          </ListItemIcon>
          <ListItemText
            primary={<Typography fontWeight="medium">Dark Mode</Typography>}
          />
          <MaterialUISwitch
            edge="end"
            onChange={handleDarkModeToggle}
            checked={themeMode === "dark"}
            inputProps={{ "aria-label": "toggle dark mode" }}
          />
        </ListItemButton>

        <Divider sx={{ my: 0 }} />

        {/* Logout */}
        <ListItemButton onClick={fnSignOut} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary={<Typography fontWeight="medium">Logout</Typography>}
          />
        </ListItemButton>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            pt: 1,
            backgroundColor: "theme.pallete.background.default",
            borderTop: "1px solid #eee",

          }}
        >
          
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={0.5}
            sx={{ mt: 0.5 }}
          >
            <Typography variant="caption" color="theme.pallete.text.secondary">
              Application Version: {applicationVersion}
            </Typography>
            <CircleInfo size="xxsmall" color="theme.pallete.text.secondary" />
          </Stack>
        </Box>
      </Stack>
    </Popover>
  );
};

export default UserProfile;
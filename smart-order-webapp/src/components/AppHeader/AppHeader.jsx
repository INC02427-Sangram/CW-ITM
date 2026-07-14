import { useState, useEffect } from "react";
import { ListSubheader, IconButton as MuiIconButton } from "@mui/material";
import { ClipboardPlus } from '@cw/rds/icons';
import SystemHealthPopover from "./SystemHealthPopover";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import NotificationsPopover from "./NotificationsPopover";
import Badge from "@mui/material/Badge";
import { Chip } from "@cw/rds";
import Menu from "@mui/material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";
import TuneIcon from "@mui/icons-material/Tune";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import "./AppHeader.css";
import CherryWork from "../../assets/cherrywork_logo.png";
import UserProfile from "./UserProfile";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CustomAvatar from "../../utility/Custom Components/CustomAvatar";
import Palette from "@mui/icons-material/Palette";
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import ThemeCustomizer from "../ThemeCustomizer/ThemeCustomizer";
import {
  getDateRange,
  getUserNameFromEmailId,
} from "../../utility/utilityFunctions";
import { useDispatch } from "react-redux";
import {
  appSettingsUpdate,
  setCurrentPayload,
  setFilterOptions,
  setThemeMode,
} from "../../redux/reducers/appReducer";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  Box,
  Divider,
  Button,
  DialogActions,
  Select,
  MenuItem
} from "@mui/material";
import CustomSelect from "../../UIComponents/CustomSelect";
import { useTheme } from "@mui/material/styles";
//import HealthMonitor from "./HealthMonitor";
import fnGetAllTranslations from "../../utility/fnGetAllTranslations";
import { updateTranslations } from "../../i18n";
import fnServiceRequest from "../../utility/fnServiceRequest";
import BusyIndicator from "../../utility/BusyIndicator";
import { Setting, BellFilled, Bell, UpArrow, Dropdown } from "@cw/rds/icons";
import { HeaderControlButton as HeaderButton } from "../../UIComponents/Button";
import CustomAutocomplete from "../../UIComponents/CustomAutocomplete";
import { ButtonTypes } from "../../UIComponents/UITypes";

// --- GLOBAL CONSTANTS & HELPERS ---

const INITIAL_FILTER_STATE = {
  createdDateFrom: "",
  createdDateTo: "",
  customerId: "",
  exceptionType: [],
  poNumber: "",
  salesGroup: "",
  salesOffice: "",
  isRushOrder: "",
  salesOrg: [],
  documentProcessStatus: [],
  orderHeaderId: "",
  sapOrderId: "",
  orderType: "",
  distChannel: "",
  senderEmail: "",
  country: "",
};

const StyledIconButton = styled(MuiIconButton)(({ theme }) => ({
  padding: "8px",
  borderRadius: "50%",
  transition: "all 0.2s ease",
  "&:hover": {
    // backgroundColor: "rgba(0, 0, 0, 0.08)",
    transform: "translateY(-1px)",
  },
}));

const AppHeader = () => {
  const theme = useTheme();
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const navigate = useNavigate();
  // const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false);
  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false);
  const [appearanceAnchorEl, setAppearanceAnchorEl] = useState(null);
  const isAppearanceOpen = Boolean(appearanceAnchorEl);

  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const userRoles = useSelector((state) => state.appReducer.userRoles);
  const appSettings = useSelector((state) => state.appReducer.appSettings);
  let userData = useSelector((state) => state.appReducer.userDetails);
  const displayName = getUserNameFromEmailId(userDetails?.emailId || userDetails?.email);
  const [notifications, setNotifications] = useState([]);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userProfileAnchorElement, setUserProfileAnchorElement] =
    useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const userLanguage = useSelector((state) => state.appReducer.userLanguage);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [healthDialogOpen, setHealthDialogOpen] = useState(false);
  const [ocrTool, setOcrTool] = useState("Abby");
  const [erpSystem, setErpSystem] = useState("ECC");
  const [busyIndicatorFlag, setBusyindicatorFlag] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const dispatch = useDispatch();
  const fnProfileClickHandler = (event) => {
    setShowUserProfile((prev) => true);
    setUserProfileAnchorElement(event.currentTarget);
  };
  const themeMode = useSelector((state) => state.appReducer.themeMode);
  
  
  const [settingsObj, setSettingsObj] = useState({
    dateFormat: appSettings.dateFormat ?? "MM/DD/YYYY",
    range: appSettings.range,
    timeFormat: appSettings.timeFormat,
    language: appSettings.language ?? "EN",
  });
  const oCurrentPayload = useSelector(
    (state) => state.appReducer.oCurrentPayload
  );
  const handleSettingsOpen = () => {
    setSettingsDialogOpen(true);
  };
  const handleSettingsClose = () => {
    setSettingsDialogOpen(false);
  };
  const [healthAnchorEl, setHealthAnchorEl] = useState(null);
  const handleHealthOpen = (event) => {
    setHealthAnchorEl(event.currentTarget);
  };
  const handleHealthClose = () => {
    setHealthAnchorEl(null);
  };
  const isHealthOpen = Boolean(healthAnchorEl);
  const [notificationCount, setNotificationCount] = useState();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const handleNotificationsOpen = (event) => {
    setIsNotificationsOpen(true);
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setIsNotificationsOpen(false);
    setNotificationsAnchorEl(null);
  };


  const toTitleCase = (s = "") =>
    String(s)
      .replace(/[_-]+/g, " ")
      .trim()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");


  const getDisplayRole = () => {
    let icon = showUserProfile ? <UpArrow style={{color: "#fff"}}/> : <Dropdown style={{color: "#fff"}}/>;
    const roleToDisplay = Array.isArray(userRoles) && userRoles.length > 0 ? userRoles[0] : null;
    const role = toTitleCase(roleToDisplay);
    if (!role) return " ";
    return (
      <Box className="header-role-content" display={"flex"} gap={1} mr={1} alignItems={"center"}>
        <span className="header-role-label">{role}</span>
        <span className="header-role-icon">{icon}</span>
      </Box>
    );
  };


  const selectLightDefault = () => {
    dispatch(setThemeMode("light"));
    // clear light overrides so Light uses base theme.js
    dispatch({ type: "PALETTE/UPDATE", payload: null });
  };

  const selectDark = () => {
    dispatch(setThemeMode("dark"));
    // nothing else; overrides are ignored in dark by App.jsx
  };

  const resetCurrentMode = () => {
    if (themeMode === "light") {
      dispatch({ type: "PALETTE/UPDATE", payload: null });
    }
    // dark has no overrides; nothing to do
  };

  // Replace languages constant with redux state
  const availableLanguages = useSelector(
    (state) => state.appReducer.availableLanguages
  );
  const translations = useSelector((state) => state.appReducer.translations);

  // Fetch translations on component mount
  useEffect(() => {
    fnGetAllTranslations(dispatch);
  }, [dispatch]);

  // Update i18next when translations or languages change
  useEffect(() => {
    if (availableLanguages.length > 0 && Object.keys(translations).length > 0) {
      updateTranslations(translations, availableLanguages);
    }
  }, [translations, availableLanguages]);

  const handleSelect = (e) => {
    const value = e.target.value;

    if (value.startsWith("header-")) return;
    setSettingsObj((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const dispatchDefaultDateRange = (range) => {
    let { startDate, endDate } = getDateRange(range);
    const formatDate = (dateObj) => {
      const d = new Date(dateObj);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${month}${day}${year}`;
    };
    const formatDateHyphen = (dateObj) => {
      const d = new Date(dateObj);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${month}-${day}-${year}`;
    };
    let newStartDate = formatDate(startDate);
    let newEndDate = formatDate(endDate);
    let newStartDateHyphen = formatDateHyphen(startDate);
    let newEndDateHyphen = formatDateHyphen(endDate);
    dispatch(
      setCurrentPayload({
        filterData: {
          ...INITIAL_FILTER_STATE,
          createdDateFrom: newStartDate,
          createdDateTo: newEndDate,
        },
        pageNumber: 1,
        pageSize: 50,
      })
    );
    dispatch(
      setFilterOptions({
        filterData: {
          ...INITIAL_FILTER_STATE,
          createdDateFrom: newStartDateHyphen,
          createdDateTo: newEndDateHyphen,
        },
        pageNumber: 1,
        pageSize: 50,
      })
    );
  };

  const fetchAppSettings = () => {
    let hSuccess = (data) => {
      if (!data) {
        dispatchDefaultDateRange(String(appSettings.range));
      } else {
        if (
          data.data.dateFormat ||
          data.data.range ||
          data.data.timeFormat ||
          data.data.landingPage
        ) {
          const appSettingsData = {
            dateFormat: data.data.dateFormat === "" ? "DD/MM/YYYY" : data.data.dateFormat,
            range: data.data.range,
            timeFormat: data.data.timeFormat,
            language: data.data.language,
          };
          dispatch(appSettingsUpdate(appSettingsData));
          let { startDate, endDate } = getDateRange(data.data.range);
          // Convert to ddmmyyyy format
          const formatDate = (dateObj) => {
            const d = new Date(dateObj);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${month}${day}${year}`;
          };
          let newStartDate = formatDate(startDate);
          let newEndDate = formatDate(endDate);
          const formatDateHyphen = (dateObj) => {
            const d = new Date(dateObj);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${month}-${day}-${year}`;
          };
          let newStartDateHyphen = formatDateHyphen(startDate);
          let newEndDateHyphen = formatDateHyphen(endDate);
          console.log(startDate, endDate);
          dispatch(
            setCurrentPayload({
              filterData: {
                ...INITIAL_FILTER_STATE,
                createdDateFrom: newStartDate,
                createdDateTo: newEndDate,
              },
              pageNumber: 1,
              pageSize: 50,
            })
          );
          dispatch(
            setFilterOptions({
              filterData: {
                  ...INITIAL_FILTER_STATE,
                createdDateFrom: newStartDateHyphen,
                createdDateTo: newEndDateHyphen,
              },
              pageNumber: 1,
              pageSize: 50,
            })
          );

          changeLanguage(data.data.language ?? "en");
          setSettingsObj({
            ...settingsObj,
            dateFormat: data.data.dateFormat === "" ? "DD/MM/YYYY" : data.data.dateFormat,
            range: data.data.range ?? 7,
            timeFormat: data.data.timeFormat ?? "hh:mm A",
            language: data.data.language ?? "EN",
          });
          console.log(settingsObj, data.data, "...")
        } else {
          // API returned data but no usable settings — use defaults
          dispatchDefaultDateRange(String(appSettings.range));
        }
      }
    };
    let hError = () => {
      dispatchDefaultDateRange(String(appSettings.range));
    };
    fnServiceRequest(
      `/JavaServices_Oauth/api/applicationSettings/getSetting?emailId=${userData?.emailId || userData?.email}`,
      "get",
      hSuccess,
      hError
    );
  };

  useEffect(() => {
    fetchAppSettings();
  }, []);
  const handleSave = () => {
    setBusyindicatorFlag(true);
    let payload = {
      range: settingsObj.range,
      dateFormat: settingsObj.dateFormat,
      timeFormat: settingsObj.timeFormat,
      language: settingsObj.language,
      emailId: userData?.emailId || userData?.email,
    };
    let hSuccess = (data) => {
      if (data.status && data.status.toLowerCase() === "success") {
        const newData = {
          dateFormat: data.data.dateFormat === "" ? "DD/MM/YYYY" : data.data.dateFormat,
          range: data.data.range,
          timeFormat: data.data.timeFormat,
          language: data.data.language,
        };
        let { startDate, endDate } = getDateRange(data.data.range);
        // Convert to ddmmyyyy format
        const formatDate = (dateObj) => {
          const d = new Date(dateObj);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${month}${day}${year}`;
        };
        let newStartDate = formatDate(startDate);
        let newEndDate = formatDate(endDate);
        const formatDateHyphen = (dateObj) => {
          const d = new Date(dateObj);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${month}-${day}-${year}`;
        };
        let newStartDateHyphen = formatDateHyphen(startDate);
        let newEndDateHyphen = formatDateHyphen(endDate);
        console.log(startDate, endDate);
        dispatch(
          setCurrentPayload({
            filterData: {
                ...INITIAL_FILTER_STATE,
              createdDateFrom: newStartDate,
              createdDateTo: newEndDate,
            },
            pageNumber: 1,
            pageSize: 50,
          })
        );
        dispatch(
          setFilterOptions({
            filterData: {
                ...INITIAL_FILTER_STATE,
              createdDateFrom: newStartDateHyphen,
              createdDateTo: newEndDateHyphen,
            },
            pageNumber: 1,
            pageSize: 50,
          })
        );
        changeLanguage(data.data.language ?? "en");
        dispatch(appSettingsUpdate(newData));
      } else {
        fetchAppSettings();
      }
      setBusyindicatorFlag(false);
      handleSettingsClose();
    };
    let hError = () => {
      handleSettingsClose();
      setBusyindicatorFlag(false);
    };

    fnServiceRequest(
      `/JavaServices_Oauth/api/applicationSettings/addSetting`,
      "POST",
      hSuccess,
      hError,
      payload
    );
  };

  const dateFormatOptions = [
    { key: "DD MMM YYYY", value: "DD MMM YYYY (01 Apr 2025)", type: "Common Formats" },
    { key: "MMM DD, YYYY", value: "MMM DD, YYYY (Apr 01, 2025)", type: "Common Formats" },
    { key: "YYYY MMM DD", value: "YYYY MMM DD (2025 Apr 01)", type: "Common Formats" },
    { key: "DD-MM-YYYY", value: "DD-MM-YYYY (01-04-2025)", type: "With Hyphens" },
    { key: "MM-DD-YYYY", value: "MM-DD-YYYY (04-01-2025)", type: "With Hyphens" },
    { key: "YYYY-MM-DD", value: "YYYY-MM-DD (2025-04-01)", type: "With Hyphens" },
    { key: "DD/MM/YYYY", value: "DD/MM/YYYY (01/04/2025)", type: "With Slashes" },
    { key: "MM/DD/YYYY", value: "MM/DD/YYYY (04/01/2025)", type: "With Slashes" },
    { key: "YYYY/MM/DD", value: "YYYY/MM/DD (2025/04/01)", type: "With Slashes" },
  ];

  return (
    <>
      {busyIndicatorFlag && <BusyIndicator />}

      <header className="appHeader">
        <Stack
          className="header-brand"
          direction="row"
          justifyContent="flex-start"
          alignItems={"center"}
          gap={1}
        >
          <img
            className="header-brand-logo"
            src={CherryWork}
            style={{ verticalAlign: "middle" }}
            alt=" "
            height={"32px"}
            width="auto"
          />
          <Stack direction="column">
            <Typography
              className="header-brand-title"
              sx={{
                color: (theme) => theme.palette.text.default,
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
                color: (theme) => theme.palette.text.paper,
                fontFamily: "Roboto, sans-serif",
                fontSize: "10px",
                fontStyle: "italic",
                fontWeight: "400",
                lineHeight: "15px",
              }}
            >
              Trades Simplified
            </Typography>
          </Stack>
        </Stack>

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
                color: (theme) => theme.palette.text.default,
                "&:hover": {
                  backgroundColor: "#eae9ff !important",
                },
              }}
            >
              <Setting style={{color: "#fff"}}/>
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
              <ClipboardPlus style={{color: "#fff"}}/>
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
              <Badge color="error"
                variant="dot"
                invisible={unreadCount === 0} >
                {isNotificationsOpen ? (
                  <BellFilled style={{color: "#fff"}} />
                ) : (
                  <Bell style={{color: "#fff"}} />
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
                <Button
                  sx={{
                    padding: "0 !important",
                    width: "max-content",
                    // borderRadius: "25px",
                    // backgroundColor: (theme) => theme.palette.background.default,
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
                      sx={{ height: 38, }}
                    />
                    <Typography className="header-user-role" variant="body2" sx={{color: (theme) => theme.palette.text.default}}>
                      {getDisplayRole()}
                    </Typography>
                  </Stack>
                </Button>
              </Stack>
            </MuiIconButton>
          </Tooltip>
          {/* <Box display="flex" sx={{ marginRight: "-10px" }}>
            <HealthMonitor />
          </Box> */}
        </Stack>
      </header>
      <Dialog
        open={settingsDialogOpen}
        onClose={handleSettingsClose}
        PaperProps={{
          sx: {
            width: "700px",
            height: "450px",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            overflow: "hidden",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{ fontSize: "18px", fontWeight: "600", padding: "10px", justifyContent: "space-between", }}
        >
          <Typography variant="h6">{t("Application Settings")}</Typography>
          <Tooltip title="Appearance" arrow placement="bottom">
            <MuiIconButton
              size="small"
              onClick={(e) => setAppearanceAnchorEl(e.currentTarget)}
              sx={{
                "&:hover": { backgroundColor: "#eae9ff !important" },
              }}
            >
              <PaletteOutlinedIcon fontSize="small" />
            </MuiIconButton>
          </Tooltip>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ padding: "16px", display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Date Format */}
          <Typography variant="body1">
            Date Format <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomAutocomplete
            fullWidth
            value={dateFormatOptions.find(o => o.key === settingsObj.dateFormat) || null}
            name="dateFormat"
            onChange={(e, newValue) => {
              setSettingsObj((prev) => ({
                ...prev,
                dateFormat: newValue?.key || "",
              }));
            }}
            filterOptions={(x) => x}
            placeholder="Select Date Format"
            options={dateFormatOptions}
            groupBy={(option) => option.type}
            getOptionLabel={(option) => option.value}
            isOptionEqualToValue={(o, v) => o.key === v.key}
          // freeSolo={false}
          />
          {/* Time Format */}
          <Typography variant="body1">
            Time Format <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomSelect
            fullWidth
            value={settingsObj.timeFormat || ""}
            name="timeFormat"
            onChange={handleSelect}
            placeholder="Select Time Format"
            options={[
              { key: "hh:mm:ss A", value: "12-hour (01:34 AM)" },
              { key: "HH:mm:ss", value: "24-hour (13:34)" },
            ]}
          />

          {/* Default Date Range */}
          <Typography variant="body1">
            Default Date Range <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomSelect
            fullWidth
            value={settingsObj?.range || ""}
            name="range"
            onChange={handleSelect}
            placeholder="Select Default Date Range"
            options={[
              { key: "10", value: "This Week" },
              { key: "20", value: "This Month" },
              { key: "25", value: "Last one Month" },
              { key: "30", value: "Last Month" },
              { key: "40", value: "Current Quater" },
              { key: "50", value: "Last Quater" },
              { key: "60", value: "Current Year to Date" },
            ]}
          />

          {/* Default Language */}
          <Typography variant="body1">
            {t("Default Language")} <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomSelect
            fullWidth
            value={settingsObj.language || ""}
            name="language"
            onChange={handleSelect}
            placeholder="Select Default Language"
            options={availableLanguages.map((lang) => ({ key: lang.value, value: lang.text }))}
          />
        </DialogContent>
        <Divider />
        {/* Actions */}
        <DialogActions sx={{ px: 2, py: 1.5, gap: 2 }}>
          <HeaderButton
            action={ButtonTypes.CANCEL}
            onClick={() => handleSettingsClose()}
          >
            Cancel
          </HeaderButton>
          <HeaderButton action={ButtonTypes.SAVE} onClick={handleSave}>
            Save
          </HeaderButton>
        </DialogActions>
      </Dialog>
      <SystemHealthPopover
        open={isHealthOpen}
        anchorEl={healthAnchorEl}
        onClose={handleHealthClose}
      />
      <ThemeCustomizer
        open={themeCustomizerOpen}
        onClose={() => setThemeCustomizerOpen(false)}
      />
      <NotificationsPopover
        open={isNotificationsOpen}
        anchorEl={notificationsAnchorEl}
        onClose={handleNotificationsClose}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      {showUserProfile && (
        <UserProfile
          userDetails={userDetails}
          roles={userRoles}
          setShowUserProfile={setShowUserProfile}
          showUserProfile={showUserProfile}
          userProfileAnchorElement={userProfileAnchorElement}
          setUserProfileAnchorElement={setUserProfileAnchorElement}
        />
      )}
    </>
  );
};

export default AppHeader;

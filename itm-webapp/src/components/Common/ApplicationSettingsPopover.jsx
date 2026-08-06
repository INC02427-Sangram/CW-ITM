import React, { useEffect, useState } from "react";
import {
  Popover,
  Box,
  Typography,
  Divider,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setPreferences } from "../../redux/slices/userSlice";
import {
  dateFormatOptions,
  languageOptions,
  timeFormats,
  dateSettings,
} from "../../config/timeConfigs";
import Button from "../CommonMUI/CustomButton";

export default function ApplicationSettingsPopover({
  anchorEl,
  open,
  onClose,
}) {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const userPreferences = useSelector((state) => state.user.preferences);
  const [preferences, setPreferencesState] = useState(userPreferences);

  useEffect(() => {
    if (open) {
      setPreferencesState(userPreferences);
    }
  }, [open, userPreferences]);

  const handleSave = () => {
    dispatch(setPreferences(preferences));
    if (preferences.language && preferences.language !== i18n.language) {
      i18n.changeLanguage(preferences.language);
    }
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          width: 400,
          maxHeight: "85vh",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          overflow: "hidden",
          mt: 1,
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e3e7ee",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "16px",
              color: "#2f3136",
            }}
          >
            Application Settings
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Content Body */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: "calc(85vh - 120px)",
            overflowY: "auto",
          }}
        >
          {/* Date Format */}
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 0.5, color: "#2f3136" }}
            >
              Date Format <span style={{ color: "red" }}>*</span>
            </Typography>
            <Autocomplete
              size="small"
              options={dateFormatOptions}
              getOptionLabel={(option) => option.value}
              groupBy={(option) => option.type}
              defaultValue={
                preferences.dateFormat
                  ? dateFormatOptions.find(
                      (option) => option.key === preferences.dateFormat,
                    )
                  : dateFormatOptions[0]
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Date Format" />
              )}
              onChange={(event, newValue) => {
                // Handle date format change
                console.log("Selected Date Format:", newValue);
                setPreferencesState((prev) => ({
                  ...prev,
                  dateFormat: newValue?.key,
                }));
              }}
            />
          </Box>

          {/* Date ranges */}

          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 0.5, color: "#2f3136" }}
            >
              Date Range <span style={{ color: "red" }}>*</span>
            </Typography>
            <Autocomplete
              size="small"
              options={dateSettings}
              getOptionLabel={(option) => option.label}
              defaultValue={
                preferences.dateRange
                  ? dateSettings.find(
                      (option) => option.key === preferences.dateRange,
                    )
                  : dateSettings[0]
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Date Range" />
              )}
              onChange={(event, newValue) => {
                // Handle date range change
                console.log("Selected Date Range:", newValue);
                setPreferencesState((prev) => ({
                  ...prev,
                  dateRange: newValue.value,
                }));
              }}
            />
          </Box>

          {/* Time Format */}
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 0.5, color: "#2f3136" }}
            >
              Time Format <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                onChange={(event) => {
                  console.log("Selected Time Format:", event.target.value);
                  setPreferencesState((prev) => ({
                    ...prev,
                    timeFormat: event.target.value,
                  }));
                }}
                defaultValue={preferences.timeFormat || "HH:mm:ss"}
              >
                {timeFormats.map((format) => (
                  <MenuItem key={format.value} value={format.value}>
                    {format.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Default Language */}
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 0.5, color: "#2f3136" }}
            >
              Application Language <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={preferences.language || "en"}
                onChange={(event) => {
                  setPreferencesState((prev) => ({
                    ...prev,
                    language: event.target.value,
                  }));
                }}
              >
                {languageOptions.map((lang) => (
                  <MenuItem key={lang.key} value={lang.key}>
                    {lang.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider />

        {/* Footer Actions */}
        <Box
          sx={{
            p: 1.5,
            px: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            backgroundColor: "#f8f9fb",
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

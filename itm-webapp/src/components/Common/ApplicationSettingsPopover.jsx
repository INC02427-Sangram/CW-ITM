import React from "react";
import {
  Popover,
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import { useSelector, useDispatch } from "react-redux";
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
  const userPreferences = useSelector((state) => state.user.preferences);

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
              defaultValue={dateFormatOptions[0]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Date Format" />
              )}
              onChange={(event, newValue) => {
                // Handle date format change
                console.log("Selected Date Format:", newValue);
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
              getOptionLabel={(option) => option.value}
              defaultValue={dateSettings[0]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Date Range" />
              )}
              onChange={(event, newValue) => {
                // Handle date range change
                console.log("Selected Date Range:", newValue);
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
                }}
                defaultValue="hh:mm:ss A"
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
              Default Language <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                defaultValue="en"
                onChange={(event) => {
                  console.log("Selected Language:", event.target.value);
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
          <Button
            variant="outlined"
            size="small"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onClose}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

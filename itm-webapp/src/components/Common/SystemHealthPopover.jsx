import React from "react";
import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedIcon from "@mui/icons-material/Speed";
import CloudIcon from "@mui/icons-material/Cloud";

// Dummy system health data
const systemHealthData = {
  status: "Operational",
  services: [
    {
      name: "API Server",
      status: "online",
      responseTime: "45ms",
      uptime: "99.9%",
    },
    {
      name: "Database",
      status: "online",
      responseTime: "12ms",
      uptime: "99.8%",
    },
    {
      name: "Cache Service",
      status: "online",
      responseTime: "3ms",
      uptime: "100%",
    },
    {
      name: "File Storage",
      status: "warning",
      responseTime: "120ms",
      uptime: "98.5%",
    },
  ],
};

const getStatusColor = (status) => {
  switch (status) {
    case "online":
      return "#2e7d32";
    case "warning":
      return "#ed6c02";
    case "error":
      return "#d32f2f";
    default:
      return "#7b818f";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "online":
      return <CheckCircleIcon sx={{ color: getStatusColor(status) }} />;
    case "warning":
      return <WarningIcon sx={{ color: getStatusColor(status) }} />;
    default:
      return <CheckCircleIcon sx={{ color: getStatusColor(status) }} />;
  }
};

export default function SystemHealthPopover({ anchorEl, open, onClose }) {
  const overallStatus = systemHealthData.status;
  const allOnline = systemHealthData.services.every(
    (service) => service.status === "online"
  );

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
      sx={{
        mt: 1,
      }}
    >
      <Box
        sx={{
          width: 360,
        }}
      >
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "16px",
                color: "#2f3136",
              }}
            >
              System Health
            </Typography>
            <Chip
              label={overallStatus}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "12px",
                backgroundColor: allOnline ? "#e8f5e9" : "#fff3e0",
                color: allOnline ? "#2e7d32" : "#ed6c02",
              }}
            />
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* System Metrics */}
        <Box sx={{ p: 2, backgroundColor: "#f8f9fb" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <SpeedIcon sx={{ color: "#123db8", fontSize: 20, mb: 0.5 }} />
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#7b818f",
                  fontSize: "11px",
                  mb: 0.5,
                }}
              >
                Avg Response
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#2f3136",
                  fontSize: "14px",
                }}
              >
                45ms
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <CloudIcon sx={{ color: "#123db8", fontSize: 20, mb: 0.5 }} />
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#7b818f",
                  fontSize: "11px",
                  mb: 0.5,
                }}
              >
                Uptime
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#2f3136",
                  fontSize: "14px",
                }}
              >
                99.8%
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <StorageIcon sx={{ color: "#123db8", fontSize: 20, mb: 0.5 }} />
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#7b818f",
                  fontSize: "11px",
                  mb: 0.5,
                }}
              >
                Services
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#2f3136",
                  fontSize: "14px",
                }}
              >
                {systemHealthData.services.length}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Services List */}
        <List sx={{ p: 0 }}>
          {systemHealthData.services.map((service, index) => (
            <React.Fragment key={service.name}>
              <ListItem
                sx={{
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getStatusIcon(service.status)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#2f3136",
                      }}
                    >
                      {service.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "12px",
                        color: "#7b818f",
                      }}
                    >
                      {service.responseTime} • Uptime: {service.uptime}
                    </Typography>
                  }
                />
              </ListItem>
              {index < systemHealthData.services.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Popover>
  );
}

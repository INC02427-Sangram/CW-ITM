import React from "react";
import {
  Popover,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import ReusableTypography from "./ReusableTypography";

// Dummy notification data
const dummyNotifications = [
  {
    id: 1,
    type: "success",
    title: "Contract Approved",
    message: "Contract BTBC-882-2024 has been approved",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "warning",
    title: "Pending Action Required",
    message: "Purchase Order PO-1234 needs your review",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "info",
    title: "System Update",
    message: "New features are now available",
    time: "2 hours ago",
  },
];

const getNotificationIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon sx={{ color: "#2e7d32" }} />;
    case "warning":
      return <WarningIcon sx={{ color: "#ed6c02" }} />;
    case "info":
      return <InfoIcon sx={{ color: "#0288d1" }} />;
    default:
      return <NotificationsIcon sx={{ color: "#7b818f" }} />;
  }
};

export default function NotificationsPopover({ anchorEl, open, onClose }) {
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
          width: 380,
          maxHeight: 500,
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
          <ReusableTypography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "16px",
              color: "#2f3136",
            }}
          >
            Notifications
          </ReusableTypography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Notifications List */}
        <List sx={{ p: 0, maxHeight: 400, overflowY: "auto" }}>
          {dummyNotifications.length > 0 ? (
            dummyNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 2,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "#f8f9fb",
                    },
                    cursor: "pointer",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "transparent",
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <ReusableTypography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#2f3136",
                          mb: 0.5,
                        }}
                      >
                        {notification.title}
                      </ReusableTypography>
                    }
                    secondary={
                      <>
                        <ReusableTypography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            color: "#7b818f",
                            mb: 0.5,
                          }}
                        >
                          {notification.message}
                        </ReusableTypography>
                        <ReusableTypography
                          variant="caption"
                          sx={{
                            fontSize: "12px",
                            color: "#a3adba",
                          }}
                        >
                          {notification.time}
                        </ReusableTypography>
                      </>
                    }
                  />
                </ListItem>
                {index < dummyNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
              }}
            >
              <ReusableTypography
                variant="body2"
                sx={{
                  color: "#7b818f",
                }}
              >
                No notifications
              </ReusableTypography>
            </Box>
          )}
        </List>

        {/* Footer */}
        <Box
          sx={{
            p: 1.5,
            borderTop: "1px solid #e3e7ee",
            textAlign: "center",
          }}
        >
          <Button
            fullWidth
            sx={{
              textTransform: "none",
              color: "#123db8",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

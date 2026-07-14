import React from "react";
import { Chip, Box, Tooltip, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { getPriorityColor } from "./CustomTableUtils";
import {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
  DOC_STATUS_CREATED_WITH_BLOCK,
} from "../../dataStore/docProcessStatus";

/**
 * Status Chip Component
 * Renders chips for different order statuses
 */
export const StatusChip = ({ status, theme }) => {
  const getStatusConfig = (status) => {
    const statusMap = {
      Created: {
        label: "Created",
        bg: theme.palette.statusChips.created.bg,
        text: theme.palette.statusChips.created.text,
        border: theme.palette.statusChips.created.border || theme.palette.statusChips.created.text,
      },
      [DOC_STATUS_CREATED_WITH_BLOCK]: {
        label: DOC_STATUS_CREATED_WITH_BLOCK,
        bg: theme.palette.statusChips.created.bg,
        text: theme.palette.statusChips.created.text,
        border: theme.palette.statusChips.created.border || theme.palette.statusChips.created.text,

      },
      Queued: {
        label: "Queued",
        bg: theme.palette.statusChips.queued.bg,
        text: theme.palette.statusChips.queued.text,
        border:theme.palette.statusChips.queued.border || theme.palette.statusChips.queued.text,
      },
      [DOC_STATUS_PENDING_FOR_APPROVAL]: {
        label: DOC_STATUS_PENDING_FOR_APPROVAL,
        bg: theme.palette.statusChips.pendingForApproval.bg,
        text: theme.palette.statusChips.pendingForApproval.text,
        border:
          theme.palette.statusChips.pendingForApproval.border ||
          theme.palette.statusChips.pendingForApproval.bg,
      },
      [DOC_STATUS_REJECTED]: {
        label: DOC_STATUS_REJECTED,
        bg: theme.palette.statusChips.rejected.bg,
        text: theme.palette.statusChips.rejected.text,
        border: theme.palette.statusChips.rejected.border || theme.palette.statusChips.rejected.bg,
      },
      "To Be Reviewed": {
        label: "To Be Reviewed",
        bg: theme.palette.statusChips.toBeReviewed.bg,
        text: theme.palette.statusChips.toBeReviewed.text,
        border:theme.palette.statusChips.toBeReviewed.border || theme.palette.statusChips.toBeReviewed.text,
      },
      Drafted: {
        label: "To Be Reviewed",
        bg: theme.palette.statusChips.toBeReviewed.bg,
        text: theme.palette.statusChips.toBeReviewed.text,
      },
      Cancelled: {
        label: "Cancelled",
        bg: theme.palette.statusChips.cancelled.bg,
        text: theme.palette.statusChips.cancelled.text,
        border: theme.palette.statusChips.cancelled.border || theme.palette.statusChips.cancelled.text,

      },
    };

    return statusMap[status] || { label: "NULL", bg: "default", text: "default" };
  };

  const config = getStatusConfig(status);

  const longLabelStatuses = [DOC_STATUS_PENDING_FOR_APPROVAL, DOC_STATUS_CREATED_WITH_BLOCK];

  return (
    <Tooltip title={longLabelStatuses.includes(status) ? config.label : ""} placement="bottom">
    <Chip
      label={config.label}
      style={{
        height: "2.25rem",
        width: "100%",
        backgroundColor: config.bg,
        color: config.text,
        border: `0.5px solid ${config.border || config.bg}`,
      }}
    />
    </Tooltip>
  );
};

/**
 * Exception Type Chip Component with expandable tooltip
 */
export const ExceptionChip = ({ exceptionValue, row, aSmartOrderList, theme }) => {
  if (!exceptionValue) {
    const smartOrder = aSmartOrderList?.[row.id];
    if (
      !smartOrder ||
      !smartOrder.sapErrorResponse ||
      smartOrder.sapErrorResponse === "" ||
      smartOrder.exceptionType === ""
    ) {
      return <span>-</span>;
    }
    return (
      <Chip
        label={smartOrder.sapErrorResponse}
        variant="outlined"
        sx={{
          height: "2.25rem",
          border: "1px solid transparent",
          background: "linear-gradient(135deg, #ffd6dc, #ffa8b2)",
          color: "#4c4c4c",
          fontSize: "0.7rem",
          fontWeight: 500,
          padding: "2px 10px",
          borderRadius: "1rem",
          boxShadow: "0 1px 4px rgba(255, 160, 180, 0.3)",
          lineHeight: 1.5,
          textShadow: "0 1px 1px rgba(0, 0, 0, 0.05)",
        }}
      />
    );
  }

  const exceptions = exceptionValue
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (exceptions.length === 0) return <span>-</span>;

  const first = exceptions[0];
  const rest = exceptions.slice(1);

  const chipStyleFor = (label) => {
    const key = label.replace(/\s+/g, "").toLowerCase();
    const palette = theme.palette.exceptionChips[key] || theme.palette.exceptionChips.default;
    return {
      height: "2.25rem",
      backgroundColor: palette.bg,
      color: palette.text,
      border: `1px solid ${palette.bg}`,
    };
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "nowrap" }}>
      <Chip label={first} size="small" style={chipStyleFor(first)} />

      {rest.length > 0 && (
        <Tooltip
          placement="top-start"
          arrow
          enterTouchDelay={0}
          title={
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: 440 }}>
              {exceptions.map((e, i) => (
                <Chip key={i} label={e} size="small" style={chipStyleFor(e)} />
              ))}
            </Box>
          }
          slotProps={{
            tooltip: {
              sx: (theme) => ({
                bgcolor: theme.palette.mode === "dark" ? "#2c2f35" : "#ffffff",
                p: 1,
                borderRadius: "10px",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.7)"
                    : "0 4px 12px rgba(0,0,0,0.15)",
                border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#e6e8eb"}`,
              }),
            },
            arrow: {
              sx: (theme) => ({
                color: theme.palette.mode === "dark" ? "#2c2f35" : "#ffffff",
              }),
            },
          }}
        >
          <IconButton
            size="small"
            sx={{ p: 0.5, ml: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Show all exception types"
          >
            <InfoIcon fontSize="small" color="grey" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

/**
 * Priority Chip Component
 */
export const PriorityChip = ({ priority, theme }) => {
  const priorityLevel = getPriorityColor(priority);
  const chipColors = theme.palette.priorityChips[priorityLevel] || theme.palette.priorityChips.default;

  return (
    <Chip
      label={priority}
      size="small"
      style={{
        backgroundColor: chipColors.bg,
        color: chipColors.text,
        height: "1.8rem",
        border: `1px solid ${chipColors.bg}`,
        fontWeight: "600",
      }}
    />
  );
};

/**
 * Azure Status Chip Component
 */
export const AzureChip = ({ isActive, theme }) => {
  const chipColors = isActive
    ? theme.palette.azureChips.active
    : theme.palette.azureChips.inactive;

  return (
    <Chip
      label={isActive ? "Active" : "Inactive"}
      size="small"
      style={{
        backgroundColor: chipColors.bg,
        color: chipColors.text,
        height: "2rem",
        border: `1px solid ${chipColors.bg}`,
      }}
    />
  );
};

/**
 * Order Block Chip Component
 */
export const OrderBlockChip = ({ value, theme }) => {
  const chipColors = theme.palette.orderBlockChips.default;

  return (
    <Chip
      label={value}
      size="small"
      style={{
        backgroundColor: chipColors.bg,
        color: chipColors.text,
        border: `1px solid ${chipColors.bg}`,
        height: "1.8rem",
        fontWeight: 500,
        minWidth: "2.2rem",
        justifyContent: "center",
      }}
    />
  );
};

/**
 * Recipient Type Chip Component
 */
export const RecipientTypeChip = ({ recipientType }) => {
  const groupValue = recipientType || "general";

  const getGroupInfo = (type) => {
    switch (type) {
      case "admin":
        return { label: "Administrators", color: "error" };
      case "support":
        return { label: "Support Team", color: "primary" };
      case "general":
        return { label: "General Users", color: "warning" };
      default:
        return { label: type || "N/A", color: "default" };
    }
  };

  const groupInfo = getGroupInfo(groupValue);

  return (
    <Chip
      label={groupInfo.label}
      size="small"
      color={groupInfo.color}
      style={{
        fontWeight: 400,
        height: "2rem",
        width: "8rem",
        justifyContent: "center",
        fontSize: "14px !important",
      }}
    />
  );
};

/**
 * Notification Types Chip Component with expandable view
 */
export const NotificationTypesChip = ({ notificationTypes, rowId, theme }) => {
  const raw = notificationTypes;
  const notifications = Array.isArray(raw)
    ? raw
    : typeof raw === "string"
      ? raw.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  if (notifications.length === 0) return "-";

  const displayCount = 1;
  const visibleNotifications = notifications.slice(0, displayCount);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
        alignItems: "center",
      }}
    >
      {visibleNotifications.map((type, index) => (
        <Chip
          key={`${rowId}-vis-${index}`}
          label={type}
          size="small"
          variant="outlined"
          sx={(theme) => ({
            fontSize: "12px",
            lineHeight: 1.2,
            bgcolor: theme.palette.mode === "dark" ? "#2c2f35" : "#f5f7fa",
            color: theme.palette.mode === "dark" ? "#f5f5f5" : "#333",
            borderColor: theme.palette.mode === "dark" ? "#555" : "#d0d7de",
          })}
        />
      ))}

      {notifications.length >= 2 && (
        <Tooltip
          placement="top-start"
          arrow
          enterTouchDelay={0}
          title={
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: 440 }}>
              {notifications.map((type, i) => (
                <Chip
                  key={`${rowId}-all-${i}`}
                  label={type}
                  size="small"
                  variant="outlined"
                  sx={(theme) => ({
                    fontSize: "12px",
                    lineHeight: 1.2,
                    bgcolor: theme.palette.mode === "dark" ? "#2c2f35" : "#f5f7fa",
                    color: theme.palette.mode === "dark" ? "#f5f5f5" : "#333",
                    borderColor: theme.palette.mode === "dark" ? "#555" : "#d0d7de",
                  })}
                />
              ))}
            </Box>
          }
          slotProps={{
            tooltip: {
              sx: (theme) => ({
                bgcolor: theme.palette.mode === "dark" ? "#2c2f35" : "#ffffff",
                p: 1,
                borderRadius: "10px",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.7)"
                    : "0 4px 12px rgba(0,0,0,0.15)",
                border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#e6e8eb"}`,
              }),
            },
            arrow: {
              sx: (theme) => ({
                color: theme.palette.mode === "dark" ? "#2c2f35" : "#ffffff",
              }),
            },
          }}
        >
          <IconButton
            size="small"
            sx={{ p: 0.5, ml: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Show all notification types"
          >
            <InfoIcon fontSize="small" color="grey" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

/**
 * Month Year Display Component
 */
export const MonthYearDisplay = ({ value }) => {
  if (!value) return "-";

  const [year, month] = value.split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthIndex = parseInt(month) - 1;

  return monthIndex >= 0 && monthIndex < 12
    ? `${monthNames[monthIndex]} ${year}`
    : value;
};

export const DateTimeChip = ({ label, sx }) => {
  const theme = useTheme();
  return (
    <Chip
      label={label}
      variant="outlined"
      size="small"
      sx={{
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        padding: "0px 5px",
        maxWidth: "100%",
        "& .MuiChip-label": {
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        ...sx,
      }}
    />
  )
};

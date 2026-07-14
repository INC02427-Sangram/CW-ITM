import React from "react";
import moment from "moment";
import {
  Box,
  IconButton,
  Tooltip,
  Stack,
  Switch,
  Typography,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import TableChartIcon from "@mui/icons-material/TableChart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import RestoreIcon from '@mui/icons-material/Restore';
import {
  CircleCheckbox,
  TriangleAlert,
  Check,
  CircleCross,
  Trash,
  Pencil,
} from "@cw/rds/icons";
import { HeaderControlButton } from "../../UIComponents/Button";
import {
  StatusChip,
  ExceptionChip,
  PriorityChip,
  AzureChip,
  OrderBlockChip,
  RecipientTypeChip,
  NotificationTypesChip,
  MonthYearDisplay,
} from "./CustomChips";
import {
  EditableQuantityCell,
  EditableUomCell,
  EditableUnitPriceCell,
  MaterialDescriptionAutocomplete,
  MaterialNumberAutocomplete,
  EditableHourField,
  EditableMinuteSelect,
  EditableDaySelect,
  EditableTimezoneSelect,
  AdminEditableTextField,
  AdminEditableNumberField,
} from "./EditableCells";
import { computeNetPrice, isRowEmpty } from "./CustomTableUtils";
import { customDateTimeFormat } from "../../utility/CustomDateTimeFormat";
/**
 * Format customer ID helper
 */
const formatCustomerId = (id) => {
  // Add your formatting logic here
  return id;
};

/**
 * Core date parser - converts to user's local timezone
 */
const parseToLocal = (date) => {
  let m;
  if (date instanceof Date) {
    m = moment(date);
  } else if (typeof date === "string") {
    // Normalize: trim excessive fractional seconds to 3 digits and treat as UTC if no offset
    let normalized = date.trim();
    // Truncate fractional seconds beyond 3 digits for moment compatibility
    normalized = normalized.replace(/(\.\d{3})\d+/, "$1");
    // If no timezone indicator (Z or +/-offset), append Z to treat as UTC
    if (!/Z|[+-]\d{2}:\d{2}$/.test(normalized)) {
      normalized += "Z";
    }
    m = moment.utc(normalized).local();
  } else {
    m = moment(date);
  }
  return m;
};

/**
 * Format date with time (converts to user's local timezone)
 */
const formatDate = (date, appSettings) => {
  if (!date) return "-";
  const dateFormat = appSettings?.dateFormat || "DD/MM/YYYY";
  const timeFormat = appSettings?.timeFormat || "hh:mm:ss A";
  const m = parseToLocal(date);
  if (!m.isValid()) return date;
  return m.format(`${dateFormat} ${timeFormat}`);
};

/**
 * Format date only (no time, converts to user's local timezone)
 */
const formatDate1 = (date, appSettings) => {
  if (!date) return "-";
  const dateFormat = appSettings?.dateFormat || "DD/MM/YYYY";
  const m = parseToLocal(date);
  if (!m.isValid()) return date;
  return m.format(dateFormat);
};

/**
 * Renders checkbox cell
 */
export const renderCheckboxCell = (row, rows, setRows, isSapMaterialList) => {
  return (
    <Checkbox
      checked={row.checkbox || false}
      onChange={(e) => {
        e.stopPropagation();
        const updatedRows = [...rows];
        const realIndex = rows.findIndex(
          (item) =>
            (isSapMaterialList &&
              (item.id === row.id || item.gid === row.gid)) ||
            (!isSapMaterialList &&
              item.serialNumber === row.serialNumber)
        );

        if (realIndex !== -1) {
          updatedRows[realIndex] = {
            ...updatedRows[realIndex],
            checkbox: e.target.checked,
          };
          if (setRows) setRows(updatedRows);
        }
      }}
    />
  );
};

/**
 * Renders date cell (date + time)
 */
export const renderDateCell = (value, appSettings) => {
  return value ? customDateTimeFormat(appSettings, value, undefined, true) : "-";
};

/**
 * Renders request date cell (date only)
 */
export const renderReqDateCell = (value, appSettings) => {
  return value ? customDateTimeFormat(appSettings, value, "YYYY-MM-DD") : "-";
};

/**
 * Renders month/year cell
 */
export const renderMonthYearCell = (value) => {
  return <MonthYearDisplay value={value} />;
};

/**
 * Renders status chip cell
 */
export const renderStatusCell = (value, theme) => {
  if (!value || value === "NULL") return <span>NULL</span>;
  return <StatusChip status={value} theme={theme} />;
};

/**
 * Renders customer cell
 */
export const renderCustomerCell = (row, fieldBinding) => {
  const customerName = row[fieldBinding[0]] || "";
  const customerId = row[fieldBinding[1]]
    ? `(${formatCustomerId(row[fieldBinding[1]])})`
    : "";
  return customerName === "-" && customerId === "-"
    ? "-"
    : customerName + customerId;
};

/**
 * Renders success flag cell
 */
export const renderSuccessFlagCell = (value) => {
  return value === "true" ? <CircleCheckbox color="success" /> : null;
};

/**
 * Renders icon cell (exception/success indicator)
 */
export const renderIconCell = (row) => {
  if (
    row.exceptionType &&
    row.exceptionType !== "Resolved" &&
    row.exceptionType !== ""
  ) {
    return <TriangleAlert color="error" size={"small"} />;
  }
  return <CircleCheckbox color="success" size={"small"} />;
};

/**
 * Renders serial number cell
 */
export const renderSerialNumberCell = (row) => {
  return row.soItemNumber || 0;
};

/**
 * Renders folder icon cell
 */
export const renderFolderIconCell = (row, theme) => {
  const folderType = row.type || "Folder";
  const isPDFFolder = folderType.toLowerCase() === "pdf";
  const isJSONFolder = folderType.toLowerCase() === "json";

  let displayFolderType = folderType;
  if (isPDFFolder) {
    displayFolderType = "PDF";
  } else if (isJSONFolder) {
    displayFolderType = "JSON";
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 1,
      }}
    >
      {isPDFFolder ? (
        <PictureAsPdfIcon
          sx={{
            color: theme.palette.error.main,
            fontSize: "1.2rem",
          }}
        />
      ) : (
        <FolderOutlinedIcon
          sx={{
            color: theme.palette.primary.main,
            fontSize: "1.2rem",
          }}
        />
      )}
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {displayFolderType}
      </Typography>
    </Box>
  );
};

/**
 * Renders document icon cell
 */
export const renderDocumentIconCell = (row, theme) => {
  const fileType = row.type || "Document";
  const isPDF = fileType.toLowerCase() === "pdf";
  const isJSON = fileType.toLowerCase() === "json";

  let displayType = fileType;
  if (isPDF) {
    displayType = "PDF";
  } else if (isJSON) {
    displayType = "JSON";
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {isPDF ? (
        <PictureAsPdfIcon
          sx={{
            color: theme.palette.error.main,
            fontSize: "1.2rem",
          }}
        />
      ) : (
        <DescriptionOutlinedIcon
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "1.2rem",
          }}
        />
      )}
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {displayType}
      </Typography>
    </Box>
  );
};

/**
 * Renders document actions cell
 */
export const renderDocumentActionsCell = (row, col, theme) => {
  if (col.onView || col.onDownload) {
    return (
      <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
        {col.onView && (
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                col.onView(row);
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {col.onDownload && (
          <Tooltip title="Download">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                col.onDownload(row);
              }}
              sx={{ color: theme.palette.text.secondary }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }
  return <Box sx={{ display: "flex", justifyContent: "center" }} />;
};

/**
 * Renders status icon cell
 */
export const renderStatusIconCell = (value) => {
  return <CircleCheckbox color="success" status={value} />;
};

/**
 * Renders admin switch cell
 */
export const renderAdminSwitchCell = (row, col) => {
  const isEditingSwitch = col.editRowIndex === row.originalIndex;
  return (
    <Switch
      checked={
        isEditingSwitch
          ? col.rowDraft?.[col.fieldBinding]
          : row[col.fieldBinding]
      }
      onChange={(e) => {
        e.stopPropagation();
        if (isEditingSwitch) {
          col.updateDraft(col.fieldBinding, e.target.checked);
        }
      }}
      disabled={!isEditingSwitch}
    />
  );
};

/**
 * Renders direct admin switch cell
 */
export const renderDirectAdminSwitchCell = (row, col) => {
  return (
    <Switch
      checked={!!row[col.fieldBinding]}
      onChange={() => {
        if (col.onStatusChange) {
          col.onStatusChange(row);
        }
      }}
      onClick={(e) => e.stopPropagation()}
    />
  );
};

/**
 * Renders custom button cell
 */
export const renderCustomButtonCell = (row, col, theme) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Tooltip title="Click to sync now for given sales org">
        <span>
          <HeaderControlButton
            action="save"
            size="small"
            className="sync-now-btn"
            onClick={() => col.onAction(row)}
            sx={{
              textTransform: "none",
              lineHeight: 1.5,
            }}
          >
            {col?.labelText || "Action"}
          </HeaderControlButton>
        </span>
      </Tooltip>
    </Box>
  );
};

/**
 * Renders admin actions cell
 */
export const renderAdminActionsCell = (row, col, theme) => {
  if (col.actionType === "editSave") {
    const isEditing = col.editRowIndex === row.originalIndex;
    if (isEditing) {
      return (
        <Stack direction="row" spacing={1} justifyContent="flex-start">
          <Tooltip title="Save">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                col.onSave(row.originalIndex);
              }}
              sx={{ color: "#28a745" }}
            >
              <Check size="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                col.onCancel();
              }}
              sx={{ color: "#dc3545" }}
            >
              <CircleCross size="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      );
    }
    return (
      <Stack direction="row" spacing={1} justifyContent="flex-start">
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              col.onEdit(row.originalIndex);
            }}
            sx={{ color: "#3026B9" }}
          >
            <Pencil fontSize="small" />
          </IconButton>
        </Tooltip>
        {typeof col.onDelete === "function" && (
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                col.onDelete(row.originalIndex);
              }}
              sx={{ color: "#dc2626" }}
            >
              <Trash fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    );
  }

  if (col.actionType === "delete") {
    return (
      <Tooltip title="Delete">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            const deleteKey = col.deleteKey;
            const payload = deleteKey ? row[deleteKey] : row.id;
            if (col.onAction && typeof col.onAction === "function") {
              col.onAction(payload);
            } else {
              console.error("onAction is not a function:", col.onAction);
            }
          }}
          sx={{ color: "#dc2626" }}
        >
          <Trash fontSize="small" color="error" />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
};

export {
  formatCustomerId,
  formatDate,
  formatDate1,
};

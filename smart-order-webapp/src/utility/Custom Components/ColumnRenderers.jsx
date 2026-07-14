/**
 * ColumnRenderers.js
 *
 * Provides renderCell functions for different column types in CustomTable.
 * This extracts the massive switch statement into a reusable module.
 */

import { Typography } from "@mui/material";
import { EllipsisWrapper } from "./EllipsisWrapper";
import {
  renderCheckboxCell,
  renderDateCell,
  renderReqDateCell,
  renderMonthYearCell,
  renderStatusCell,
  renderCustomerCell,
  renderSuccessFlagCell,
  renderIconCell,
  renderSerialNumberCell,
  renderFolderIconCell,
  renderDocumentIconCell,
  renderDocumentActionsCell,
  renderStatusIconCell,
  renderAdminSwitchCell,
  renderDirectAdminSwitchCell,
  renderCustomButtonCell,
  renderAdminActionsCell,
} from "./CellRenderers";
import {
  renderEditActionsCell,
  renderEditableQuantityCell,
  renderEditableUomCell,
  renderEditableUnitPriceCell,
  renderNetPriceCell,
  renderEditableMaterialDescriptionCell,
  renderEditableMaterialNumberCell,
  renderActionCell,
} from "./ActionCellRenderers";
import {
  EditableHourField,
  EditableMinuteSelect,
  EditableDaySelect,
  EditableTimezoneSelect,
  AdminEditableTextField,
  AdminEditableNumberField,
} from "./EditableCells";
import {
  ExceptionChip,
  PriorityChip,
  AzureChip,
  OrderBlockChip,
  RecipientTypeChip,
  NotificationTypesChip,
} from "./CustomChips";

/**
 * Get the appropriate renderCell function for a column
 * @param {Object} col - Column configuration
 * @param {Object} context - Context object with all necessary state and handlers
 * @returns {Function} RenderCell function for DataGrid
 */
export const getColumnRenderer = (col, context) => {
  const {
    rows,
    setRows,
    editableRow,
    editMode,
    unsavedRow,
    setUnsavedRow,
    isSapMaterialList,
    theme,
    canEdit,
    deletedMode,
    onRestoreRow,
    setEditMode,
    setEditableRow,
    handleSaveRow,
    handleCancelEdit,
    handleDeleteRow,
    setToastMessage,
    setToastType,
    setToastOpen,
    selectedShipTo,
    selectedSoldTo,
    fnNaviagtionToMaterialMismatch,
    aSmartOrderList,
    materialDescSearch,
    materialIdSearch,
    setMaterialDescSearch,
    setMaterialIdSearch,
    debouncedSearchByDesc,
    debouncedSearchByNumber,
    t,
    appSettings,
  } = context;

  return (params) => {
    const row = params.row;

    if (col.type === "render" && typeof col.renderCell === "function") {
      const content = col.renderCell(params);
      return (
        <EllipsisWrapper value={params.formattedValue || params.value}>
          {content}
        </EllipsisWrapper>
      );
    }

    let content;

    switch (col.type) {
      case "checkBox":
        content = renderCheckboxCell(row, rows, setRows, isSapMaterialList);
        break;

      case "date":
        content = renderDateCell(row[col.fieldBinding], appSettings);
        break;

      case "reqdate":
        content = renderReqDateCell(row[col.fieldBinding], appSettings);
        break;

      case "monthYear":
        content = renderMonthYearCell(row[col.fieldBinding]);
        break;

      case "status":
        content = renderStatusCell(row[col.fieldBinding], theme);
        break;

      case "customer":
        content = renderCustomerCell(row, col.fieldBinding);
        break;

      case "successFlag":
        content = renderSuccessFlagCell(row[col.fieldBinding]);
        break;

      case "sapItemNumber":
        return row.sapItemNumber || "";

      case "poQuantity":
        content = renderEditableQuantityCell({
          row,
          col,
          editableRow,
          editMode,
          unsavedRow,
          setUnsavedRow,
        });
        break;

      case "sapUom":
        content = row[col.fieldBinding] ?? "-";
        break;

      case "sapQuantity":
        content = row[col.fieldBinding] ?? "-";
        break;

      case "poUom":
        content = renderEditableUomCell({
          row,
          col,
          editableRow,
          editMode,
          unsavedRow,
          setUnsavedRow,
        });
        break;

      case "poUnitPrice":
        content = renderEditableUnitPriceCell({
          row,
          col,
          editableRow,
          editMode,
          unsavedRow,
          setUnsavedRow,
        });
        break;

      case "poTotalAmount":
        content = renderNetPriceCell({ row, col, unsavedRow });
        break;

      case "sapUnitPrice":
        content = row[col.fieldBinding] ?? "-";
        break;

      case "sapTotalPrice":
        content = row[col.fieldBinding] ?? "-";
        break;

      case "sapMatDescription":
        content = renderEditableMaterialDescriptionCell({
          row,
          col,
          editableRow,
          editMode,
          unsavedRow,
          setUnsavedRow,
          materialDescSearch,
          debouncedSearchByDesc,
          setMaterialDescSearch,
        });
        break;

      case "sapMaterialNumber":
        content = renderEditableMaterialNumberCell({
          row,
          col,
          editableRow,
          editMode,
          unsavedRow,
          setUnsavedRow,
          materialIdSearch,
          debouncedSearchByNumber,
          setMaterialIdSearch,
        });
        break;

      case "icons":
        content = renderIconCell(row);
        break;

      case "edit":
        content = renderEditActionsCell({
          row,
          editableRow,
          editMode,
          canEdit,
          deletedMode,
          onRestoreRow,
          setEditMode,
          setEditableRow,
          setUnsavedRow,
          handleSaveRow,
          handleCancelEdit,
          handleDeleteRow,
          unsavedRow,
          setToastMessage,
          setToastType,
          setToastOpen,
          t,
        });
        break;

      case "exceptionType":
      case "exceptionTypeButton":
        content = (
          <ExceptionChip
            exceptionValue={row[col.fieldBinding]}
            row={row}
            aSmartOrderList={aSmartOrderList}
            theme={theme}
          />
        );
        break;

      case "action":
        content = renderActionCell({
          row,
          selectedShipTo,
          selectedSoldTo,
          fnNaviagtionToMaterialMismatch,
          setToastMessage,
          setToastType,
          setToastOpen,
          deletedMode,
          t,
        });
        break;

      case "eanNumber":
        content = row[col.fieldBinding];
        break;

      case "sNo":
        content = renderSerialNumberCell(row);
        break;

      case "adminSwitch":
        content = renderAdminSwitchCell(row, col);
        break;

      case "directAdminSwitch":
        content = renderDirectAdminSwitchCell(row, col);
        break;

      case "adminEditableText": {
        const isEditingText = col.editRowIndex === row.originalIndex;

        if (isEditingText) {
          content = (
            <AdminEditableTextField
              value={
                col.editingData[col.fieldBinding] !== undefined
                  ? col.editingData[col.fieldBinding]
                  : row[col.fieldBinding]
              }
              onChange={(value) =>
                col.handleEditChange(col.fieldBinding, value)
              }
              error={col.editingErrors[col.fieldBinding]}
              helperText={col.editingErrors[col.fieldBinding]}
              maxLength={col.maxLength}
              multiline={col.multiline}
              fieldBinding={col.fieldBinding}
            />
          );
        } else if (col.fieldBinding === "priority") {
          content = (
            <PriorityChip priority={row[col.fieldBinding]} theme={theme} />
          );
        } else if (col.fieldBinding === "orderBlockDesc") {
          content = (
            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
              {row[col.fieldBinding]}
            </Typography>
          );
        } else {
          content = (
            <OrderBlockChip value={row[col.fieldBinding]} theme={theme} />
          );
        }
        break;
      }

      case "adminEditableNumber": {
        const isEditingNumber = col.editRowIndex === row.originalIndex;

        if (isEditingNumber) {
          content = (
            <AdminEditableNumberField
              value={col.rowDraft?.[col.fieldBinding]}
              onChange={(value) => {
                col.updateDraft(col.fieldBinding, value);
              }}
              onBlur={(e) => {
                if (col.fieldBinding === "frequency") {
                  const value = e.target.value.trim();
                  if (value === "" || parseInt(value, 10) <= 0) {
                    col.updateDraft(col.fieldBinding, row[col.fieldBinding]);
                  }
                }
              }}
              fieldBinding={col.fieldBinding}
              minValue={col.minValue}
              step={col.step}
            />
          );
        } else {
          content = row[col.fieldBinding];
        }
        break;
      }

      case "custom_btn":
        content = renderCustomButtonCell(row, col, theme);
        break;

      case "custom": {
        const isTimeField =
          col.fieldBinding === "time" ||
          col.fieldBinding === "weekDay" ||
          col.fieldBinding === "hour" ||
          col.fieldBinding === "minute" ||
          col.fieldBinding === "timezone" ||
          col.fieldBinding === "dataRetentionPeriod";

        if (isTimeField) {
          const isEditingRow = col.editRowIndex === row.originalIndex;

          if (isEditingRow) {
            if (col.fieldBinding === "hour") {
              content = (
                <EditableHourField
                  value={col.editingData?.[col.fieldBinding] ?? ""}
                  onChange={(value) => col.updateDraft(col.fieldBinding, value)}
                />
              );
            } else if (col.fieldBinding === "minute") {
              const rawValue = col.editingData?.[col.fieldBinding] ?? "";
              const currentValue =
                rawValue === 0 || rawValue === "0" ? "00" : String(rawValue);

              content = (
                <EditableMinuteSelect
                  value={currentValue}
                  onChange={(value) => col.updateDraft(col.fieldBinding, value)}
                />
              );
            } else if (col.fieldBinding === "time") {
              content = (
                <EditableHourField
                  value={
                    col.editingData?.[col.fieldBinding] ??
                    row[col.fieldBinding] ??
                    ""
                  }
                  onChange={(value) =>
                    col.handleEditChange(col.fieldBinding, value)
                  }
                />
              );
            } else if (col.fieldBinding === "weekDay") {
              content = (
                <EditableDaySelect
                  value={
                    col.editingData?.[col.fieldBinding] ??
                    row[col.fieldBinding] ??
                    ""
                  }
                  onChange={(value) =>
                    col.handleEditChange(col.fieldBinding, value)
                  }
                />
              );
            } else if (col.fieldBinding === "timezone") {
              const tzList = Array.isArray(col.editTimezones)
                ? col.editTimezones
                : [];

              content = (
                <EditableTimezoneSelect
                  value={
                    col.editingData?.[col.fieldBinding] ??
                    row[col.fieldBinding] ??
                    ""
                  }
                  timezones={tzList}
                  onChange={(value) =>
                    col.handleEditChange(col.fieldBinding, value)
                  }
                />
              );
            } else if (col.fieldBinding === "dataRetentionPeriod") {
              content = (
                <AdminEditableNumberField
                  value={
                    col.editingData?.[col.fieldBinding] ??
                    row[col.fieldBinding] ??
                    ""
                  }
                  onChange={(value) =>
                    col.handleEditChange(col.fieldBinding, value)
                  }
                  fieldBinding={col.fieldBinding}
                  minValue={1}
                  step={1}
                />
              );
            }
          } else {
            content = row[col.fieldBinding] ?? "-";
          }
        } else if (col.fieldBinding === "recipientType") {
          content = <RecipientTypeChip recipientType={row.recipientType} />;
        } else if (col.fieldBinding === "notificationTypes") {
          content = (
            <NotificationTypesChip
              notificationTypes={row?.notificationTypes}
              rowId={row.id}
              theme={theme}
            />
          );
        } else {
          content = row[col.fieldBinding] ?? "-";
        }

        break;
      }

      case "statusIcon":
        content = renderStatusIconCell(row[col.fieldBinding]);
        break;

      case "azureChip":
        content = (
          <AzureChip isActive={row[col.fieldBinding] !== false} theme={theme} />
        );
        break;

      case "folderIcon":
        content = renderFolderIconCell(row, theme);
        break;

      case "documentIcon":
        content = renderDocumentIconCell(row, theme);
        break;

      case "documentActions":
        content = renderDocumentActionsCell(row, col, theme);
        break;

      case "adminActions":
        content = renderAdminActionsCell(row, col, theme);
        break;

      default:
        if (Array.isArray(col.fieldBinding)) {
          content = col.fieldBinding.map((field) => row[field]).join(" - ");
        } else {
          content = row[col.fieldBinding];
        }
        break;
    }

    const noTooltipTypes = new Set([
      "date",
      "reqdate",
      "checkBox",
      "icons",
      "statusIcon",
      "folderIcon",
      "documentIcon",
      "edit",
      "action",
      "adminActions",
      "documentActions",
      "adminSwitch",
      "directAdminSwitch",
      "custom_btn",
      "azureChip",
      "successFlag",
      "status",
      "exceptionType",
      "sNo",
      "sapItemNumber",
      "poMaterialNumber",
      "poMatDescription",
      "sapMaterialNumber",
      "sapMatDescription",
      "sapQuantity",
      "sapUom",
      "poQuantity",
      "poUom",
      "poUnitPrice",
      "poTotalAmount",
      "eanNumber",
      "exceptionTypeButton",
    ]);

    const tooltipValue = noTooltipTypes.has(col.type)
      ? ""
      : params.formattedValue ??
      (typeof params.value === "string" || typeof params.value === "number"
        ? params.value
        : "");

    return (
      <EllipsisWrapper value={tooltipValue}>
        {content}
      </EllipsisWrapper>
    );
  };
};
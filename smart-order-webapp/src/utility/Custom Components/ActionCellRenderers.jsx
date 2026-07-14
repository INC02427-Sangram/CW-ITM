import React from "react";
import { Box, IconButton, Tooltip, Stack, Chip } from "@mui/material";
import { Check, CircleCross, Trash } from "@cw/rds/icons";
import RestoreIcon from '@mui/icons-material/Restore';
import EditIcon from "@mui/icons-material/Edit";
import { 
  EditableQuantityCell,
  EditableUomCell,
  EditableUnitPriceCell,
  MaterialDescriptionAutocomplete,
  MaterialNumberAutocomplete,
} from "./EditableCells";
import { computeNetPrice, isRowEmpty, rowHasChanges } from "./CustomTableUtils";
import { MAX_QUANTITY, MAX_UNIT_PRICE } from "../../dataStore/constants";

/**
 * Renders edit/save/cancel actions for a row
 */
export const renderEditActionsCell = ({
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
}) => {
  if (deletedMode) {
    return (
      <Stack direction="row" spacing={1}>
        <Tooltip title={t("Restore")}>
          <span>
            <IconButton
              aria-label="restore"
              onClick={(e) => {
                e.stopPropagation();
                if (typeof onRestoreRow === "function") onRestoreRow(row);
              }}
            >
              <RestoreIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    );
  }

  if (editableRow === row.orderItemId) {
    return (
      <Stack direction="row" spacing={2}>
        <IconButton
          aria-label="save"
          onClick={(e) => {
            e.stopPropagation();

            // Check for mandatory fields before proceeding
            const mandatoryFields = [
              "sapMaterialNumber",
              "sapMatDescription",
              "poQuantity",
              "poUom",
              "poUnitPrice",
            ];
            const mandatoryFieldLabels = {
              sapMaterialNumber: "SAP Material Number",
              sapMatDescription: "SAP Material Description",
              poQuantity: "PO Quantity",
              poUom: "PO UOM",
              poUnitPrice: "Unit Price",
            };
            const unsavedItem = unsavedRow[row.orderItemId] || {};

            const missingFields = mandatoryFields.filter((field) => {
              const value =
                unsavedItem[field] !== undefined
                  ? unsavedItem[field]
                  : row[field];
              return !value || value.toString().trim() === "";
            });

            if (missingFields.length > 0) {
              const missingLabels = missingFields.map(
                (field) => mandatoryFieldLabels[field] || field
              );
              setToastMessage(
                `Please fill in the mandatory fields: ${missingLabels.join(", ")}`
              );
              setToastType("warning");
              setToastOpen(true);
              return;
            }

            // Check for zero values in Quantity and Unit Price
            const qtyValue =
              unsavedItem.poQuantity !== undefined
                ? unsavedItem.poQuantity
                : row.poQuantity;
            const unitPriceValue =
              unsavedItem.poUnitPrice !== undefined
                ? unsavedItem.poUnitPrice
                : row.poUnitPrice;

            if (qtyValue !== undefined && qtyValue !== "" && parseFloat(qtyValue) === 0) {
              setToastMessage("Quantity must be greater than 0.");
              setToastType("warning");
              setToastOpen(true);
              return;
            }

            if (qtyValue !== undefined && qtyValue !== "" && parseInt(qtyValue, 10) > MAX_QUANTITY) {
              setToastMessage(`Quantity cannot exceed ${MAX_QUANTITY.toLocaleString()}.`);
              setToastType("warning");
              setToastOpen(true);
              return;
            }

            if (unitPriceValue !== undefined && unitPriceValue !== "" && parseFloat(unitPriceValue) === 0) {
              setToastMessage("Unit Price must be greater than 0.");
              setToastType("warning");
              setToastOpen(true);
              return;
            }

            if (unitPriceValue !== undefined && unitPriceValue !== "" && parseFloat(unitPriceValue) > MAX_UNIT_PRICE) {
              setToastMessage(`Unit Price cannot exceed ${MAX_UNIT_PRICE.toLocaleString()}.`);
              setToastType("warning");
              setToastOpen(true);
              return;
            }

            if (unitPriceValue !== undefined && unitPriceValue !== "" && /\.\d{4,}$/.test(String(unitPriceValue))) {
              setToastMessage("Unit Price allows only up to 3 decimal places.");
              setToastType("warning");
              setToastOpen(true);
              return;
            }

            if (!rowHasChanges(row, unsavedRow)) {
              setToastMessage("No changes made.");
              setToastType("info");
              setToastOpen(true);
              // Exit edit mode on no-change
              setEditMode(false);
              setEditableRow(null);
              // Clean any accidental draft
              setUnsavedRow((prev) => {
                const nxt = { ...(prev || {}) };
                delete nxt[row.orderItemId];
                return nxt;
              });
              return;
            }
            handleSaveRow(row.orderItemId);
          }}
        >
          <Check size={"small"} />
        </IconButton>

        {!(
          String(row.orderItemId || "").startsWith("temp_") &&
          isRowEmpty(row)
        ) && (
          <IconButton
            aria-label="cancel"
            onClick={(e) => {
              e.stopPropagation();
              handleCancelEdit(row.orderItemId);
            }}
          >
            <CircleCross size={"small"} />
          </IconButton>
        )}

        <IconButton
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRow(row.orderItemId);
          }}
        >
          <Trash fontSize="small" color="error" />
        </IconButton>
      </Stack>
    );
  }

  return (
    <Tooltip title={editableRow ? "save the unsaved row" : "Edit"}>
      <span>
        <IconButton
          aria-label="edit"
          disabled={!!editableRow || canEdit === false}
          onClick={(e) => {
            e.stopPropagation();
            setEditMode(true);
            setEditableRow(row.orderItemId);
          }}
        >
          <EditIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

/**
 * Renders editable quantity cell
 */
export const renderEditableQuantityCell = ({
  row,
  col,
  editableRow,
  editMode,
  unsavedRow,
  setUnsavedRow,
}) => {
  if (editableRow === row.orderItemId && editMode) {
    const currentValue =
      unsavedRow[row.orderItemId]?.[col.fieldBinding] ?? row[col.fieldBinding];

    return (
      <EditableQuantityCell
        value={currentValue}
        onChange={(newVal) => {
          setUnsavedRow((prev) => ({
            ...prev,
            [row.orderItemId]: {
              ...(prev[row.orderItemId] ?? {}),
              [col.fieldBinding]: newVal,
            },
          }));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.target.blur();
        }}
      />
    );
  }
  return row[col.fieldBinding];
};

/**
 * Renders editable UOM cell
 */
export const renderEditableUomCell = ({
  row,
  col,
  editableRow,
  editMode,
  unsavedRow,
  setUnsavedRow,
}) => {
  if (editableRow === row.orderItemId && editMode) {
    const currentValue =
      unsavedRow[row.orderItemId]?.[col.fieldBinding] ?? row[col.fieldBinding];

    return (
      <EditableUomCell
        value={currentValue}
        onChange={(newVal) => {
          setUnsavedRow((prev) => ({
            ...prev,
            [row.orderItemId]: {
              ...(prev[row.orderItemId] ?? {}),
              [col.fieldBinding]: newVal,
            },
          }));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.target.blur();
        }}
      />
    );
  }
  return row[col.fieldBinding];
};

/**
 * Renders editable unit price cell
 */
export const renderEditableUnitPriceCell = ({
  row,
  col,
  editableRow,
  editMode,
  unsavedRow,
  setUnsavedRow,
}) => {
  if (editableRow === row.orderItemId && editMode) {
    const currentValue =
      unsavedRow[row.orderItemId]?.[col.fieldBinding] ?? row[col.fieldBinding];

    return (
      <EditableUnitPriceCell
        value={currentValue}
        onChange={(v) => {
          setUnsavedRow((prev) => ({
            ...prev,
            [row.orderItemId]: {
              ...(prev[row.orderItemId] ?? {}),
              [col.fieldBinding]: v,
            },
          }));
        }}
      />
    );
  }
  return row[col.fieldBinding];
};

/**
 * Renders net price (computed from qty and unit price)
 */
export const renderNetPriceCell = ({ row, col, unsavedRow }) => {
  const draft = unsavedRow?.[row.orderItemId] || {};
  const qty = draft.poQuantity ?? row.poQuantity;
  const price = draft.poUnitPrice ?? row.poUnitPrice;

  const total = computeNetPrice(qty, price);

  if (total !== "") return total;

  // Fallback to backend value
  return row[col.fieldBinding] ?? "-";
};

/**
 * Renders editable material description autocomplete
 */
export const renderEditableMaterialDescriptionCell = ({
  row,
  col,
  editableRow,
  editMode,
  unsavedRow,
  setUnsavedRow,
  materialDescSearch,
  debouncedSearchByDesc,
  setMaterialDescSearch,
}) => {
  if (editableRow === row.orderItemId && editMode) {
    const currentValue =
      unsavedRow[row.orderItemId]?.sapMatDescription ??
      row[col.fieldBinding] ??
      "";

    return (
      <MaterialDescriptionAutocomplete
        value={currentValue}
        options={materialDescSearch}
        onChange={(event, newValue) => {
          // When an option from dropdown is chosen, find the full record
          const selected = (materialDescSearch || []).find(
            (x) => x.materialDescription === newValue
          );
          if (selected) {
            setUnsavedRow((prev) => ({
              ...prev,
              [row.orderItemId]: {
                ...(prev[row.orderItemId] ?? {}),
                sapMatDescription: selected.materialDescription || "",
                sapMaterialNumber: (selected.materialId || "").replace(
                  /^0+/,
                  ""
                ),
                sapUnitPrice: parseFloat(selected.netPrice) || 0,  
                exceptionType: null,
              },
            }));
            setMaterialDescSearch([]);
          } else if (!newValue || newValue.trim() === "") {
            // When cleared, also clear material number
            setUnsavedRow((prev) => ({
              ...prev,
              [row.orderItemId]: {
                ...(prev[row.orderItemId] ?? {}),
                sapMatDescription: "",
                sapMaterialNumber: "",
              },
            }));
            setMaterialDescSearch([]);
          } else {
            // Free text typed in dropdown input
            setUnsavedRow((prev) => ({
              ...prev,
              [row.orderItemId]: {
                ...(prev[row.orderItemId] ?? {}),
                sapMatDescription: newValue || "",
              },
            }));
          }
        }}
        onInputChange={(event, value, reason) => {
          if (reason === "clear" || reason === "reset") {
            setMaterialDescSearch([]);
            return;
          }
          if (reason !== "input") return;
          debouncedSearchByDesc(value, row.orderItemId);
        }}
        onKeyDown={(e) => {
          if (
            e.key === " " ||
            e.key === "ArrowUp" ||
            e.key === "ArrowDown" ||
            e.key === "Enter"
          ) {
            e.stopPropagation();
          }
        }}
      />
    );
  }
  return row[col.fieldBinding];
};

/**
 * Renders editable material number autocomplete
 */
export const renderEditableMaterialNumberCell = ({
  row,
  col,
  editableRow,
  editMode,
  unsavedRow,
  setUnsavedRow,
  materialIdSearch,
  debouncedSearchByNumber,
  setMaterialIdSearch,
}) => {
  if (editableRow === row.orderItemId && editMode) {
    const currentValue =
      unsavedRow[row.orderItemId]?.sapMaterialNumber ??
      row[col.fieldBinding] ??
      "";

    return (
      <MaterialNumberAutocomplete
        value={currentValue}
        options={materialIdSearch}
        onChange={(event, newValue) => {
          const normalized = (newValue || "").trim();
          const selected = (materialIdSearch || []).find(
            (x) => (x.materialId || "").replace(/^0+/, "") === normalized
          );
          if (selected) {
            setUnsavedRow((prev) => ({
              ...prev,
              [row.orderItemId]: {
                ...(prev[row.orderItemId] ?? {}),
                sapMaterialNumber: (selected.materialId || "").replace(
                  /^0+/,
                  ""
                ),
                sapMatDescription: selected.materialDescription || "",
                sapUnitPrice: parseFloat(selected.netPrice) || 0,  
                exceptionType: null,
              },
            }));
            setMaterialIdSearch([]);
          } else if (!normalized || normalized === "") {
            // When cleared, also clear material description
            setUnsavedRow((prev) => ({
              ...prev,
              [row.orderItemId]: {
                ...(prev[row.orderItemId] ?? {}),
                sapMaterialNumber: "",
                sapMatDescription: "",
              },
            }));
            setMaterialIdSearch([]);
          } else {
            setUnsavedRow((prev) => ({
              ...prev,
              [row.orderItemId]: {
                ...(prev[row.orderItemId] ?? {}),
                sapMaterialNumber: normalized,
              },
            }));
          }
        }}
        onInputChange={(event, value, reason) => {
          if (reason === "clear" || reason === "reset") {
            setMaterialIdSearch([]);
            return;
          }
          if (reason !== "input") return;
          debouncedSearchByNumber(value, row.orderItemId);
        }}
        onKeyDown={(e) => {
          if (
            e.key === " " ||
            e.key === "ArrowUp" ||
            e.key === "ArrowDown" ||
            e.key === "Enter"
          ) {
            e.stopPropagation();
          }
        }}
      />
    );
  }
  return row[col.fieldBinding];
};

/**
 * Renders action cell for exception handling
 */
export const renderActionCell = ({
  row,
  selectedShipTo,
  selectedSoldTo,
  fnNaviagtionToMaterialMismatch,
  setToastMessage,
  setToastType,
  setToastOpen,
  deletedMode,
  t,
}) => {
  if (deletedMode) {
    const note = String(row?.comment ?? "").trim();
    if (!note) return <span>-</span>;

    const short = note.length > 15 ? `${note.slice(0, 15)}…` : note;

    return (
      <Tooltip title={note} placement="top" arrow enterTouchDelay={0}>
        <span style={{ display: "inline-block", maxWidth: "100%" }}>
          <Chip
            label={short}
            size="small"
            variant="outlined"
            sx={{ fontSize: "12px", lineHeight: 1.2, cursor: "pointer" }}
          />
        </span>
      </Tooltip>
    );
  }
  if (
    (row.exceptionType &&
      row.exceptionType.includes("Invalid Material")) ||
    (row.exceptionType &&
      row.exceptionType.includes("Multiple Materials Found")) ||
    (row.exceptionType && row.exceptionType.includes("UOM issue"))
  ) {
    const isCustomerSelected =
      (selectedShipTo?.selectedCustomer === true && selectedShipTo?.sapCustomerId && (selectedShipTo?.sapCustomerName1 || selectedShipTo?.sapCustomerName)) &&
      (selectedSoldTo?.selectedCustomer === true && selectedSoldTo?.sapCustomerId && (selectedSoldTo?.sapCustomerName1 || selectedSoldTo?.sapCustomerName));

    return (
      <Tooltip
        title={
          isCustomerSelected
            ? "Click here to Manually Match"
            : "Please select a customer to proceed"
        }
        placement="bottom"
      >
        <button
          className="exception-type-btn"
          onClick={(event) => {
            event.stopPropagation();
            if (isCustomerSelected) {
              fnNaviagtionToMaterialMismatch(event);
            } else {
              setToastMessage("Please select a customer to proceed.");
              setToastType("warning");
              setToastOpen(true);
            }
          }}
        >
          {t("Manually Match")}
        </button>
      </Tooltip>
    );
  } else if (row.exceptionType === "Price Mismatch") {
    return (
      <button
        className="exception-type-btn"
        onClick={(event) => {
          event.stopPropagation();
          // Price mismatch handler here
        }}
      >
        {t("Price Mismatch")}
      </button>
    );
  }

  return <span>-</span>;
};

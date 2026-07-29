import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Add, Copy } from "@cw/rds/icons";
import CallSplit from "@mui/icons-material/CallSplit";
import ReusableToast from "../../components/Common/ReusableToast";
const MATERIAL_OPTIONS = [
  "Glycol - 2114",
  "Lens - XJ720",
  "Steel",
  "Camera Cabinet",
];
const SUPPLIER_OPTIONS = ["BASF", "Lenskart", "Tata Steel", "Sony"];
const UNIT_OPTIONS = ["MT", "KG", "L", "PC"];
const PLANT_OPTIONS = ["PL01", "PL02", "PL03"];
const STORAGE_LOCATION_OPTIONS = ["SL-100", "SL-200", "SL-300"];
const CURRENCY_OPTIONS = ["USD", "EUR", "GBP"];
const EXPENSE_NAME_OPTIONS = [
  "Freight Costs",
  "Insurance",
  "Handling Charges",
  "Customs Duty",
];

const columns = [
  { key: "serial", label: "#", width: 50 },
  { key: "actions", label: "Actions", width: 50 },
  { key: "supplier", label: "Supplier", width: 50 },
  { key: "material", label: "Material", width: 50 },
  { key: "deliveryPeriodFrom", label: "Delivery Period From", width: 100 },
  { key: "deliveryPeriodTo", label: "Delivery Period To", width: 100 },
  { key: "salesQuantity", label: "Sales Qty", width: 70 },
  { key: "salesQuantityUnit", label: "Sales Unit", width: 50 },
  {
    key: "salesOverdeliveryTolerance",
    label: "Sales Overdelivery Tolerance",
    width: 120,
  },
  {
    key: "salesUnderdeliveryTolerance",
    label: "Sales Underdelivery Tolerance",
    width: 120,
  },
  { key: "purchaseQuantity", label: "Purchase Qty", width: 50 },
  { key: "purchaseQuantityUnit", label: "Purchase Unit", width: 100 },
  {
    key: "purchaseOverdeliveryTolerance",
    label: "Purchase Overdelivery Tolerance",
    width: 120,
  },
  {
    key: "purchaseUnderdeliveryTolerance",
    label: "Purchase Underdelivery Tolerance",
    width: 120,
  },
  { key: "salesPrice", label: "Sales Price", width: 50 },
  { key: "salesPriceCurrency", label: "Sales Price Currency", width: 50 },
  { key: "salesPricePerUnit", label: "Sales Price Per Unit", width: 50 },
  { key: "purchasePrice", label: "Purchase Price", width: 50 },
  {
    key: "purchasePriceCurrency",
    label: "Purchase Price Currency",
    width: 120,
  },
  { key: "purchasePricePerUnit", label: "Purchase Price Per Unit", width: 120 },
  { key: "plant", label: "Plant", width: 50 },
  { key: "storageLocation", label: "Storage Location", width: 50 },
  { key: "expenses", label: "Expenses", width: 50 },
];

const FIELD_CONFIG = {
  supplier: { type: "select", options: SUPPLIER_OPTIONS },
  material: { type: "select", options: MATERIAL_OPTIONS },
  deliveryPeriodFrom: { type: "date" },
  deliveryPeriodTo: { type: "date" },
  salesQuantity: { type: "number" },
  salesQuantityUnit: { type: "select", options: UNIT_OPTIONS },
  salesOverdeliveryTolerance: { type: "number" },
  salesUnderdeliveryTolerance: { type: "number" },
  purchaseQuantity: { type: "number" },
  purchaseQuantityUnit: { type: "select", options: UNIT_OPTIONS },
  purchaseOverdeliveryTolerance: { type: "number" },
  purchaseUnderdeliveryTolerance: { type: "number" },
  salesPrice: { type: "number", prefix: "€" },
  salesPriceCurrency: { type: "select", options: CURRENCY_OPTIONS },
  salesPricePerUnit: { type: "select", options: UNIT_OPTIONS },
  purchasePrice: { type: "number", prefix: "$" },
  purchasePriceCurrency: { type: "select", options: CURRENCY_OPTIONS },
  purchasePricePerUnit: { type: "select", options: UNIT_OPTIONS },
  plant: { type: "select", options: PLANT_OPTIONS },
  storageLocation: { type: "select", options: STORAGE_LOCATION_OPTIONS },
};

let rowIdCounter = 0;
const nextRowId = () => `row-${++rowIdCounter}`;

const createEmptyRow = () => ({
  id: nextRowId(),
  supplier: "",
  material: "",
  deliveryPeriodFrom: "",
  deliveryPeriodTo: "",
  salesQuantity: "",
  salesQuantityUnit: "",
  salesOverdeliveryTolerance: "",
  salesUnderdeliveryTolerance: "",
  purchaseQuantity: "",
  purchaseQuantityUnit: "",
  purchaseOverdeliveryTolerance: "",
  purchaseUnderdeliveryTolerance: "",
  salesPrice: "",
  salesPriceCurrency: "",
  salesPricePerUnit: "",
  purchasePrice: "",
  purchasePriceCurrency: "",
  purchasePricePerUnit: "",
  plant: "",
  storageLocation: "",
  expenses: [],
  editing: true,
  isNew: true,
});

const toExternalRow = (row) => {
  const externalRow = { ...row };
  delete externalRow.editing;
  delete externalRow.isNew;
  delete externalRow.original;
  return externalRow;
};

const createEmptyExpenseRow = () => ({
  id: nextRowId(),
  name: "",
  amount: "",
  currency: "",
  per: "",
});

const cellSx = {
  verticalAlign: "middle",
};

const normalizeRow = (item) => ({
  id: item.id || nextRowId(),
  supplier: item.supplier || "",
  material: item.material || "",
  deliveryPeriodFrom: item.deliveryPeriodFrom || "",
  deliveryPeriodTo: item.deliveryPeriodTo || "",
  salesQuantity: item.salesQuantity || "",
  salesQuantityUnit: item.salesQuantityUnit || "",
  salesOverdeliveryTolerance: item.salesOverdeliveryTolerance || "",
  salesUnderdeliveryTolerance: item.salesUnderdeliveryTolerance || "",
  purchaseQuantity: item.purchaseQuantity || "",
  purchaseQuantityUnit: item.purchaseQuantityUnit || "",
  purchaseOverdeliveryTolerance: item.purchaseOverdeliveryTolerance || "",
  purchaseUnderdeliveryTolerance: item.purchaseUnderdeliveryTolerance || "",
  salesPrice: item.salesPrice || "",
  salesPriceCurrency: item.salesPriceCurrency || "",
  salesPricePerUnit: item.salesPricePerUnit || "",
  purchasePrice: item.purchasePrice || "",
  purchasePriceCurrency: item.purchasePriceCurrency || "",
  purchasePricePerUnit: item.purchasePricePerUnit || "",
  plant: item.plant || "",
  storageLocation: item.storageLocation || "",
  expenses: item.expenses || [],
  editing: false,
  isNew: false,
});

const AddMaterial = forwardRef(
  ({ initialItems, readOnly = false, disableAddMaterial }, ref) => {
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("success");
    const [rows, setRows] = useState(() =>
      initialItems?.length
        ? initialItems.map((item) => normalizeRow(item))
        : [
            {
              id: nextRowId(),
              supplier: "BASF",
              material: "Glycol - 2114",
              deliveryPeriodFrom: "",
              deliveryPeriodTo: "",
              salesQuantity: "10000",
              salesQuantityUnit: "MT",
              salesOverdeliveryTolerance: "",
              salesUnderdeliveryTolerance: "",
              purchaseQuantity: "10000",
              purchaseQuantityUnit: "MT",
              purchaseOverdeliveryTolerance: "",
              purchaseUnderdeliveryTolerance: "",
              salesPrice: "50",
              salesPriceCurrency: "",
              salesPricePerUnit: "MT",
              purchasePrice: "80",
              purchasePriceCurrency: "",
              purchasePricePerUnit: "MT",
              plant: "PL01",
              storageLocation: "SL-100",
              expenses: [],
              editing: false,
              isNew: false,
            },
          ],
    );

    const [expenseDialog, setExpenseDialog] = useState({
      open: false,
      rowId: null,
      rows: [],
    });
    const [expenseMenu, setExpenseMenu] = useState({
      anchorEl: null,
      rowId: null,
    });

    const updateRow = (id, field, value) => {
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
      );
    };

    const handleAddMaterial = () =>
      setRows((prev) => [...prev, createEmptyRow()]);
    const handleConfirmRow = (id) =>
      setRows((prev) =>
        prev.map((row) => {
          if (row.id !== id) return row;
          const confirmedRow = { ...row, editing: false, isNew: false };
          delete confirmedRow.original;
          return confirmedRow;
        }),
      );
    const handleCancelRow = (id) =>
      setRows((prev) => {
        const row = prev.find((r) => r.id === id);
        if (!row) return prev;
        if (row.isNew) {
          return prev.filter((r) => r.id !== id);
        }
        return prev.map((r) =>
          r.id === id ? { ...row.original, editing: false, isNew: false } : r,
        );
      });
    const handleEditRow = (id) =>
      setRows((prev) =>
        prev.map((row) => {
          if (row.id !== id) return row;
          const snapshot = { ...row };
          delete snapshot.original;
          return { ...row, editing: true, original: snapshot };
        }),
      );
    const handleDeleteRow = (id) =>
      setRows((prev) => prev.filter((row) => row.id !== id));

    const handleSplitItem = (id) => {
      setRows((prev) => {
        const rowToSplit = prev.find((row) => row.id === id);
        if (!rowToSplit) return prev;
        const remainingPurchaseQty = Number(rowToSplit.purchaseQuantity || 0);
        const remainingSalesQty = Number(rowToSplit.salesQuantity || 0);
        if (remainingPurchaseQty <= 0 || remainingSalesQty <= 0) {
          setToastMessage(
            "Cannot split item with zero or negative purchase or sales quantity",
          );
          setToastSeverity("error");
          setToastOpen(true);
          return prev;
        }
        if (remainingPurchaseQty < 2 || remainingSalesQty < 2) {
          setToastMessage(
            "Cannot split item with purchase or sales quantity less than 2",
          );
          setToastSeverity("error");
          setToastOpen(true);
          return prev;
        }
        if (rowToSplit.editing) {
          setToastMessage("Please confirm the row before splitting");
          setToastSeverity("error");
          setToastOpen(true);
          return prev;
        }
        // Split the quantity into two halves, rounding down for the first half
        // and assigning the remainder to the second half. This ensures that the
        // total quantity remains consistent after the split.
        const halfPurchaseQty = Math.floor(remainingPurchaseQty / 2);
        const halfSalesQty = Math.floor(remainingSalesQty / 2);
        return prev.flatMap((row) => {
          if (row.id !== id) return [row];

          const updatedCurrentRow = {
            ...row,
            purchaseQuantity: String(halfPurchaseQty),
            salesQuantity: String(halfSalesQty),
          };

          const newRow = {
            ...row,
            id: nextRowId(),
            purchaseQuantity: String(remainingPurchaseQty - halfPurchaseQty),
            salesQuantity: String(remainingSalesQty - halfSalesQty),
            editing: true,
          };

          return [updatedCurrentRow, newRow];
        });
      });
    };
    const handleDuplicateItem = (id) => {
      setRows((prev) => {
        const rowToDuplicate = prev.find((row) => row.id === id);
        if (!rowToDuplicate) return prev;
        if (rowToDuplicate.editing) {
          setToastMessage("Please confirm the row before duplicating");
          setToastSeverity("error");
          setToastOpen(true);
          return prev;
        }
        const duplicatedRow = {
          ...rowToDuplicate,
          id: nextRowId(),
          editing: true,
        };
        return [...prev, duplicatedRow];
      });
    };

    const handleOpenExpenseDialog = (rowId) => {
      const row = rows.find((r) => r.id === rowId);
      const existingRows = row?.expenses?.length
        ? row.expenses
        : [createEmptyExpenseRow()];
      setExpenseDialog({ open: true, rowId, rows: existingRows });
    };

    const handleCloseExpenseDialog = () =>
      setExpenseDialog({ open: false, rowId: null, rows: [] });

    const handleAddExpenseRow = () =>
      setExpenseDialog((prev) => ({
        ...prev,
        rows: [...prev.rows, createEmptyExpenseRow()],
      }));

    const handleUpdateExpenseRow = (id, field, value) =>
      setExpenseDialog((prev) => ({
        ...prev,
        rows: prev.rows.map((expenseRow) =>
          expenseRow.id === id ? { ...expenseRow, [field]: value } : expenseRow,
        ),
      }));

    const handleDeleteExpenseRow = (id) => {
      setExpenseDialog((prev) => ({
        ...prev,
        rows: prev.rows.filter((expenseRow) => expenseRow.id !== id),
      }));
      setExpenseMenu({ anchorEl: null, rowId: null });
    };

    const handleSaveExpenseDialog = () => {
      const validExpenseRows = expenseDialog.rows.filter(
        (expenseRow) =>
          expenseRow.name || expenseRow.amount || expenseRow.currency,
      );
      updateRow(expenseDialog.rowId, "expenses", validExpenseRows);
      handleCloseExpenseDialog();
    };

    const handleOpenExpenseMenu = (event, rowId) =>
      setExpenseMenu({ anchorEl: event.currentTarget, rowId });

    const handleCloseExpenseMenu = () =>
      setExpenseMenu({ anchorEl: null, rowId: null });

    const renderEditableField = (row, columnKey) => {
      const config = FIELD_CONFIG[columnKey];
      if (!config) return "-";

      if (config.type === "select") {
        return (
          <Select
            value={row[columnKey] || ""}
            onChange={(e) => updateRow(row.id, columnKey, e.target.value)}
            displayEmpty
            size="small"
            fullWidth
          >
            <MenuItem value="">
              <em>-</em>
            </MenuItem>
            {config.options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        );
      }

      return (
        <TextField
          value={row[columnKey] || ""}
          onChange={(e) => updateRow(row.id, columnKey, e.target.value)}
          size="small"
          type={config.type}
          fullWidth
          InputProps={config.prefix ? { startAdornment: config.prefix } : {}}
          InputLabelProps={
            config.type === "date" ? { shrink: true } : undefined
          }
        />
      );
    };

    const renderReadOnlyField = (row, columnKey) => {
      if (columnKey === "purchaseQuantity" || columnKey === "salesQuantity") {
        return Number(row[columnKey] || 0).toLocaleString();
      }

      if (columnKey === "purchasePrice" || columnKey === "salesPrice") {
        const value = row[columnKey];
        if (!value) return "-";
        const symbol = columnKey === "purchasePrice" ? "$" : "€";
        return `${symbol} ${Number(value).toFixed(2)}`;
      }

      return row[columnKey] || "-";
    };

    const renderCell = (row, index, columnKey) => {
      if (columnKey === "serial") {
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography component="span" sx={{ fontSize: 13 }}>
              {index + 1}
            </Typography>
          </Box>
        );
      }

      if (columnKey === "expenses") {
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenExpenseDialog(row.id)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#23409a",
              borderColor: "#23409a",
              whiteSpace: "nowrap",
            }}
          >
            {row.expenses?.length
              ? `Expenses (${row.expenses.length})`
              : "Add Expenses"}
          </Button>
        );
      }

      if (columnKey === "actions") {
        return row.editing ? (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              justifyContent: "center",
            }}
          >
            <IconButton size="small" onClick={() => handleConfirmRow(row.id)}>
              <CheckIcon sx={{ color: "#2e7d32", fontSize: 20 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleCancelRow(row.id)}>
              <CloseIcon sx={{ color: "#c0392b", fontSize: 20 }} />
            </IconButton>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              justifyContent: "center",
            }}
          >
            {!readOnly && (
              <IconButton
                size="small"
                onClick={() => handleSplitItem(row.id)}
                title="Split item"
              >
                <CallSplit fontSize="small" />
              </IconButton>
            )}
            {!readOnly && (
              <IconButton
                size="small"
                onClick={() => handleDuplicateItem(row.id)}
                title="Duplicate item"
              >
                <Copy fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={() => handleEditRow(row.id)}>
              <EditIcon sx={{ color: "#7a8aa0", fontSize: 18 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleDeleteRow(row.id)}>
              <DeleteOutlineIcon sx={{ color: "#c0392b", fontSize: 18 }} />
            </IconButton>
          </Box>
        );
      }

      return row.editing
        ? renderEditableField(row, columnKey)
        : renderReadOnlyField(row, columnKey);
    };
    useImperativeHandle(
      ref,
      () => ({
        getValues: () => rows.map(toExternalRow),
        getItems: () => rows.map(toExternalRow),
        reset: () => setRows([]),
        validate: () => !rows.some((row) => row.editing),
      }),
      [rows],
    );

    return (
      <Box>
        <ReusableToast
          open={toastOpen}
          severity={toastSeverity}
          message={toastMessage}
          onClose={() => setToastOpen(false)}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#2f3136" }}>
            Contract Items
          </Typography>
          {!readOnly && !disableAddMaterial && (
            <Button
              variant="outlined"
              startIcon={<Add sx={{ fontSize: 18 }} />}
              onClick={handleAddMaterial}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#23409a",
                borderColor: "#23409a",
              }}
            >
              Add Material
            </Button>
          )}
        </Box>

        <TableContainer
          sx={{ border: "1px solid #d9dee7", borderRadius: "6px" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#9aa1ac" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.key === "actions" ? "center" : "left"}
                    sx={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: 13,
                      overflow: "hidden",
                      lineHeight: 1.2,
                      width: column.width,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ py: 3, color: "#7b818f" }}
                  >
                    No materials added yet
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell
                        key={`${row.id}-${column.key}`}
                        align={column.key === "actions" ? "center" : "left"}
                        sx={cellSx}
                      >
                        {renderCell(row, index, column.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={expenseDialog.open}
          onClose={handleCloseExpenseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 18,
              fontWeight: 700,
              color: "#2f3136",
            }}
          >
            Add Expenses
            <IconButton size="small" onClick={handleCloseExpenseDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 1.5,
              }}
            >
              {!readOnly && (
                <Button
                  variant="outlined"
                  startIcon={<Add sx={{ fontSize: 18 }} />}
                  onClick={handleAddExpenseRow}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#23409a",
                    borderColor: "#23409a",
                  }}
                >
                  Add Row
                </Button>
              )}
            </Box>
            <TableContainer
              sx={{ border: "1px solid #d9dee7", borderRadius: "6px" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#ece9fc" }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>
                      Expense Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>
                      Expense Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>
                      Expense Currency
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>
                      Per
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenseDialog.rows.map((expenseRow) => (
                    <TableRow key={expenseRow.id}>
                      <TableCell sx={cellSx}>
                        <Select
                          value={expenseRow.name}
                          onChange={(e) =>
                            handleUpdateExpenseRow(
                              expenseRow.id,
                              "name",
                              e.target.value,
                            )
                          }
                          displayEmpty
                          size="small"
                          fullWidth
                          disabled={readOnly}
                        >
                          <MenuItem value="">
                            <em>-</em>
                          </MenuItem>
                          {EXPENSE_NAME_OPTIONS.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <TextField
                          value={expenseRow.amount}
                          onChange={(e) =>
                            handleUpdateExpenseRow(
                              expenseRow.id,
                              "amount",
                              e.target.value,
                            )
                          }
                          size="small"
                          type="number"
                          fullWidth
                          disabled={readOnly}
                        />
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Select
                          value={expenseRow.currency}
                          onChange={(e) =>
                            handleUpdateExpenseRow(
                              expenseRow.id,
                              "currency",
                              e.target.value,
                            )
                          }
                          displayEmpty
                          size="small"
                          fullWidth
                          disabled={readOnly}
                        >
                          <MenuItem value="">
                            <em>-</em>
                          </MenuItem>
                          {CURRENCY_OPTIONS.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Select
                          value={expenseRow.per}
                          onChange={(e) =>
                            handleUpdateExpenseRow(
                              expenseRow.id,
                              "per",
                              e.target.value,
                            )
                          }
                          displayEmpty
                          size="small"
                          fullWidth
                          disabled={readOnly}
                        >
                          <MenuItem value="">
                            <em>-</em>
                          </MenuItem>
                          {UNIT_OPTIONS.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="center" sx={cellSx}>
                        {!readOnly && (
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleOpenExpenseMenu(e, expenseRow.id)
                            }
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Menu
              anchorEl={expenseMenu.anchorEl}
              open={Boolean(expenseMenu.anchorEl)}
              onClose={handleCloseExpenseMenu}
            >
              <MenuItem
                onClick={() => handleDeleteExpenseRow(expenseMenu.rowId)}
              >
                Delete
              </MenuItem>
            </Menu>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button
              variant="outlined"
              onClick={handleCloseExpenseDialog}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#23409a",
                borderColor: "#23409a",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveExpenseDialog}
              disabled={readOnly}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#123db8",
                "&:hover": { backgroundColor: "#0f35a1" },
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  },
);

AddMaterial.displayName = "AddMaterial";
export default AddMaterial;

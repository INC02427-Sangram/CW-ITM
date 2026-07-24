import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Box,
  Button,
  IconButton,
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
import { Add } from "@cw/rds/icons";
import CallSplit from "@mui/icons-material/CallSplit";
import ReusableToast from "../../components/Common/ReusableToast";
const MATERIAL_OPTIONS = [
  "Glycol - 2114",
  "Lens - XJ720",
  "Steel",
  "Camera Cabinet",
];
const SUPPLIER_OPTIONS = ["BASF", "Lenskart", "Tata Steel", "Sony"];
const ITEM_CATEGORY_OPTIONS = ["Stock Shipment", "Direct Shipment"];
const UNIT_OPTIONS = ["MT", "KG", "L", "PC"];
const PLANT_OPTIONS = ["PL01", "PL02", "PL03"];
const STORAGE_LOCATION_OPTIONS = ["SL-100", "SL-200", "SL-300"];

const columns = [
  { key: "serial", label: "#" },
  { key: "supplier", label: "Supplier" },
  { key: "material", label: "Material" },
  { key: "itemCategory", label: "Item Category" },
  { key: "purchaseQty", label: "Purchase Qty" },
  { key: "purchaseUnit", label: "Purchase Unit" },
  { key: "salesQty", label: "Sales Qty" },
  { key: "salesUnit", label: "Sales Unit" },
  { key: "buyPrice", label: "Buy Price" },
  { key: "sellPrice", label: "Sell Price" },
  { key: "priceUnit", label: "Price Unit" },
  { key: "plant", label: "Plant" },
  { key: "storageLocation", label: "Storage Location" },
  { key: "deliveryDate", label: "Delivery Date" },
  { key: "netValue", label: "Net Value" },
  { key: "actions", label: "Actions" },
];

const FIELD_CONFIG = {
  supplier: { type: "select", options: SUPPLIER_OPTIONS },
  material: { type: "select", options: MATERIAL_OPTIONS },
  itemCategory: { type: "select", options: ITEM_CATEGORY_OPTIONS },
  purchaseQty: { type: "number" },
  purchaseUnit: { type: "select", options: UNIT_OPTIONS },
  salesQty: { type: "number" },
  salesUnit: { type: "select", options: UNIT_OPTIONS },
  buyPrice: { type: "number", prefix: "$" },
  sellPrice: { type: "number", prefix: "€" },
  priceUnit: { type: "select", options: UNIT_OPTIONS },
  plant: { type: "select", options: PLANT_OPTIONS },
  storageLocation: { type: "select", options: STORAGE_LOCATION_OPTIONS },
  deliveryDate: { type: "date" },
};

let rowIdCounter = 0;
const nextRowId = () => `row-${++rowIdCounter}`;

const createEmptyRow = () => ({
  id: nextRowId(),
  supplier: "",
  material: "",
  itemCategory: "",
  salesQty: "",
  salesUnit: "",
  purchaseQty: "",
  purchaseUnit: "",
  buyPrice: "",
  sellPrice: "",
  priceUnit: "",
  plant: "",
  storageLocation: "",
  deliveryDate: "",
  editing: true,
});

const calcNetValue = (row) =>
  (Number(row.salesQty) || 0) * (Number(row.sellPrice) || 0);

const formatCurrency = (value) =>
  `€${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const cellSx = { verticalAlign: "middle" };

const normalizeRow = (item) => ({
  id: item.id || nextRowId(),
  supplier: item.supplier || "",
  material: item.material || "",
  itemCategory: item.itemCategory || "",
  salesQty: item.salesQty || "",
  salesUnit: item.salesUnit || "",
  purchaseQty: item.purchaseQty || "",
  purchaseUnit: item.purchaseUnit || "",
  buyPrice: item.buyPrice || "",
  sellPrice: item.sellPrice || "",
  priceUnit: item.priceUnit || "",
  plant: item.plant || "",
  storageLocation: item.storageLocation || "",
  deliveryDate: item.deliveryDate || "",
  editing: false,
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
              itemCategory: "Stock Shipment",
              salesQty: "10000",
              salesUnit: "MT",
              purchaseQty: "10000",
              purchaseUnit: "MT",
              buyPrice: "80",
              sellPrice: "50",
              priceUnit: "MT",
              plant: "PL01",
              storageLocation: "SL-100",
              deliveryDate: "",
              editing: false,
            },
          ],
    );

    const updateRow = (id, field, value) => {
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
      );
    };

    const handleAddMaterial = () =>
      setRows((prev) => [...prev, createEmptyRow()]);
    const handleConfirmRow = (id) =>
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, editing: false } : row)),
      );
    const handleCancelRow = (id) =>
      setRows((prev) => prev.filter((row) => row.id !== id));
    const handleEditRow = (id) =>
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, editing: true } : row)),
      );
    const handleDeleteRow = (id) =>
      setRows((prev) => prev.filter((row) => row.id !== id));

    const handleSplitItem = (id) => {
      setRows((prev) => {
        const rowToSplit = prev.find((row) => row.id === id);
        if (!rowToSplit) return prev;
        const remainingQty = Number(rowToSplit.purchaseQty || 0);
        if (remainingQty <= 0) {
          setToastMessage("Cannot split item with zero or negative quantity");
          setToastSeverity("error");
          setToastOpen(true);
          return prev;
        }
        if (remainingQty < 2) {
          setToastMessage("Cannot split item with quantity less than 2");
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
        const halfQty = Math.floor(remainingQty / 2);

        return prev.flatMap((row) => {
          if (row.id !== id) return [row];

          const updatedCurrentRow = {
            ...row,
            purchaseQty: String(halfQty),
          };

          const newRow = {
            ...row,
            id: nextRowId(),
            purchaseQty: String(remainingQty - halfQty),
            editing: true,
          };

          return [updatedCurrentRow, newRow];
        });
      });
    };

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
      if (columnKey === "purchaseQty" || columnKey === "salesQty") {
        return Number(row[columnKey] || 0).toLocaleString();
      }

      if (columnKey === "buyPrice" || columnKey === "sellPrice") {
        const value = row[columnKey];
        if (!value) return "-";
        const symbol = columnKey === "buyPrice" ? "$" : "€";
        return `${symbol} ${Number(value).toFixed(2)}`;
      }

      return row[columnKey] || "-";
    };

    const renderCell = (row, index, columnKey) => {
      if (columnKey === "serial") {
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {!readOnly && (
              <IconButton
                size="small"
                onClick={() => handleSplitItem(row.id)}
                title="Split item"
              >
                <CallSplit fontSize="small" />
              </IconButton>
            )}
            <Typography component="span" sx={{ fontSize: 13 }}>
              {index + 1}
            </Typography>
          </Box>
        );
      }

      if (columnKey === "netValue") {
        return formatCurrency(calcNetValue(row));
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
        getValues: () => rows.map(({ editing, ...rest }) => rest),
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
            Items (Release from Contract)
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
                    sx={{ color: "#ffffff", fontWeight: 600, fontSize: 13 }}
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
      </Box>
    );
  },
);

AddMaterial.displayName = "AddMaterial";
export default AddMaterial;

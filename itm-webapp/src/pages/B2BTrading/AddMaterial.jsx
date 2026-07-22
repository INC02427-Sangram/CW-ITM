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

const MATERIAL_OPTIONS = ["Glycol - 2114", "Lens - XJ720", "Steel", "Camera Cabinet"];
const UNIT_OPTIONS = ["MT", "KG", "L", "PC"];

const columns = [
  "#",
  "Material",
  "Target Quantity",
  "Unit",
  "Buy Price",
  "Sell Price",
  "Net Value",
  "Actions",
];

let rowIdCounter = 0;
const nextRowId = () => `row-${++rowIdCounter}`;

const createEmptyRow = () => ({
  id: nextRowId(),
  material: "",
  targetQuantity: "",
  unit: "",
  buyPrice: "",
  sellPrice: "",
  editing: true,
});

const calcNetValue = (row) => (Number(row.targetQuantity) || 0) * (Number(row.sellPrice) || 0);

const formatCurrency = (value) =>
  `€${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const cellSx = { verticalAlign: "middle" };

const AddMaterial = forwardRef(({ initialItems, readOnly = false }, ref) => {
  const [rows, setRows] = useState(() =>
    initialItems?.length
      ? initialItems.map((item) => ({ ...item, id: item.id || nextRowId(), editing: false }))
      : [
          {
            id: nextRowId(),
            material: "Glycol - 2114",
            targetQuantity: "10000",
            unit: "MT",
            buyPrice: "80",
            sellPrice: "50",
            editing: false,
          },
        ]
  );

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleAddMaterial = () => setRows((prev) => [...prev, createEmptyRow()]);
  const handleConfirmRow = (id) =>
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, editing: false } : row)));
  const handleCancelRow = (id) => setRows((prev) => prev.filter((row) => row.id !== id));
  const handleEditRow = (id) =>
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, editing: true } : row)));
  const handleDeleteRow = (id) => setRows((prev) => prev.filter((row) => row.id !== id));

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => rows.map(({ editing, ...rest }) => rest),
      reset: () => setRows([]),
      validate: () => !rows.some((row) => row.editing),
    }),
    [rows]
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#2f3136" }}>
          Items (Release from Contract)
        </Typography>
        {!readOnly && (
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

      <TableContainer sx={{ border: "1px solid #d9dee7", borderRadius: "6px" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#9aa1ac" }}>
              {columns.map((label) => (
                <TableCell
                  key={label}
                  align={label === "Actions" ? "center" : "left"}
                  sx={{ color: "#ffffff", fontWeight: 600, fontSize: 13 }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3, color: "#7b818f" }}>
                  No materials added yet
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell sx={cellSx}>{index + 1}</TableCell>
                  <TableCell sx={cellSx}>
                    {row.editing ? (
                      <Select
                        value={row.material}
                        onChange={(e) => updateRow(row.id, "material", e.target.value)}
                        displayEmpty
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {MATERIAL_OPTIONS.map((m) => (
                          <MenuItem key={m} value={m}>
                            {m}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      row.material || "-"
                    )}
                  </TableCell>
                  <TableCell sx={cellSx}>
                    {row.editing ? (
                      <TextField
                        value={row.targetQuantity}
                        onChange={(e) => updateRow(row.id, "targetQuantity", e.target.value)}
                        size="small"
                        type="number"
                        fullWidth
                      />
                    ) : (
                      Number(row.targetQuantity || 0).toLocaleString()
                    )}
                  </TableCell>
                  <TableCell sx={cellSx}>
                    {row.editing ? (
                      <Select
                        value={row.unit}
                        onChange={(e) => updateRow(row.id, "unit", e.target.value)}
                        displayEmpty
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {UNIT_OPTIONS.map((u) => (
                          <MenuItem key={u} value={u}>
                            {u}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      row.unit || "-"
                    )}
                  </TableCell>
                  <TableCell sx={cellSx}>
                    {row.editing ? (
                      <TextField
                        value={row.buyPrice}
                        onChange={(e) => updateRow(row.id, "buyPrice", e.target.value)}
                        size="small"
                        type="number"
                        fullWidth
                        InputProps={{ startAdornment: "$" }}
                      />
                    ) : row.buyPrice ? (
                      `$ ${Number(row.buyPrice).toFixed(2)}`
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell sx={cellSx}>
                    {row.editing ? (
                      <TextField
                        value={row.sellPrice}
                        onChange={(e) => updateRow(row.id, "sellPrice", e.target.value)}
                        size="small"
                        type="number"
                        fullWidth
                        InputProps={{ startAdornment: "€" }}
                      />
                    ) : row.sellPrice ? (
                      `€ ${row.sellPrice}`
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell sx={cellSx}>{formatCurrency(calcNetValue(row))}</TableCell>
                  <TableCell align="center" sx={cellSx}>
                    {row.editing ? (
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                        <IconButton size="small" onClick={() => handleConfirmRow(row.id)}>
                          <CheckIcon sx={{ color: "#2e7d32", fontSize: 20 }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleCancelRow(row.id)}>
                          <CloseIcon sx={{ color: "#c0392b", fontSize: 20 }} />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                        <IconButton size="small" onClick={() => handleEditRow(row.id)}>
                          <EditIcon sx={{ color: "#7a8aa0", fontSize: 18 }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteRow(row.id)}>
                          <DeleteOutlineIcon sx={{ color: "#c0392b", fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

AddMaterial.displayName = "AddMaterial";
export default AddMaterial;

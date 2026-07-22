import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const baseSx = {
  border: "1px solid #d9dee7",
  borderRadius: "6px",
  backgroundColor: "#fff",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#aaaaaa",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 600,
    color: "#2f3136",
  },
  "& .MuiDataGrid-cell": {
    fontSize: 13,
    color: "#2f3136",
  },
  "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#f8f9fb",
  },
};

function EmptyOverlay({ message }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "#7b818f",
        py: 4,
      }}
    >
      <Typography sx={{ fontSize: 13 }}>{message}</Typography>
    </Box>
  );
}

/**
 * Thin, fully-flexible wrapper around MUI X DataGrid.
 * Ships opinionated defaults (styling, pagination, empty state) while
 * passing every other DataGrid prop straight through via `...rest`,
 * so any column type, row grouping, editing, server-side mode, etc. still works.
 */
export default function ReusableDataGrid({
  rows = [],
  columns = [],
  loading = false,
  getRowId,
  height = 480,
  autoHeight = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  hidePagination = false,
  checkboxSelection = false,
  disableRowSelectionOnClick = true,
  showToolbar = false,
  density = "standard",
  emptyMessage = "No records found",
  sx,
  slots,
  slotProps,
  onRowClick,
  onRowSelectionModelChange,
  ...rest
}) {
  const initialState = useMemo(
    () => ({
      pagination: { paginationModel: { page: 0, pageSize } },
    }),
    [pageSize],
  );

  return (
    <Box sx={{ width: "100%", height: autoHeight ? "auto" : height }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        loading={loading}
        autoHeight={autoHeight}
        density={density}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        hideFooterPagination={hidePagination}
        initialState={initialState}
        pageSizeOptions={pageSizeOptions}
        showToolbar={showToolbar}
        onRowClick={onRowClick}
        onRowSelectionModelChange={onRowSelectionModelChange}
        slots={{
          noRowsOverlay: () => <EmptyOverlay message={emptyMessage} />,
          noResultsOverlay: () => <EmptyOverlay message={emptyMessage} />,
          ...slots,
        }}
        slotProps={slotProps}
        sx={{ ...baseSx, ...sx }}
        {...rest}
      />
    </Box>
  );
}

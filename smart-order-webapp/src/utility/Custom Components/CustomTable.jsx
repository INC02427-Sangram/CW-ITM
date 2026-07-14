import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Chip, Box } from "@cw/rds";
import TableChartIcon from "@mui/icons-material/TableChart";
import CustomMessageToast from "./CustomMessageToast";
import "./CustomTable.css";

// Modularized imports
import { useMaterialSearch } from "./useMaterialSearch";
import { isRowEmpty, computeNetPrice, rowHasChanges } from "./CustomTableUtils";
import { getColumnValueGetter } from "./ColumnValueGetters";
import { getColumnRenderer } from "./ColumnRenderers.jsx";
import { applyColumnWidthConfig } from "./ColumnWidthConfig";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  flexGrow: 1,
  height: "auto",
  maxHeight: "calc(100vh - 200px)",
  overflow: "hidden",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.background.datagridHeader,
    fontWeight: "bold",
    fontSize: "14px",
    fontFamily: "Roboto, sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 1100,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: theme.palette.background.datagridHeader,
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    backgroundColor: theme.palette.background.datagridHeader,
  },
  "& .MuiDataGrid-row:hover": {
    cursor: "pointer",
  },
  "& .MuiDataGrid-footerContainer": {
    "& .MuiTablePagination-selectLabel": {
      display: "inline-block",
      marginRight: "8px",
      fontSize: "14px",
    },
  },
  "& .MuiTablePagination-selectLabel": {
    display: "inline-block !important",
    visibility: "visible !important",
  },
  "& .MuiDataGrid-row.clicked-row": {
    backgroundColor: `${theme.palette.background.rowclicked} !important`,
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  // Remove the default focus ring completely
  "& .MuiDataGrid-cell--editing": {
    outline: "none !important",
    boxShadow: "none !important",
  },
  // Ensure input fields have their own focus styling
  "& .MuiDataGrid-cell--editing .MuiInputBase-root": {
    "&.Mui-focused": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: "-2px",
    },
  },
}));

const CustomTable = ({
  rows,
  setRows,
  Headercolumns,
  editableRow,
  setEditableRow,
  rowItemDone,
  setRowItemDone,
  fnNaviagtionToMaterialMismatch,
  unsavedRow,
  setUnsavedRow,
  fnRowClickHandler,
  maxHeight,
  className,
  visible,
  isSapMaterialList,
  remarks,
  setRemarks,
  editMode,
  setEditMode,
  selectedOption,
  setSelectedOption,
  handleDropdownChange,
  // handleCancelEdit,
  fixedRowHeight,
  onSortModelChange,
  paginationModel,
  onPaginationModelChange,
  rowCount,
  paginationMode = "server",
  handleDeleteRow,
  handleSaveRow,
  handleCancelEdit,
  selectedRowId,
  headerinfoformanual,
  deletedMode = false,
  onRestoreRow,
  canEdit = true,
  preserveColumnWidths = false,
  compactMaterialColumns = false,
  disableSelection = false,
}) => {


  const dispatch = useDispatch();
  const headerInfo = useSelector((state) => state.appReducer.salesOrderDetails);
  const appSettings = useSelector((state) => state.appReducer.appSettings);
  const shipTo = useMemo(
    () => headerinfoformanual?.shipTo ?? headerinfoformanual?.shipToList ?? [],
    [headerinfoformanual?.shipTo, headerinfoformanual?.shipToList]
  );
  const soldTo = useMemo(
    () => headerinfoformanual?.soldTo ?? headerinfoformanual?.soldToList ?? [],
    [headerinfoformanual?.soldTo, headerinfoformanual?.soldToList]
  );
  const getDefaultCustomer = (list = []) =>
    list.find((c) => c.selectedCustomer) || list[0] || null;
  const selectedShipTo = getDefaultCustomer(shipTo);
  const selectedSoldTo = getDefaultCustomer(soldTo);
  const manualScreenDetails = useSelector(
    (state) => state.appReducer.manualScreenDetails
  );
  const deletedItems = useSelector((state) => state.appReducer.deletedItems);
  const clickedIndex = useSelector((state) => state.appReducer.clickedIndex);
  const aSmartOrderList = useSelector(
    (state) => state.appReducer.aSmartOrderList
  );
  const lineItemList = useSelector((state) => state.appReducer.lineItemList);
  const reduxState = useSelector((state) => state.appReducer);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const theme = useTheme();

  // Get orderId from Redux state
  const currentOrderId = useSelector((state) => {
    const orderId = state.appReducer.salesOrderDetails?.orderHeaderId ||
      state.appReducer.headerInfo?.orderHeaderId ||
      state.appReducer.oCurrentPayload?.filterData?.orderHeaderId ||
      "";
    return orderId;
  });

  // Use material search hook
  const {
    materialDescSearch,
    materialIdSearch,
    setMaterialDescSearch,
    setMaterialIdSearch,
    debouncedSearchByDesc,
    debouncedSearchByNumber,
  } = useMaterialSearch(currentOrderId);


  // const SMALL_COLUMNS = [
  //   'Request ID',
  //   'SAP Order ID',
  //   'PO Number',
  //   'Order Type',
  //   'Success',
  //   'Exception Type',
  //   'Status'
  // ];

  // const LARGE_COLUMNS = [
  //   'Customer',
  //   'Created On',
  //   'Req. Delivery Date',
  //   'Sender Email'
  // ];

  

  const dataGridColumns = useMemo(() => {
    // Prepare context for column renderer
    const rendererContext = {
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
    };


    return (Headercolumns ?? [])
      .filter((col) => col.visible)
      .map((col) => {
        let colDef = {
          field:
            col.fieldName ||
            (Array.isArray(col.fieldBinding)
              ? col.fieldBinding.join("_")
              : col.fieldBinding),
          headerName: col.fieldLabel,
          // flex: 1,
          sortable: true,
          valueGetter: getColumnValueGetter(col),
          renderCell: getColumnRenderer(col, rendererContext),
        };

        // Apply width configuration
        colDef = applyColumnWidthConfig(colDef, col, t, deletedMode);

        if (preserveColumnWidths && col.width) {
          colDef.width = col.width;
          colDef.minWidth = col.minWidth || col.width;
          delete colDef.flex;
        }

        if (compactMaterialColumns) {
          if (["poMaterialNumber", "gid"].includes(col.fieldBinding)) {
            colDef.minWidth = 82;
            colDef.flex = 0.8;
          }

          if (["poMatDescription", "globalDescription"].includes(col.fieldBinding)) {
            colDef.minWidth = 130;
            colDef.flex = 1.8;
          }
        }

        return colDef;
      });
  }, [
    Headercolumns,
    theme,
    editableRow,
    editMode,
    unsavedRow,
    selectedShipTo,
    selectedSoldTo,
    aSmartOrderList,
    materialDescSearch,
    materialIdSearch,
    deletedMode,
    appSettings,
    preserveColumnWidths,
    compactMaterialColumns,
  ]);

  const dataGridRows = useMemo(() => {
    return rows.map((row, index) => ({
      id: row.orderItemId ?? row.id ?? `idx_${index}`,
      ...row,
    }));
  }, [rows]);

  return (
    <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>

      {dataGridRows.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            backgroundColor: theme.palette.background.paper || '#ffffff',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            marginTop: 2,
            marginBottom: 2,
            // border: '1px solid #e4752bff',
            // height: '100% !important',
          }}
        >
          <TableChartIcon
            sx={{ fontSize: 64, color: "action.disabled", mb: 2 }}
          />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Data Available
          </Typography>
          <Typography variant="body2" color="textSecondary">
            There are no records to display at this time
          </Typography>
        </Box>
      ) : (
        <StyledDataGrid
          sx={{
            "& .MuiDataGrid-row": { minHeight: "auto !important" },
            "& .MuiDataGrid-cell": {
              fontSize: "12px",
              fontFamily: "Roboto, sans-serif",
              display: "flex",
              alignItems: "center",
              lineHeight: "1.2",
              paddingTop: "4px",
              paddingBottom: "4px",
            },
            "& .MuiDataGrid-root": { overflow: "hidden" },
            "& .MuiDataGrid-main": { overflow: "hidden" },
            // "& .MuiDataGrid-row.clicked-row": {
            //   backgroundColor: "#e4f1ff !important",
            // },
            ...(compactMaterialColumns && {
              "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
                px: "6px",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                whiteSpace: "normal",
                lineHeight: 1.1,
              },
              "& .MuiDataGrid-cellContent": {
                whiteSpace: "normal",
                overflow: "visible",
                textOverflow: "clip",
              },
              "& .MuiDataGrid-cell, & .MuiDataGrid-row": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                minHeight: 44,
              },
              "& .MuiTablePagination-root, & .MuiTablePagination-toolbar": {
                minHeight: 44,
              },
              "& .MuiTablePagination-toolbar": {
                px: 1,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: "12px",
                margin: 0,
              },
              "& .MuiTablePagination-actions": {
                ml: 0.5,
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflowX: "hidden !important",
              },
            }),
          }}
          rows={dataGridRows}
          {...(fixedRowHeight
            ? { rowHeight: fixedRowHeight }
            : { rowHeight: 48 })}
          columns={dataGridColumns}
          // getRowId={(row) => row.orderHeaderId || row.id}
          // getRowClassName={(params) => (params.id === clickedIndex ? "clicked-row" : "")}
          getRowId={(row) => {
            if (row.orderHeaderId !== undefined && row.serialNumber !== undefined) {
              return `${row.orderHeaderId}_${row.serialNumber}`;
            }
            return row.orderHeaderId ?? row.id;
          }}

          getRowClassName={(params) => {
            if (typeof selectedRowId !== "undefined" && selectedRowId !== null) {
              return params.id === selectedRowId ? "clicked-row" : "";
            }

            if (typeof clickedIndex !== "undefined" && clickedIndex !== null && clickedIndex !== "") {
              if (params.id === clickedIndex) return "clicked-row";
              const clickedIndexStr = String(clickedIndex);
              if (String(params.id).startsWith(`${clickedIndexStr}_`)) return "clicked-row";
            }

            const index = rows.findIndex(
              (r) =>
                `${r.orderHeaderId}_${r.serialNumber}` === params.id ||
                r.orderHeaderId === params.id ||
                r.id === params.id
            );
            if (index === -1) return "";
            if (rows[index]?.isclicked) return "clicked-row";
            return "";
          }}

          onRowClick={(params, event) => {
            const isIconClick =
              event.target.closest(".MuiIconButton-root") ||
              event.target.closest(".MuiChip-root") ||
              event.target.closest("button");
            if (isIconClick) return;

            let rowIndex = dataGridRows.findIndex((row) => row.id === params.id);
            if (rowIndex === -1) {
              rowIndex = rows.findIndex((row, idx) => {
                if (isSapMaterialList && row.id === params.row.id) return true;
                return (
                  row.orderHeaderId === params.id ||
                  row.orderItemId === params.id ||
                  `${row.orderHeaderId}_${row.serialNumber || idx}` === params.id
                );
              });
            }
            if (rowIndex !== -1 && fnRowClickHandler) {
              fnRowClickHandler(event, dataGridColumns, rows, rowIndex);
            }
          }}
          disableSelectionOnClick={false}
          disableRowSelectionOnClick={disableSelection}
          hideFooterSelectedRowCount={disableSelection}
          {...(disableSelection && { rowSelection: false })}
          sortingMode="client"
          columnHeaderHeight={50}
          headerHeight={50}
          paginationMode={paginationMode}
          paginationModel={paginationModel}
          // onPaginationModelChange={onPaginationModelChange}
          {...(paginationMode === "server" && {
            rowCount: rowCount || rows.length,
          })}
          pageSizeOptions={[10, 25, 50, 100]}
          onSortModelChange={onSortModelChange || ((model) => {
            // Default behavior: Sorting is handled client-side, no need to trigger pagination
            console.log("Sort model changed:", model);
          })}
          // Ensure sorting doesn't interfere with pagination
          keepNonExistentRowsSelected={false}
          // Prevent automatic pagination reset on sorting
          disableColumnPinning={false}
          // Additional props to prevent pagination interference
          autoHeight={false}
          // Prevent sorting from affecting pagination
          disableColumnResize={false}
          // Force DataGrid to maintain pagination state during sorting
          // key={`pagination-${paginationModel.page}-${paginationModel.pageSize}`}
          // Ensure sorting doesn't trigger pagination changes
          onPaginationModelChange={(newModel) => {
            // Only allow pagination changes if they're not caused by sorting
            if (onPaginationModelChange) {
              onPaginationModelChange(newModel);
            }
          }}
          disableColumnResize={false}
        />
      )}
      <CustomMessageToast
        open={toastOpen}
        setOpen={setToastOpen}
        messageType={toastType}
        messageDescription={toastMessage}
        anchorPosition={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
};

export default CustomTable;

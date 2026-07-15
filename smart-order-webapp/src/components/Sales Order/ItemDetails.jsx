import applicationConfig from "../../dataStore/applicationConfig";
import { MAX_QUANTITY, MAX_UNIT_PRICE } from "../../dataStore/constants";

import CustomTable from "../../utility/Custom Components/CustomTable";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@mui/material/TablePagination";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  setBusyIndicatorForDetailScreen,
  setLineItemList,
} from "../../redux/reducers/appReducer";
import { Typography, Box, Grid, Tooltip, IconButton } from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useTranslation } from "react-i18next";
import { TOAST_SUCCESS, TOAST_ERROR, TOAST_WARNING } from "../../dataStore/strings";
import { checkIsCSR } from "../../dataStore/userRoles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { setCurrentColumnsList } from "../../redux/reducers/appReducer";
import CustomMessagePopover from "../../utility/Custom Components/CustomMessagePopover";
import {
  setMessagePopoverStatus,
  setMessagePopoverVisibility,
  setDetailColumnList,
} from "../../redux/reducers/appReducer";
import fnServiceRequest from "../../utility/fnServiceRequest";
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import CustomDeletePopover from "../../utility/Custom Components/CustomDeletePopover";
import { CircleInfo } from '@cw/rds/icons';
import { HeaderControlButton as HeaderButton } from '../../UIComponents/Button';
import { ButtonTypes } from '../../UIComponents/UITypes';
import StockSearchPopover from "./StockSearchPopover";
import ItemDetailsHeader from "./ItemDetailsHeader";
import ItemDetailsActions from "./ItemDetailsActions";
import {
  hasMeaningfulData,
  MANDATORY_FIELDS,
  MANDATORY_FIELD_LABELS,
  validateMandatoryFields,
  calculateSummaryData,
  createSummaryDataArray,
  calculateNetAmount,
  generateTempOrderItemId,
  isTempOrderItemId,
  filterItemsByExceptionType,
  createNewMaterialObject,
  createUpdateItemPayload,
  FIELDS_TO_TRACK,
  getChangedFields,
  DETAIL_COLUMNS_STORAGE_KEY,
  getDetailColumnsStorageKey,
  DROP_DOWN_FILTER_OPTIONS,
  customizeDataArray,
} from "./itemDetailsHelpers";
import ColumnCustomizationDialog from "./ColumnCustomization";

const ItemDetails = ({
  remarks,
  setRemarks,
  splitScreenFlag,
  status,
  deletedMode,
  deletedRows,
  onToggleDeletedMode,
  onRestoreRow,
  onDeleteRow,
  onRefreshItems,
}) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const theme = useTheme();
  const { orderHeaderId, poTotalQuantity, poTotalAmount } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editableRow, setEditableRow] = useState(null);
  const [rowItemDone, setRowItemDone] = useState(false);
  const itemDetailRow = useSelector((state) => state.appReducer.lineItemList);
  const salesItemdata = useSelector((state) => state.appReducer.salesItemdata);
  const headerinfoformanual = useSelector((state) => state.appReducer.salesOrderDetails);
  const salesOrderDetails = useSelector((state) => state.appReducer.salesOrderDetails);
  const userRole = useSelector((state) => state.appReducer.userDetails.roles);
  const listTitle = deletedMode ? t("deletedSalesItemList") : t("salesItemList");
  // Summary chips state
  const [showSummaryChips, setShowSummaryChips] = useState(true);
  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessageType, setToastMessageType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteNotes, setDeleteNotes] = useState("");
  const [stockSearchOpen, setStockSearchOpen] = useState(false);

  // Calculate summary data using helper function
  const summary = calculateSummaryData(itemDetailRow, salesItemdata);
  const summaryData = createSummaryDataArray(summary, t);

  const handleSummaryToggle = () => {
    setShowSummaryChips(!showSummaryChips);
  };

  const handleStockSearchClick = () => {
    setStockSearchOpen(true);
  };

  const handleStockSearchClose = () => {
    setStockSearchOpen(false);
  };

  const handleStockToast = (type, message) => {
    setToastMessageType(type);
    setToastMessage(message);
    setToastOpen(true);
  };

  const [itemDetailsRowCopy, setItemDetailsRowCopy] = useState([
    ...itemDetailRow,
  ]);
  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const [unsavedRow, setUnsavedRow] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");
  const [listPage, setListPage] = useState(0);
  const [hasPagination, setHasPagination] = useState(false);
  const [popOverVisibility, setPopOverVisibility] = useState(false);
  const paginationCount = 10;

  // Add pagination model state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: paginationCount,
  });

  // Add pagination change handler
  const handlePaginationModelChange = (newModel) => {
    setListPage(newModel.page);
    setPaginationModel(newModel);
  };

  var aCurrentColumnsList = useSelector(
    (state) => state.appReducer.aCurrentColumnsList
  );
  const currentModule = useSelector(
    (state) => state?.appReducer?.currentModule
  );
  const headerInfo = useSelector((state) => state.appReducer.headerInfo);
  const messagePopoverStatus = useSelector(
    (state) => state.appReducer.messagePopoverStatus
  );
  const messagePopoverVisibility = useSelector(
    (state) => state.appReducer.messagePopoverVisibility
  );
  const defaultModuleColumns = applicationConfig(t)
    ?.moduleListFields?.filter((moduleData) => {
      return moduleData.moduleName === currentModule;
    })
    ?.filter((item) => {
      return item;
    })
    ?.at(0)?.itemDetailsList[status];
  const detailColumnList = useSelector(
    (state) => state.appReducer.detailColumnList
  );

  const addMaterialHandler = () => {
    if (headerInfo?.salesOrg === null || headerInfo?.salesOrg === "") {
      dispatch(
        setMessagePopoverStatus({
          status: "Empty Salesorg",
        })
      );
      dispatch(setMessagePopoverVisibility(true));
    } else {
      console.log("itemDetailRow before adding:", itemDetailRow);

      const addedObject = createNewMaterialObject(itemDetailRow);

      console.log("New row object being added:", addedObject);
      dispatch(setLineItemList([...itemDetailRow, addedObject]));
      setEditableRow(addedObject.orderItemId);
      setEditMode(true);
      setRowItemDone(true);
    }
  };

  console.log(itemDetailRow);
  console.log(itemDetailsRowCopy);

  const dropDownFilterArrayAtItemLevel = DROP_DOWN_FILTER_OPTIONS.map(option => t(option));

  const fnCustomizeColumns = () => {
    setPopOverVisibility(true);
  };

  const handlePageChange = (oEvent, newPage) => {
    setListPage(newPage);
  };

  const handleDropdownChange = (event, deletedCheck) => {
    let currentFilter = event?.target?.value;
    if (deletedCheck) {
      currentFilter = event;
    }
    setSelectedOption(currentFilter);
    setListPage(0);
    setItemDetailsRowCopy(filterItemsByExceptionType(itemDetailRow, currentFilter));
  };

  const fnNaviagtionToMaterialMismatch = (event) => {
    if (headerInfo?.salesOrg === null || headerInfo?.salesOrg === "") {
      dispatch(
        setMessagePopoverStatus({
          status: "Empty Salesorg",
        })
      );
      dispatch(setMessagePopoverVisibility(true));
    } else if (
      (headerInfo?.sapShipToName === null ||
        headerInfo?.sapShipToName === "") &&
      (headerInfo?.sapShipToId === null || headerInfo?.sapShipToId === "")
    ) {
      dispatch(
        setMessagePopoverStatus({
          status: "Please select a customer before moving forward.",
        })
      );
      dispatch(setMessagePopoverVisibility(true));
    } else {
      event.stopPropagation();
      navigate(`/salesOrderExceptionMatch/${orderHeaderId}`);
    }
  };

  const fnRowClickHandler = (event, columns, rows, index) => {
    event.stopPropagation();
  };

  // Tracks the last "status__email" key for which column prefs were fetched.
  // Prevents the API from re-firing on unrelated re-renders (itemDetailRow changes,
  // headerinfoformanual changes, etc.). Resets automatically when status or email changes.
  const itemColumnPrefsFetchRef = useRef(null);

  // Helper: merge saved prefs with the current status's default column definitions.
  // Columns not present in the current status's defaults (e.g. Action/Edit for read-only
  // statuses) are silently dropped, so preferences never bleed across statuses.
  const mergeItemColumns = (defaults, saved) => {
    const merged = [];
    const used = new Set();
    saved.forEach((pref) => {
      const def = (defaults || []).find((d) => d.fieldName === pref.fieldName);
      if (def) {
        merged.push({
          ...def,
          visible: pref.visible,
          fieldLabel: def.fieldLabelKey ? t(def.fieldLabelKey) : def.fieldLabel,
        });
        used.add(pref.fieldName);
      }
    });
    (defaults || []).forEach((def) => {
      if (!used.has(def.fieldName)) {
        merged.push({
          ...def,
          fieldLabel: def.fieldLabelKey ? t(def.fieldLabelKey) : def.fieldLabel,
        });
      }
    });
    return merged;
  };

  // Effect 1 — row formatting only.
  // Runs whenever line items or deleted-mode changes. Does NOT call the backend.
  useEffect(() => {
    setItemDetailsRowCopy(itemDetailRow.map((item) => ({ ...item })));
    dispatch(setCurrentColumnsList(defaultModuleColumns));
  }, [itemDetailRow, deletedMode]);

  // Effect 2 — column preferences fetch.
  // Runs ONLY when status or user email changes. The useRef key guard ensures the API
  // is called exactly once per (status + email) combination even if the component
  // re-renders many times (e.g. due to itemDetailRow or headerinfoformanual updates).
  useEffect(() => {
    if (!status) return;

    const fetchKey = `${status}__${userDetails?.email ?? ""}`;
    if (itemColumnPrefsFetchRef.current === fetchKey) return; // already fetched for this combination
    itemColumnPrefsFetchRef.current = fetchKey;

    // Snapshot defaultModuleColumns at the time this effect runs.
    // It is derived purely from `status` so it will always be correct here.
    const defaults = defaultModuleColumns;

    const applyDefaults = () => {
      const updatedColumns = Array.isArray(defaults)
        ? defaults.map((col) => ({
          ...col,
          fieldLabel: col.fieldLabelKey ? t(col.fieldLabelKey) : col.fieldLabel,
        }))
        : [];
      dispatch(setDetailColumnList(updatedColumns));
    };

    const applyFromSaved = (saved) => {
      const hasValid =
        Array.isArray(saved) &&
        saved.length > 0 &&
        saved.some(
          (col) => col.fieldName !== "Action" && col.fieldName !== "Edit" && col.fieldName !== ""
        );
      if (hasValid) {
        dispatch(setDetailColumnList(mergeItemColumns(defaults, saved)));
        return true;
      }
      return false;
    };

    const readLocalCache = () => {
      try {
        return JSON.parse(
          localStorage.getItem(getDetailColumnsStorageKey()) ??
          localStorage.getItem(DETAIL_COLUMNS_STORAGE_KEY)
        );
      } catch (_) {
        return [];
      }
    };

    const email = userDetails?.email;
    if (email) {
      const url = `/JavaServices_Oauth/api/salesOrder/getUserColumnPreferences?emailId=${encodeURIComponent(email)}&moduleName=Sales%20Order%20Item`;
      fnServiceRequest(
        url,
        "GET",
        (res) => {
          const saved = res?.data?.columns ?? res?.columns;
          if (!applyFromSaved(saved)) {
            if (!applyFromSaved(readLocalCache())) applyDefaults();
          }
        },
        () => {
          // API failed — fall back to localStorage cache, then defaults
          if (!applyFromSaved(readLocalCache())) applyDefaults();
        }
      );
    } else {
      if (!applyFromSaved(readLocalCache())) applyDefaults();
    }
  }, [status, userDetails?.email]);

  useEffect(() => {
    setUnsavedRow({});
    setEditMode(false);
    setEditableRow(null);
  }, [deletedMode]);

  useEffect(() => {
    const last = itemDetailRow?.[itemDetailRow.length - 1];
    if (last && String(last.orderItemId).startsWith("temp_")) {
      setEditableRow(last.orderItemId);
      setEditMode(true);
    }
  }, [itemDetailRow?.length]);

  const customizedDataArray = customizeDataArray(itemDetailsRowCopy, detailColumnList);
  console.log("Customized data array:", customizedDataArray);

  // HANDLE DELETE ROW
  const handleDeleteRow = (orderItemId, opts = {}) => {
    if (!deletedMode && itemDetailRow.length <= 1) {
      setToastMessageType(TOAST_WARNING);
      setToastMessage(t("At least one item is required. Cannot delete the last item."));
      setToastOpen(true);
      return;
    }

    const srcRows = deletedMode ? deletedRows : itemDetailRow;
    const row = srcRows?.find(r => r.orderItemId === orderItemId);

    const isTemp = isTempOrderItemId(orderItemId);
    const isEmpty = !hasMeaningfulData(row);

    if (isTemp || (opts?.immediateIfEmpty && isEmpty)) {
      // immediate delete
      dispatch(setLineItemList(
        itemDetailRow.filter(item => item.orderItemId !== orderItemId)
      ));
      // reset edit state
      setEditMode(false);
      setEditableRow(null);
      setUnsavedRow({});
      setToastMessageType(TOAST_SUCCESS);
      setToastMessage(t("Item deleted successfully"));
      setToastOpen(true);
      return;
    }

    // non-empty regular item -> open confirmation popover
    setDeleteTargetId(orderItemId);
    setDeleteNotes("");
    setDeleteDialogOpen(true);
  };


  const confirmDeleteRow = () => {
    if (!deleteTargetId) return;

    const isLastDeletedItem = deletedMode && deletedRows?.length === 1;

    const postSuccess = () => {
      if (isLastDeletedItem) {
        onToggleDeletedMode?.();
      } else {
        onRefreshItems?.();
      }

      setEditMode(false);
      setEditableRow(null);
      setUnsavedRow({});
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
      setDeleteNotes("");

      setToastMessageType(TOAST_SUCCESS);
      setToastMessage(t("Item deleted successfully"));
      setToastOpen(true);
    };

    onDeleteRow?.(deleteTargetId, deleteNotes, postSuccess);
  };



  const handleSaveRow = (orderItemId) => {
    const unsavedItem = unsavedRow[orderItemId];
    if (!unsavedItem) {
      console.warn("No unsaved changes found for row:", orderItemId);
      return;
    }

    const originalItem = itemDetailRow.find(
      (item) => item.orderItemId === orderItemId
    );
    if (!originalItem) {
      console.error("Item not found in current list");
      dispatch(
        setMessagePopoverStatus({
          status: "Item not found in current list",
        })
      );
      dispatch(setMessagePopoverVisibility(true));
      return;
    }

    // Check for mandatory fields using helper function
    const mergedItem = { ...originalItem, ...unsavedItem };
    const missingFields = validateMandatoryFields(mergedItem, MANDATORY_FIELDS);
    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(
        (field) => MANDATORY_FIELD_LABELS[field] || field
      );
      setToastMessageType("warning");
      setToastMessage(`Please fill in the mandatory fields: ${missingLabels.join(", ")}`);
      setToastOpen(true);
      return; // Prevent saving
    }

    // Quantity validations
    if (mergedItem.poQuantity !== undefined && mergedItem.poQuantity !== "") {
      const qty = parseInt(mergedItem.poQuantity, 10);
      if (isNaN(qty) || qty === 0) {
        setToastMessageType("warning");
        setToastMessage(t("Quantity must be greater than 0."));
        setToastOpen(true);
        return;
      }
      if (qty > MAX_QUANTITY) {
        setToastMessageType("warning");
        setToastMessage(`${t("Quantity cannot exceed")} ${MAX_QUANTITY.toLocaleString()}.`);
        setToastOpen(true);
        return;
      }
    }
    // Unit Price validations
    if (mergedItem.poUnitPrice !== undefined && mergedItem.poUnitPrice !== "") {
      const price = parseFloat(mergedItem.poUnitPrice);
      if (isNaN(price) || price === 0) {
        setToastMessageType("warning");
        setToastMessage(t("Unit Price must be greater than 0."));
        setToastOpen(true);
        return;
      }
      if (price > MAX_UNIT_PRICE) {
        setToastMessageType("warning");
        setToastMessage(`${t("Unit Price cannot exceed")} ${MAX_UNIT_PRICE.toLocaleString()}.`);
        setToastOpen(true);
        return;
      }
      if (/\.\d{4,}$/.test(String(mergedItem.poUnitPrice))) {
        setToastMessageType("warning");
        setToastMessage(t("Unit Price allows only up to 3 decimal places."));
        setToastOpen(true);
        return;
      }
    }

    dispatch(setBusyIndicatorForDetailScreen(true));

    const updatedItem = {
      ...originalItem,
      ...unsavedItem,
      lastModifiedDate: new Date().toISOString(),
    };

    // Compute Net Price from quantity & unit price using helper
    const netAmount = calculateNetAmount(updatedItem.poQuantity, updatedItem.poUnitPrice);
    updatedItem.poTotalAmount = netAmount;


    // Create payload using helper function
    const payload = createUpdateItemPayload(updatedItem, userDetails, netAmount);

    const url = `/JavaServices_Oauth/api/salesOrder/updateItem?headerId=${orderHeaderId}`;

    fnServiceRequest(
      url,
      "POST",
      (response) => {
        console.log("API response:", response);

        const updatedRows = itemDetailRow.map((item) =>
          item.orderItemId === orderItemId ? updatedItem : item
        );
        dispatch(setLineItemList(updatedRows));
        onRefreshItems?.();
        setToastMessageType("success");
        setToastMessage(t("Line item updated successfully"));
        setToastOpen(true);
        const Itemtoupdate = itemDetailRow.find(
          (item) => item.orderItemId === orderItemId
        );

        // Get changed fields using helper function
        const changedFields = getChangedFields(originalItem, updatedItem, FIELDS_TO_TRACK);

        if (changedFields.length === 0) {
          setToastMessageType("info");
          setToastMessage(t("No changes to save."));
          setToastOpen(true);
          dispatch(setBusyIndicatorForDetailScreen(false));
          return; // no API call
        }
        Object.keys(FIELDS_TO_TRACK).forEach((field) => {
          const oldValue = originalItem[field] || "";
          const newValue = updatedItem[field] || "";
          if (oldValue !== newValue) {
            fnSaveAudit({
              salesOrderHeader: {
                orderHeaderId: orderHeaderId,
              },
              entityName: "",
              action: "Updated",
              lastModifiedBy: userDetails?.email,
              lastModifiedDate: new Date().toISOString(),
              createdBy: userDetails?.firstName + " " + userDetails?.lastName,
              createdDate: new Date().toISOString(),
              oldValue: oldValue,
              newValue: newValue,
              remarks: `${FIELDS_TO_TRACK[field]} Updated for ${Itemtoupdate.sapMaterialNumber || updatedItem.sapMaterialNumber}`,
            });
          }
        });

        const newUnsavedRows = { ...unsavedRow };
        delete newUnsavedRows[orderItemId];
        setUnsavedRow(newUnsavedRows);

        setEditMode(false);
        setEditableRow(null);

        dispatch(setBusyIndicatorForDetailScreen(false));
      },
      (error) => {
        console.error("API error:", error);
        dispatch(
          setMessagePopoverStatus({
            status: "Error",
            errorMessageFromEcc:
              error?.response?.data?.message ||
              error?.message ||
              t("Failed to save changes"),
          })
        );

        dispatch(setMessagePopoverVisibility(true));
        dispatch(setBusyIndicatorForDetailScreen(false));
      },
      payload
    );
  };

  const handleCancelEdit = (orderItemId) => {
    // 1) Drop draft for this row (so UI shows saved/original values again)
    setUnsavedRow((prev) => {
      const next = { ...(prev || {}) };
      delete next[orderItemId];
      return next;
    });

    // 2) Just exit edit mode — DO NOT remove temp rows anymore
    setEditMode(false);
    setEditableRow(null);
  };



  const fnSaveAudit = (payload) => {
    fnServiceRequest(
      `/JavaServices_Oauth/api/audit/saveAudit`,
      "POST",
      (response) => { },
      (error) => { },
      payload
    );
  };
  const isAnyRowEditable = itemDetailRow.some(item => item.orderItemId === editableRow);
  const guardedSetEditableRow = (next) => {
    if (
      editableRow &&                         // something is being edited
      next !== editableRow &&                // trying to move to another row
      next !== null &&                       // allow exiting edit mode (setting to null)
      unsavedRow?.[editableRow]              // current row has unsaved changes
    ) {
      setToastMessageType("warning");
      setToastMessage(t("Please save the current row before editing another row."));
      setToastOpen(true);
      return; // block switching
    }
    setEditableRow(next); // allow switching
  };

  const isCSR = checkIsCSR(userRole);
  const isPendingApproval = status === "pendingForApproval";
  const isRejected = status === "rejected";
  const canEdit =
    status === "toBeReviewed" ||
    (status === "pendingForApproval" && !isCSR) ||
    (isRejected && isCSR);

  // Force editMode to false if the user is restricted
  const isRestricted = (isCSR && isPendingApproval) || (!isCSR && isRejected);
  // const effectiveEditMode = (isCSR && isPendingApproval) ? false : editMode;
  const effectiveEditMode = isRestricted ? false : editMode;

  return (
    <>
      <CustomDeletePopover
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTargetId(null);
          setDeleteNotes("");
        }}
        onConfirm={confirmDeleteRow}
        title={t("Confirm Deletion")}
        message={t("Are you sure you want to delete this item?")}
        confirmText={t("Delete")}
        cancelText={t("Cancel")}
        showItemDetails={false}
        requireNotes
        notes={deleteNotes}
        onNotesChange={setDeleteNotes}
      />


      <div
        className={
          splitScreenFlag === true ? "itemDetailsForSplitScreen" : "itemDetails"
        }
        style={{ width: "100%", overflowX: "auto" }}
      >
        <Grid container
          className="addRows"
          sx={{
            display: "flex",
            paddingRight: "20px",
            paddingLeft: 2,
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: 0,
          }}
          gap={1}
        >
          <Grid item>
            <ItemDetailsHeader
              title={t(deletedMode ? "deletedSalesItemList" : "salesItemList")}
              itemCount={(deletedMode ? deletedRows : itemDetailsRowCopy)?.length ?? 0}
              showSummaryChips={showSummaryChips}
              onToggleSummary={handleSummaryToggle}
              summaryData={summaryData}
              deletedMode={deletedMode}
            />
          </Grid>
          <Grid
            item
            display={"flex"}
            justifyContent={"flex-end"}
            flexWrap={"wrap"}
            gap={1}
            alignItems={"center"}
            marginLeft="auto"
          >

            {/* Customize Columns — always visible regardless of edit permissions */}
            <Tooltip title={t("Customize Columns")}>
              <HeaderButton action={ButtonTypes.CHECK} onClick={fnCustomizeColumns}>
                <ViewColumnIcon />
              </HeaderButton>
            </Tooltip>

            <HeaderButton
              action={ButtonTypes.CHECK}
              startIcon={<CircleInfo />}
              onClick={() => {
                setEditMode(false);
                setEditableRow(null);
                setUnsavedRow({});
                onToggleDeletedMode?.();
              }}
            >
              {deletedMode ? t("Back to Active items") : t("Want to see Deleted items?")}
            </HeaderButton>

            <div
              className="flex-container"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {canEdit && !deletedMode && (
                <ItemDetailsActions
                  onStockSearchClick={handleStockSearchClick}
                  onAddMaterial={addMaterialHandler}
                  onDropdownChange={(event) => handleDropdownChange(event, false)}
                  selectedOption={selectedOption}
                  dropDownOptions={dropDownFilterArrayAtItemLevel}
                  isAnyRowEditable={isAnyRowEditable}
                />
              )}

            </div>
          </Grid>
        </Grid>
        <Box sx={{ p: 2 }}>
          <CustomTable
            rows={deletedMode ? deletedRows : itemDetailsRowCopy}
            setRows={(next) => dispatch(setLineItemList(next))}
            Headercolumns={detailColumnList}
            editableRow={editableRow}
            setEditableRow={guardedSetEditableRow}
            rowItemDone={rowItemDone}
            setRowItemDone={setRowItemDone}
            fnNaviagtionToMaterialMismatch={fnNaviagtionToMaterialMismatch}
            unsavedRow={unsavedRow}
            setUnsavedRow={setUnsavedRow}
            fnRowClickHandler={fnRowClickHandler}
            // handleCancelEdit={handleCancelEdit}
            remarks={remarks}
            setRemarks={setRemarks}
            editMode={editMode}
            canEdit={canEdit}
            setEditMode={setEditMode}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            handleDropdownChange={handleDropdownChange}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            rowCount={customizedDataArray?.length}
            paginationMode="client"
            handleDeleteRow={handleDeleteRow}
            handleSaveRow={handleSaveRow}
            handleCancelEdit={handleCancelEdit}
            headerinfoformanual={headerinfoformanual}
            deletedMode={deletedMode}
            onRestoreRow={(row) => {
              const isLastItem = deletedMode && deletedRows?.length === 1;

              const postSuccess = () => {
                if (isLastItem) {
                  onToggleDeletedMode?.();
                } else {
                  onRefreshItems?.();
                }

                setToastMessageType(TOAST_SUCCESS);
                setToastMessage(t("Item restored successfully"));
                setToastOpen(true);
              };

              onRestoreRow?.(row, postSuccess);
            }}
          />
        </Box>
      </div>
      <CustomMessageToast
        open={toastOpen}
        setOpen={setToastOpen}
        messageType={toastMessageType}
        messageDescription={toastMessage}
        anchorPosition={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <StockSearchPopover
        open={stockSearchOpen}
        onClose={handleStockSearchClose}
        onToast={handleStockToast}
      />

      <ColumnCustomizationDialog
        visible={popOverVisibility}
        setVisibility={setPopOverVisibility}
        columns={detailColumnList}
        defaultColumns={defaultModuleColumns}
        userEmail={userDetails?.email}
        lockedFields={["Icon","Material ID","SAP Material ID","SAP Material Description","PO Quantity","Unit Price","Net Price","PO UOM","Exception Type"]}
        onApply={(cols) => {
          // 1. Update Redux immediately so the table re-renders without waiting for API
          dispatch(setDetailColumnList(cols));

          // 2. Build the lightweight payload (fieldName + visible + order only)
          const columnsPayload = cols.map((col, idx) => ({
            fieldName: col.fieldName,
            visible: col.visible,
            order: idx,
          }));

          // 3. Mirror to localStorage as an offline/fallback cache
          localStorage.setItem(
            getDetailColumnsStorageKey(),
            JSON.stringify(columnsPayload)
          );

          // 4. Persist to backend under a single shared module name.
          // The merge logic filters columns by the current status's defaults,
          // so Action/Edit never bleed into statuses that don't have them.
          const url = `/JavaServices_Oauth/api/salesOrder/saveUserColumnPreferences`;
          fnServiceRequest(
            url,
            "POST",
            () => {
              // success — nothing extra needed, Redux + localStorage already updated
            },
            (err) => {
              console.error("Failed to save item column preferences:", err);
              // Silent fail — localStorage cache ensures prefs are still applied locally
            },
            {
              email: userDetails?.email,
              moduleName: "Sales Order Item",
              columns: columnsPayload,
            }
          );

          setPopOverVisibility(false);
        }}
      />
    </>
  );
};

export default ItemDetails;

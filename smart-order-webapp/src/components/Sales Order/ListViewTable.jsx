import CustomTable from "../../utility/Custom Components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import applicationConfig from "../../dataStore/applicationConfig";
import { useNavigate } from "react-router-dom";
import { getPathNameFromModuleName, Capitalize } from "../../utility/utilityFunctions";
import { Grid, IconButton, Typography, Box, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import useSelectedText from "../../utility/useSelectedText";
import ColumnCustomizationDialog from "./ColumnCustomization";
import ManualFileUploadOption from "./ManualFileUploadOption";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useMemo, useRef } from "react";
import { useTheme } from '@mui/material/styles';
import EditNoteIcon from "@mui/icons-material/EditNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  setCurrentColumnsList,
  setUserEmailId,
  setSoColumnList,
  setClickedIndex,
  setConcurrentUserData,
  setCurrentPayload,
  setListPage,
  setStatus,
  setFilterOptions,
  setSelectedStatusTab,
} from "../../redux/reducers/appReducer";
import fnServiceRequest from "../../utility/fnServiceRequest";
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import ExportDataDialog from "./ExportData";
import "rsuite/dist/rsuite.min.css";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ListViewHeader from "./ListViewHeader";
import { Refresh, Download, Upload, FilePen } from '@cw/rds/icons';
import { Chip } from "@cw/rds";
import moment from "moment";
import Unprocessed from "./Unprocessed";
import { DateTimeChip } from "../../utility/Custom Components/CustomChips";
import {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
} from "../../dataStore/docProcessStatus";
import { customDateTimeFormat } from "../../utility/CustomDateTimeFormat";
const ListViewTable = ({ totalRecords, metaData, filteredDate, setFilteredDate }) => {
  const theme = useTheme();
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedText = useSelectedText();
  const aSmartOrderList = useSelector(
    (state) => state.appReducer.aSmartOrderList
  );
  const filterOptions = useSelector((state) => state.appReducer.filterOptions);
  const appSettings = useSelector((state) => state.appReducer.appSettings);

  // Function to get default start date based on appSettings.range
  const getDefaultStartDate = () => {
    if (!appSettings?.range) return new Date();

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(appSettings.range));

    return startDate;
  };

  // Function to get default end date based on appSettings.range
  const getDefaultEndDate = () => {
    if (!appSettings?.range) return new Date();

    return new Date();
  };

  // Get effective dates - use filteredDate if available, otherwise use defaults
  const effectiveStartDate = filteredDate?.createdDateFrom || getDefaultStartDate();
  const effectiveEndDate = filteredDate?.createdDateTo || getDefaultEndDate();
  console.log("effectiveStartDate", effectiveStartDate);
  console.log("effectiveEndDate", effectiveEndDate);
  console.log("Default Date", getDefaultStartDate());


  const currentModule = useSelector(
    (state) => state?.appReducer?.currentModule
  );
  const defaultModuleColumns = useMemo(() => {
    return applicationConfig(t)
      ?.moduleListFields?.filter((moduleData) => {
        return moduleData.moduleName === currentModule;
      })
      ?.at(0)?.columnsList;
  }, [t, currentModule]);
  const soColumnList = useSelector((state) => state.appReducer.soColumnList);

  // console.log(itemdetailsColumn);

  var aCurrentColumnsList = useSelector(
    (state) => state.appReducer.aCurrentColumnsList
  );
  // console.log("b:", aCurrentColumnsList);

  var userEmailId = useSelector((state) => state.appReducer.userEmailId);
  var concurrentUserData = useSelector(
    (state) => state.appReducer.concurrentUserData
  );
  const userDetails = useSelector((state) => state.appReducer.userDetails);

  const [popOverVisibility, setPopOverVisibility] = useState(false);
  const selectedStatusTab = useSelector((state) => state.appReducer.selectedStatusTab);

  const handleStatusTabClick = (event, newValue) => {
    dispatch(setSelectedStatusTab(newValue));

    const statusMap = ["All", "To Be Reviewed", "Created", "Created With Block", "Queued", "Cancelled", "Pending For Approval", "Rejected", "Unprocessed"];
    const status = statusMap[newValue];
    if(status === "Unprocessed")return;

    // Update filter options with selected status
    const filterOptionClone = { ...filterOptions };

    if (status === "All") {
      filterOptionClone.documentProcessStatus = [];
    } else {
      filterOptionClone.documentProcessStatus = [status];
    }

    dispatch(setFilterOptions(filterOptionClone));

    // Trigger API call with new filter
    const payload = {
      ...oPayload,
      pageNumber: 1,
      filterData: {
        ...oPayload.filterData,
        documentProcessStatus: status === "All" ? [] : [status]
      }
    };
    dispatch(setCurrentPayload(payload));
    dispatch(setListPage(0));
  };

  const fnCustomizeColumns = () => {
    setPopOverVisibility(true);
  };
  const status = useSelector((state) => state.appReducer.status);
  const path = getPathNameFromModuleName(currentModule);
  const [lockOrderFlag, setLockOrderFlag] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [anchorPosition, setAnchorPosition] = useState({
    vertical: "bottom",
    horizontal: "center",
  });
  const clickedIndex = useSelector((state) => state.appReducer.clickedIndex);
  const fnRowClickHandler = (oEvent, columns, rows, index) => {
    const rowId = rows[index]?.orderHeaderId ?? rows[index]?.id;
    // Check if there is selected text
    dispatch(setClickedIndex(rowId));
    if (selectedText?.selectedText.length !== 0) {
      oEvent.stopPropagation();
    } else {
      // Get the specific order status
      const orderStatus = rows[index].docProcessStatus;
      if (
        orderStatus === "To Be Reviewed" ||
        orderStatus === "Drafted"
      ) {
        dispatch(setStatus("toBeReviewed"));
        console.log("statussssssssssssset", status);
      } else if (orderStatus === "Created With Block") {
        dispatch(setStatus("createdWithBlock"));
        console.log("statussssssssssssset", status);
      }
      else if (orderStatus === "Created") {
        dispatch(setStatus("Created"));
        console.log("statussssssssssssset", status);
      } else if (orderStatus === DOC_STATUS_PENDING_FOR_APPROVAL) {
        dispatch(setStatus("pendingForApproval"));
        console.log("statussssssssssssset", status);
      } else if (orderStatus === DOC_STATUS_REJECTED) {
        dispatch(setStatus("rejected"));
        console.log("statussssssssssssset", status);
      } else if (orderStatus === "Unprocessed") {
        dispatch(setStatus("unprocessed"));
        console.log("statussssssssssssset", status);
      }  else {
        dispatch(setStatus(Capitalize(orderStatus)));
        console.log("statussssssssssssset", status);
      }
      // Check if the order status is "To Be Reviewed"
      if (
        orderStatus === "To Be Reviewed" ||
        orderStatus === DOC_STATUS_PENDING_FOR_APPROVAL ||
        orderStatus === DOC_STATUS_REJECTED
      ) {
        // Call the getUserInfo function to determine user access to this order

        const orderId = rows[index]?.orderHeaderId;
        const sUploadUrl = `/JavaServices_Oauth/api/lock/lock?orderId=${orderId}&email=${userDetails?.email}`;

        fnServiceRequest(
          sUploadUrl,
          "POST",
          (response) => fnSuccessHandlerForGetUserInfo(response),
          (error) => fnErrorHandlerForGetUserInfo(error)
        );
        function fnSuccessHandlerForGetUserInfo(response) {
          dispatch(setConcurrentUserData(response));
          if (
            response &&
            (customizedDataArray[index]?.docProcessStatus === "To Be Reviewed" ||
              customizedDataArray[index]?.docProcessStatus === DOC_STATUS_PENDING_FOR_APPROVAL ||
              customizedDataArray[index]?.docProcessStatus === DOC_STATUS_REJECTED)
          ) {
            // Check if order is locked by another user
            if (
              response.userEditFlag &&
              response?.lockedBy !== userDetails?.email
            ) {
              dispatch(setUserEmailId(response?.lockedBy));
              setLockOrderFlag(true);
            } else {
              // Same user or no lock conflict, allow navigation
              navigate(`/${path}/${customizedDataArray[index].orderHeaderId}`);
            }
          }
        }
        function fnErrorHandlerForGetUserInfo(error) {
          // Handle 409 conflict error
          if (error.status === 409 && error.data) {
            const lockData = error.data;
            dispatch(setConcurrentUserData(lockData));

            // Check if the order is locked by the same user
            if (lockData.lockedBy === userDetails?.email) {
              // Same user, allow navigation
              navigate(`/${path}/${customizedDataArray[index].orderHeaderId}`);
            } else {
              // Different user has locked the order
              dispatch(setUserEmailId(lockData.lockedBy));
              setLockOrderFlag(true);
            }
          } else {
            // Handle other errors
            console.error('Error in lock API:', error);
          }
        }
      } else {
        // If the status is not "To Be Reviewed," simply navigate to the order
        navigate(`/${path}/${rows[index].orderHeaderId}`);
      }
    }
  };

  const customizedDataArray = (aSmartOrderList && Array.isArray(aSmartOrderList))
    ? aSmartOrderList.map((rowData) => {
      const adjustedRow = {};
      soColumnList?.forEach((column) => {
        if (column.visible) {
          if (Array.isArray(column.fieldBinding)) {
            column.fieldBinding.forEach((field) => {
              adjustedRow[field] = rowData[field];
            });
          } else {
            adjustedRow[column.fieldBinding] = rowData[column.fieldBinding];
          }
        }
      });

      adjustedRow.orderHeaderId = rowData.orderHeaderId;
      adjustedRow.serialNumber = rowData.serialNumber;

      return adjustedRow;
    })
    : [];
  // console.log(customizedDataArray);
  const handleRefresh = async () => {
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Clear Service Worker cache
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cache) => caches.delete(cache)));
    }

    // Optionally refresh the application
    window.location.reload(true);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  // let oPayload = useSelector((state) => state.appReducer.oCurrentPayload);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const [columnPrefsFetched, setColumnPrefsFetched] = useState(false);

  // Fetch saved column preferences from the backend on mount
  useEffect(() => {
    if (columnPrefsFetched) return;
    if (!defaultModuleColumns || !Array.isArray(defaultModuleColumns)) return;
    dispatch(setCurrentColumnsList(defaultModuleColumns));

    const email = userDetails?.email;
    if (!email) {
      // No user logged in yet – just use defaults
      const updatedColumns = defaultModuleColumns.map((col) => ({
        ...col,
        fieldLabel: t(col.fieldLabel),
      }));
      dispatch(setSoColumnList(updatedColumns));
      setColumnPrefsFetched(true);
      return;
    }

    const url = `/JavaServices_Oauth/api/salesOrder/getUserColumnPreferences?emailId=${encodeURIComponent(email)}&moduleName=Sales%20Order`;
    fnServiceRequest(
      url,
      "GET",
      (res) => {
        const saved = res?.data?.columns ?? res?.columns;
        if (Array.isArray(saved) && saved.length > 0) {
          // Merge saved preferences (order + visibility) with full column metadata
          const merged = mergeColumnsWithPreferences(defaultModuleColumns, saved, t);
          dispatch(setSoColumnList(merged));
        } else {
          // First-time user — use default columns
          const updatedColumns = defaultModuleColumns.map((col) => ({
            ...col,
            fieldLabel: t(col.fieldLabel),
          }));
          dispatch(setSoColumnList(updatedColumns));
        }
        setColumnPrefsFetched(true);
      },
      () => {
        // API failed – fall back to defaults
        const updatedColumns = defaultModuleColumns.map((col) => ({
          ...col,
          fieldLabel: t(col.fieldLabel),
        }));
        dispatch(setSoColumnList(updatedColumns));
        setColumnPrefsFetched(true);
      }
    );
  }, [defaultModuleColumns, dispatch, t, userDetails?.email]);

  // Helper: merge default column definitions with saved user preferences
  const mergeColumnsWithPreferences = (defaults, saved, translator) => {
    const prefMap = new Map(saved.map((p) => [p.fieldName, p]));
    // Start with columns ordered by saved preferences
    const ordered = [];
    const used = new Set();

    // First, add columns in saved order
    saved.forEach((pref) => {
      const def = defaults.find((d) => d.fieldName === pref.fieldName);
      if (def) {
        ordered.push({
          ...def,
          visible: pref.visible,
          fieldLabel: translator(def.fieldLabel),
        });
        used.add(pref.fieldName);
      }
    });

    // Then, append any new default columns not in saved preferences
    defaults.forEach((def) => {
      if (!used.has(def.fieldName)) {
        ordered.push({
          ...def,
          fieldLabel: translator(def.fieldLabel),
        });
      }
    });

    return ordered;
  };
  console.log(concurrentUserData);
  // Add pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });
  const [isSorting, setIsSorting] = useState(false);
  // Use ref to track the page before sorting started
  const pageBeforeSorting = useRef(null);
  // Get current page from redux
  const listPage = useSelector((state) => state.appReducer.listPage);
  const oPayload = useSelector((state) => state.appReducer.oCurrentPayload);

  useEffect(() => {
    // Use oPayload.pageNumber as the source of truth for page
    const targetPage = oPayload?.pageNumber ? oPayload.pageNumber - 1 : listPage;
    const targetPageSize = oPayload?.pageSize || 50;

    // Only update if there's an actual change to prevent loops
    if (paginationModel.page !== targetPage || paginationModel.pageSize !== targetPageSize) {
      console.log("Updating paginationModel from Redux:", {
        from: paginationModel,
        to: { page: targetPage, pageSize: targetPageSize },
        source: { oPayloadPageNumber: oPayload?.pageNumber, listPage }
      });

      setPaginationModel({
        page: targetPage,
        pageSize: targetPageSize,
      });
    }
  }, [oPayload?.pageNumber, oPayload?.pageSize, listPage]);

  // Monitor pagination changes during sorting and correct them
  useEffect(() => {
    if (isSorting) {
      // Store the current page when sorting starts
      const currentPage = paginationModel.page;
      const currentPageSize = paginationModel.pageSize;

      console.log("Sorting started, monitoring pagination at page:", currentPage);

      // Set up multiple timers to catch pagination changes at different stages
      const timer1 = setTimeout(() => {
        if (paginationModel.page !== currentPage) {
          console.log("Timer 1: Correcting pagination during sorting from", paginationModel.page, "back to", currentPage);
          setPaginationModel({
            page: currentPage,
            pageSize: currentPageSize
          });
        }
      }, 100);

      const timer2 = setTimeout(() => {
        if (paginationModel.page !== currentPage) {
          console.log("Timer 2: Correcting pagination during sorting from", paginationModel.page, "back to", currentPage);
          setPaginationModel({
            page: currentPage,
            pageSize: currentPageSize
          });
        }
      }, 200);

      const timer3 = setTimeout(() => {
        if (paginationModel.page !== currentPage) {
          console.log("Timer 3: Correcting pagination during sorting from", paginationModel.page, "back to", currentPage);
          setPaginationModel({
            page: currentPage,
            pageSize: currentPageSize
          });
        }
      }, 300);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      // When sorting is not active, clear the pageBeforeSorting ref
      // This allows normal navigation to work without interference
      if (pageBeforeSorting.current !== null) {
        console.log("Sorting finished, clearing pageBeforeSorting ref");
        pageBeforeSorting.current = null;
      }
    }
  }, [isSorting, paginationModel.page, paginationModel.pageSize]);

  // Handle pagination change
  const handlePaginationModelChange = (newModel) => {
    console.log("Pagination changed:", {
      from: { page: paginationModel.page, pageSize: paginationModel.pageSize },
      to: { page: newModel.page, pageSize: newModel.pageSize }
    });

    // Prevent pagination changes during sorting operations
    if (isSorting) {
      console.log("Sorting in progress, ignoring pagination change");
      return;
    }

    // Additional check: only block pagination changes that are clearly related to sorting
    // Allow legitimate navigation (including to page 1) when not sorting
    if (isSorting) {
      console.log("Sorting in progress, blocking pagination change from", paginationModel.page, "to", newModel.page);
      return;
    }
    // Only block page resets to 0 if we're in a sorting context
    if (pageBeforeSorting.current !== null && newModel.page === 0 && paginationModel.page > 0) {
      console.log("Blocking page reset to 0 during sorting context from", paginationModel.page, "to", newModel.page);
      return;
    }

    // Update Redux state first
    const payload = {
      ...oPayload,
      pageNumber: newModel.page + 1,
      pageSize: newModel.pageSize
    };

    console.log("Dispatching pagination payload:", payload);
    dispatch(setCurrentPayload(payload));
    dispatch(setListPage(newModel.page));

    // Don't update local state here - let the useEffect handle it from Redux
    // This prevents conflicts between local state and Redux state
  };

  // Function to get current page number for API calls
  const getCurrentPageNumber = () => {
    return paginationModel.page + 1; // Convert from 0-based to 1-based
  };

  // Function to handle sorting without affecting pagination
  const handleSortingChange = (sortModel) => {
    // Store the page before sorting starts
    pageBeforeSorting.current = paginationModel.page;

    // Set sorting flag to prevent pagination interference
    setIsSorting(true);

    console.log("Sorting applied:", {
      currentPage: getCurrentPageNumber(),
      currentPaginationModel: paginationModel,
      sortModel: sortModel,
      pageBeforeSorting: pageBeforeSorting.current
    });

    // Store current pagination state to restore it if needed
    const currentPage = paginationModel.page;
    const currentPageSize = paginationModel.pageSize;

    // Use a longer delay to ensure DataGrid sorting is complete
    setTimeout(() => {
      // Force pagination back to current page if it changed
      if (paginationModel.page !== currentPage) {
        console.log("Forcing pagination back to current page:", currentPage);
        setPaginationModel({
          page: currentPage,
          pageSize: currentPageSize
        });
      }
      setIsSorting(false);
      // Reset the ref after sorting is complete
      pageBeforeSorting.current = null;
    }, 300);

    // Note: No dispatch needed for client-side sorting
    // This prevents unnecessary API calls and page resets
  };

  return (
    <>
      {lockOrderFlag && (
        <CustomMessageToast
          open={lockOrderFlag}
          setOpen={setLockOrderFlag}
          messageType={"warning"}
          messageDescription={
            "Another user is making some changes in this order" +
            "  " +
            userEmailId
          }
          anchorPosition={anchorPosition}
        />
      )}

      {/* Header Section */}
      <Grid container alignItems="center" justifyContent="space-between" >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: 0.5,
            columnGap: 1,
            px: { xs: 2, sm: 2.5 },
            py: 1,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "600",
              textAlign: "left",
              color: theme.palette.primary.main,
              fontFamily: "'Roboto', sans-serif",
              display: "inline-flex",        // 👈 this ensures one line
              alignItems: "center",
              minWidth: 0,
            }}
          >
            {`${t("salesOrderList")} (${totalRecords})`}
          </Typography>
          <DateTimeChip
            sx={{
              flexShrink: 1,
              maxWidth: { xs: "100%", sm: "calc(100% - 8px)" },
            }}
            // label={`${moment(effectiveStartDate).format(appSettings.dateFormat)} - ${moment(effectiveEndDate).format(appSettings.dateFormat)}`}
            label={`${customDateTimeFormat(appSettings, effectiveStartDate, "MM-DD-YYYY")} - ${customDateTimeFormat(appSettings, effectiveEndDate, "MM-DD-YYYY")}`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          container
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
        >


          <Grid item>
            <IconButton
              className="btn btn-apply"
              title={t("Clear Cache")}
              onClick={() => handleRefresh()}
              sx={{ width: "2.5rem", height: "2.5rem" }}
            >
              <Refresh sx={{ color: theme.palette.text.secondary }} />
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton
              title={t("Export Data")}
              onClick={handleOpenDialog}
              sx={{ color: "#757575", width: "2.5rem", height: "2.5rem" }}
            >
              <Download fontSize="medium" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              title={t("Customize Columns")}
              onClick={() => setPopOverVisibility(true)}
              sx={{ color: "#757575", width: "2.5rem", height: "2.5rem" }}
            >
              <ViewColumnIcon fontSize="medium" />
            </IconButton>
          </Grid>
          <Grid item sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ExportDataDialog open={dialogOpen} onClose={handleCloseDialog} />
            <ManualFileUploadOption />
          </Grid>
        </Grid>
      </Grid>

      {/* Status Filter Tabs - Below Sales Order List */}
      <Box sx={{ pl: 2, pr: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedStatusTab}
          onChange={handleStatusTabClick}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-flexContainer': {
              paddingLeft: 0,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              minHeight: '40px',
              color: theme.palette.text.secondary,
              backgroundColor: 'transparent',
              borderRadius: '8px 8px 0 0',
              margin: '0 2px',
              paddingLeft: '16px',
              paddingRight: '16px',
            },
            '& .Mui-selected': {
              color: `${theme.palette.primary.main} !important`,
              fontWeight: 600,
              backgroundColor: '#EAE9FF !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 3,
            }
          }}
        >
          <Tab
            label={`All`}
            sx={{ color: theme.palette.text.primary }}
          />
          <Tab
            label={`To Be Reviewed`}
            sx={{ color: theme.palette.warning.main }}
          />
          <Tab
            label={`Created`}
            sx={{ color: theme.palette.success.main }}
          />
          <Tab
            label={`Created With Block`}
            sx={{ color: theme.palette.info.main }}
          />
          <Tab
            label={`Queued`}
            sx={{ color: theme.palette.secondary.main }}
          />
          <Tab
            label={`Cancelled`}
            sx={{ color: theme.palette.secondary.main }}
          />
          <Tab
            label={`Pending For Approval`}
            sx={{ color: theme.palette.secondary.main }}
          />
          <Tab
            label={`Rejected`}
            sx={{ color: theme.palette.secondary.main }}
          />
          {/* <Tab
            label={`Unprocessed`}
            sx={{ color: theme.palette.secondary.main }}
          /> */}
        </Tabs>
      </Box>

      <ColumnCustomizationDialog
        visible={popOverVisibility}
        setVisibility={setPopOverVisibility}
        columns={soColumnList}
        defaultColumns={defaultModuleColumns?.map((col) => ({
          ...col,
          fieldLabel: t(col.fieldLabel),
        }))}
        userEmail={userDetails?.email}
      />

      {/* Filter Section */}
      <Accordion
        expanded={filterVisible}
        disableGutters={true}
        onChange={() => setFilterVisible(!filterVisible)}
        sx={{
          boxShadow: '0px 4px 6px -4px rgba(200, 205, 235, 0.9)',
          border: '1px solid #c4c4c4',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          mx: 2,
          mt: 1,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: '40px',
            backgroundColor: '#E6E8F5',
            padding: '5px 10px',
            borderBottom: '1px solid #c4c4c4',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '15px',
              fontFamily: 'Roboto, sans-serif',
              color: '#000000DE',
            }}
          >
            {t("Filters")}
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            p: 0,
            backgroundColor: '#ffffff',
          }}
        >
          <ListViewHeader
            metaData={metaData}
            filteredDate={filteredDate}
            setFilteredDate={setFilteredDate}
            setSelectedStatusTab={setSelectedStatusTab}
          />
        </AccordionDetails>
      </Accordion>

      {selectedStatusTab === 8 ? (
        <Unprocessed />
      ) : (
      <Box sx={{ p: 2 }}>
        {soColumnList && Array.isArray(soColumnList) && soColumnList.length > 0 ? (
          <CustomTable
            rows={customizedDataArray}
            visible={popOverVisibility}
            Headercolumns={soColumnList}
            fnRowClickHandler={fnRowClickHandler}
            // Add pagination props
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            rowCount={totalRecords}
            paginationMode="server"
            onSortModelChange={handleSortingChange}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Loading table configuration...
          </div>
        )}
      </Box>)}
    </>
  );
};

export default ListViewTable;


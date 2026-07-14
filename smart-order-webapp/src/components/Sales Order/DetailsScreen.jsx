import { Grid, Popover, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useRef } from "react";
import "./Style.css";
import SplitPane from "react-split-pane";
import { setMessagePopoverStatus } from "../../redux/reducers/appReducer";
import ViewPoDocument from "./ViewPoDocument";
import { setBusyIndicatorForDetailScreen } from "../../redux/reducers/appReducer";
import {
  setWorkflowTaskDetails,
} from "../../redux/reducers/appReducer";
import {
  setHeaderInfo,
  setSalesOrderDetails,
} from "../../redux/reducers/appReducer";
import BusyIndicator from "../../utility/BusyIndicator";
import DetailScreenSkeleton from "../../UIComponents/Skeletons/DetailScreenSkeleton";
import {
  setMessageToastForInvalidLineItem,
  setviewDocumentServiceResponse,
} from "../../redux/reducers/appReducer";
import HeaderInfoNew from "./HeaderInfonew";

import ItemDetails from "./ItemDetails";
import DetailsFooter from "./DetailsFooter";
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";

import fnServiceRequest from "../../utility/fnServiceRequest";
import { useParams, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import HeaderTopBar from "./HeaderTopBar";
import {
  setLineItemList,
  setSalesItemdata,
  setStatus,
} from "../../redux/reducers/appReducer";
import { Capitalize } from "../../utility/utilityFunctions";
import CustomMessagePopover from "../../utility/Custom Components/CustomMessagePopover";
import fnDeleteConcurrentUser from "../../utility/fnDeleteConcurrentUser";
import { setMessagePopoverVisibility } from "../../redux/reducers/appReducer";
import { useGetHeaderById } from "../../hooks/useGetHeaderById";
import {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
} from "../../dataStore/docProcessStatus";

// detect below-laptop breakpoint
const DetailsScreen = () => {
  const theme = useTheme();
  const isBelowLaptopView = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const detailScreenBusyIndicator = useSelector(
    (state) => state.appReducer.detailScreenBusyIndicator
  );
  const lineItemList = useSelector((state) => state.appReducer.lineItemList);
  const salesItemdata = useSelector((state) => state.appReducer.salesItemdata);
  // console.log(lineItemList);
  const messageToastForInvalidLineItem = useSelector(
    (state) => state.appReducer.messageToastForInvalidLineItem
  );
  const exceptionScreenFlag = useSelector(
    (state) => state.appReducer.exceptionScreenFlag
  );
  const messagePopoverVisibility = useSelector(
    (state) => state.appReducer.messagePopoverVisibility
  );

  const { orderHeaderId } = useParams();

  const salesOrderDetails = useSelector(
    (state) => state.appReducer.salesOrderDetails
  );
  const headerInfo = useSelector((state) => state.appReducer.headerInfo);

  const [headerInfoEdited, setHeaderInfoEdited] = useState(headerInfo);
  // This state headerInfoEdited will hold the state for edited mode and state will be updated on handleChange

  const [editMode, setEditMode] = useState(false);

  // by default edit mode is false and will be true once we click on the edit button

  const [splitScreenFlag, setSplitScreenFlag] = useState(false);
  const messagePopoverObject = useSelector(
    (state) => state.appReducer.messagePopoverObject
  );
  const busyIndicatorForDetailScreen = useSelector(
    (state) => state.appReducer.busyIndicatorForDetailScreen
  );
  const currentSalesOrg = useSelector(
    (state) => state.appReducer.currentSalesOrg
  );

  const status = useSelector((state) => state.appReducer.status);
  // console.log(status);
  const multipleCustomerOption = useSelector(
    (state) => state.appReducer.multipleCustomerOption
  );
  const userLanguage = useSelector((state) => state.appReducer.userLanguage);
  const [gridItemWidth, setGridItemWidth] = useState(splitScreenFlag ? 6 : 2);
  const dispatch = useDispatch();

  const [auditLogData, setAuditLogData] = useState([]);
  const [errorFlagForPoDocument, setErrorFlagForPoDocument] = useState({
    visiblity: false,
    errorMessage: null,
  });
  // for handling bad request in view PO service

  const [remarks, setRemarks] = useState(null);
  const userDetails = useSelector((state) => state.appReducer.userDetails);


  const [
    suggestedDropdownFromECCForShipName,
    setSuggestedDropdownFromECCForShipName,
  ] = useState([]);
  const [
    suggestedDropdownFromECCForShipToId,
    setSuggestedDropdownFromECCForShipToId,
  ] = useState([]);
  const [
    suggestedDropdownFromECCForSoldName,
    setSuggestedDropdownFromECCForSoldName,
  ] = useState([]);
  const [
    suggestedDropdownFromECCForSoldToId,
    setSuggestedDropdownFromECCForSoldToId,
  ] = useState([]);
  const [validate, setValidate] = useState(false);
  console.log("DetailsScreen validate:", validate);
  const [poAlreadyExistsToast, setPoAlreadyExistsToast] = useState(false);
  const [poWarning, setPoWarning] = useState(false);
  const [busyIndicatorGetItems, setBusyIndicatorGetItems] = useState(false); // New state for getAllItems

  const [busyIndicatorgetPo, setBusyIndicatorGetPo] = useState(false);

  // Use the custom hook for fetching header data
  const { isPending: isHeaderLoading, getOrderHeaderById, loadingCount } = useGetHeaderById(
    orderHeaderId,
    exceptionScreenFlag
  );
  const [busyIndicatorSubmitToSAP, setBusyIndicatorSubmitToSAP] =
    useState(false);
  const [busyIndicatorForShipToParty, setBusyIndicatorForShipToParty] =
    useState(false);

  const [loadingItems, setLoadingItems] = useState(false);
  const [deletedMode, setDeletedMode] = useState(false);
  const [deletedRows, setDeletedRows] = useState([]);

  // Inactivity warning state (freeze overlay)
  const [inactivityWarning, setInactivityWarning] = useState({ visible: false, countdown: 60 });
  const inactivityCountdownRef = useRef(null);
  const autoExitTimeoutRef = useRef(null);
  const isFirstRenderForRefetch = useRef(true);


  const updateUser = (orderHeaderId) => {
    const userEmail = userDetails?.email || userDetails?.emailId || "";
    const sUploadUrl = `/JavaServices_Oauth/api/lock/lock?orderId=${orderHeaderId}&email=${encodeURIComponent(userEmail)}`;
    fnServiceRequest(
      sUploadUrl,
      "POST",
      (response) => fnSuccessHandlerupdateUserInfo(response),
      (error) => fnErrorHandlerupdateUserInfo(error)
    );
    function fnSuccessHandlerupdateUserInfo(response) {
      // Lock created successfully
      console.log('Lock acquired successfully:', response);
    }
    function fnErrorHandlerupdateUserInfo(error) {
      // Handle 409 conflict error
      if (error.status === 409 && error.data) {
        const lockData = error.data;

        // Check if the order is locked by the same user
        if (lockData.lockedBy === (userDetails?.email || userDetails?.emailId)) {
          // Same user, continue normal flow
          console.log('Order already locked by same user, continuing...');
        } else {
          // Different user has locked the order, show warning
          console.log('Order locked by another user:', lockData.lockedBy);
          dispatch(setMessagePopoverStatus({
            status: `Order is currently being edited by ${lockData.lockedBy}`
          }));
          dispatch(setMessagePopoverVisibility(true));

        }
      } else {
        // Handle other errors
        console.error('Error in updateUser lock API:', error);
        dispatch(setMessagePopoverStatus({
          status: 'Error acquiring order lock'
        }));
        dispatch(setMessagePopoverVisibility(true));
      }
    }
  };


  const fnSuccessHandler = (response) => {

    dispatch(setSalesOrderDetails(response?.data));

    if (
      response.data.docProcessStatus === "To Be Reviewed" ||
      response.data.docProcessStatus === "Drafted"
    ) {
      dispatch(setStatus("toBeReviewed"));
    } else if (response.data.docProcessStatus === "Created With Block") {
      dispatch(setStatus("createdWithBlock"));
    } else if (response.data.docProcessStatus === DOC_STATUS_PENDING_FOR_APPROVAL) {
      dispatch(setStatus("pendingForApproval"));
    } else if (response.data.docProcessStatus === DOC_STATUS_REJECTED) {
      dispatch(setStatus("rejected"));
    } else {
      dispatch(setStatus(Capitalize(response.data?.docProcessStatus)));
    }

    setBusyIndicatorGetHeader(false);

  };
  const fnErrorHandler = () => {
    setBusyIndicatorGetHeader(true);
  };
  const salesOrgObject = useSelector(
    (state) => state.appReducer.salesOrgObject
  );
  // like the four states we have made , We are adding four more states that keeps track of unsaved data

  useEffect(() => {
    dispatch(setBusyIndicatorForDetailScreen(false));
    return () => {
      // console.log("cleaned up");
      // dispatch(setFilterOptions({}));
    };
  }, []);

  const getPoDocument = (orderHeaderId) => {
    // for setting state which shows view Po document
    const sUrl = `/JavaServices_Oauth/api/dms/getDocById?orderId=${orderHeaderId}`;
    fnServiceRequest(
      sUrl,
      "GET",
      (response) => fnSuccessHandlerForPoDocument(response),
      (error) => fnErrorHandlerForPoDocument(error)
    );
  };
  const fnSuccessHandlerForPoDocument = (response) => {
    if (!response?.data || response.data.length === 0) {
      setErrorFlagForPoDocument({
        visiblity: true,
        errorMessage: true
      });
      return;
    }

    dispatch(setviewDocumentServiceResponse(response));

    // Set error flag to false on success
    setErrorFlagForPoDocument({
      visiblity: false,
      errorMessage: false
    });

    setBusyIndicatorGetPo(true);
  };
  const fnErrorHandlerForPoDocument = (error) => {
    setErrorFlagForPoDocument({
      visiblity: true,
      errorMessage: true
    });
    setBusyIndicatorGetPo(false);
  };
  const [open, setOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({
    vertical: "bottom",
    horizontal: "center",
  });

  const getAuditLog = (orderHeaderId) => {
    const sUrl = `/JavaServices_Oauth/api/audit/getAuditInfo?requestId=${orderHeaderId}`;
    fnServiceRequest(
      sUrl,
      "GET",
      (response) => fnSuccessHandlerForAudit(response),
      (error) => fnErrorHandlerForAudit(error)
    );
  };

  const fetchWorkflowTaskDetails = (orderHeaderId) => {
    if (!orderHeaderId) return;

    const url = `/JavaServices_Oauth/api/caf-iwm/fetchTaskDetails?headerId=${orderHeaderId}`;

    fnServiceRequest(
      url,
      "GET",
      (response) => {
        console.log("Task Details API:", response);

        if (!Array.isArray(response) || response.length === 0) {
          dispatch(setWorkflowTaskDetails(null));
          return;
        }

        dispatch(setWorkflowTaskDetails(response[0]));
      },
      (error) => {
        console.error("Task Details Error:", error);

        dispatch(setWorkflowTaskDetails(null));
      }
    );
  };
  const fnSuccessHandlerForAudit = (response) => {
    // console.log("success");
    setAuditLogData(response);
  };

  const fnErrorHandlerForAudit = (error) => { };


  const fetchAllItems = (isDeleted = false) => {
    setLoadingItems(true);
    const url = `/JavaServices_Oauth/api/salesOrder/getAllItems?headerId=${orderHeaderId}&isDeleted=${isDeleted}`;

    fnServiceRequest(
      url,
      "GET",
      (response) => {
        const maybeData = response?.data;
        const payload = maybeData?.data ?? maybeData ?? {};
        const list = Array.isArray(payload?.itemList) ? payload.itemList : [];

        if (isDeleted) {
          setDeletedRows(list);
        } else {
          dispatch(setSalesItemdata(payload));
          dispatch(setLineItemList(list));
          getOrderHeaderById(orderHeaderId);
        }

        setLoadingItems(false);
      },
      (error) => {
        console.error("getAllItems failed:", error);
        dispatch(setMessagePopoverStatus({ status: "Failed to fetch items" }));
        dispatch(setMessagePopoverVisibility(true));
        setLoadingItems(false);
      }
    );
  };


  useEffect(() => {
    if (exceptionScreenFlag != true) {
      // Hook automatically fetches header data when orderHeaderId changes
      updateUser(orderHeaderId);
      getPoDocument(orderHeaderId);
      getAuditLog(orderHeaderId);
      fetchWorkflowTaskDetails(orderHeaderId);
      fetchAllItems(false);
    }

    // fnErrorHandler();

    return () => {
      dispatch(
        setMessageToastForInvalidLineItem({
          visiblity: false,
          message: null,
        })
      );
      setErrorFlagForPoDocument({
        visiblity: false,
        errorMessage: null,
      });
      dispatch(setMessagePopoverVisibility(false));
      dispatch(
        setMessageToastForInvalidLineItem({
          visiblity: false,
          message: null,
        })
      );
      setErrorFlagForPoDocument({
        visiblity: false,
        errorMessage: null,
      });

    };
  }, [orderHeaderId]);

  const shouldRefetchLineItems = useSelector(
    (state) => state.appReducer.shouldRefetchLineItems
  );

  useEffect(() => {
    if (isFirstRenderForRefetch.current) {
      isFirstRenderForRefetch.current = false;
      return;
    }
    if (shouldRefetchLineItems) {
      fetchAllItems(false);
      // dispatch(setShouldRefetchLineItems(false));
    }
  }, [shouldRefetchLineItems]);

  const fnDragClickHandler = () => {
    // invoked when we try to drag it

    if (document.querySelector(".detailsHeader")?.clientWidth < 415) {
      setGridItemWidth(6);
    } else if (splitScreenFlag) {
      setGridItemWidth(6);
    }
  };

  const messagePopoverStatus = useSelector(
    (state) => state.appReducer.messagePopoverStatus
  );
  const manualScreenDetails = useSelector(
    (state) => state.appReducer.manualScreenDetails
  );

  // console.log(lineItemList);

  const fnGetSalesEmployee = (editedHeaderInfo) => {
    const formattedCustomerId = editedHeaderInfo?.sapShipToId?.trim();
    const sUrl = `/JavaServices_Oauth/api/v1/getSalesEmployee?custId=${formattedCustomerId}&salesOrg=${editedHeaderInfo?.salesOrg}&division=${editedHeaderInfo?.division}&distChan=${editedHeaderInfo?.distributionChannel}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) =>
        fnSuccessHandlerForSalesEmployee(response, editedHeaderInfo),
      (error) => fnErrorHandlerForSalesEmployee(error, editedHeaderInfo)
    );
  };

  const fnSuccessHandlerForSalesEmployee = (response, editedHeaderInfo) => {
    if (response.salesEmployee === "" || response.salesEmployee === null) {
      setErrorFlagForSalesEmployee({
        visiblity: true,
        errorMessage: "Sales Employee is not maintained for this Ship-To",
      });
    } else {
      const headerInfoEditedClone = { ...editedHeaderInfo };
      headerInfoEditedClone.salesEmployee = response.data?.salesEmployee;
      setHeaderInfoEdited(headerInfoEditedClone);
    }
  };
  const fnErrorHandlerForSalesEmployee = (error) => {
    // console.log(error);
  };

  const handleToggleDeletedMode = () => {
    const next = !deletedMode;
    setDeletedMode(next);
    fetchAllItems(next);
  };

  // Inactivity unlock: if user is inactive for 5 minutes on this screen,
  useEffect(() => {
    let inactivityTimerId;

    const WARNING_AT_MS = 4 * 60 * 1000;
    const AUTO_EXIT_AFTER_WARNING_MS = 60 * 1000;

    const clearExistingTimer = () => {
      if (inactivityTimerId) {
        clearTimeout(inactivityTimerId);
        inactivityTimerId = null;
      }
    };

    const stopCountdown = () => {
      if (inactivityCountdownRef.current) {
        clearInterval(inactivityCountdownRef.current);
        inactivityCountdownRef.current = null;
      }
    };

    const clearAutoExitTimeout = () => {
      if (autoExitTimeoutRef.current) {
        clearTimeout(autoExitTimeoutRef.current);
        autoExitTimeoutRef.current = null;
      }
    };

    const startWarningCountdown = () => {
      setInactivityWarning({ visible: true, countdown: 60 });
      stopCountdown();
      inactivityCountdownRef.current = setInterval(() => {
        setInactivityWarning((prev) => {
          const next = Math.max(0, (prev?.countdown ?? 1) - 1);
          if (next <= 0) {
            stopCountdown();
            clearAutoExitTimeout();
            try {
              if (orderHeaderId) {
                fnDeleteConcurrentUser(orderHeaderId, userDetails);
              }
            } finally {
              navigate(`/salesOrder`);
            }
          }
          return { visible: true, countdown: next };
        });
      }, 1000);
    };

    const startTimer = () => {
      clearExistingTimer();
      stopCountdown();
      clearAutoExitTimeout();
      inactivityTimerId = setTimeout(() => {
        startWarningCountdown();
        autoExitTimeoutRef.current = setTimeout(() => {
          try {
            if (orderHeaderId) {
              fnDeleteConcurrentUser(orderHeaderId, userDetails);
            }
          } finally {
            navigate(`/salesOrder`);
          }
        }, AUTO_EXIT_AFTER_WARNING_MS);
      }, WARNING_AT_MS);
    };

    const resetTimer = () => {
      if (!inactivityWarning.visible) startTimer();
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "wheel",
      "pointermove",
      "visibilitychange",
    ];

    events.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));
    startTimer();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
      clearExistingTimer();
      stopCountdown();
      clearAutoExitTimeout();
    };
  }, [orderHeaderId, userDetails, navigate]);

  const handleInactivityContinue = () => {
    if (inactivityCountdownRef.current) {
      clearInterval(inactivityCountdownRef.current);
      inactivityCountdownRef.current = null;
    }
    if (autoExitTimeoutRef.current) {
      clearTimeout(autoExitTimeoutRef.current);
      autoExitTimeoutRef.current = null;
    }
    setInactivityWarning({ visible: false, countdown: 60 });
    window.dispatchEvent(new Event("mousemove"));
  };

  const handleInactivityLeave = () => {
    if (inactivityCountdownRef.current) {
      clearInterval(inactivityCountdownRef.current);
      inactivityCountdownRef.current = null;
    }
    if (autoExitTimeoutRef.current) {
      clearTimeout(autoExitTimeoutRef.current);
      autoExitTimeoutRef.current = null;
    }
    try {
      if (orderHeaderId) {
        fnDeleteConcurrentUser(orderHeaderId, userDetails);
      }
    } finally {
      navigate(`/salesOrder`);
    }
  };

  const saveAudit = (action, { oldValue = "", newValue = "", remarks = "" } = {}) => {
    const payload = {
      entityName: "",
      salesOrderHeader: {
        orderHeaderId: orderHeaderId,
      },
      action,
      lastModifiedBy: userDetails?.email,
      lastModifiedDate: new Date().toISOString(),
      createdBy: `${userDetails?.firstName} ${userDetails?.lastName}`,
      createdDate: new Date().toISOString(),
      oldValue,
      newValue,
      columnName: " ",
      remarks,
    };
    fnServiceRequest(
      `/JavaServices_Oauth/api/audit/saveAudit`,
      "POST",
      () => { },
      () => { },
      payload
    );
  };


  const handleRestoreItem = (row, onSuccess) => {
    if (!row?.orderItemId) return;

    const payload = {
      headerId: orderHeaderId,
      itemId: row.orderItemId,
    };

    dispatch(setBusyIndicatorForDetailScreen(true));

    fnServiceRequest(
      `/JavaServices_Oauth/api/salesOrder/restoreItem`,
      "POST",
      () => {
        dispatch(setBusyIndicatorForDetailScreen(false));

        saveAudit("Restored", {
          oldValue: "",
          newValue: row?.poMaterialNumber || row?.sapMaterialNumber || "",
          remarks: `Item with Material ID ${row?.poMaterialNumber} restored from deleted List`,
        });

        onSuccess?.();
      },
      (err) => {
        dispatch(setBusyIndicatorForDetailScreen(false));
        console.error("restoreItem failed:", err);
        dispatch(setMessagePopoverStatus({ status: "Failed to restore item" }));
        dispatch(setMessagePopoverVisibility(true));
      },
      payload
    );
  };

  const handleDeleteItem = (itemId, comment, onSuccess) => {
    const payload = { headerId: orderHeaderId, itemId, comment: (comment || "").trim() };
    const row = lineItemList?.find(r => r.orderItemId === itemId);
    fnServiceRequest(
      `/JavaServices_Oauth/api/salesOrder/deleteItems`,
      "POST",
      () => {
        // refresh active list after delete

        saveAudit("Deleted", {
          oldValue: row?.poMaterialNumber || row?.sapMaterialNumber || "",
          newValue: "",
          remarks: `Item with Material ID ${row?.sapMaterialNumber} is deleted . Notes: ${comment || "Not provided"}`,
        })
        if (onSuccess) {
          onSuccess();
        } else {
          fetchAllItems(deletedMode);
        }
      },
      (err) => {
        console.error("deleteItems failed:", err);
        dispatch(setMessagePopoverStatus({ status: "Failed to delete item" }));
        dispatch(setMessagePopoverVisibility(true));
      },
      payload
    );
  };


  return (
    <>
      {/* {
      JSON.stringify(shipToNameValue)
    } */}
      {(isHeaderLoading || loadingItems) ? (
        loadingCount <= 1 ? <DetailScreenSkeleton /> : <BusyIndicator />
      ) : (
        <>
          {messagePopoverVisibility &&
            !["Warning", "Error", "Delete", "Schedule Simulation"].includes(messagePopoverStatus?.status) && (
              <CustomMessagePopover popOverMessageObj={messagePopoverStatus} />
            )}
          {inactivityWarning.visible && (
            <CustomMessagePopover
              popOverMessageObj={{
                status: "Inactivity Warning",
                message: "You will be thrown out of this screen with 1 minute timer.",
                countdownSeconds: inactivityWarning.countdown,
              }}
              inactivityContinue={handleInactivityContinue}
              inactivityLeave={handleInactivityLeave}
            />
          )}
          {busyIndicatorSubmitToSAP && <BusyIndicator />}
          {busyIndicatorForShipToParty && <BusyIndicator />}

          {errorFlagForPoDocument.visiblity &&
            errorFlagForPoDocument.errorMessage && (
              <CustomMessageToast
                open={true}
                setOpen={setOpen}
                messageType={"error"}
                messageDescription={"Unable to View PO Document"}
                anchorPosition={anchorPosition}
                setErrorFlagForPoDocument={setErrorFlagForPoDocument}
              />
            )}
          {poWarning && (
            <CustomMessageToast
              open={poWarning}
              setOpen={setPoWarning}
              messageType="warning"
              messageDescription="Please fill all required fields for Duplicate‑PO check"
              anchorPosition={anchorPosition}
              autoHideDuration={null}
            />
          )}

          {poAlreadyExistsToast && (
            <CustomMessageToast
              open={poAlreadyExistsToast}
              setOpen={setPoAlreadyExistsToast}
              messageType="warning"
              messageDescription="PO already exists."
              anchorPosition={anchorPosition}
              autoHideDuration={null}
            />
          )}
          {messageToastForInvalidLineItem.visiblity && (
            <CustomMessageToast
              open={true}
              setOpen={setOpen}
              messageType={"warning"}
              messageDescription={messageToastForInvalidLineItem?.message}
              anchorPosition={anchorPosition}
            />
          )}
          <div className="detailsContainer">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <HeaderTopBar
                  setEditMode={setEditMode}
                  setHeaderInfoEdited={setHeaderInfoEdited}
                  headerInfoEdited={headerInfoEdited}
                  splitScreenFlag={splitScreenFlag}
                  setSplitScreenFlag={setSplitScreenFlag}
                  editMode={editMode}
                  auditLogData={auditLogData}
                  setAuditLogData={setAuditLogData}
                  errorFlagForPoDocument={errorFlagForPoDocument}
                  setErrorFlagForPoDocument={setErrorFlagForPoDocument}
                  setGridItemWidth={setGridItemWidth}
                />
              </Grid>
            </Grid>

            {/* Consolidated rendering: render main content once and conditionally render split/right pane */}
            {(() => {
              const mainContent = (
                <Grid className="detail-grid" container spacing={2} paddingLeft={isBelowLaptopView ? 0 : 2} paddingBottom={2}>
                  <Grid item xs={12} className={"headerinfo-grid-item"}>
                    <HeaderInfoNew
                      gridItemWidth={gridItemWidth}
                      editMode={editMode}
                      splitScreenFlag={splitScreenFlag}
                      validate={validate}
                      setValidate={setValidate}
                      poAlreadyExistsToast={poAlreadyExistsToast}
                      setPoAlreadyExistsToast={setPoAlreadyExistsToast}
                      setPoWarning={setPoWarning}
                      poWarning={poWarning}
                      getOrderHeaderById={getOrderHeaderById}
                    />
                  </Grid>

                  <Grid item xs={12} className={"line-items-grid-item"}>
                    <ItemDetails
                      remarks={remarks}
                      setRemarks={setRemarks}
                      splitScreenFlag={splitScreenFlag}
                      status={status}
                      deletedMode={deletedMode}
                      deletedRows={deletedRows}
                      onToggleDeletedMode={handleToggleDeletedMode}
                      onRestoreRow={handleRestoreItem}
                      onDeleteRow={handleDeleteItem}
                      onRefreshItems={() => fetchAllItems(deletedMode)}
                    />
                  </Grid>
                  <Grid item xs={12} className={"line-items-grid-item"}>
                    {(status === "toBeReviewed" || status === "unprocessed" || status === "Queued" || status === "pendingForApproval" || status === "rejected") && (
                      <DetailsFooter
                        getOrderHeaderById={getOrderHeaderById}
                        busyIndicatorSubmitToSAP={busyIndicatorSubmitToSAP}
                        setBusyIndicatorSubmitToSAP={setBusyIndicatorSubmitToSAP}
                        remarks={remarks}
                        setRemarks={setRemarks}
                        multipleCustomerOption={multipleCustomerOption}
                        orderLock={salesOrderDetails?.orderLock}
                        validate={validate}
                        saveAudit={saveAudit}
                      />
                    )}
                  </Grid>
                </Grid>
              );

              const showSplit = splitScreenFlag && !isBelowLaptopView;

              return showSplit ? (
                <div className="split-Screen">
                  <SplitPane
                    split={"vertical"}
                    className="split-pane"
                    minSize={450}
                    defaultSize={690}
                    maxSize={1190}
                    allowResize={true}
                    onDragStarted={() => fnDragClickHandler()}
                  >
                    <div className="pane-left">{mainContent}</div>
                    <div className="pane-right">
                      <ViewPoDocument
                        splitScreenFlag={splitScreenFlag}
                        setSplitScreenFlag={setSplitScreenFlag}
                        setGridItemWidth={setGridItemWidth}
                      />
                    </div>
                  </SplitPane>
                </div>
              ) : (
                <>
                  {mainContent}
                  {splitScreenFlag && isBelowLaptopView && (
                    <Popover
                      open={true}
                      anchorReference={typeof window !== 'undefined' ? 'anchorPosition' : 'anchorEl'}
                      anchorPosition={typeof window !== 'undefined' ? { top: Math.round(window.innerHeight / 2), left: Math.round(window.innerWidth / 2) } : undefined}
                      transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                      PaperProps={{ style: { width: '80vw', height: '70vh', maxWidth: '80vw', maxHeight: '70vh', overflow: 'auto' } }}
                    >
                      <ViewPoDocument
                        splitScreenFlag={splitScreenFlag}
                        setSplitScreenFlag={setSplitScreenFlag}
                        setGridItemWidth={setGridItemWidth}
                      />
                    </Popover>
                  )}
                </>
              );
            })()}
          </div >
        </>
      )}
    </>
  );
};

export default DetailsScreen;

// Helper function to create location string
function createLocationString(components) {
  const filteredComponents = components.filter(comp => comp && comp.trim() !== '');
  return filteredComponents.length > 0 ? filteredComponents.join(', ') : '';
}

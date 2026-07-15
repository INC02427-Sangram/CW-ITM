import BottomNavigation from "@mui/material/BottomNavigation";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import BusyIndicator from "../../utility/BusyIndicator";
import { checkIsCSR } from "../../dataStore/userRoles";

// Custom Hooks
import { useOrderValidation } from "../../hooks/useOrderValidation";
import { useOrderSubmission } from "../../hooks/useOrderSubmission";
import { useOrderApproval } from "../../hooks/useOrderApproval";
import { useOrderScheduling } from "../../hooks/useOrderScheduling";
import { useOrderCancellation } from "../../hooks/useOrderCancellation";
import { useWorkflowIntegration } from "../../hooks/useWorkflowIntegration";

// UI Components
import FooterButtons from "./FooterButtons";
import FooterNotifications from "./FooterNotifications";
import CustomDeletePopover from "../../utility/Custom Components/CustomDeletePopover";
import { DOC_STATUS_REJECTED } from "../../dataStore/docProcessStatus";

const DetailsFooter = ({
  busyIndicatorSubmitToSAP,
  setBusyIndicatorSubmitToSAP,
  remarks,
  setRemarks,
  getOrderHeaderById,
  orderLock,
  validate,
  saveAudit,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Redux state
  const salesOrderDetails = useSelector(
    (state) => state.appReducer.salesOrderDetails
  );
  const itemDetailRow = useSelector((state) => state.appReducer.lineItemList);
  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const messagePopoverVisibility = useSelector(
    (state) => state.appReducer.messagePopoverVisibility
  );
  const messagePopoverStatus = useSelector(
    (state) => state.appReducer.messagePopoverStatus
  );
  const userRole = useSelector(
    (state) => state.appReducer.userDetails.roles
  );
  const userEmailId = useSelector((state) => state.appReducer.userEmailId);
  const workflowTaskDetails = useSelector(
    (state) => state.appReducer.workflowTaskDetails
  );

  // Local state
  const [lockOrderFlag, setLockOrderFlag] = useState(false);
  const [toastFlag, setToastFlag] = useState({
    visibility: false,
    message: null,
  });
  const [anchorPosition] = useState({
    vertical: "bottom",
    horizontal: "center",
  });
  const [open, setOpen] = useState(false);
  const [errorFlagForNullMaterial, setErrorFlagForNullMaterial] = useState({
    visiblity: false,
    errorMessage: null,
  });
  const [errorFlagEmptyMaterialList, setErrorFlagEmptyMaterialList] = useState({
    visiblity: false,
    errorMessage: null,
  });

  // Derived state
  const isCSR = checkIsCSR(userRole);

  const isAdminUser =
    userRole === "IT_Admin" ||
    userRole === "Business_Admin" ||
    (Array.isArray(userRole) &&
      (userRole.includes("IT_Admin") || userRole.includes("Business_Admin")));

  // Custom Hooks - Each handling specific responsibility
  const { validateForSubmission } = useOrderValidation();

  const {
    sendWorkflowAction,
    cancelWorkflowProcess,
    createWorkflowPayload,
  } = useWorkflowIntegration(workflowTaskDetails, userDetails, isAdminUser);

  const { submitOrder } = useOrderSubmission(
    salesOrderDetails,
    userDetails,
    getOrderHeaderById,
    setBusyIndicatorSubmitToSAP,
    workflowTaskDetails,
    sendWorkflowAction,
    remarks
  );

  const {
    sendOrderForApproval,
    confirmReject,
    loading: approvalLoading,
    rejectDialogOpen,
    setRejectDialogOpen,
    rejectNotes,
    setRejectNotes,
    openRejectDialog,
    openReApprovalDialog,
    closeReApprovalDialog,
    confirmReApproval,
    reApprovalDialogOpen,
    reApprovalNotes,
    setReApprovalNotes,
  } = useOrderApproval(
    salesOrderDetails,
    userDetails,
    getOrderHeaderById,
    saveAudit,
    remarks,
    workflowTaskDetails,
    createWorkflowPayload,
    sendWorkflowAction,
    isAdminUser
  );

  const {
    runOrderSimulation,
    scheduleOrder,
    loading: schedulingLoading,
    isScheduling,
  } = useOrderScheduling(
    salesOrderDetails,
    workflowTaskDetails,
    sendWorkflowAction,
    remarks
  );

  const {
    showCancelConfirmation,
    cancelOrderService,
    busyIndicatorForCancel,
  } = useOrderCancellation(
    salesOrderDetails,
    workflowTaskDetails,
    cancelWorkflowProcess,
    remarks
  );

  const loading = approvalLoading || schedulingLoading;

  const handleSubmitClick = () => {
    const validation = validateForSubmission(
      validate,
      salesOrderDetails,
      itemDetailRow,
      false
    );

    if (!validation.isValid) {
      setToastFlag({
        visibility: true,
        message: validation.message,
      });
      return;
    }

    if (!lockOrderFlag) {
      submitOrder(salesOrderDetails?.orderHeaderId);
    }
  };

  const handleApprovalClick = () => {
    const validation = validateForSubmission(
      validate,
      salesOrderDetails,
      itemDetailRow,
      false
    );

    if (!validation.isValid) {
      setToastFlag({
        visibility: true,
        message: validation.message,
      });
      return;
    }

    if (!lockOrderFlag) {
      const isRejectedOrder =
        salesOrderDetails?.orderStatus === DOC_STATUS_REJECTED;

      if (isRejectedOrder) {
        openReApprovalDialog();
      } else {
        sendOrderForApproval();
      }
    }
  };

  const handleRejectClick = () => {
    const validation = validateForSubmission(
      validate,
      salesOrderDetails,
      itemDetailRow,
      false
    );

    if (!validation.isValid) {
      setToastFlag({
        visibility: true,
        message: validation.message,
      });
      return;
    }

    if (!lockOrderFlag) {
      openRejectDialog();
    }
  };

  const handleSaveLaterClick = () => {
    if (messagePopoverVisibility || orderLock || loading) return;

    const validation = validateForSubmission(
      validate,
      salesOrderDetails,
      itemDetailRow,
      false
    );

    if (!validation.isValid) {
      setToastFlag({
        visibility: true,
        message: validation.message,
      });
      return;
    }

    runOrderSimulation();
  };

  const handleCancelClick = () => {
    showCancelConfirmation();
  };

  return (
    <>
      {/* Loading Indicators */}
      {loading && (
        <BusyIndicator
          message={isScheduling ? "Scheduling Submit…" : "Running simulation…"}
        />
      )}
      {busyIndicatorForCancel && <BusyIndicator />}

      {/* Notifications (Toasts, Popovers, Dialogs) */}
      <FooterNotifications
        toastFlag={toastFlag}
        setToastFlag={setToastFlag}
        lockOrderFlag={lockOrderFlag}
        setLockOrderFlag={setLockOrderFlag}
        userEmailId={userEmailId}
        validationErrors={{}}
        messagePopoverVisibility={messagePopoverVisibility}
        messagePopoverStatus={messagePopoverStatus}
        cancelService={cancelOrderService}
        scheduleService={scheduleOrder}
        rejectDialogOpen={rejectDialogOpen}
        setRejectDialogOpen={setRejectDialogOpen}
        rejectNotes={rejectNotes}
        setRejectNotes={setRejectNotes}
        onConfirmReject={confirmReject}
        anchorPosition={anchorPosition}
        errorFlagForNullMaterial={errorFlagForNullMaterial}
        setErrorFlagForNullMaterial={setErrorFlagForNullMaterial}
        errorFlagEmptyMaterialList={errorFlagEmptyMaterialList}
        setErrorFlagEmptyMaterialList={setErrorFlagEmptyMaterialList}
        open={open}
        setOpen={setOpen}
      />

      <CustomDeletePopover
        open={reApprovalDialogOpen}
        onClose={closeReApprovalDialog}
        onConfirm={confirmReApproval}
        title="Confirm Reapproval"
        message="Are you sure you want to send this for reapproval?"
        confirmText="Resubmit"
        cancelText="Cancel"
        requireNotes={true}
        notes={reApprovalNotes}
        onNotesChange={(val) => setReApprovalNotes(val)}
      />

      {/* Footer Navigation with Buttons */}
      <Box sx={{ width: "100%", paddingBottom: "20px" }}>
        <BottomNavigation
          showLabels
          sx={{
            display: "flex",
            justifyContent: "end",
            position: "sticky",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <FooterButtons
            theme={theme}
            isCSR={isCSR}
            currentStatus={salesOrderDetails?.orderStatus}
            isLocked={orderLock}
            isLoading={loading}
            messagePopoverVisible={messagePopoverVisibility}
            onApprovalClick={handleApprovalClick}
            onRejectClick={handleRejectClick}
            onSaveLaterClick={handleSaveLaterClick}
            onCancelClick={handleCancelClick}
            onSubmitClick={handleSubmitClick}
          />
        </BottomNavigation>
      </Box>
    </>
  );
};

export default DetailsFooter;

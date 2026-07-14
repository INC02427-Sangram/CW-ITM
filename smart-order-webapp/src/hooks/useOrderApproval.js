import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setMessagePopoverVisibility,
  setMessagePopoverStatus,
} from "../redux/reducers/appReducer";
import { sendForApproval, rejectOrderApproval } from "../services/orderService";
import fnDeleteConcurrentUser from "../utility/fnDeleteConcurrentUser";
import {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
} from "../dataStore/docProcessStatus";
import { STATUS_ERROR, STATUS_SUCCESS, MSG_ORDER_HEADER_ID_MISSING } from "../dataStore/strings";

/**
 * Custom hook for order approval logic
 */
export const useOrderApproval = (
  salesOrderDetails,
  userDetails,
  getOrderHeaderById,
  saveAudit,
  remarks,
  workflowTaskDetails,
  createWorkflowPayload,
  sendWorkflowAction,
  isAdminUser
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [reApprovalDialogOpen, setReApprovalDialogOpen] = useState(false);
  const [reApprovalNotes, setReApprovalNotes] = useState("");

  /**
   * Send order for approval (or resubmit)
   */
  const sendOrderForApproval = (note = "") => {
    const orderHeaderId = salesOrderDetails?.orderHeaderId;

    if (!orderHeaderId) {
      return {
        success: false,
        message: MSG_ORDER_HEADER_ID_MISSING,
      };
    }

    setLoading(true);

    const isReApproval =
      salesOrderDetails?.orderStatus === DOC_STATUS_REJECTED;

    let payload = null;

    if (isReApproval && workflowTaskDetails) {
      payload = createWorkflowPayload(
        workflowTaskDetails,
        "RESUBMIT",
        note || "Resubmitted for approval",
        isAdminUser
      );
    }

    sendForApproval(
      orderHeaderId,
      (response) => {
        setLoading(false);
        dispatch(setMessagePopoverVisibility(true));

        const apiStatus = String(response?.status || "").toUpperCase();
        const apiMessage =
          response?.message || "Successfully sent for approval";

        if (apiStatus === "FAILED") {
          dispatch(
            setMessagePopoverStatus({
              status: STATUS_ERROR,
              orderId: null,
              errorMessageFromEcc: apiMessage,
            })
          );
          return;
        }

        if (apiStatus === "SUCCESS") {
          dispatch(
            setMessagePopoverStatus({
              status: STATUS_SUCCESS,
              message: apiMessage,
            })
          );

          if (saveAudit) {
            saveAudit("Updated", {
              oldValue: salesOrderDetails?.orderStatus || "",
              newValue: DOC_STATUS_PENDING_FOR_APPROVAL,
              remarks: isReApproval
                ? `Order Send For ReApproval . Reason: ${note || "Not provided"}`
                : (remarks || "Order Send For Approval"),
              columnName: "Status",
            });
          }

          fnDeleteConcurrentUser(orderHeaderId, userDetails);
        } else {
          dispatch(
            setMessagePopoverStatus({
              status: STATUS_ERROR,
              orderId: null,
              errorMessageFromEcc:
                response?.message || "Approval request failed.",
            })
          );
        }
      },
      (error) => {
        setLoading(false);
        dispatch(setMessagePopoverVisibility(true));
        dispatch(
          setMessagePopoverStatus({
            status: STATUS_ERROR,
            orderId: null,
            errorMessageFromEcc: error?.message || "Service request failed.",
          })
        );
      },
      payload
    );
  };

  /**
   * Reject order approval
   */
  const rejectOrder = (note) => {
    const orderHeaderId = salesOrderDetails?.orderHeaderId;

    if (!orderHeaderId) {
      return {
        success: false,
        message: "Order Header ID is missing",
      };
    }

    setLoading(true);

    rejectOrderApproval(
      orderHeaderId,
      async (response) => {
        const apiStatus = String(response?.status || "").toUpperCase();
        const apiMessage = response?.message || "Order Rejected Successfully";

        if (apiStatus === "FAILED") {
          setLoading(false);
          dispatch(setMessagePopoverVisibility(true));
          dispatch(
            setMessagePopoverStatus({
              status: STATUS_ERROR,
              orderId: null,
              errorMessageFromEcc: apiMessage,
            })
          );
          return;
        }

        if (apiStatus === "SUCCESS") {
          // If workflow exists, send workflow rejection action
          if (workflowTaskDetails) {
            sendWorkflowAction("REJECT", note || "Rejected by Approver")
              .then(() => {
                console.log("Reject workflow success (background)");
              })
              .catch((err) => {
                console.error("Reject workflow failed:", err);
              });
          }

          setLoading(false);
          dispatch(setMessagePopoverVisibility(true));
          dispatch(
            setMessagePopoverStatus({
              status: "Success",
              message: apiMessage,
            })
          );

          if (saveAudit) {
            saveAudit("Updated", {
              oldValue: salesOrderDetails?.orderStatus|| "",
              newValue: DOC_STATUS_REJECTED,
              remarks: `Order Rejected by Approver. Reason: ${
                note || "Not provided"
              }`,
              columnName: "Status",
            });
          }

          getOrderHeaderById(orderHeaderId);
          fnDeleteConcurrentUser(orderHeaderId, userDetails);
        } else {
          setLoading(false);
          dispatch(setMessagePopoverVisibility(true));
          dispatch(
            setMessagePopoverStatus({
              status: "Error",
              orderId: null,
              errorMessageFromEcc: response?.message || "Rejection failed.",
            })
          );
        }
      },
      (error) => {
        setLoading(false);
        dispatch(setMessagePopoverVisibility(true));
        dispatch(
          setMessagePopoverStatus({
            status: "Error",
            orderId: null,
            errorMessageFromEcc: error?.message || "Service request failed.",
          })
        );
      }
    );
  };

  /**
   * Open reject dialog
   */
  const openRejectDialog = () => {
    setRejectDialogOpen(true);
  };

  /**
   * Close reject dialog
   */
  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectNotes("");
  };

  /**
   * Confirm rejection with notes
   */
  const confirmReject = () => {
    rejectOrder(rejectNotes);
    closeRejectDialog();
  };

  const openReApprovalDialog = () => setReApprovalDialogOpen(true);

  const closeReApprovalDialog = () => {
    setReApprovalDialogOpen(false);
    setReApprovalNotes("");
  };

  const confirmReApproval = () => {
    sendOrderForApproval(reApprovalNotes); // pass note to the function
    closeReApprovalDialog();
  };

  return {
    sendOrderForApproval,
    rejectOrder,
    openRejectDialog,
    closeRejectDialog,
    confirmReject,
    openReApprovalDialog,
    closeReApprovalDialog,
    confirmReApproval,
    reApprovalDialogOpen,
    setReApprovalDialogOpen,
    reApprovalNotes,
    setReApprovalNotes,
    loading,
    rejectDialogOpen,
    setRejectDialogOpen,
    rejectNotes,
    setRejectNotes,
  };
};

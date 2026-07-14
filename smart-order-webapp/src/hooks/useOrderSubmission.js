import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setMessagePopoverVisibility,
  setMessagePopoverStatus,
  setMessageToastForInvalidLineItem,
} from "../redux/reducers/appReducer";
import { submitOrderToSAP } from "../services/orderService";
import fnDeleteConcurrentUser from "../utility/fnDeleteConcurrentUser";
import {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
} from "../dataStore/docProcessStatus";
import {
  MSG_ORDER_HEADER_ID_REQUIRED,
  MSG_DUPLICATE_PO,
  STR_PO_ALREADY_EXISTS,
  STR_SAP_ERROR_MESSAGE,
  STR_SAP_PROCESSING_MESSAGE,
  STATUS_ERROR,
  STATUS_SUCCESS,
} from "../dataStore/strings";

/**
 * Custom hook for order submission logic
 */
export const useOrderSubmission = (
  salesOrderDetails,
  userDetails,
  getOrderHeaderById,
  setBusyIndicatorSubmitToSAP,
  workflowTaskDetails,
  sendWorkflowAction,
  remarks
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  /**
   * Check if workflow is required for this order
   */
  const isWorkflowTaskRequired = () => {
    const currentStatus = salesOrderDetails?.orderStatus;
    return (
      currentStatus === DOC_STATUS_PENDING_FOR_APPROVAL ||
      currentStatus === DOC_STATUS_REJECTED
    );
  };

  /**
   * Handle successful submission response
   */
  const handleSuccess = (response) => {
    setLoading(false);
    setBusyIndicatorSubmitToSAP(false);
    dispatch(setMessagePopoverVisibility(true));

    // Handle new response format with status and message fields
    if (response?.status === "FAILED") {
      dispatch(
        setMessagePopoverStatus({
          status: STR_SAP_ERROR_MESSAGE,
          orderId: null,
          errorMessageFromEcc: response?.message,
        })
      );
    } else if (response?.status === "SUCCESS" || response?.status === "Success") {
      dispatch(
        setMessagePopoverStatus({
          status: t(STATUS_SUCCESS),
          orderId: response?.data?.sapOrderId,
          message: response?.message,
        })
      );

      // If workflow is required, send workflow action in background
      if (isWorkflowTaskRequired() && workflowTaskDetails) {
        sendWorkflowAction(
          "APPROVE",
          remarks || "Approved after SAP submission"
        )
          .then(() => {
            console.log("Workflow success (background)");
          })
          .catch((err) => {
            console.error("Workflow failed (background):", err);
          });
      }
    } else if (response?.message === MSG_DUPLICATE_PO) {
      dispatch(
        setMessagePopoverStatus({
          status: STR_PO_ALREADY_EXISTS,
        })
      );
    } else if (response?.sapOrderId === null || response?.sapOrderId === "") {
      const isProcessingMessage = response?.sapErrorResponse?.includes(
        "Sales Order Processing is taking more time"
      );

      dispatch(
        setMessagePopoverStatus({
          status: isProcessingMessage
            ? STR_SAP_PROCESSING_MESSAGE
            : STR_SAP_ERROR_MESSAGE,
          orderId: null,
          errorMessageFromEcc: response?.sapErrorResponse,
        })
      );
    } else {
      dispatch(
        setMessagePopoverStatus({
          status: t(STATUS_SUCCESS),
          orderId: response?.data?.sapOrderId,
          message: response?.message,
        })
      );
    }

    getOrderHeaderById(salesOrderDetails?.orderHeaderId);

    if (response?.sapOrderId !== null || response?.sapOrderId === "") {
      fnDeleteConcurrentUser(salesOrderDetails?.orderHeaderId, userDetails);
    }
  };

  /**
   * Handle submission error
   */
  const handleError = (error) => {
    setLoading(false);
    setBusyIndicatorSubmitToSAP(false);
    dispatch(setMessagePopoverVisibility(true));
    dispatch(
      setMessagePopoverStatus({
        status: t("Error"),
        orderId: null,
        errorMessageFromEcc: error,
      })
    );
    fnDeleteConcurrentUser(salesOrderDetails?.orderHeaderId, userDetails);
  };

  /**
   * Submit order to SAP
   */
  const submitOrder = (orderHeaderId) => {
    if (!orderHeaderId) {
      dispatch(
        setMessageToastForInvalidLineItem({
          visiblity: true,
          message: MSG_ORDER_HEADER_ID_REQUIRED,
        })
      );
      return;
    }

    setLoading(true);
    setBusyIndicatorSubmitToSAP(true);

    dispatch(
      setMessageToastForInvalidLineItem({
        visiblity: false,
        message: null,
      })
    );

    submitOrderToSAP(orderHeaderId, handleSuccess, handleError);
  };

  return {
    submitOrder,
    loading,
  };
};

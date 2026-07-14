import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setMessagePopoverVisibility,
  setMessagePopoverStatus,
} from "../redux/reducers/appReducer";
import { cancelOrder } from "../services/orderService";
import {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
} from "../dataStore/docProcessStatus";
import { STATUS_ERROR } from "../dataStore/strings";

/**
 * Custom hook for order cancellation
 */
export const useOrderCancellation = (
  salesOrderDetails,
  workflowTaskDetails,
  cancelWorkflowProcess,
  remarks
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [busyIndicatorForCancel, setBusyIndicatorForCancel] = useState(false);

  /**
   * Show cancel confirmation dialog
   */
  const showCancelConfirmation = () => {
    const currentStatus = salesOrderDetails?.orderStatus;

    dispatch(setMessagePopoverVisibility(true));
    dispatch(
      setMessagePopoverStatus({
        status: t("Warning"),
      })
    );
  };

  /**
   * Cancel order service
   */
  const cancelOrderService = () => {
    const orderHeaderId = salesOrderDetails?.orderHeaderId;

    if (!orderHeaderId) {
      return {
        success: false,
        message: "Order Header ID is required",
      };
    }

    setBusyIndicatorForCancel(true);

    cancelOrder(
      orderHeaderId,
      (data) => {
        // If workflow exists, cancel workflow process
        if (workflowTaskDetails) {
          cancelWorkflowProcess(
            "CANCEL",
            remarks || "Order cancelled by user"
          )
            .then(() => {
              console.log("Cancel workflow success");
            })
            .catch(() => {
              console.warn("Cancel workflow failed");
            });
        }

        setBusyIndicatorForCancel(false);
        dispatch(setMessagePopoverVisibility(true));

        if (data === "Cancelled UnSuccessfull...Order not present in Hana") {
          dispatch(
            setMessagePopoverStatus({
              status: t("Error"),
              orderId: null,
              errorMessageFromEcc: "Unable to cancel the order",
            })
          );
        } else {
          dispatch(
            setMessagePopoverStatus({
              status: t("cancel"),
              errorMessageFromEcc: "Order Cancelled",
            })
          );
        }
      },
      (error) => {
        setBusyIndicatorForCancel(false);
        dispatch(setMessagePopoverVisibility(true));
        dispatch(
          setMessagePopoverStatus({
            status: t("Error"),
            orderId: null,
            errorMessageFromEcc: "Unable to cancel the order",
          })
        );
      }
    );
  };

  return {
    showCancelConfirmation,
    cancelOrderService,
    busyIndicatorForCancel,
  };
};

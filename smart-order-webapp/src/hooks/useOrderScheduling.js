import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setMessagePopoverVisibility,
  setMessagePopoverStatus,
} from "../redux/reducers/appReducer";
import {
  runSimulation,
  scheduleOrderSubmission,
} from "../services/orderService";
import { toMMDDYY } from "../utils/dateUtils";
import {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
} from "../dataStore/docProcessStatus";
import { MSG_ORDER_HEADER_ID_REQUIRED, STATUS_ERROR, STATUS_SUCCESS } from "../dataStore/strings";

/**
 * Custom hook for order scheduling and simulation
 */
export const useOrderScheduling = (
  salesOrderDetails,
  workflowTaskDetails,
  sendWorkflowAction,
  remarks
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

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
   * Run simulation service
   */
  const runOrderSimulation = () => {
    const orderHeaderId = salesOrderDetails?.orderHeaderId;

    if (!orderHeaderId) {
      return {
        success: false,
        message: MSG_ORDER_HEADER_ID_REQUIRED,
      };
    }

    setLoadingMessage("Running Simulation...");
    setLoading(true);
    dispatch(setMessagePopoverVisibility(false));

    runSimulation(
      orderHeaderId,
      (res) => {
        setLoading(false);

        const apiStatus = String(res?.status || "").toUpperCase();
        const apiMessage = res?.message || "Simulation failed.";

        if (apiStatus === "SUCCESS") {
          // SUCCESS → Schedule Simulation dialog
          dispatch(setMessagePopoverVisibility(true));
          dispatch(
            setMessagePopoverStatus({
              status: "Schedule Simulation",
              orderId: orderHeaderId,
            })
          );
        } else {
          // FAILED → show RED error popover
          dispatch(setMessagePopoverVisibility(true));
          dispatch(
            setMessagePopoverStatus({
              status: STATUS_ERROR,
              orderId: null,
              errorMessageFromEcc: apiMessage,
            })
          );
        }
      },
      (err) => {
        setLoading(false);
        dispatch(setMessagePopoverVisibility(true));
        dispatch(
          setMessagePopoverStatus({
            status: t("Error"),
            orderId: null,
            errorMessageFromEcc: err || "Simulation failed.",
          })
        );
      }
    );
  };

  /**
   * Schedule order submission for later date
   */
  const scheduleOrder = (pickedDate) => {
    const orderHeaderId = salesOrderDetails?.orderHeaderId;

    if (!orderHeaderId) {
      return {
        success: false,
        message: MSG_ORDER_HEADER_ID_REQUIRED,
      };
    }

    // Normalize any incoming format to MMDDYYYY
    const dateForApi = toMMDDYY(pickedDate);

    if (!dateForApi) {
      return {
        success: false,
        message: "Please pick a valid date.",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(
      pickedDate?.toDate ? pickedDate.toDate() : pickedDate  
    );
    selected.setHours(0, 0, 0, 0);

    if (selected <= today) {
      dispatch(setMessagePopoverVisibility(true));
      dispatch(
        setMessagePopoverStatus({
          status: STATUS_ERROR,
          orderId: null,
          errorMessageFromEcc: "Please select a future date. Past dates and today are not allowed.",
        })
      );
      return { success: false, message: "Please select a future date." };
    }

    setIsScheduling(true);
    setLoading(true);

    scheduleOrderSubmission(
      orderHeaderId,
      dateForApi,
      (res) => {
        setLoading(false);
        setIsScheduling(false);
        dispatch(setMessagePopoverVisibility(true));

        const apiStatus = String(res?.status || "").toUpperCase();

        if (apiStatus === "SUCCESS") {
          dispatch(
            setMessagePopoverStatus({
              status: "Success",
              orderId: null,
              message: res?.message || "Updated Successfully",
            })
          );

          // If workflow is required, send workflow action in background
          if (isWorkflowTaskRequired() && workflowTaskDetails) {
            sendWorkflowAction(
              "APPROVE",
              remarks || "Approved after scheduling"
            )
              .then(() => {
                console.log("Workflow success");
              })
              .catch((err) => {
                console.error("Workflow failed:", err);
              });
          }
        } else {
          const errorMsg =
            res?.data ||
            res?.message ||
            "Scheduling failed. Please select a future date.";

          dispatch(
            setMessagePopoverStatus({
              status: t("Error"),
              orderId: null,
              errorMessageFromEcc: errorMsg,
            })
          );
        }
      },
      (err) => {
        setLoading(false);
        setIsScheduling(false);
        dispatch(setMessagePopoverVisibility(true));
        dispatch(
          setMessagePopoverStatus({
            status: t("Error"),
            orderId: null,
            errorMessageFromEcc: err || "Scheduling failed.",
          })
        );
      }
    );
  };

  return {
    runOrderSimulation,
    scheduleOrder,
    loading,
    isScheduling,
    loadingMessage,
  };
};

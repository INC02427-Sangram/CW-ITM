import { useDispatch } from "react-redux";
import fnServiceRequest from "../utility/fnServiceRequest";
import { setWorkflowTaskDetails } from "../redux/reducers/appReducer";
import appEnv from "../config/appEnv";
import {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
} from "../dataStore/docProcessStatus";

/**
 * Custom hook for workflow integration
 */
export const useWorkflowIntegration = (workflowTaskDetails, userDetails, isAdminUser) => {
  const dispatch = useDispatch();

  // Clear workflow task from Redux store

  const clearWorkflowTask = () => {
    dispatch(setWorkflowTaskDetails(null));
  };

  /**
   * Create workflow action payload
   */
  const createWorkflowPayload = (task, action, comment = "", isAdmin = false) => {
    const userEmail = userDetails?.emailId || userDetails?.email;

    return {
      tasks: [
        {
          action: action,
          comment: comment,
          processId: task?.processId,
          processName: task?.processName,
          requestId: task?.requestId,
          systemId: task?.systemId || "Flowable",
          taskId: task?.taskId,
          taskType: task?.taskType,
          userId: userEmail,
          isSubstitutedToMe: Boolean(task?.isSubstitutedToMe) || false,
          referenceId: task?.referenceId || "62b0ccc7e4b0d001cbbacfa",
          applicationId: appEnv.APP_ID,
        },
      ],
      isAdmin: isAdmin,
    };
  };

  /**
   * Create workflow cancel payload
   */
  const cancelWorkflowPayload = (task, action, comment = "", isAdmin = false) => {
    const userEmail = userDetails?.emailId || userDetails?.email;

    return {
      systemId: task?.systemId || "Flowable",
      processName: task?.processName,
      referenceId: task?.referenceId || "62b0ccc7e4b0d001cbbacfa",
      processId: task?.processId,
      action: action,
      comment: comment,
      subject: task?.subject || task?.processName,
      isAdmin: isAdmin,
      creator: userEmail,
      applicationId: appEnv.APP_ID,
    };
  };

  /**
   * Send workflow action (approve, reject, resubmit)
   */
  const sendWorkflowAction = (action, comment = "") => {
    return new Promise((resolve) => {
      if (!workflowTaskDetails) {
        resolve({ success: true });
        return;
      }

      const payload = createWorkflowPayload(
        workflowTaskDetails,
        action,
        comment,
        isAdminUser
      );

      console.log("Workflow Action Payload:", payload);

      const sUrl = "/JavaServices_Oauth/api/caf-iwm/action";

      fnServiceRequest(
        sUrl,
        "POST",
        (response) => {
          clearWorkflowTask();
          resolve({ success: true, data: response });
        },
        (error) => {
          clearWorkflowTask();
          console.warn("Workflow failed:", error);
          resolve({ success: true, error });
        },
        payload
      );
    });
  };

  /**
   * Cancel workflow process
   */
  const cancelWorkflowProcess = (action, comment = "") => {
    return new Promise((resolve) => {
      if (!workflowTaskDetails) {
        resolve({ success: true });
        return;
      }

      const payload = cancelWorkflowPayload(
        workflowTaskDetails,
        action,
        comment,
        isAdminUser
      );

      console.log("Cancel Workflow Payload:", payload);

      const sUrl = "/JavaServices_Oauth/api/caf-iwm/cancel";

      fnServiceRequest(
        sUrl,
        "POST",
        (response) => {
          clearWorkflowTask();
          resolve({ success: true, data: response });
        },
        (error) => {
          clearWorkflowTask();
          console.warn("Cancel workflow failed:", error);
          resolve({ success: true, error });
        },
        payload
      );
    });
  };

 /**
   * Validate that workflow is required and available
   */
  const validateWorkflowContext = (currentStatus) => {
    return (
      (currentStatus === DOC_STATUS_PENDING_FOR_APPROVAL ||
        currentStatus === DOC_STATUS_REJECTED) &&
      !workflowTaskDetails
    );
  };

  return {
    clearWorkflowTask,
    createWorkflowPayload,
    cancelWorkflowPayload,
    sendWorkflowAction,
    cancelWorkflowProcess,
    validateWorkflowContext,
  };
};

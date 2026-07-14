import fnServiceRequest from "../../../utility/fnServiceRequest";
import { API_ENDPOINTS } from "./emailManagementConfig";

/**
 * Email Management Service Module
 * Handles all API communications for email management
 */

/**
 * Fetches all email notifications types from the server
 * @param {Function} onSuccess - Callback for successful response
 * @param {Function} onError - Callback for error response
 * @param {string} [countryCode] - Country code to filter notification types
 * @param {string} [salesOrg] - Sales organization to filter notification types
 */
export const fetchNotificationTypes = (onSuccess, onError, countryCode, salesOrg) => {
  if (!countryCode || !salesOrg) {
    onSuccess?.([]);
    return;
  }
  const url = `${API_ENDPOINTS.GET_NOTIFICATION_TYPES}?country=${encodeURIComponent(countryCode)}&salesOrg=${encodeURIComponent(salesOrg)}`;
  
  fnServiceRequest(
    url,
    "GET",
    (response) => {
      if (response.data && Array.isArray(response.data)) {
        (onSuccess || (() => {}))(response.data);
      } else {
        console.error("Unexpected response structure:", response);
        (onSuccess || (() => {}))([]);
      }
    },
    (error) => {
      console.error("Error fetching notification types:", error);
      (onError || (() => {}))(error);
    }
  );
}
/**
 * Fetches all email notifications from the server
 * @param {Function} onSuccess - Callback for successful response
 * @param {Function} onError - Callback for error response
 */
export const fetchEmailNotifications = (onSuccess, onError) => {
  fnServiceRequest(
    API_ENDPOINTS.GET_ALL_EMAILS,
    "GET",
    (response) => {
      if (response.data && Array.isArray(response.data)) {
        (onSuccess || (() => {}))(response.data);
      } else {
        console.error("Unexpected response structure:", response);
        (onSuccess || (() => {}))([]);
      }
    },
    (error) => {
      console.error("Error fetching email notifications:", error);
      (onError || (() => {}))(error);
    }
  );
};

/**
 * Adds a new email notification
 * @param {Object} emailData - Email notification data
 * @param {Function} onSuccess - Callback for successful response
 * @param {Function} onError - Callback for error response
 */
export const addEmailNotification = (emailData, onSuccess, onError) => {
  const payload = {
    emailId: typeof emailData.emailId === "string" ? emailData.emailId.trim() : "",
    recipientType: emailData.recipientType,
    salesOrg: emailData.salesOrg,
    countryCode: emailData.countryCode,
    orderType: emailData.orderType || "",
    notificationTypes: emailData.notificationTypes,
  };

  fnServiceRequest(
    API_ENDPOINTS.ADD_EMAIL,
    "POST",
    (response) => {
      (onSuccess || (() => {}))(response);
    },
    (error) => {
      console.error("Error adding email:", error);
      (onError || (() => {}))(error);
    },
    payload
  );
};

/**
 * Deletes an email notification
 * @param {string} email - Email address to delete
 * @param {Function} onSuccess - Callback for successful response
 * @param {Function} onError - Callback for error response
 */
export const deleteEmailNotification = (email, countryCode, salesOrg, onSuccess, onError) => {

  if (!email || !countryCode || !salesOrg) {
    (onSuccess || (() => {}))({});
    return;
  }
  
  const deleteUrl = `${API_ENDPOINTS.DELETE_EMAIL}?email=${encodeURIComponent(email)}&country=${encodeURIComponent(countryCode)}&salesOrg=${encodeURIComponent(salesOrg)}`;

  fnServiceRequest(
    deleteUrl,
    "POST",
    (response) => {
      (onSuccess || (() => {}))(response);
    },
    (error) => {
      console.error("Error deleting email:", error);
      (onError || (() => {}))(error);
    },
    {}
  );
};

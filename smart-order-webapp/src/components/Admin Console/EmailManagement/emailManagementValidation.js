import { VALIDATION_MESSAGES } from "./emailManagementConfig";

/**
 * Email Management Validation Module
 */

/**
 * Validates email address format
 * @param {string} email - Email address to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email.trim()) {
    return {
      isValid: false,
      error: VALIDATION_MESSAGES.EMAIL_REQUIRED,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  return {
    isValid,
    error: isValid ? "" : VALIDATION_MESSAGES.EMAIL_INVALID,
  };
};

/**
 * Checks if email already exists for the same country + sales org combination
 * @param {string} email - Email to check
 * @param {Array} emailList - List of existing emails
 * @param {string} countryCode - Country code to check
 * @param {string} salesOrg - Sales organization to check
 * @returns {boolean} - True if email exists for the same country + sales org
 */
export const isEmailDuplicate = (email, emailList, countryCode, salesOrg) => {
  return emailList.some(
    (item) =>
      item.emailId.toLowerCase() === email.toLowerCase() &&
      item.countryCode === countryCode &&
      item.salesOrg === salesOrg
  );
};

/**
 * Validates organization details
 * @param {Object} orgDetails - Organization details object
 * @returns {boolean} - True if all required fields are present
 */
export const validateOrganizationDetails = (orgDetails) => {
  const { selectedCountry, selectedSalesOrg } = orgDetails;
  return !!(selectedCountry && selectedSalesOrg);
};

/**
 * Validates notification selection
 * @param {Array} selectedNotifications - Array of selected notification IDs
 * @returns {boolean} - True if at least one notification is selected
 */
export const validateNotificationSelection = (selectedNotifications) => {
  return selectedNotifications.length > 0;
};

/**
 * Validates complete form before submission
 * @param {Object} formData - Complete form data
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export const validateCompleteForm = (formData) => {
  const errors = [];
  
  const emailValidation = validateEmail(formData.emailId);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error);
  }

  if (!validateOrganizationDetails(formData)) {
    errors.push("Please complete all organization details");
  }

  if (!validateNotificationSelection(formData.selectedNotifications)) {
    errors.push("Please select at least one notification type");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

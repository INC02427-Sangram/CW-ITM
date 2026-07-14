import { Setting, ProfileTwoUser, Profile } from "@cw/rds/icons";

/**
 * Configuration file for Email Management
 * Contains all constants, notification types, email groups, and steps
 */

// API Endpoints
export const API_ENDPOINTS = {
  GET_NOTIFICATION_TYPES: "/JavaServices_Oauth1/api/emailNotification/getNotificationType",
  GET_ALL_EMAILS: "/JavaServices_Oauth1/api/emailNotification/getAllEmail",
  ADD_EMAIL: "/JavaServices_Oauth1/api/emailNotification/addEmail",
  DELETE_EMAIL: "/JavaServices_Oauth1/api/emailNotification/deleteEmail",
};

// Notification Types Configuration
export const notificationTypes = [
  {
    id: "Email Scheduler Update",
    label: "Email Scheduler Update",
    description: "Notification for Email Scheduler frequency and Status Update.",
    allowedGroups: ["admin", "support"],
  },
  {
    id: "Manual Review Update",
    label: "Manual Review Update",
    description: "Notification for Manual Review Status Update.",
    allowedGroups: ["admin", "support"],
  },
  {
    id: "Order Block Preceding Update",
    label: "Order Block Preceding Update",
    description: "Notification for Order Block Configuration Update.",
    allowedGroups: ["admin", "support"],
  },
  {
    id: "Successful Sales Order Creation",
    label: "Successful Sales Order Creation",
    description: "Notification for Confirmation of Creating Sales Order Successfully.",
    allowedGroups: ["admin", "general"],
  },
  {
    id: "Purchase Order Extraction Failure",
    label: "Purchase Order Extraction Failure",
    description: "Notification for Purchase Order Details Extraction Failure.",
    allowedGroups: ["admin", "general"],
  },
  {
    id: "Sales Order Submission Failure",
    label: "Sales Order Submission Failure",
    description: "Notification for Sales Order Submission Failure.",
    allowedGroups: ["admin", "general"],
  },
  {
    id: "Email Address Addition",
    label: "Email Address Addition",
    description: "Notification for Receiver's Mail box Addition/Deletion Update.",
    allowedGroups: ["admin", "support"],
  },
   {
    id: "PO Cancellation",
    label: "PO Cancellation",
    description: "Notification for Purchase Order Cancellation Update.",
    allowedGroups: ["admin", "support"],
  },
];

// Email Groups Configuration
export const emailGroups = [
  {
    id: "admin",
    label: "Administrators",
    iconComponent: Setting,
    iconProps: { color: "#fff" },
    color: "#f44336",
  },
  {
    id: "support",
    label: "Support Team",
    iconComponent: ProfileTwoUser,
    iconProps: { color: "#fff" },
    color: "#2196f3",
  },
  {
    id: "general",
    label: "General Users",
    iconComponent: Profile,
    iconProps: { color: "#fff" },
    color: "#ff9800",
  },
];

// Stepper Steps Configuration
export const steps = [
  "Enter Email",
  "Organization Details",
  "Select Group",
  "Choose Notifications",
  "Review & Add",
];

// Alert Messages
export const ALERT_MESSAGES = {
  EMAIL_EXISTS: "This email already exists for the selected Country and Sales Organization combination.",
  EMAIL_ADDED_SUCCESS: "Email Notification added successfully",
  EMAIL_DELETED_SUCCESS: "Email Notification deleted successfully",
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: "Email address is required",
  EMAIL_INVALID: "Please enter a valid email address",
};

// Table Configuration
export const TABLE_CONFIG = {
  MAX_HEIGHT: "400px",
  INITIAL_PAGE: 0,
  PAGE_SIZE: 10,
  PAGINATION_MODE: "client",
};

// Search Debounce Time
export const SEARCH_DEBOUNCE_TIME = 300;

// Alert Display Time
export const ALERT_DISPLAY_TIME = 3000;

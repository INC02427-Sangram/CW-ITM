/**
 * Central export file for all Redux slices
 * Import actions and selectors from here for cleaner imports
 */

// Dashboard
export * as dashboardActions from "./slices/dashboardSlice";
export { default as dashboardReducer } from "./slices/dashboardSlice";

// Back-to-Back Trading
export * as backToBackActions from "./slices/backToBackSlice";
export { default as backToBackReducer } from "./slices/backToBackSlice";

// Purchase Trading
export * as purchaseTradingActions from "./slices/purchaseTradingSlice";
export { default as purchaseTradingReducer } from "./slices/purchaseTradingSlice";

// Sales Trading
export * as salesTradingActions from "./slices/salesTradingSlice";
export { default as salesTradingReducer } from "./slices/salesTradingSlice";

// Purchase Orders
export * as purchaseOrdersActions from "./slices/purchaseOrdersSlice";
export { default as purchaseOrdersReducer } from "./slices/purchaseOrdersSlice";

// Sales Orders
export * as salesOrdersActions from "./slices/salesOrdersSlice";
export { default as salesOrdersReducer } from "./slices/salesOrdersSlice";

// Outbound Delivery
export * as outboundDeliveryActions from "./slices/outboundDeliverySlice";
export { default as outboundDeliveryReducer } from "./slices/outboundDeliverySlice";

// Invoices
export * as invoicesActions from "./slices/invoicesSlice";
export { default as invoicesReducer } from "./slices/invoicesSlice";

// Admin Console
export * as adminConsoleActions from "./slices/adminConsoleSlice";
export { default as adminConsoleReducer } from "./slices/adminConsoleSlice";

// User
export * as userActions from "./slices/userSlice";
export { default as userReducer } from "./slices/userSlice";

// Store
export { default as store } from "./store";

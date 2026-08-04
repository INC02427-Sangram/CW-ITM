import { combineReducers } from "@reduxjs/toolkit";

// Import all slices
import dashboardReducer from "../slices/dashboardSlice";
import backToBackReducer from "../slices/backToBackSlice";
import purchaseTradingReducer from "../slices/purchaseTradingSlice";
import salesTradingReducer from "../slices/salesTradingSlice";
import purchaseOrdersReducer from "../slices/purchaseOrdersSlice";
import salesOrdersReducer from "../slices/salesOrdersSlice";
import outboundDeliveryReducer from "../slices/outboundDeliverySlice";
import invoicesReducer from "../slices/invoicesSlice";
import adminConsoleReducer from "../slices/adminConsoleSlice";
import userReducer from "../slices/userSlice";

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  backToBack: backToBackReducer,
  purchaseTrading: purchaseTradingReducer,
  salesTrading: salesTradingReducer,
  purchaseOrders: purchaseOrdersReducer,
  salesOrders: salesOrdersReducer,
  outboundDelivery: outboundDeliveryReducer,
  invoices: invoicesReducer,
  adminConsole: adminConsoleReducer,
  user: userReducer,
}); 

export default rootReducer;
import { lazy } from "react";

// Lazy load B2B Trading nested routes
const CreateB2BTradingContract = lazy(() => import("./CreateB2BTradingContract"));
const ContractDetails = lazy(() => import("./ContractDetails"));

/**
 * Back to Back Trading nested routes configuration
 * These routes are relative to /back-to-back-trading/
 */
export const b2bTradingRoutes = [
  {
    id: "create-contract",
    path: "create-contract",
    label: "Create B2B Trading Contract",
    component: CreateB2BTradingContract,
  },
  {
    id: "contract-details",
    path: "contract-details",
    label: "Contract Details",
    component: ContractDetails,
  },
];

// Helper function to get route by id
export const getB2BRouteById = (id) => {
  return b2bTradingRoutes.find((route) => route.id === id);
};

// Helper function to get route by path
export const getB2BRouteByPath = (path) => {
  return b2bTradingRoutes.find((route) => route.path === path);
};

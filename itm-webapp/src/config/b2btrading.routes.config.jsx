import { lazy } from "react";

/**
 * Back-to-Back Trading module routes configuration
 * Defines nested routes for the B2B Trading module
 */

// Lazy load B2B Trading nested components
const CreateB2BTradingContract = lazy(
  () => import("../pages/B2BTrading/CreateB2BTradingContract"),
);
const ContractDetails = lazy(
  () => import("../pages/B2BTrading/ContractDetails"),
);

/**
 * B2B Trading nested routes
 * Each route contains:
 * - id: unique identifier
 * - path: relative path (nested under /back-to-back-trading)
 * - component: Page component
 */
export const b2bTradingRoutes = [
  {
    id: "create-contract",
    path: "create-contract",
    component: CreateB2BTradingContract,
  },
  {
    id: "contract-details",
    path: "contract-details",
    component: ContractDetails,
  },
];

export const b2bTradingStatusStyles = {
  Draft: { color: "#FFC107", backgroundColor: "#FFF3CD" },
  "Approval Pending": { color: "#084298", backgroundColor: "#CFE2FF" },
  Approved: { color: "#198754", backgroundColor: "#D1E7DD" },
  "Orders Created": { color: "#0F5132", backgroundColor: "#D1E7DD" },
  "Posted to SAP": { color: "#198754", backgroundColor: "#D1E7DD" },
  Expired: { color: "#DC3545", backgroundColor: "#F8D7DA" },
  Cancelled: { color: "#6C757D", backgroundColor: "#DEE2E6" },
};

import { lazy } from "react";

/**
 * Back-to-Back Trading module routes configuration
 * Defines nested routes for the B2B Trading module
 */

// Lazy load B2B Trading nested components
const CreateB2BTradingContract = lazy(() => import("../pages/B2BTrading/CreateB2BTradingContract"));
const ContractDetails = lazy(() => import("../pages/B2BTrading/ContractDetails"));

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

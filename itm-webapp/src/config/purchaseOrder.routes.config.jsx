import { lazy } from "react";

/**
 * Purchase Orders module routes configuration
 * Defines nested routes for the Purchase Orders module
 */

// Lazy load Purchase Orders nested components
const PurchaseOrdersPage = lazy(
  () => import("../pages/PurchaseOrders/PurchaseOrdersPage"),
);

/**
 * Purchase Orders nested routes
 * Each route contains:
 * - id: unique identifier
 * - path: relative path (nested under /purchase-orders)
 * - component: Page component
 */
export const purchaseOrdersRoutes = [
  {
    id: "purchase-orders",
    path: "purchase-orders",
    component: PurchaseOrdersPage,
  },
];

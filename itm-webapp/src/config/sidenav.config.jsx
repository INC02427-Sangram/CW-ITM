import { lazy } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

// Lazy load pages for routing in MainContainer
const Dashboard = lazy(() => import("../pages/Dashboard"));
const BackToBackTrading = lazy(() => import("../pages/B2BTrading/BackToBacktrading"));
const PurchaseTrading = lazy(() => import("../pages/PurchaseTrading"));
const SalesTrading = lazy(() => import("../pages/SalesTrading"));
const PurchaseOrders = lazy(() => import("../pages/PurchaseOrders"));
const SalesOrders = lazy(() => import("../pages/SalesOrders"));
const OutboundDelivery = lazy(() => import("../pages/OutboundDelivery"));
const Invoices = lazy(() => import("../pages/Invoices"));
const AdminConsole = lazy(() => import("../pages/AdminConsole"));

/**
 * Side navigation configuration for ITM application
 * Defines sidebar navigation structure with routing components for MainContainer
 */

// Module names used for routing and state management
export const sideNavModuleNames = [
  "Dashboard",
  "Back-to-Back",
  "Purchase Trading",
  "Sales Trading",
  "Purchase Orders",
  "Sales Orders",
  "Outbound Delivery",
  "Invoices",
  "Admin Console",
];

/**
 * Side navigation items configuration
 * Each item contains:
 * - id: unique identifier
 * - path: URL path for navigation
 * - label: Display label (translation key)
 * - moduleName: Module name for state management
 * - icon: Icon component
 * - component: Page component (for MainContainer routing)
 * - showInNav: Whether to show in navigation menu
 * - index: Order in navigation
 */
export const sideNavConfig = [
  {
    id: "dashboard",
    path: "/dashboard",
    label: "Dashboard",
    moduleName: "Dashboard",
    icon: DashboardIcon,
    component: Dashboard,
    showInNav: true,
    index: 0,
  },
  {
    id: "back-to-back-trading",
    path: "/back-to-back-trading/*",
    label: "Back-to-Back",
    moduleName: "Back-to-Back",
    icon: PublishedWithChangesIcon,
    component: BackToBackTrading,
    showInNav: true,
    index: 1,
  },
  {
    id: "purchase-trading",
    path: "/purchase-trading",
    label: "Purchase Trading",
    moduleName: "Purchase Trading",
    icon: ShoppingCart,
    component: PurchaseTrading,
    showInNav: true,
    index: 2,
  },
  {
    id: "sales-trading",
    path: "/sales-trading",
    label: "Sales Trading",
    moduleName: "Sales Trading",
    icon: ReceiptIcon,
    component: SalesTrading,
    showInNav: true,
    index: 3,
  },
  {
    id: "purchase-orders",
    path: "/purchase-orders",
    label: "Purchase Orders",
    moduleName: "Purchase Orders",
    icon: ShoppingCartCheckoutIcon,
    component: PurchaseOrders,
    showInNav: true,
    index: 4,
  },
  {
    id: "sales-orders",
    path: "/sales-orders",
    label: "Sales Orders",
    moduleName: "Sales Orders",
    icon: ReceiptLongIcon,
    component: SalesOrders,
    showInNav: true,
    index: 5,
  },
  {
    id: "outbound-delivery",
    path: "/outbound-delivery",
    label: "Outbound Delivery",
    moduleName: "Outbound Delivery",
    icon: LocalShippingIcon,
    component: OutboundDelivery,
    showInNav: true,
    index: 6,
  },
  {
    id: "invoices",
    path: "/invoices",
    label: "Invoices",
    moduleName: "Invoices",
    icon: DescriptionIcon,
    component: Invoices,
    showInNav: true,
    index: 7,
  },
  {
    id: "admin-console",
    path: "/admin-console/*",
    label: "Admin Console",
    moduleName: "Admin Console",
    icon: SettingsIcon,
    component: AdminConsole,
    showInNav: true,
    index: 8,
  },
];

// Helper function to get navigation item by id
export const getNavItemById = (id) => {
  return sideNavConfig.find((item) => item.id === id);
};

// Helper function to get navigation item by path
export const getNavItemByPath = (path) => {
  return sideNavConfig.find((item) => item.path === path);
};

// Helper function to get navigation item by module name
export const getNavItemByModule = (moduleName) => {
  return sideNavConfig.find((item) => item.moduleName === moduleName);
};

// Get only items that should be shown in navigation
export const getSideNavItems = (userRoles = [], moduleAccess = {}) => {
  // TODO: Implement role-based access control when backend integration is ready
  // For now, return all items that have showInNav set to true
  return sideNavConfig
    .filter((item) => item.showInNav)
    .sort((a, b) => a.index - b.index);
};

import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SettingsIcon from "@mui/icons-material/Settings";

// Lazy load pages for better performance
import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const BackToBackTrading = lazy(() => import("../pages/B2BTrading/BackToBacktrading"));
const PurchaseTrading = lazy(() => import("../pages/PurchaseTrading"));
const SalesTrading = lazy(() => import("../pages/SalesTrading"));
const OutboundDelivery = lazy(() => import("../pages/OutboundDelivery"));
const Invoices = lazy(() => import("../pages/Invoices"));
const AdminConsole = lazy(() => import("../pages/AdminConsole"));

/**
 * Route configuration for the application
 * Each route object contains:
 * - id: unique identifier
 * - path: URL path
 * - label: Display label (translation key)
 * - icon: Icon component
 * - component: Page component
 * - showInNav: Whether to show in navigation menu
 * - index: Order in navigation
 */
export const routesConfig = [
  {
    id: "dashboard",
    path: "/dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    component: Dashboard,
    showInNav: true,
    index: 0,
  },
  {
    id: "back-to-back-trading",
    path: "/back-to-back-trading",
    label: "Back-to-Back",
    icon: PublishedWithChangesIcon,
    component: BackToBackTrading,
    showInNav: true,
    index: 1,
  },
  {
    id: "purchase-to-stock",
    path: "/purchase-trading",
    label: "Purchase Trading",
    icon: ShoppingCart,
    component: PurchaseTrading,
    showInNav: true,
    index: 2,
  },
  {
    id: "sell-from-stock",
    path: "/sales-trading",
    label: "Sales Trading",
    icon: ReceiptIcon,
    component: SalesTrading,
    showInNav: true,
    index: 3,
  },
  {
    id: "outboundDelivery",
    path: "/outbound-delivery",
    label: "Outbound Delivery",
    icon: LocalShippingIcon,
    component: OutboundDelivery,
    showInNav: true,
    index: 4,
  },
  {
    id: "invoices",
    path: "/invoices",
    label: "Invoices",
    icon: DescriptionIcon,
    component: Invoices,
    showInNav: true,
    index: 5,
  },
  {
    id: "admin-console",
    path: "/admin-console",
    label: "Admin Console",
    icon: SettingsIcon,
    component: AdminConsole,
    showInNav: true,
    index: 6,
  },
];

// Helper function to get route by id
export const getRouteById = (id) => {
  return routesConfig.find((route) => route.id === id);
};

// Helper function to get route by path
export const getRouteByPath = (path) => {
  return routesConfig.find((route) => route.path === path);
};

// Get only routes that should be shown in navigation
export const getNavigationRoutes = () => {
  return routesConfig
    .filter((route) => route.showInNav)
    .sort((a, b) => a.index - b.index);
};

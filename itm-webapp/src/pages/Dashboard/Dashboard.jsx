import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useSelector } from "react-redux";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ContractsTab from "./components/ContractsTab";
import ProfitSimulationTab from "./components/ProfitSimulationTab";
import OrdersTab from "./components/OrdersTab";
import DeliveryTab from "./components/DeliveryTab";
import InvoiceTab from "./components/InvoiceTab";

const TAB_ITEMS = [
  { value: "contracts", label: "Contracts", Component: ContractsTab },
  {
    value: "profit-simulation",
    label: "Profit Simulation",
    Component: ProfitSimulationTab,
  },
  { value: "orders", label: "Orders", Component: OrdersTab },
  { value: "delivery", label: "Delivery", Component: DeliveryTab },
  { value: "invoice", label: "Invoice", Component: InvoiceTab },
];

export default function Dashboard() {
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("contracts");

  return (
    <Box
      className="outermost-container"
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ mb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <ReusableTypography variant="h5" sx={{ fontWeight: 600 }}>
          Dashboard
        </ReusableTypography>
        <ReusableTypography variant="body1" color="text.secondary">
          Welcome to the Dashboard,{" "}
          {isAuthenticated ? `${userInfo?.firstName || "User"}!` : "Guest!"} You
          are seeing dummy data.
        </ReusableTypography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          borderBottom: "1px solid var(--divider-secondary, #eeeeee)",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            minHeight: 44,
          },
          "& .Mui-selected": {
            color: "var(--primary-main, #3026B9)",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "var(--primary-main, #3026B9)",
          },
        }}
      >
        {TAB_ITEMS.map((tab) => (
          <Tab
            key={tab.value}
            label={<ReusableTypography>{tab.label}</ReusableTypography>}
            value={tab.value}
          />
        ))}
      </Tabs>

      {TAB_ITEMS.map(({ value, Component }) =>
        activeTab === value ? (
          <Box
            key={value}
            sx={{
              "@keyframes tabContentIn": {
                from: { opacity: 0, transform: "translateY(8px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
              animation: "tabContentIn 0.35s ease-out both",
            }}
          >
            <Component />
          </Box>
        ) : null,
      )}
    </Box>
  );
}

import { Box, Typography, Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";
import { purchaseOrdersRoutes } from "../../config/purchaseOrder.routes.config.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import ReusableButtons from "../../components/Common/ReusableButtons.jsx";
import ReusableTypography from "../../components/Common/ReusableTypography.jsx";
import { Add, GridView, Mail, Pencil, SquarePen } from "@cw/rds/icons";
import PurchaseOrders from "./PurchaseOrders.jsx";
export default function PurchaseOrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tabs, setTabs] = useState("purchase-orders");
  const purchaseOrdersView = (
    <Box
      className="outermost-container"
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <ReusableTypography variant="h5" sx={{ fontWeight: 600 }}>
          {t("Purchase Orders")}
        </ReusableTypography>
        <ReusableButtons type="button" icon={<Add />}>
          New Purchase Order
        </ReusableButtons>
      </Box>
      <Tabs
        value={tabs}
        onChange={(e, newValue) => setTabs(newValue)}
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
          },
        }}
      >
        <Tab label="Purchase Orders" value="purchase-orders" />
        <Tab label="Purchase Order Items" value="purchase-order-items" />
      </Tabs>
      <Box display={tabs === "purchase-orders" ? "block" : "none"}>
        <PurchaseOrders />
      </Box>
    {/*   <Box display={tabs === "purchase-order-items" ? "block" : "none"}>
        <PurchaseOrderItems />
      </Box> */}
    </Box>
  );
  return (
    <Routes>
      <Route index element={purchaseOrdersView} />
      {purchaseOrdersRoutes.map((route) => (
        <Route key={route.id} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
}

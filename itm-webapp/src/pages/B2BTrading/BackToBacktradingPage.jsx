import React, { useRef, useState } from "react";
import { IconButton, Chip, Tabs, Tab } from "@mui/material";
import { Box } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ReusableButtons from "../../components/Common/ReusableButtons";
import { Add } from "@cw/rds/icons";
import { b2bTradingRoutes } from "../../config/b2btrading.routes.config";
import B2BTradingContracts from "./B2BTradingContracts";
import B2BTradingContractsItems from "./B2BTradingContractsItems";

export default function BackToBackTrading() {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState("contracts");
  // Dashboard view. Kept as a plain JSX value (not a nested component function) so re-renders of
  // BackToBackTrading don't remount this subtree and wipe out ListView's local selection state.
  const dashboardView = (
    <Box
      className="outermost-container"
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <ReusableTypography variant="h6" sx={{ fontWeight: 600 }}>
          Back to Back Trading Dashboard
        </ReusableTypography>
        <ReusableButtons
          type="button"
          icon={<Add />}
          onClick={() => navigate("create-contract")}
        >
          New B2B Contract
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
        <Tab label="Trading Contracts" value="contracts" />
        <Tab label="Trading Contracts Items" value="contractsItems" />
      </Tabs>
      <Box display={tabs === "contracts" ? "block" : "none"}>
        <B2BTradingContracts />
      </Box>
      <Box display={tabs === "contractsItems" ? "block" : "none"}>
        <B2BTradingContractsItems />
      </Box>
    </Box>
  );

  return (
    <Routes>
      <Route index element={dashboardView} />
      {b2bTradingRoutes.map((route) => (
        <Route key={route.id} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
}

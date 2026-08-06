import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Chip, Tabs, Tab } from "@mui/material";
import { Box } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ReusableButtons from "../../components/Common/ReusableButtons";
import { Add, GridView, Mail, Pencil, SquarePen } from "@cw/rds/icons";
import { b2bTradingRoutes } from "../../config/b2btrading.routes.config";
import B2BTradingContracts from "./B2BTradingContracts";
import B2BTradingContractsItems from "./B2BTradingContractsItems";
import { Grid } from "@cw/rds/layout";
import {
  setHeaderDetails,
  setCurrentStep,
} from "../../redux/slices/backToBackSlice";

export default function BackToBackTrading() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tabs, setTabs] = useState("contracts");
  const { headerDetails } = useSelector(
    (state) => state.backToBack.contractForm,
  );
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <ReusableTypography variant="h5" sx={{ fontWeight: 600 }}>
          Back to Back Trading Dashboard
        </ReusableTypography>
        <ReusableButtons
          type="button"
          icon={<Add />}
          options={[
            {
              label: "Create Manually",
              onClick: () => {
                // resetting incompleted application
                dispatch(setHeaderDetails({}));
                dispatch(setCurrentStep(0));
                navigate("create-contract");
              },
              icon: <Pencil />,
            },
            headerDetails &&
              Object.keys(headerDetails).length > 0 && {
                label: "Continue Incomplete Contract",
                onClick: () => navigate("create-contract"),
                icon: <SquarePen />,
              },
            {
              label: "Create From Excel",
              onClick: () => console.log("Create From Excel"),
              icon: <GridView />,
            },
            {
              label: "Create From Email",
              onClick: () => console.log("Create From Email"),
              icon: <Mail />,
            },
          ].filter(Boolean)}
        >
          <ReusableTypography>New B2B Contract</ReusableTypography>
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
        <Tab
          label={<ReusableTypography>Trading Contracts</ReusableTypography>}
          value="contracts"
        />
        <Tab
          label={
            <ReusableTypography>Trading Contracts Items</ReusableTypography>
          }
          value="contractsItems"
        />
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

import React, { useRef, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ReusableButtons from "../../components/Common/ReusableButtons";
import ReusableTile from "../../components/Common/ReusableTile";
import { Add } from "@cw/rds/icons";
import B2BContractDashboardTable from "../../cw-generated-forms/B2BContractDashboardTable";
import { dummyTableData } from "../../dummydatas/dummydata";
import { b2bTradingRoutes, getB2BRouteById } from "./b2b.routes.config";

const statCards = [
  { label: "Contract Value", value: "€1.95M", sub: "up by 12% vs Last Year" },
  { label: "Total Contracts", value: "4", sub: "+2 this week" },
  { label: "Active Contracts", value: "12", sub: "Currently Operation" },
  { label: "Pending Approval", value: "4", sub: "Contracts Awaiting" },
  { label: "Expiring Soon", value: "3", sub: "Next 30 days" },
  { label: "Expired Contracts", value: "1", sub: "Action Required" },
];
const statCards2 = [
  { label: "Open Orders", value: "18", sub: "6 due this week" },
  { label: "Completed", value: "41", sub: "+8 this month" },
  { label: "Posted", value: "12", sub: "+8 this week" },
  { label: "Pending Delivery", value: "7", sub: "In Transit" },
  { label: "Order Value (MTD)", value: "€1.1M", sub: "Month-to-date" },
  { label: "Errors/Blocked", value: "2", sub: "Validation Required" },
];

export default function BackToBacktrading() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const formRef = useRef(null);

  const [createContractOpen, setCreateContractOpen] = useState(false);
  const [contractData, setContractData] = useState(null);
  const onClose = () => {
    setCreateContractOpen(false);
    setContractData(null);
    formRef.current.reset();
  };
  const handleSubmit = () => {
    // Handle form submission logic here
    const data = formRef.current.getValues();
    console.log("Form submitted", data);
    setContractData(data);
    onClose();
  };

  // Dashboard view - exact same as user provided
  const DashboardView = () => {
    const createContractRoute = getB2BRouteById("create-contract");
    
    return (
      <div className="outermost-container">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <ReusableTypography variant="h6" sx={{ fontWeight: 600 }}>
            Back to Back Trading Dashboard
          </ReusableTypography>
          <ReusableButtons
            type="button"
            icon={<Add />}
            onClick={() => navigate(`/back-to-back-trading/${createContractRoute.path}`)}
          >
            New B2B Contract
          </ReusableButtons>
        </Box>

        <Box display="flex" gap={2} flexDirection={"column"}>
          <Box
            display="flex"
            gap={2}
            mt={2}
            flexDirection={"column"}
            flexWrap={"wrap"}
          >
            <Box display="flex" gap={2} flexWrap={"wrap"}>
              {statCards.map((card) => (
                <Box key={card.label} flex={1} minWidth={0} display="flex">
                  <ReusableTile
                    title={card.label}
                    subtitle={card.value}
                    description={card.sub}
                  />
                </Box>
              ))}
            </Box>
            <Box>
              <B2BContractDashboardTable
                initialData={dummyTableData}
                showFooter={false}
                showHeader={false}
                view="list"
              />
            </Box>
          </Box>
        </Box>
      </div>
    );
  };

  return (
    <Routes>
      <Route index element={<DashboardView />} />
      {b2bTradingRoutes.map((route) => (
        <Route
          key={route.id}
          path={route.path}
          element={<route.component />}
        />
      ))}
    </Routes>
  );
}

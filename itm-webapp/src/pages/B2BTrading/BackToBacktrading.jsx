import React, { useRef, useState, lazy } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ReusableButtons from "../../components/Common/ReusableButtons";
import ReusableTile from "../../components/Common/ReusableTile";
import { Add } from "@cw/rds/icons";
import B2BContractDashboardTable from "../../cw-generated-forms/B2BContractDashboardTable";
import { dummyTableData } from "../../dummydatas/dummydata";

// Lazy load nested routes
const CreateB2BTradingContract = lazy(() => import("./CreateB2BTradingContract"));
const ContractDetails = lazy(() => import("./ContractDetails"));

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

  // Dashboard view component
  const DashboardView = () => (
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
          onClick={() => navigate("/back-to-back-trading/create-contract")}
        >
          {activeTab === 0 ? "New B2B Contract" : "New B2B Order"}
        </ReusableButtons>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        sx={{ "& .MuiTab-root": { textTransform: "none " } }}
      >
        <Tab label="Back to Back Trading Contract" />
        <Tab label="Back to Back Trading Order" />
      </Tabs>

      {activeTab === 0 && (
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
      )}

      {activeTab === 1 && (
        <Box display="flex" gap={2} mt={2}>
          {statCards2.map((card) => (
            <Box key={card.label} flex={1} minWidth={0} display="flex">
              <ReusableTile
                title={card.label}
                subtitle={card.value}
                description={card.sub}
              />
            </Box>
          ))}
        </Box>
      )}
    </div>
  );

  return (
    <Routes>
      <Route index element={<DashboardView />} />
      <Route path="create-contract" element={<CreateB2BTradingContract />} />
    </Routes>
  );
}

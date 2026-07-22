import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ReusableButtons from "../../components/Common/ReusableButtons";
import ReusableTile from "../../components/Common/ReusableTile";
import { Add } from "@cw/rds/icons";
import B2BContractDashboardTable from "../../cw-generated-forms/B2BContractDashboardTable";
import { dummyTableData } from "../../dummydatas/dummydata";
import { b2bTradingRoutes } from "../../config/b2btrading.routes.config";

const statCards = [
  { label: "Contract Value", value: "€1.95M", sub: "up by 12% vs Last Year" },
  { label: "Total Contracts", value: "4", sub: "+2 this week" },
  { label: "Active Contracts", value: "12", sub: "Currently Operation" },
  { label: "Pending Approval", value: "4", sub: "Contracts Awaiting" },
  { label: "Expiring Soon", value: "3", sub: "Next 30 days" },
  { label: "Expired Contracts", value: "1", sub: "Action Required" },
];

export default function BackToBacktrading() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [createContractOpen, setCreateContractOpen] = useState(false);
  const [contractData, setContractData] = useState(null);
  const onClose = () => {
    setCreateContractOpen(false);
    setContractData(null);
    if (formRef.current) formRef.current.reset();
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

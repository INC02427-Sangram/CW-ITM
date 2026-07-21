import React, { useRef, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ReusableButtons from "../../components/Common/ReusableButtons";
import ReusableTile from "../../components/Common/ReusableTile";
import { Add } from "@cw/rds/icons";
import CreateB2BTradingContractPage from "./CreateB2BTradingContract";
import B2BContractDashboardTable from "../../cw-generated-forms/B2BContractDashboardTable";

const dummyTableData = [
  {
    ITM_CTC_ID: "BTBC-882-2024",
    supplier: "Chemical Supplies Inc.",
    soldToParty: "Constellation Energy",
    material: "Glycol - 2114",
    validityPeriod: "01/Jan/2024 to 31/Dec/2024",
    buyPrice: "$80/MT",
    sellPrice: "€90/MT",
    currency: "EUR",
    targetQuantity: "10,000",
    unit: "MT",
    status: "Active",
  },
  {
    ITM_CTC_ID: "BTBC-441-2023",
    supplier: "TechParts Manufacturing",
    soldToParty: "Pacific Fuels Ltd.",
    material: "Lens - XJ720",
    validityPeriod: "01/Jan/2024 to 31/Dec/2024",
    buyPrice: "$80/MT",
    sellPrice: "€90/MT",
    currency: "EUR",
    targetQuantity: "12,000",
    unit: "MT",
    status: "Pending Approval",
  },
  {
    ITM_CTC_ID: "BTBC-775-2022",
    supplier: "Tital Steel Co.",
    soldToParty: "Orion Metals Inc.",
    material: "Steel",
    validityPeriod: "01/Jan/2024 to 31/Dec/2024",
    buyPrice: "$80/MT",
    sellPrice: "€90/MT",
    currency: "EUR",
    targetQuantity: "80,000",
    unit: "MT",
    status: "Expired",
  },
  {
    ITM_CTC_ID: "BTBC-441-2023",
    supplier: "TechParts Manufacturing",
    soldToParty: "Baltic Trade Co.",
    material: "Camera Cabinet",
    validityPeriod: "01/Jan/2024 to 31/Dec/2024",
    buyPrice: "$80/MT",
    sellPrice: "€90/MT",
    currency: "EUR",
    targetQuantity: "53,000",
    unit: "MT",
    status: "Expiring Soon",
  },
];

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

  return (
    <div className="outermost-container">
      <CreateB2BTradingContractPage
        open={createContractOpen}
        onClose={onClose}
        contractData={contractData}
        formRef={formRef}
        handleSubmit={handleSubmit}
      />
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
          onClick={() => setCreateContractOpen(true)}
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
        <Box display="flex" gap={2} mt={2} flexDirection={"column"}>
          <Box
            display="flex"
            gap={2}
            mt={2}
            flexDirection={"row"}
            flexWrap={"wrap"}
          >
            {statCards.map((card) => (
              <Box key={card.label} flex={1} minWidth={0} display="flex">
                <ReusableTile
                  title={card.label}
                  subtitle={card.value}
                  description={card.sub}
                />
              </Box>
            ))}
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
}

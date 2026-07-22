import React, { useRef, useState } from "react";
import { Box, Chip, IconButton, Tab, Tabs } from "@mui/material";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ReusableButtons from "../../components/Common/ReusableButtons";
import ReusableTile from "../../components/Common/ReusableTile";
import ReusableDataGrid from "../../components/Common/ReusableDataGrid";
import { Add, ViewIcon } from "@cw/rds/icons";
import CreateB2BTradingContractPage from "./CreateB2BTradingContract";
import { useNavigate } from "react-router-dom";
import { dummyTableData } from "../../dummydatas/dummydata";

const STATUS_STYLES = {
  Active: { color: "#1e7d32", backgroundColor: "#e8f5e9" },
  "Pending Approval": { color: "#2454b8", backgroundColor: "#e6edfb" },
  Expired: { color: "#c0392b", backgroundColor: "#fdecea" },
  "Expiring Soon": { color: "#b56a1f", backgroundColor: "#fdf1e3" },
};

function ViewActionButton({ row }) {
  const navigate = useNavigate();
  return (
    <IconButton
      size="small"
      onClick={() =>
        navigate("/b2b-trading-contract-details", { state: { contractRow: row } })
      }
    >
      <ViewIcon />
    </IconButton>
  );
}

const contractColumns = [
  { field: "ITM_CTC_ID", headerName: "Contract #", flex: 1, minWidth: 140 },
  { field: "supplier", headerName: "Supplier", flex: 1, minWidth: 170 },
  { field: "soldToParty", headerName: "Sold-To Party", flex: 1, minWidth: 170 },
  { field: "material", headerName: "Material", flex: 1, minWidth: 140 },
  {
    field: "validityPeriod",
    headerName: "Validity Period",
    flex: 1,
    minWidth: 210,
  },
  { field: "buyPrice", headerName: "Buy Price", width: 110 },
  { field: "sellPrice", headerName: "Sell Price", width: 110 },
  { field: "currency", headerName: "Currency", width: 100 },
  {
    field: "targetQuantity",
    headerName: "Target Quantity",
    width: 140,
    align: "right",
    headerAlign: "right",
  },
  { field: "unit", headerName: "Unit", width: 80 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        sx={{ fontWeight: 600, ...(STATUS_STYLES[params.value] || {}) }}
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,
    renderCell: (params) => <ViewActionButton row={params.row} />,
  },
];

const contractRows = dummyTableData.map((row, index) => ({
  id: index,
  ...row,
}));

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
          onClick={() => navigate("/create-b2b-trading-contract")}
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
              <Box
                key={card.label}
                sx={{ flex: "1 1 200px", minWidth: 200 }}
                display="flex"
              >
                <ReusableTile
                  title={card.label}
                  subtitle={card.value}
                  description={card.sub}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
            <ReusableDataGrid
              rows={contractRows}
              columns={contractColumns}
              autoHeight
              hidePagination
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

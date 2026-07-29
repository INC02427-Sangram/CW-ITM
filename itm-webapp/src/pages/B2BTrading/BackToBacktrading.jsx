import React, { useRef, useState } from "react";
import { IconButton, Chip } from "@mui/material";
import { Box } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ReusableButtons from "../../components/Common/ReusableButtons";
import ReusableTile from "../../components/Common/ReusableTile";
import ReusableDataGrid from "../../components/Common/ReusableDataGrid";
import { Add, ViewIcon } from "@cw/rds/icons";
import { dummyTableData } from "../../dummydatas/dummydata";
import { b2bTradingRoutes } from "../../config/b2btrading.routes.config";
import FilterAccordian from "../../components/Common/FilterAccordian";
import B2BTradingFilter, {
  ListView,
} from "../../cw-generated-forms/B2BTradingFilter";
import requestOptions from "../../utils/fnServices/requestOptions";

const STATUS_STYLES = {
  Active: { color: "#1e7d32", backgroundColor: "#e8f5e9" },
  "Pending Approval": { color: "#2454b8", backgroundColor: "#e6edfb" },
  Expired: { color: "#c0392b", backgroundColor: "#fdecea" },
  "Expiring Soon": { color: "#b56a1f", backgroundColor: "#fdf1e3" },
};

const contractColumns = [
  { fieldName: "ITM_CTC_ID", label: "Contract", flex: 1, minWidth: 140 },
  { fieldName: "supplier", label: "Supplier", flex: 1, minWidth: 170 },
  { fieldName: "soldToParty", label: "Sold-To Party", flex: 1, minWidth: 170 },
  { fieldName: "material", label: "Material", flex: 1, minWidth: 140 },
  {
    fieldName: "validityPeriod",
    label: "Validity Period",
    flex: 1,
    minWidth: 210,
  },
  { fieldName: "buyPrice", label: "Buy Price", width: 110 },
  { fieldName: "sellPrice", label: "Sell Price", width: 110 },
  { fieldName: "currency", label: "Currency", width: 100 },
  {
    fieldName: "targetQuantity",
    label: "Target Quantity",
    width: 140,
    align: "right",
    headerAlign: "right",
  },
  { fieldName: "unit", label: "Unit", width: 80 },
  {
    fieldName: "status",
    label: "Status",
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
    fieldName: "actions",
    label: "Actions",
    width: 150,
    sortable: false,
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

export default function BackToBacktrading() {
  const navigate = useNavigate();

  const [createContractOpen, setCreateContractOpen] = useState(false);
  const [contractData, setContractData] = useState(null);
  const filterRef = useRef();
  const [selectedContracts, setSelectedContracts] = useState([]);
  const formatValue = (col, value) => {
    if (col.fieldName === "actions") {
      return (
        <IconButton
          size="small"
          onClick={() =>
            navigate("contract-details", {
              state: { contractRow: value },
            })
          }
        >
          <ViewIcon />
        </IconButton>
      );
    }
    if (col.fieldName === "status") {
      return (
        <Chip
          label={value}
          size="small"
          sx={{ fontWeight: 600, ...(STATUS_STYLES[value] || {}) }}
        />
      );
    }
    return value;
  };
  const handleClear = () => {
    filterRef.current?.reset();
  };
  const handleSearch = () => {
    const success = filterRef.current?.submit();
    console.log(filterRef.current.getValues());
  };
  // Dashboard view component
  const DashboardView = () => (
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
          onClick={() => navigate("create-contract")}
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
          <Box display="flex" gap={2} flexWrap={"wrap"}>
            <FilterAccordian
              title="Filter B2B Contracts"
              onSearch={handleSearch}
              onClear={handleClear}
              filterFieldsComponent={
                <B2BTradingFilter
                  ref={filterRef}
                  columns={4}
                  showHeader={false}
                  showFooter={false}
                  requestOptions={requestOptions}
                />
              }
            />
          </Box>
          <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
            <ListView
              data={contractRows}
              columns={contractColumns}
              selectable={true}
              onSelectionChange={setSelectedContracts}
              formatValue={formatValue}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Routes>
      <Route index element={<DashboardView />} />
      {b2bTradingRoutes.map((route) => (
        <Route key={route.id} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
}

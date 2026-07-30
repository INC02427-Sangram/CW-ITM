import React, { useRef, useState } from "react";
import { IconButton, Chip, Tabs, Tab } from "@mui/material";
import { Box } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ReusableButtons from "../../components/Common/ReusableButtons";
import ReusableTile from "../../components/Common/ReusableTile";
import ReusableDataGrid from "../../components/Common/ReusableDataGrid";
import { Add, ViewIcon } from "@cw/rds/icons";
import { B2BContractStatCards, B2BContractItemsStatCards, dummyTableData } from "../../dummydatas/dummydata";
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

export default function B2BTradingContracts() {
  const navigate = useNavigate();

  const [createContractOpen, setCreateContractOpen] = useState(false);
  const [contractData, setContractData] = useState(null);
  const filterRef = useRef();
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [tabs, setTabs] = useState("contracts");
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
    if (col.fieldName === "material") {
      const materialItems = Array.isArray(value) ? value : [];
      return (
        materialItems
          .map((item) => item.material)
          .filter(Boolean)
          .join(", ") || "-"
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
  return (
    <Box display="flex" gap={2} flexDirection={"column"}>
      <Box
        display="flex"
        gap={2}
        mt={2}
        flexDirection={"column"}
        flexWrap={"wrap"}
      >
        <Box display="flex" gap={2} flexWrap={"wrap"}>
          {B2BContractStatCards.map((card) => (
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
            onRowClick={(row) =>
              navigate("contract-details", {
                state: { contractRow: row },
              })
            }
          />
        </Box>
      </Box>
    </Box>
  );
}

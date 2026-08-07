import React, { useRef, useState } from "react";
import { IconButton, Chip, Tabs, Tab, Tooltip, MenuList } from "@mui/material";
import { Box, Menu, MenuItem } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import ReusableTypography from "../../components/Common/ReusableTypography";
import ReusableButtons from "../../components/Common/ReusableButtons";
import ReusableTile from "../../components/Common/ReusableTile";
import ReusableDataGrid from "../../components/Common/ReusableDataGrid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Add, Visibility, Pencil, Copy, PrinterIcon } from "@cw/rds/icons";
import {
  B2BContractStatCards,
  B2BContractItemsStatCards,
  dummyTableData,
} from "../../dummydatas/dummydata";
import {
  b2bTradingRoutes,
  b2bTradingStatusStyles,
} from "../../config/b2btrading.routes.config";
import FilterAccordian from "../../components/Common/FilterAccordian";
import B2BTradingFilter, {
  ListView,
} from "../../cw-generated-forms/B2BTradingFilter";
import requestOptions from "../../utils/fnServices/requestOptions";
import ActionMenuItem from "../../components/Common/ActionMenuItem";

const contractColumns = [
  { fieldName: "ITM_CTC_ID", label: "Contract", flex: 1, minWidth: 140 },
  { fieldName: "supplier", label: "Supplier", flex: 1, minWidth: 170 },
  { fieldName: "customer", label: "Customer", flex: 1, minWidth: 170 },
  { fieldName: "material", label: "Material", flex: 1, minWidth: 140 },
  {
    fieldName: "validityPeriod",
    label: "Validity Period",
    flex: 1,
    minWidth: 210,
  },
  { fieldName: "netPurchaseValue", label: "Net Purchase Price", width: 110 },
  {
    fieldName: "purchaseValueCurrency",
    label: "Purchase Currency",
    width: 100,
  },
  { fieldName: "netSalesValue", label: "Net Sales Price", width: 110 },
  { fieldName: "salesValueCurrency", label: "Sales Currency", width: 100 },
  {
    fieldName: "netQuantity",
    label: "Net Quantity",
    width: 140,
    align: "right",
    headerAlign: "right",
  },
  { fieldName: "totalContractValue", label: "Total Contract Value", width: 80 },
  {
    fieldName: "status",
    label: "Status",
    width: 150,
    sortable: false,
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
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [tabs, setTabs] = useState("contracts");

  // action anchor
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const isActionMenuOpen = Boolean(actionAnchorEl);

  const formatValue = (col, value, rowData) => {
    console.log("col", col, "value", value);
    if (col.fieldName === "actions") {
      console.log("contract Action", value);
      return (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Actions">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setActionAnchorEl(e.currentTarget);
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="View Contract">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate("contract-details", {
                  state: { contractData: rowData, actionType: "view" },
                });
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy Contract">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate("create-contract", {
                  state: { editContractData: rowData, actionType: "clone" },
                });
              }}
            >
              <Copy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Contract">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate("create-contract", {
                  state: { editContractData: rowData, actionType: "edit" },
                });
              }}
            >
              <Pencil />
            </IconButton>
          </Tooltip> */}
        </Box>
      );
    }
    if (col.fieldName === "status") {
      return (
        <Chip
          label={value}
          size="small"
          sx={{
            fontWeight: 600,
            height: 30,
            width: 150,
            ...(b2bTradingStatusStyles[value] || {}),
          }}
        />
      );
    }
    if (col.fieldName === "material") {
      const materialItems = Array.isArray(value) ? value : [];
      if (materialItems.length > 1)
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <span>{materialItems[0].material}</span>
            <Tooltip
              title={`Additional materials: ${materialItems
                .slice(1)
                .map((item) => item.material)
                .join(", ")}`}
            >
              <Chip label={`+${materialItems.length - 1} more`} size="small" />
            </Tooltip>
          </Box>
        );
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
          onRowClick={(row) => {
            navigate("contract-details", {
              state: { contractData: row, actionType: "view" },
            });
            setSelectedRowData(row);
          }}
        />
      </Box>
      <Menu
        id="long-menu"
        anchorEl={actionAnchorEl}
        open={isActionMenuOpen}
        slotProps={{
          paper: {
            style: {
              height: "fit-content",
              // maxHeight: 48 * 3,
              // width: "20ch",
            },
          },
          list: {
            "aria-labelledby": "long-button",
          },
        }}
        onClose={() => setActionAnchorEl(null)}
      >
        <MenuList sx={{ padding: 0, margin: 0 }}>
          <ActionMenuItem
            title="View Contract"
            icon={<Visibility />}
            tooltipTitle="View Contract"
            onClick={(e) => {
              e.stopPropagation();
              navigate("contract-details", {
                state: { contractData: selectedRowData, actionType: "view" },
              });
            }}
          />
          <ActionMenuItem
            title="Clone Contract"
            icon={<Copy />}
            tooltipTitle="Clone Contract"
            onClick={(e) => {
              e.stopPropagation();
              navigate("create-contract", {
                state: {
                  editContractData: selectedRowData,
                  actionType: "clone",
                },
              });
            }}
          />
          <ActionMenuItem
            title="Edit Contract"
            icon={<Pencil />}
            tooltipTitle="Edit Contract"
            onClick={(e) => {
              e.stopPropagation();
              navigate("create-contract", {
                state: {
                  editContractData: selectedRowData,
                  actionType: "edit",
                },
              });
            }}
          />
          <ActionMenuItem
            title="Print Contract"
            icon={<PrinterIcon />}
            tooltipTitle="Print Contract"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Printing");
            }}
          />
        </MenuList>
      </Menu>
    </Box>
  );
}

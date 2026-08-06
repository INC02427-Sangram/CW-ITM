import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation, Box, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import ReusableTypography from "../../components/Common/ReusableTypography";
import AddMaterial from "./AddMaterial";
import { ArrowBack } from "@cw/rds/icons";
import Button from "../../components/CommonMUI/CustomButton";
import { b2bTradingStatusStyles } from "../../config/b2btrading.routes.config";
// Dummy data source — in a real integration this would come from the contract API response.
const dummyContractDetails = {
  contractNumber: "BTBC-882-2024",
  status: "Pending Approval",
  supplier: "Chemical Supplier AG Inc.",
  validityFrom: "01/Jan/2024",
  validityTo: "01/Jan/2024",
  currency: "EUR",
  incoterms: "FOB - Rotterdam Port",
  paymentTerms: "N30",
  personResponsible: "John Miller",
  purchasingOrganization: "1000 - Central Procurement",
  exchangeRateType: "M - Standard",
  documentDate: "01/Jan/2024",
  items: [
    {
      supplier: "BASF",
      material: "Glycol - 2114",
      deliveryPeriodFrom: "2024-01-01",
      deliveryPeriodTo: "2024-12-31",
      salesQuantity: "10000",
      salesQuantityUnit: "MT",
      salesOverdeliveryTolerance: "5",
      salesUnderdeliveryTolerance: "5",
      purchaseQuantity: "10000",
      purchaseQuantityUnit: "MT",
      purchaseOverdeliveryTolerance: "5",
      purchaseUnderdeliveryTolerance: "5",
      salesPrice: "90",
      salesPriceCurrency: "EUR",
      salesPricePerUnit: "MT",
      purchasePrice: "80",
      purchasePriceCurrency: "USD",
      purchasePricePerUnit: "MT",
      plant: "PL01",
      storageLocation: "SL-100",
      expenses: [],
      editing: false,
    },
  ],
  netContractValue: "4,500,000.00",
  tax: "0.00",
  totalContractValue: "4,500,000.00",
};

const CONTRACT_DETAIL_FIELDS = [
  { label: "Contract Number", key: "contractNumber" },
  { label: "Person Responsible", key: "personResponsible" },
  { label: "Validity Period", key: "validityPeriod" },
  { label: "Document Date", key: "documentDate" },
  { label: "Customer", key: "customer" },
  { label: "Sales Organization", key: "salesOrg" },
  { label: "Distribution Channel", key: "distChannel" },
  { label: "Division", key: "division" },
  { label: "Supplier", key: "supplier" },
  { label: "Purchasing Organization", key: "purchaseOrg" },
  { label: "Purchase Group", key: "purchaseGroup" },
  { label: "Purchase Currency", key: "purchasingCurrency" },
  { label: "Purchase Incoterms", key: "purchaseIncoterms" },
  { label: "Purchase Incoterms Location", key: "purchaseIncotermsLocation" },
  { label: "Purchase Payment Terms", key: "purchasePaymentTerms" },
  { label: "Sales Currency", key: "salesCurrency" },
  { label: "Sales Incoterms", key: "salesIncoterms" },
  { label: "Sales Incoterms Location", key: "salesIncotermsLocation" },
  { label: "Sales Payment Terms", key: "salesPaymentTerms" },
  { label: "Exchange Rate Type", key: "exchangeRateType" },
];

const SUMMARY_FIELDS = [
  { label: "Net Quantity:", key: "netQuantity", emphasize: false },
  { label: "Net Quantity Unit:", key: "netQuantityUnit", emphasize: false },
  { label: "Net Purchase Value:", key: "netPurchaseValue", emphasize: false },
  { label: "Total Expenses:", key: "totalExpenses", emphasize: false },
  { label: "Net Sales Value:", key: "netSalesValue", emphasize: false },
  { label: "Tax:", key: "tax", emphasize: false },
  {
    label: "Total Contract Value:",
    key: "totalContractValue",
    emphasize: true,
  },
];

const parseNumeric = (value) =>
  Number(String(value ?? "").replace(/[^0-9.]/g, "")) || 0;

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Maps a Back-to-Back Trading table row (dashboard list shape) into the richer
// contractData shape this page renders. row.material already carries the full
// AddMaterial line-item shape, so it's used directly as the items array.
const buildContractDataFromRow = (row) => {
  if (!row) return dummyContractDetails;
  const [validityFrom, validityTo] = String(row.validityPeriod || "")
    .split(" to ")
    .map((s) => s.trim());
  const items =
    Array.isArray(row.material) && row.material.length
      ? row.material.map((item) => ({ ...item, editing: false }))
      : dummyContractDetails.items;
  const netValue = items.reduce(
    (sum, item) =>
      sum + parseNumeric(item.salesQuantity) * parseNumeric(item.salesPrice),
    0,
  );

  return {
    ...row,
    contractNumber: row.ITM_CTC_ID || "N/A",
    status: row.status || "N/A",
    supplier: row.supplier || "N/A",
    purchasingCurrency: row.purchasingCurrency || "N/A",
    salesCurrency: row.salesCurrency || "N/A",
    validityFrom: validityFrom || "N/A",
    validityTo: validityTo || "N/A",
    purchaseIncoterms: row.purchaseIncoterms || "N/A",
    purchaseIncotermsLocation: row.purchaseIncotermsLocation || "N/A",
    purchasePaymentTerms: row.purchasePaymentTerms || "N/A",
    salesIncoterms: row.salesIncoterms || "N/A",
    salesIncotermsLocation: row.salesIncotermsLocation || "N/A",
    salesPaymentTerms: row.salesPaymentTerms || "N/A",
    personResponsible: row.personResponsible || "N/A",
    purchasingOrganization: row.purchasingOrganization || "N/A",
    exchangeRateType: row.exchangeRateType || "N/A",
    documentDate: row.documentDate || "N/A",
    items,
    netContractValue: formatAmount(netValue),
    tax: "0.00",
    totalContractValue: formatAmount(netValue),
    salesValueCurrency: row.salesValueCurrency || "N/A",
    purchaseValueCurrency: row.purchaseValueCurrency || "N/A",
  };
};

export default function ContractDetails({ contractData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const resolvedContractData = buildContractDataFromRow(
    location.state?.contractData,
  );
  const detailValues = {
    ...resolvedContractData,
    validityPeriod: `${resolvedContractData.validityFrom}  -  ${resolvedContractData.validityTo}`,
  };
  const statusStyle =
    b2bTradingStatusStyles[resolvedContractData.status] ||
    b2bTradingStatusStyles["Draft"];

  const buttonConfig = {
    draft: {
      label: "Save & Submit For Approval",
      variant: "outlined",
      endIcon: <SendIcon sx={{ fontSize: 16 }} />,
      onClick: () => {
        navigate("../create-contract", {
          state: { editContractData: resolvedContractData },
        });
      },
    },
    "approval pending": {
      label: "Submit For Approval",
      variant: "contained",
      onClick: () => {
        navigate("../create-contract", {
          state: { editContractData: resolvedContractData },
        });
      },
    },
    approved: {
      label: "Created Orders",
      variant: "contained",
    },
    "orders created": {
      label: "Post to SAP",
      variant: "contained",
      endIcon: <SendIcon sx={{ fontSize: 16 }} />,
      onClick: () => {
        navigate("../create-contract", {
          state: { editContractData: resolvedContractData },
        });
      },
    },
    "posted to sap": {
      label: "Submit & Create Purchase Order",
      variant: "contained",
      endIcon: <SendIcon sx={{ fontSize: 16 }} />,
      onClick: () => {
        navigate("../create-contract", {
          state: { editContractData: resolvedContractData },
        });
      },
    },
    expired: {
      label: "Submit & Create Purchase Order",
      variant: "contained",
      endIcon: <SendIcon sx={{ fontSize: 16 }} />,
      onClick: () => {
        navigate("../create-contract", {
          state: { editContractData: resolvedContractData },
        });
      },
    },
    cancelled: {
      label: "Submit & Create Purchase Order",
      variant: "contained",
      endIcon: <SendIcon sx={{ fontSize: 16 }} />,
      onClick: () => {
        navigate("../create-contract", {
          state: { editContractData: resolvedContractData },
        });
      },
    },
  };

  return (
    <Box className="outermost-container" sx={{ pb: 10 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            sx={{
              p: 0,
              "&:hover": { backgroundColor: "transparent" },
            }}
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBack sx={{ color: "#7a8aa0", fontSize: 22 }} />
          </IconButton>
          <ReusableTypography
            sx={{ fontSize: 18, fontWeight: 700, color: "#2f3136" }}
          >
            Back to Back Trading Contract Details{" "}
            <ReusableTypography
              component="span"
              sx={{ fontWeight: 400, color: "#7b818f", fontSize: 16 }}
            >
              :
            </ReusableTypography>{" "}
            <ReusableTypography
              component="span"
              sx={{ fontWeight: 700, fontSize: 16 }}
            >
              {resolvedContractData.contractNumber}
            </ReusableTypography>
          </ReusableTypography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
          onClick={() =>
            navigate("../create-contract", {
              state: { editContractData: resolvedContractData },
            })
          }
          disabled={
            resolvedContractData.status !== "Draft" &&
            resolvedContractData.status !== "Pending Approval"
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Edit
        </Button>
      </Box>

      <Box
        sx={{
          border: "1px solid #d9dee7",
          borderRadius: "6px",
          p: 2.5,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            pr: 5,
          }}
        >
          <ReusableTypography
            sx={{ fontSize: 15, fontWeight: 700, color: "#2f3136" }}
          >
            Contract Header Details
          </ReusableTypography>
          <Chip
            label={resolvedContractData.status}
            size="small"
            sx={{ fontWeight: 600, ...statusStyle }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(5, 1fr)" },
            rowGap: 2.5,
            columnGap: 3,
          }}
        >
          {CONTRACT_DETAIL_FIELDS.map((field) => (
            <Box
              key={field.key}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <ReusableTypography
                sx={{ fontSize: 12, color: "#7b818f", mb: 0.5 }}
              >
                {field.label}:
              </ReusableTypography>
              <ReusableTypography
                sx={{ fontSize: 13, fontWeight: 600, color: "#2f3136" }}
              >
                {detailValues[field.key] ?? "-"}
              </ReusableTypography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <AddMaterial
          key={resolvedContractData.contractNumber}
          initialItems={resolvedContractData.items}
          disableAddMaterial={true}
        />
      </Box>

      <Box
        sx={{
          border: "1px solid #d9dee7",
          borderRadius: "6px",
          p: 2.5,
        }}
      >
        {SUMMARY_FIELDS.map((field) => (
          <Box
            key={field.key}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: field.emphasize ? 1 : 0.5,
              borderTop: field.emphasize ? "1px solid #e3e7ee" : "none",
              mt: field.emphasize ? 1 : 0,
            }}
          >
            <ReusableTypography
              sx={{
                fontSize: field.emphasize ? 14 : 13,
                fontWeight: field.emphasize ? 700 : 400,
                color: field.emphasize ? "#2f3136" : "#7b818f",
              }}
            >
              {field.label}
            </ReusableTypography>
            <ReusableTypography
              sx={{
                fontSize: field.emphasize ? 15 : 13,
                fontWeight: field.emphasize ? 700 : 600,
                color: field.emphasize ? "#23409a" : "#2f3136",
              }}
            >
              {detailValues[field.key]}
            </ReusableTypography>
          </Box>
        ))}
      </Box>
      <BottomNavigation
        sx={{
          flexShrink: 0,
          width: "calc(100% - 4dvw)",
          height: "auto",
          px: { xs: 2, sm: 3 },
          py: 2,
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: "#fff",
          borderTop: "1px solid #e3e7ee",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
          position: "fixed",
          bottom: 0,
          right: 0,
          boxSizing: "border-box",
        }}
      >
        {buttonConfig[resolvedContractData.status?.toLowerCase()]?.variant ===
          "outlined" && (
          <Button
            variant="outlined"
            onClick={
              buttonConfig[resolvedContractData.status?.toLowerCase()]?.onClick
            }
          >
            {buttonConfig[resolvedContractData.status?.toLowerCase()]?.label}
          </Button>
        )}
        {buttonConfig[resolvedContractData.status?.toLowerCase()]?.variant ===
          "contained" && (
          <Button
            variant="contained"
            onClick={
              buttonConfig[resolvedContractData.status?.toLowerCase()]?.onClick
            }
          >
            {buttonConfig[resolvedContractData.status?.toLowerCase()]?.label}
            {buttonConfig[resolvedContractData.status?.toLowerCase()]?.endIcon}
          </Button>
        )}
      </BottomNavigation>
    </Box>
  );
}

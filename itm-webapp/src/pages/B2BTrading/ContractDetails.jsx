import React from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import ReusableTypography from "../../components/Common/ReusableTypography";
import AddMaterial from "./AddMaterial";

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
      material: "Glycol - 2114",
      targetQuantity: "10000",
      unit: "MT",
      buyPrice: "80",
      sellPrice: "50",
      editing: false,
    },
  ],
  netContractValue: "4,500,000.00",
  tax: "0.00",
  totalContractValue: "4,500,000.00",
};

const CONTRACT_DETAIL_FIELDS = [
  { label: "Contract Number", key: "contractNumber" },
  { label: "Supplier", key: "supplier" },
  { label: "Validity Period", key: "validityPeriod" },
  { label: "Currency", key: "currency" },
  { label: "Incoterms", key: "incoterms" },
  { label: "Payment Terms", key: "paymentTerms" },
  { label: "Person Responsible", key: "personResponsible" },
  { label: "Purchasing Organization", key: "purchasingOrganization" },
  { label: "Exchange Rate Type", key: "exchangeRateType" },
  { label: "Document Date", key: "documentDate" },
];

const SUMMARY_FIELDS = [
  { label: "Net Contract Value:", key: "netContractValue", emphasize: false },
  { label: "Tax:", key: "tax", emphasize: false },
  { label: "Total Contract Value:", key: "totalContractValue", emphasize: true },
];

const STATUS_STYLES = {
  Active: { color: "#1e7d32", backgroundColor: "#e8f5e9" },
  "Pending Approval": { color: "#2454b8", backgroundColor: "#e6edfb" },
  Expired: { color: "#c0392b", backgroundColor: "#fdecea" },
  "Expiring Soon": { color: "#b56a1f", backgroundColor: "#fdf1e3" },
};

export default function ContractDetails({ contractData = dummyContractDetails }) {
  const detailValues = {
    ...contractData,
    validityPeriod: `${contractData.validityFrom}  -  ${contractData.validityTo}`,
  };
  const statusStyle = STATUS_STYLES[contractData.status] || STATUS_STYLES["Pending Approval"];

  return (
    <div className="outermost-container">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <ReusableTypography sx={{ fontSize: 18, fontWeight: 700, color: "#2f3136" }}>
          Back to Back Trading Contract Details{" "}
          <Typography component="span" sx={{ fontWeight: 400, color: "#7b818f", fontSize: 16 }}>
            :
          </Typography>{" "}
          <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}>
            {contractData.contractNumber}
          </Typography>
        </ReusableTypography>
        <Button
          variant="contained"
          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: "#123db8",
            "&:hover": { backgroundColor: "#0f35a1" },
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#2f3136" }}>
            Contract Details
          </Typography>
          <Chip
            label={contractData.status}
            size="small"
            sx={{ fontWeight: 600, ...statusStyle }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            rowGap: 2.5,
            columnGap: 3,
          }}
        >
          {CONTRACT_DETAIL_FIELDS.map((field) => (
            <Box key={field.key}>
              <Typography sx={{ fontSize: 12, color: "#7b818f", mb: 0.5 }}>
                {field.label}:
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#2f3136" }}>
                {detailValues[field.key] ?? "-"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <AddMaterial initialItems={contractData.items} />
      </Box>

      <Box
        sx={{
          border: "1px solid #d9dee7",
          borderRadius: "6px",
          p: 2.5,
          mb: 3,
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
            <Typography
              sx={{
                fontSize: field.emphasize ? 14 : 13,
                fontWeight: field.emphasize ? 700 : 400,
                color: field.emphasize ? "#2f3136" : "#7b818f",
              }}
            >
              {field.label}
            </Typography>
            <Typography
              sx={{
                fontSize: field.emphasize ? 15 : 13,
                fontWeight: field.emphasize ? 700 : 600,
                color: field.emphasize ? "#23409a" : "#2f3136",
              }}
            >
              {contractData.currency} {detailValues[field.key]}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        <Button
          variant="text"
          sx={{ color: "#23409a", textTransform: "none", fontWeight: 600, px: 2.5 }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          sx={{ textTransform: "none", color: "#23409a", fontWeight: 600, px: 2.5 }}
        >
          Save & Submit For Approval
        </Button>
        <Button
          variant="contained"
          endIcon={<SendIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: "#123db8",
            px: 3,
            "&:hover": { backgroundColor: "#0f35a1" },
          }}
        >
          Submit & Create Purchase Order
        </Button>
      </Box>
    </div>
  );
}

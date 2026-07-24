import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")}/${MONTHS[d.getMonth()]}/${d.getFullYear()}`;
};

const buildDisplayValues = (headerDetails = {}) => ({
  ...headerDetails,
  ITM_CTC_DOC_DATE: formatDate(headerDetails.ITM_CTC_DOC_DATE),
  ITM_CTC_VAL_FROM: formatDate(headerDetails.ITM_CTC_VAL_FROM),
  ITM_CTC_VAL_TO: formatDate(headerDetails.ITM_CTC_VAL_TO),
  ITM_CTC_EXC_RATE_DATE: formatDate(headerDetails.ITM_CTC_EXC_RATE_DATE),
  ITM_CTC_PURCH_INCO: [
    headerDetails.ITM_CTC_PURCH_INCO,
    headerDetails.ITM_CTC_PURCH_INCO_LOC,
  ]
    .filter(Boolean)
    .join(" - "),
  ITM_CTC_SALES_INCO: [
    headerDetails.ITM_CTC_SALES_INCO,
    headerDetails.ITM_CTC_SALES_INCO_LOC,
  ]
    .filter(Boolean)
    .join(" - "),
});

const REVIEW_SECTIONS = [
  {
    title: "Header",
    fields: [
      { key: "ITM_CTC_CLIENT", label: "Client" },
      { key: "ITM_CTC_CONTRACT_TYPE", label: "Contract Type" },
      { key: "ITM_CTC_PERSON", label: "Person Responsible" },
      { key: "ITM_CTC_DOC_DATE", label: "Document Date" },
      { key: "ITM_CTC_VAL_FROM", label: "Validity From" },
      { key: "ITM_CTC_VAL_TO", label: "Validity To" },
    ],
  },
  {
    title: "Parties & Validity",
    fields: [
      { key: "ITM_CTC_SUPPLIER", label: "Supplier Name" },
      { key: "ITM_CTC_CUST", label: "Customer (Sold-To Party)" },
      { key: "ITM_CTC_PURCH_ORG", label: "Purchasing Organization" },
      { key: "ITM_CTC_SALES_ORG", label: "Sales Organization" },
      { key: "ITM_CTC_PURCH_GRP", label: "Purchasing Group" },
      { key: "ITM_CTC_DIST_CH", label: "Distribution Channel" },
      { key: "ITM_CTC_REF_NO", label: "Our Reference" },
      { key: "ITM_CTC_COUNTER_PARTY_REF_NO", label: "Your Reference" },
    ],
  },
  {
    title: "Currency & Pricing",
    fields: [
      { key: "ITM_CTC_PURCH_CUR", label: "Purchasing Currency" },
      { key: "ITM_CTC_SALES_CUR", label: "Sales Currency" },
      { key: "ITM_CTC_SUP_ACC_NO", label: "Supplier Account No." },
      { key: "ITM_CTC_CUST_REF", label: "Customer Reference" },
      { key: "ITM_CTC_PURCH_INCO", label: "Purchase Incoterms" },
      { key: "ITM_CTC_SALES_INCO", label: "Sales Incoterms" },
      { key: "ITM_CTC_TERMS_OF_PAY", label: "Terms of Payment (Buy)" },
      { key: "ITM_CTC_TERMS_OF_PAY_SELL", label: "Terms of Payment (Sell)" },
    ],
  },
  {
    title: "Exchange Rate",
    fields: [
      { key: "ITM_CTC_EXC_RATE_TYPE", label: "Exchange Rate Type" },
      { key: "ITM_CTC_EXC_RATE_DATE", label: "Exchange Rate Date" },
      { key: "ITM_CTC_FIXED_EXC_RATE", label: "Fixed Exchange Rate" },
      { key: "ITM_CTC_NOTES", label: "Description / Notes" },
    ],
  },
];

const ITEM_COLUMNS = [
  { key: "material", label: "Material" },
  { key: "targetQuantity", label: "Target Quantity" },
  { key: "unit", label: "Unit" },
  { key: "buyPrice", label: "Buy Price" },
  { key: "sellPrice", label: "Sell Price" },
  { key: "netValue", label: "Net Value" },
];

const calcNetValue = (item) =>
  (Number(item.targetQuantity) || 0) * (Number(item.sellPrice) || 0);

const formatCurrency = (value) =>
  `€${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const sectionCardSx = {
  border: "1px solid #d9dee7",
  borderRadius: "6px",
  p: 2.5,
  mb: 2.5,
};

const accordionSx = {
  border: "1px solid #d9dee7",
  borderRadius: "6px",
  mb: 2.5,
  boxShadow: "none",
  "&:before": { display: "none" },
  "&.Mui-expanded": { margin: 0, marginBottom: "20px" },
};

export default function ReviewContractDetails({
  headerDetails = {},
  contractItems = [],
}) {
  const displayValues = buildDisplayValues(headerDetails);
  const netContractValue = contractItems.reduce(
    (sum, item) => sum + calcNetValue(item),
    0,
  );
  const tax = 0;
  const totalContractValue = netContractValue + tax;

  return (
    <Box>
      {REVIEW_SECTIONS.map((section) => (
        <Accordion
          key={section.title}
          defaultExpanded
          disableGutters
          sx={accordionSx}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: "#f2f6ff",
            }}
          >
            <Typography
              sx={{ fontSize: 15, fontWeight: 700, color: "#2f3136" }}
            >
              {section.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
                rowGap: 2,
                columnGap: 3,
              }}
            >
              {section.fields.map((field) => (
                <Box
                  key={field.key}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "#7b818f", mb: 0.5 }}>
                    {field.label}:
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 600, color: "#2f3136" }}
                  >
                    {displayValues[field.key] || "-"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={sectionCardSx}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: "#2f3136",
            mb: 2,
            textAlign: "left",
          }}
        >
          Contract Items
        </Typography>
        <TableContainer
          sx={{ border: "1px solid #d9dee7", borderRadius: "6px" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#9aa1ac" }}>
                <TableCell
                  sx={{ color: "#ffffff", fontWeight: 600, fontSize: 13 }}
                >
                  #
                </TableCell>
                {ITEM_COLUMNS.map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{ color: "#ffffff", fontWeight: 600, fontSize: 13 }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {contractItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={ITEM_COLUMNS.length + 1}
                    align="center"
                    sx={{ py: 3, color: "#7b818f" }}
                  >
                    No materials added
                  </TableCell>
                </TableRow>
              ) : (
                contractItems.map((item, index) => (
                  <TableRow key={item.id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.material || "-"}</TableCell>
                    <TableCell>
                      {Number(item.targetQuantity || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>{item.unit || "-"}</TableCell>
                    <TableCell>
                      {item.buyPrice
                        ? `$ ${Number(item.buyPrice).toFixed(2)}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.sellPrice ? `€ ${item.sellPrice}` : "-"}
                    </TableCell>
                    <TableCell>{formatCurrency(calcNetValue(item))}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={sectionCardSx}>
        {[
          {
            label: "Net Contract Value:",
            value: netContractValue,
            emphasize: false,
          },
          { label: "Tax:", value: tax, emphasize: false },
          {
            label: "Total Contract Value:",
            value: totalContractValue,
            emphasize: true,
          },
        ].map((row) => (
          <Box
            key={row.label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: row.emphasize ? 1 : 0.5,
              borderTop: row.emphasize ? "1px solid #e3e7ee" : "none",
              mt: row.emphasize ? 1 : 0,
            }}
          >
            <Typography
              sx={{
                fontSize: row.emphasize ? 14 : 13,
                fontWeight: row.emphasize ? 700 : 400,
                color: row.emphasize ? "#2f3136" : "#7b818f",
              }}
            >
              {row.label}
            </Typography>
            <Typography
              sx={{
                fontSize: row.emphasize ? 15 : 13,
                fontWeight: row.emphasize ? 700 : 600,
                color: row.emphasize ? "#23409a" : "#2f3136",
              }}
            >
              {headerDetails.ITM_CTC_SALES_CUR || "EUR"}{" "}
              {row.value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

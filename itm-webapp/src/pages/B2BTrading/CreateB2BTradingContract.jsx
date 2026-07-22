import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Typography,
  Divider,
  BottomNavigation,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ReusableTypography from "../../components/Common/ReusableTypography";
import CreateB2BTradingContract from "../../cw-generated-forms/CreateB2BTradingContract";
import CreateB2BTradingContract2 from "../../cw-generated-forms/CreateB2BTradingContract2";
import CreateB2BTradingContract3 from "../../cw-generated-forms/CreateB2BTradingContract3";
import CreateB2BTradingContract4 from "../../cw-generated-forms/CreateB2BTradingContract4";
import AddMaterial from "./AddMaterial";
import ReviewContractDetails from "./ReviewContractDetails";
import { ArrowBack } from "@cw/rds/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { dummyContractData } from "../../dummydatas/dummydata";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Converts a display-formatted date ("01/Jan/2024") back to ISO ("2024-01-01").
// Values already in another format (e.g. ISO) are passed through untouched.
const toISODate = (value) => {
  if (!value) return "";
  const match = /^(\d{2})\/([A-Za-z]{3})\/(\d{4})$/.exec(String(value).trim());
  if (!match) return value;
  const [, day, mon, year] = match;
  const monthIndex = MONTHS.indexOf(mon);
  if (monthIndex === -1) return value;
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${day}`;
};

// Maps the Contract Details page's shape back into the ITM_CTC_* fields the
// generated step forms expect, so "Edit" can reopen this wizard pre-filled.
// Fields the details page doesn't carry fall back to the default dummy header.
const buildHeaderDetailsFromContractData = (contractData) => {
  if (!contractData) return dummyContractData.headerDetails;
  const [incoCode = "", ...incoLocParts] = String(contractData.incoterms || "").split(" - ");
  const incoLoc = incoLocParts.join(" - ").trim();

  return {
    ...dummyContractData.headerDetails,
    ITM_CTC_SUPPLIER: contractData.supplier || dummyContractData.headerDetails.ITM_CTC_SUPPLIER,
    ITM_CTC_DOC_DATE: toISODate(contractData.documentDate) || dummyContractData.headerDetails.ITM_CTC_DOC_DATE,
    ITM_CTC_VAL_FROM: toISODate(contractData.validityFrom) || dummyContractData.headerDetails.ITM_CTC_VAL_FROM,
    ITM_CTC_VAL_TO: toISODate(contractData.validityTo) || dummyContractData.headerDetails.ITM_CTC_VAL_TO,
    ITM_CTC_PERSON: contractData.personResponsible || dummyContractData.headerDetails.ITM_CTC_PERSON,
    ITM_CTC_PURCH_ORG:
      contractData.purchasingOrganization || dummyContractData.headerDetails.ITM_CTC_PURCH_ORG,
    ITM_CTC_SALES_ORG:
      contractData.purchasingOrganization || dummyContractData.headerDetails.ITM_CTC_SALES_ORG,
    ITM_CTC_PURCH_CUR: contractData.currency || dummyContractData.headerDetails.ITM_CTC_PURCH_CUR,
    ITM_CTC_SALES_CUR: contractData.currency || dummyContractData.headerDetails.ITM_CTC_SALES_CUR,
    ITM_CTC_PURCH_INCO: incoCode.trim() || dummyContractData.headerDetails.ITM_CTC_PURCH_INCO,
    ITM_CTC_PURCH_INCO_LOC: incoLoc || dummyContractData.headerDetails.ITM_CTC_PURCH_INCO_LOC,
    ITM_CTC_SALES_INCO: incoCode.trim() || dummyContractData.headerDetails.ITM_CTC_SALES_INCO,
    ITM_CTC_SALES_INCO_LOC: incoLoc || dummyContractData.headerDetails.ITM_CTC_SALES_INCO_LOC,
    ITM_CTC_TERMS_OF_PAY: contractData.paymentTerms || dummyContractData.headerDetails.ITM_CTC_TERMS_OF_PAY,
    ITM_CTC_TERMS_OF_PAY_SELL:
      contractData.paymentTerms || dummyContractData.headerDetails.ITM_CTC_TERMS_OF_PAY_SELL,
    ITM_CTC_EXC_RATE_TYPE:
      contractData.exchangeRateType || dummyContractData.headerDetails.ITM_CTC_EXC_RATE_TYPE,
  };
};

const steps = [
  { label: "Header", number: 1 },
  { label: "Parties & Validity", number: 2 },
  { label: "Currency & Pricing", number: 3 },
  { label: "Exchange Rate", number: 4 },
  { label: "Items", number: 5 },
  { label: "Review & Submit", number: 6 },
];

const formPlaceholders = {
  Header: {
    title: "Header Form Section",
    description:
      "Add core contract identifiers and basic header details in this step.",
  },
  "Parties & Validity": {
    title: "Parties & Validity Form Section",
    description:
      "Capture client, responsible person, and date validity fields here.",
  },
  "Currency & Pricing": {
    title: "Currency & Pricing Form Section",
    description:
      "Configure transaction currency, rates, and pricing-related values.",
  },
  "Exchange Rate": {
    title: "Exchange Rate Form Section",
    description:
      "Define exchange rate source, type, and effective date details.",
  },
  Items: {
    title: "Items Form Section",
    description: "Specify the material items, quantities, and related details.",
  },
};

function StepNode({ step }) {
  if (step.state === "done") {
    return <CheckCircleOutlineIcon sx={{ color: "#2e7d32", fontSize: 28 }} />;
  }

  const isActive = step.state === "active";

  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        fontWeight: 600,
        border: isActive ? "none" : "1px solid #b0b7c3",
        backgroundColor: isActive ? "#2434c6" : "#ffffff",
        color: isActive ? "#ffffff" : "#8d98aa",
      }}
    >
      {step.number}
    </Box>
  );
}
export default function CreateB2BTradingContractPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const formRef = useRef(null);

  const editContractData = location.state?.editContractData;
  const isEditMode = Boolean(editContractData);
  const initialHeaderDetails = isEditMode
    ? buildHeaderDetailsFromContractData(editContractData)
    : dummyContractData.headerDetails;
  const initialContractItems = editContractData?.items?.length
    ? editContractData.items
    : dummyContractData.contractItems;

  const computedSteps = steps.map((step, index) => ({
    ...step,
    state:
      index < activeStep
        ? "done"
        : index === activeStep
          ? "active"
          : "upcoming",
  }));

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
      return;
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const activeStepLabel = steps[activeStep].label;
  const activePlaceholder = formPlaceholders[activeStepLabel];

  const stepContents = {
    Header: (formRef) => (
      <CreateB2BTradingContract
        ref={formRef}
        initialData={initialHeaderDetails}
        showFooter={true}
        showHeader={false}
        columns={4}
      />
    ),
    "Parties & Validity": (formRef) => (
      <CreateB2BTradingContract2
        ref={formRef}
        initialData={initialHeaderDetails}
        showFooter={false}
        showHeader={false}
        columns={4}
      />
    ),
    "Currency & Pricing": (formRef) => (
      <CreateB2BTradingContract3
        ref={formRef}
        initialData={initialHeaderDetails}
        showFooter={false}
        showHeader={false}
        columns={4}
      />
    ),
    "Exchange Rate": (formRef) => (
      <CreateB2BTradingContract4
        ref={formRef}
        initialData={initialHeaderDetails}
        showFooter={false}
        showHeader={false}
        columns={4}
      />
    ),
    Items: (formRef) => (
      <AddMaterial ref={formRef} initialItems={initialContractItems} />
    ),
    "Review & Submit": (formRef) => (
      <ReviewContractDetails
        headerDetails={initialHeaderDetails}
        contractItems={initialContractItems}
      />
    ),
  };
  const handleSubmit = () => {
    const data = formRef.current.getValues();
    console.log("Form submitted", data);
  };
  return (
    <Box className="outermost-container">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          mb: 1,
          gap: 2,
          py: 1,
        }}
      >
        <IconButton
          sx={{
            p: 0,
            "&:hover": { backgroundColor: "transparent" },
          }}
          onClick={() => {
            navigate(-1); // Navigate back to the previous page
          }}
        >
          <ArrowBack sx={{ color: "#7a8aa0", fontSize: 22 }} />
        </IconButton>
        <ReusableTypography
          sx={{ fontSize: 16, fontWeight: 700, color: "#2f3136" }}
        >
          {isEditMode
            ? "Edit Back to Back Trading Contract"
            : "New Back to Back Trading Contract"}
        </ReusableTypography>
        <ReusableTypography sx={{ fontSize: 16, color: "#7b818f" }}>
          -
        </ReusableTypography>
        <ReusableTypography
          sx={{ fontSize: 16, color: "#6c7484", fontWeight: 500 }}
        >
          {editContractData?.contractNumber || "BTBC-882-2024"}
        </ReusableTypography>
        <Chip
          label={isEditMode ? editContractData.status : "Draft"}
          size="small"
          sx={{
            ml: 0.5,
            fontWeight: 600,
            color: "#d47d24",
            backgroundColor: "#fbefdf",
          }}
        />
      </Box>

      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          borderBottom: "1px solid #e3e7ee",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
          }}
        >
          {computedSteps.map((step, index) => (
            <React.Fragment key={step.label}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  whiteSpace: "nowrap",
                }}
              >
                <StepNode step={step} />
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: step.state === "active" ? 600 : 500,
                    color:
                      step.state === "active"
                        ? "#2434c6"
                        : step.state === "done"
                          ? "#2f3136"
                          : "#a3adba",
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
              {index < steps.length - 1 && (
                <Divider
                  sx={{
                    minWidth: 90,
                    borderColor: "#d9dee7",
                    borderBottomWidth: "2px",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2.5,
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            minHeight: 360,
            border: "1px solid #d9dee7",
            borderRadius: "6px",
            backgroundColor: "#fafbfc",
            p: 2,
          }}
        >
          {stepContents[activeStepLabel](formRef)}
        </Box>
      </Box>
      <BottomNavigation
        sx={{
          flexShrink: 0,
          width: "100%",
          height: "auto",
          px: { xs: 2, sm: 3 },
          py: 1,
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: "#fff",
          borderTop: "1px solid #e3e7ee",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {activeStep > 0 && (
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{
                textTransform: "none",
                color: "#23409a",
                fontWeight: 600,
                px: 2.5,
              }}
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={
              activeStep === steps.length - 1 ? handleSubmit : handleNext
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#123db8",
              px: 3,
              "&:hover": { backgroundColor: "#0f35a1" },
            }}
          >
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </BottomNavigation>
    </Box>
  );
}

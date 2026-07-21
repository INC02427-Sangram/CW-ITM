import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ReusableTypography from "../../components/Common/ReusableTypography";
import CreateB2BTradingContract from "../../cw-generated-forms/CreateB2BTradingContract";
import CreateB2BTradingContract2 from "../../cw-generated-forms/CreateB2BTradingContract2";
import CreateB2BTradingContract3 from "../../cw-generated-forms/CreateB2BTradingContract3";
import CreateB2BTradingContract4 from "../../cw-generated-forms/CreateB2BTradingContract4";

const steps = [
  { label: "Header", number: 1 },
  { label: "Parties & Validity", number: 2 },
  { label: "Currency & Pricing", number: 3 },
  { label: "Exchange Rate", number: 4 },
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
export default function CreateB2BTradingContractPage({
  open,
  onClose,
  contractData,
  formRef,
  handleSubmit,
}) {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    if (open) {
      setActiveStep(0);
    }
  }, [open]);

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
        showFooter={true}
        showHeader={false}
      />
    ),
    "Parties & Validity": (formRef) => (
      <CreateB2BTradingContract2
        ref={formRef}
        showFooter={false}
        showHeader={false}
      />
    ),
    "Currency & Pricing": (formRef) => (
      <CreateB2BTradingContract3
        ref={formRef}
        showFooter={false}
        showHeader={false}
      />
    ),
    "Exchange Rate": (formRef) => (
      <CreateB2BTradingContract4
        ref={formRef}
        showFooter={false}
        showHeader={false}
      />
    ),
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"md"}>
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e3e7ee",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <InfoOutlinedIcon sx={{ color: "#7a8aa0", fontSize: 22 }} />
          <ReusableTypography
            sx={{ fontSize: 16, fontWeight: 700, color: "#2f3136" }}
          >
            New Back to Back Trading Contract
          </ReusableTypography>
          <ReusableTypography sx={{ fontSize: 16, color: "#7b818f" }}>
            -
          </ReusableTypography>
          <ReusableTypography
            sx={{ fontSize: 16, color: "#6c7484", fontWeight: 500 }}
          >
            BTBC-882-2024
          </ReusableTypography>
          <Chip
            label="Draft"
            size="small"
            sx={{
              ml: 0.5,
              fontWeight: 600,
              color: "#d47d24",
              backgroundColor: "#fbefdf",
            }}
          />
        </Box>
        <IconButton size="small" aria-label="close" onClick={onClose}>
          <CloseIcon sx={{ color: "#555b67" }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          borderBottom: "1px solid #e3e7ee",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            overflowX: "auto",
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

      <Box sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
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
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          borderTop: "1px solid #e3e7ee",
        }}
      >
        <Button
          variant="text"
          onClick={onClose}
          sx={{
            color: "#23409a",
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
          }}
        >
          Cancel
        </Button>

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
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
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
    </Dialog>
  );
}

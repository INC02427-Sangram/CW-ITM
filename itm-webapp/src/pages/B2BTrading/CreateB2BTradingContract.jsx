import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Chip,
  Dialog,
  IconButton,
  Divider,
  BottomNavigation,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ReusableTypography from "../../components/Common/ReusableTypography";
import AddMaterial from "./AddMaterial";
import ReviewContractDetails from "./ReviewContractDetails";
import { ArrowBack } from "@cw/rds/icons";
import { useLocation, useNavigate } from "react-router-dom";
import requestOptions from "../../utils/fnServices/requestOptions";
import { data } from "../../dummydatas/intitialDummy";
import { buildFormBuilderFromContractData } from "../../utils/contractHelpers";
import CTCB2BHeader from "../../cw-generated-forms/CTCB2BHeader";
import CTCB2BExchangeRate from "../../cw-generated-forms/CTCB2BExchangeRate";
import CTCB2BCustomerSupplier from "../../cw-generated-forms/CTCB2BCustomerSupplier";
import CTCB2BCurrencyPricing from "../../cw-generated-forms/CTCB2BCurrencyPricing";
import Button from "../../components/CommonMUI/CustomButton";
import {
  setHeaderDetails,
  setCurrentStep,
} from "../../redux/slices/backToBackSlice";

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
  const dispatch = useDispatch();

  const editContractData = location.state?.editContractData;
  const isEditMode = Boolean(editContractData);

  // Centralized form data state - stores all form values across steps
  const [formData, setFormData] = useState(() => {
    if (isEditMode) {
      return buildFormBuilderFromContractData(editContractData);
    }
    return {};
  });
  const contractHeaderDetails = useSelector(
    (state) => state.backToBack.contractForm.headerDetails,
  );
  const savedStateActiveStep = useSelector(
    (state) => state.backToBack.contractForm.currentStep,
  );

  // Contract items state
  const [contractItems, setContractItems] = useState(() => {
    return editContractData?.items?.length ? editContractData.items : [];
  });

  // adding a state [done, active, upcoming] to each step based on the current activeStep
  const computedSteps = steps.map((step, index) => ({
    ...step,
    state:
      index < activeStep
        ? "done"
        : index === activeStep
          ? "active"
          : "upcoming",
  }));

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      ...contractHeaderDetails,
    }));
    setActiveStep(savedStateActiveStep || 0);
  }, []);

  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [activeStep, formData, contractItems]);

  // Merges current form values into the formData state
  const mergeFormData = (newData) => {
    const updatedFormData = { ...formData, ...newData };
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
    console.log(updatedFormData, "updatedFormData");
    dispatch(setHeaderDetails(updatedFormData));
    dispatch(setCurrentStep(activeStep + 1));
  };

  const handleNext = () => {
    // Capture form data from current step before moving forward
    const data = formRef.current?.getValues ? formRef.current.getValues() : {};

    const success =
      activeStepLabel !== "Items" ? formRef.current.submit() : true;
    if (!success) {
      return; // Prevent moving to next step if validation fails
    }

    // For Items step, capture the items
    if (activeStepLabel === "Items" && formRef.current?.getItems) {
      const items = formRef.current.getItems();
      setContractItems(items);
    }

    if (formRef.current?.getValues) {
      const currentStepData = formRef.current.getValues();
      mergeFormData(currentStepData);
    }

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

  const headerFooterFalse = {
    showHeader: false,
    showFooter: false,
  };

  const stepContents = {
    Header: (formRef) => (
      <CTCB2BHeader
        ref={formRef}
        {...headerFooterFalse}
        initialData={formData}
        columns={4}
        requestOptions={requestOptions}
      />
    ),
    "Parties & Validity": (formRef) => (
      <CTCB2BCustomerSupplier
        ref={formRef}
        {...headerFooterFalse}
        initialData={formData}
        columns={4}
        requestOptions={requestOptions}
      />
    ),
    "Currency & Pricing": (formRef) => (
      <CTCB2BCurrencyPricing
        ref={formRef}
        {...headerFooterFalse}
        initialData={formData}
        columns={4}
        requestOptions={requestOptions}
      />
    ),
    "Exchange Rate": (formRef) => (
      <CTCB2BExchangeRate
        ref={formRef}
        {...headerFooterFalse}
        initialData={formData}
        columns={4}
        requestOptions={requestOptions}
      />
    ),
    Items: (formRef) => (
      <AddMaterial ref={formRef} initialItems={contractItems} />
    ),
    "Review & Submit": (formRef) => (
      <ReviewContractDetails
        headerDetails={formData}
        contractItems={contractItems}
      />
    ),
  };
  const handleSubmit = () => {
    // Capture any final data from Review step
    if (formRef.current?.getValues) {
      const finalStepData = formRef.current.getValues();
      mergeFormData(finalStepData);
    }

    // Prepare complete contract data for submission
    const completeContractData = {
      ...formData,
      items: contractItems,
    };
    // TODO: Add API call to submit the contract data
    // navigate to success page or back to list
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
            width: "100%",
          }}
        >
          {computedSteps.map((step, index) => (
            <React.Fragment key={step.label}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.25,
                  flex: 1,
                  whiteSpace: "nowrap",
                }}
              >
                <StepNode step={step} />
                <ReusableTypography
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
                </ReusableTypography>
              </Box>
              {index < steps.length - 1 && (
                <Divider
                  sx={{
                    flex: 1,
                    minWidth: 20,
                    maxWidth: 90,
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
          width: "calc(100% - 4dvw)",
          height: "auto",
          px: { xs: 2, sm: 3 },
          py: 1,
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: "#fff",
          borderTop: "1px solid #e3e7ee",
          position: "fixed",
          bottom: 0,
          right: 0,
          boxSizing: "border-box",
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
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={
              activeStep === steps.length - 1 ? handleSubmit : handleNext
            }
          >
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </BottomNavigation>
    </Box>
  );
}

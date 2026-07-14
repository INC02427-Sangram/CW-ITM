import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { HeaderControlButton as HeaderButton } from "../../UIComponents/Button";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { checkIsCSR } from "../../dataStore/userRoles";
import { useParams } from "react-router-dom";
import fnServiceRequest from "../../utility/fnServiceRequest";
import BusyIndicator from "../../utility/BusyIndicator";
import { useTheme } from "@mui/material/styles";
import { ButtonTypes } from "../../UIComponents/UITypes";
import { useGetCustomDetails } from "../../hooks/useGetCustomDetails";
import { useSaveAdditionalDetails } from "../../hooks/useSaveAdditionalDetails";
import { HeaderCard } from "../../UIComponents/HeaderCard";
import { CustomTextField } from "../../UIComponents/CustomTextField";
import { AppTypography } from "../../UIComponents/AppTypography";
import CustomDatePicker from "../../UIComponents/CustomDatePicker";
import { customDateTimeFormat } from "../../utility/CustomDateTimeFormat";
const AdditionalOrderInfo = ({
  onSave,
  readOnly = false,
  editMode = false,
  headerInfoEdited,
  setHeaderInfoEdited,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { orderHeaderId } = useParams();
  const toDayjs = (v) => (v ? dayjs(v) : null);  // accepts ISO or YYYY-MM-DD

  const gridResponsiveConfig = {
    xl: 2,
    lg: 2,
    md: 3,
    sm: 6,
    xs: 12,
  };

  // Redux selectors
  const headerInfo = useSelector((state) => state.appReducer.headerInfo);
  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const userRole = useSelector((state) => state.appReducer.userDetails.roles);

  // Use React Query hook for fetching custom details
  const {
    customDetails,
    isLoadingCustomDetails,
    customDetailsError,
    refetch: refetchCustomDetails
  } = useGetCustomDetails(orderHeaderId);

  // Use save hook for saving additional details
  const {
    saveAdditionalDetails,
    isSaving: saving,
    error: saveApiError,
    currentAdditionalDetails
  } = useSaveAdditionalDetails(orderHeaderId);

  // Local state
  const [localEditMode, setLocalEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState({});
  const [saveError, setSaveError] = useState(null);

  // Get custId from headerInfo or headerInfoEdited
  const custId = headerInfoEdited?.sapSoldToId || headerInfo?.sapSoldToId;
  const status = useSelector((state) => state.appReducer.status);
  const appSettings = useSelector((state) => state.appReducer.appSettings);
  // Audit logging function
  const fnSaveAudit = useCallback(
    (newValue, oldValue, columnName) => {
      const sUploadUrl = `/JavaServices_Oauth/api/audit/saveAudit`;
      const oPayload = {
        salesOrderHeader: { orderHeaderId: orderHeaderId },
        action: "Updated",
        entityName: "SalesOrderHeader",
        lastModifiedBy: userDetails?.email,
        lastModifiedDate: new Date().toISOString(),
        createdBy: userDetails?.firstName + " " + userDetails?.lastName,
        createdDate: new Date().toISOString(),
        oldValue: oldValue,
        newValue: newValue,
        remarks: `${columnName} Updated from ${oldValue || "-"} to ${newValue || "-"}`,
      };
      fnServiceRequest(
        sUploadUrl,
        "POST",
        (response) => {
          // Success handler for audit
          console.log("Audit log saved successfully");
        },
        (error) => {
          // Error handler for audit
          console.error("Error saving audit log:", error);
        },
        oPayload
      );
    },
    [orderHeaderId, userDetails]
  );

  // Merge headerInfo with API data
  const mergedData = {
    ...headerInfo,
    ...headerInfoEdited,
    poDate:
      headerInfoEdited?.poDate ?? customDetails?.poDate ?? headerInfo?.poDate,
    requestDeliveryDate:
      headerInfoEdited?.requestDeliveryDate ??
      customDetails?.requestDeliveryDate ??
      headerInfo?.requestDeliveryDate,
    carrierPartner:
      headerInfoEdited?.carrierPartner ??
      customDetails?.carrierPartner ??
      headerInfo?.carrierPartner,
    senderEmail:
      headerInfoEdited?.senderEmail ??
      customDetails?.senderEmail ??
      headerInfo?.senderEmail,
    receiverEmail:
      headerInfoEdited?.receiverEmail ??
      customDetails?.receiverEmail ??
      headerInfo?.receiverEmail,
    emailSubject:
      headerInfoEdited?.emailSubject ??
      customDetails?.emailSubject ??
      headerInfo?.emailSubject,
    deliveryNote:
      headerInfoEdited?.deliveryNote ??
      customDetails?.deliveryNote ??
      headerInfo?.deliveryNote,
    contactName:
      headerInfoEdited?.contactName ??
      customDetails?.contactName ??
      headerInfo?.contactName,
    contactNumber:
      headerInfoEdited?.contactNumber ??
      customDetails?.contactNumber ??
      headerInfo?.contactNumber,
    incoTerms1:
      headerInfoEdited?.incoTerms1 ??
      customDetails?.sapIncoTerms1 ??
      customDetails?.incoTerms ??
      headerInfo?.incoTerms1,
    shippingInstruction:
      customDetails?.shippingInstruction ||
      headerInfoEdited?.shippingInstruction ||
      headerInfo?.shippingInstruction,
  };

  // Initialize edited values when entering edit mode
  const handleEdit = () => {
    const poDate = mergedData?.poDate || "";
    const requestDeliveryDate = mergedData?.requestDeliveryDate || "";
    const rddBeforePoDate = !!(poDate && requestDeliveryDate && dayjs(requestDeliveryDate).isBefore(dayjs(poDate), "day"));
    setEditedValues({
      poDate,
      carrierPartner: mergedData?.carrierPartner || "",
      incoTerms1: mergedData?.incoTerms1 || "",
      senderEmail: mergedData?.senderEmail || "",
      receiverEmail: mergedData?.receiverEmail || "",
      emailSubject: mergedData?.emailSubject || "",
      deliveryNote: mergedData?.deliveryNote || "",
      contactNumber: mergedData?.contactNumber || "",
      contactName: mergedData?.contactName || "",
      requestDeliveryDate,
      shipDate: mergedData?.shipDate || "",
      shippingInstruction: mergedData?.shippingInstruction || "",
    });
    setFieldErrors((prev) => ({ ...prev, requestDeliveryDate: rddBeforePoDate }));
    setLocalEditMode(true);
    setSaveError(null);
  };

  const uploadSource = mergedData?.receiverEmail || mergedData?.emailSubject
    ? "Sent through Mail"
    : "Manually Uploaded";

  const toMMDDYYYY = (date) => {
    if (!date) return "";

    // Handles YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [yyyy, mm, dd] = date.split("-");
      return `${mm}${dd}${yyyy}`;
    }

    // Fallback for Date / timestamp
    const d = new Date(date);
    if (isNaN(d)) return "";

    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `${mm}${dd}${yyyy}`;
  };

  // Defining length of some fields
  const incoTerms1Length = 3;
  const shippingInstructionLength = 255;

  const [fieldErrors, setFieldErrors] = useState({
    incoTerms1: false,
    shippingInstruction: false,
    requestDeliveryDate: false,
  });

  // Handle field changes
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    if (name === "incoTerms1") {
      // Strip anything that isn't A-Z, then cap at 3 chars
      const upperValue = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);

      // Error only makes sense for partial (1-2 letter) entries now,
      // since upperValue can never exceed 3 chars
      const error =
        upperValue.length > 0 && upperValue.length < 3
          ? "Incoterm must be exactly 3 uppercase letters."
          : "";

      setFieldErrors((prev) => ({
        ...prev,
        incoTerms1: !!error,
      }));

      setEditedValues((prev) => ({
        ...prev,
        incoTerms1: upperValue,
      }));

      return;
    }

    const limits = {
      incoTerms1: incoTerms1Length,
      shippingInstruction: shippingInstructionLength,
    };

    if (limits[name]) {
      const maxLength = limits[name];

      // show error if user tries exceeding
      setFieldErrors((prev) => ({
        ...prev,
        [name]: value.length > maxLength,
      }));

      // store only allowed chars
      const trimmedValue = value.slice(0, maxLength);

      setEditedValues((prev) => ({
        ...prev,
        [name]: trimmedValue,
      }));

      return;
    }

    setEditedValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, [incoTerms1Length, shippingInstructionLength]);

  // Save changes with audit logging
  const handleSave = useCallback(async () => {
    // Validate requestDeliveryDate >= poDate before saving
    const poDateVal = editedValues.poDate || mergedData?.poDate;
    const rddVal = editedValues.requestDeliveryDate || mergedData?.requestDeliveryDate;
    if (poDateVal && rddVal && dayjs(rddVal).isBefore(dayjs(poDateVal), "day")) {
      setFieldErrors((prev) => ({ ...prev, requestDeliveryDate: true }));
      return;
    }

    try {
      // Prepare complete additionalDetails payload matching the structure from getOrderHeaderById
      const additionalDetailsPayload = {
        additionalDetailsId: customDetails?.additionalDetailsId || null,
        orderHeaderId: orderHeaderId,
        requestDeliveryDate: editedValues.requestDeliveryDate ?? customDetails?.requestDeliveryDate ?? null,
        poDate: editedValues.poDate ?? customDetails?.poDate ?? null,
        senderEmail: editedValues.senderEmail ?? customDetails?.senderEmail ?? "",
        receiverEmail: editedValues.receiverEmail ?? customDetails?.receiverEmail ?? "",
        emailSubject: editedValues.emailSubject ?? customDetails?.emailSubject ?? "",
        uploadSource: customDetails?.uploadSource || "Manually Uploaded",
        incoTerms: editedValues.incoTerms1 ?? customDetails?.incoTerms ?? "",
        shippingInstruction: editedValues.shippingInstruction ?? customDetails?.shippingInstruction ?? "",
        createdBy: customDetails?.createdBy || userDetails?.email || "",
        createdDate: customDetails?.createdDate || new Date().toISOString(),
        modifiedBy: userDetails?.email || "",
        modifiedDate: new Date().toISOString(),
      };

      // Call API to save using the new hook
      await saveAdditionalDetails(additionalDetailsPayload);

      // Update headerInfoEdited with the new values
      if (setHeaderInfoEdited) {
        setHeaderInfoEdited((prev) => ({
          ...prev,
          ...editedValues,
        }));
      }

      // Define fields to track for audit logging
      const fieldsToTrack = {
        poDate: "PO Date",
        requestDeliveryDate: "Request Delivery Date",
        carrierPartner: "Carrier Partner",
        senderEmail: "Sender Email",
        receiverEmail: "Receiver Email",
        emailSubject: "Email Subject",
        shippingInstruction: "Shipping Instruction",
        contactNumber: "Contact Number",
        contactName: "Contact Name",
        incoTerms1: "Incoterm 1",
      };

      // Compare all tracked fields and log changes
      Object.keys(fieldsToTrack).forEach((field) => {
        const oldValue = mergedData[field] || "";
        const newValue = editedValues[field] || "";

        // Only log if values are different
        if (oldValue !== newValue) {
          fnSaveAudit(newValue, oldValue, fieldsToTrack[field]);
        }
      });

      // Call parent onSave if provided
      if (onSave) {
        onSave(editedValues);
      }

      setLocalEditMode(false);
      setSaveError(null);

      // No need to refetch - Redux is already updated by the hook
    } catch (error) {
      console.error("Error saving additional details:", error);
      setSaveError(error?.message || "Error saving additional details. Please try again.");
      // Data is NOT updated in Redux on failure (rollback handled by hook)
    }
  }, [
    editedValues,
    onSave,
    setHeaderInfoEdited,
    saveAdditionalDetails,
    fnSaveAudit,
    mergedData,
    customDetails,
    orderHeaderId,
    userDetails,
  ]);

  // Cancel changes
  const handleCancel = useCallback(() => {
    setEditedValues({});
    setLocalEditMode(false);
    setSaveError(null);
    setFieldErrors({ incoTerms1: false, shippingInstruction: false, requestDeliveryDate: false });
  }, []);

  // Determine if we should show edit mode (either local edit mode or parent edit mode)
  const isEditMode = localEditMode || editMode;

  const isCSR = checkIsCSR(userRole);
  const isPendingApproval = status === "pendingForApproval";
  const isRejected = status === "rejected";
  const isRestricted = (isCSR && isPendingApproval) || (!isCSR && isRejected);
  const showEditButton = (status === "toBeReviewed" || status === "pendingForApproval" || status === "rejected") && !isRestricted;

  // Style definitions for consistent labels
  const headerLabelSx = {
    color: theme.palette.text.primary,
    fontWeight: 600,
  };



  return (
    <HeaderCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 500,
              color: theme.palette.text.primary,
              fontSize: '1.1rem'
            }}
          >
            {t("Additional Order Information")}
          </Typography>
          {!readOnly && !editMode && (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {localEditMode ? (
                <>
                  <HeaderButton
                    action={ButtonTypes.CLEAR}
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={isLoadingCustomDetails || saving}
                  >
                    {t("Cancel")}
                  </HeaderButton>
                  <HeaderButton
                    action={ButtonTypes.SAVE}
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={isLoadingCustomDetails || saving || fieldErrors.requestDeliveryDate || fieldErrors.incoTerms1}
                  >
                    {saving ? t("Saving...") : t("Save")}
                  </HeaderButton>

                </>
              ) : (
                <HeaderButton
                  style={{
                    display: showEditButton ? "inline-flex" : "none",
                  }}
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  disabled={isLoadingCustomDetails}
                  action={ButtonTypes.EDIT}
                >
                  {t("Edit")}
                </HeaderButton>
              )}
            </Box>
          )}

        </Box>

        <Divider sx={{ mb: 2 }} />

        {customDetailsError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 1.5,
              border: "1px solid #f44336",
            }}
          >
            {customDetailsError?.message || "Error fetching custom details. Please try again."}
            <HeaderButton
              action={ButtonTypes.CLEAR}
              size="small"
              onClick={refetchCustomDetails}
              sx={{ ml: 1 }}
              disabled={isLoadingCustomDetails}
            >
              {t("Retry")}
            </HeaderButton>
          </Alert>
        )}

        {saveError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 1.5,
              border: "1px solid #f44336",
            }}
          >
            {saveError}
          </Alert>
        )}

        {isLoadingCustomDetails && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {t("Loading...")}
            </Typography>
          </Box>
        )}

        {saving && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {t("Saving...")}
            </Typography>
          </Box>
        )}

        <Grid container spacing={2} wrap="wrap">
          <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Request Delivery Date")}
              </Typography>
              {isEditMode ? (
                <>
                  <CustomDatePicker
                    format={appSettings?.dateFormat || "MM/DD/YYYY"}
                    value={editedValues.requestDeliveryDate ? dayjs(editedValues.requestDeliveryDate) : null}
                    onChange={(v) => {
                      const newRdd = v ? v.format("YYYY-MM-DD") : "";
                      const poDateVal = editedValues.poDate || mergedData?.poDate;
                      const isInvalid = !!(poDateVal && newRdd && dayjs(newRdd).isBefore(dayjs(poDateVal), "day"));
                      setFieldErrors((prev) => ({ ...prev, requestDeliveryDate: isInvalid }));
                      setEditedValues((prev) => ({ ...prev, requestDeliveryDate: newRdd }));
                    }}
                    placeholder={t("Request Delivery Date")}
                  />
                  {fieldErrors.requestDeliveryDate && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                      {t("Request Delivery Date cannot be before PO Date")}
                    </Typography>
                  )}
                </>
              ) : (
                <AppTypography value={customDateTimeFormat(appSettings, mergedData?.requestDeliveryDate, "YYYY-MM-DD")} />
              )}
            </Box>
          </Grid>

          <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("PO Date")}
              </Typography>
              {isEditMode ? (
                <CustomDatePicker
                  format={appSettings?.dateFormat || "MM/DD/YYYY"}
                  value={editedValues.poDate ? dayjs(editedValues.poDate) : null}
                  onChange={(v) => {
                    const newPoDate = v ? v.format("YYYY-MM-DD") : "";
                    const rddVal = editedValues.requestDeliveryDate || mergedData?.requestDeliveryDate;
                    const isInvalid = newPoDate && rddVal && dayjs(rddVal).isBefore(dayjs(newPoDate), "day");
                    setFieldErrors((prev) => ({ ...prev, requestDeliveryDate: !!isInvalid }));
                    setEditedValues((prev) => ({ ...prev, poDate: newPoDate }));
                  }}
                  placeholder={t("PO Date")}
                />
              ) : (
                <AppTypography value={customDateTimeFormat(appSettings, mergedData?.poDate, "YYYY-MM-DD")} />
              )}
            </Box>
          </Grid>

          <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Sender Email")}
              </Typography>
              {isEditMode ? (
                <CustomTextField
                  type="email"
                  name="senderEmail"
                  disabled={true}
                  value={editedValues.senderEmail || ""}
                  placeholder={t("Sender Email")}
                  onChange={handleChange}
                />
              ) : (
                <AppTypography value={mergedData?.senderEmail} />
              )}
            </Box>
          </Grid>

          <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Receiver Email")}
              </Typography>
              {isEditMode ? (
                <CustomTextField
                  type="email"
                  name="receiverEmail"
                  disabled={true}
                  value={editedValues.receiverEmail || ""}
                  placeholder={t("Receiver Email")}
                  onChange={handleChange}
                />
              ) : (
                <AppTypography value={mergedData?.receiverEmail} />
              )}
            </Box>
          </Grid>

          <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Email Subject")}
              </Typography>
              {isEditMode ? (
                <CustomTextField
                  disabled={true}
                  name="emailSubject"
                  value={editedValues.emailSubject || ""}
                  placeholder={t("Email Subject")}
                  onChange={handleChange}
                />
              ) : (
                <AppTypography value={mergedData?.emailSubject} />
              )}
            </Box>
          </Grid>

          <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Upload Source")}
              </Typography>

              <AppTypography
                variant="body2"
                className="unedited-mode"
                sx={{
                  backgroundColor:
                    uploadSource === "Sent through Mail"
                      ? "#e6f4ea !important"   // soft green
                      : "#fff4e5 !important",  // soft orange

                  border:
                    uploadSource === "Sent through Mail"
                      ? "1px solid #a5d6a7 !important"
                      : "1px solid #ffcc80 !important",

                  color:
                    uploadSource === "Sent through Mail"
                      ? "#1b5e20 !important"
                      : "#e65100 !important",
                }}
              >
                {uploadSource}
              </AppTypography>

            </Box>
          </Grid>

          {/* <Grid className="grid-item-flex grid-item-small" item xs={2}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Carrier Partner")}
              </Typography>
              {isEditMode ? (
                <CustomTextField
                  name="carrierPartner"
                  value={editedValues.carrierPartner || ""}
                  placeholder={t("Carrier Partner")}
                  onChange={handleChange}
                />
              ) : (
                <AppTypography value={mergedData?.carrierPartner} />
              )}
            </Box>
          </Grid> */}

          <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Incoterm 1")}
              </Typography>
              {isEditMode ? (
                <CustomTextField
                  name="incoTerms1"
                  value={editedValues?.incoTerms1 || ""}
                  placeholder={t("Incoterm")}
                  onChange={handleChange}
                  onBlur={() => {
                    const current = editedValues?.incoTerms1 || "";
                    if (current.length > 0 && current.length < 3) {
                      // Incomplete entry left on blur — clear it and reset error
                      setEditedValues((prev) => ({ ...prev, incoTerms1: "" }));
                      setFieldErrors((prev) => ({ ...prev, incoTerms1: false }));
                    }
                  }}
                  error={fieldErrors.incoTerms1}
                  helperText={
                    fieldErrors.incoTerms1
                      ? t("Incoterm must be 3 characters or less")
                      : ""
                  }
                />
              ) : (
                <AppTypography value={mergedData?.incoTerms1} />
              )}
            </Box>
          </Grid>
          {/* <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Contact Name")}
              </Typography>
              {isEditMode ? (
                <CustomTextField
                  name="contactName"
                  value={editedValues.contactName || ""}
                  placeholder={t("Contact Name")}
                  onChange={handleChange}
                />
              ) : (
                <AppTypography value={mergedData?.contactName} />
              )}
            </Box>
          </Grid>
          <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Contact Number")}
              </Typography>
              {isEditMode ? (
                <CustomTextField
                  name="contactNumber"
                  value={editedValues.contactNumber || ""}
                  placeholder={t("Contact Number")}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, "");
                    handleChange({ target: { name: "contactNumber", value: clean } });
                  }}
                  onKeyDown={(e) => {
                    const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
                    if (e.ctrlKey || e.metaKey) return;
                    if (/^\d$/.test(e.key)) return;
                    if (allowed.includes(e.key)) return;
                    e.preventDefault();
                  }}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 15,
                  }}
                />
              ) : (
                <AppTypography value={mergedData?.contactNumber} />
              )}
            </Box>
          </Grid> */}
          {/* <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Delivery Note")}
              </Typography>
              {isEditMode ? (
                <CustomTextField
                  fullWidth
                  multiline
                  rows={2}
                  name="deliveryNote"
                  value={editedValues.deliveryNote || ""}
                  placeholder={t("Delivery Note")}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root.MuiInputBase-multiline": {
                      padding: "8px 14px",
                    },
                    "& .MuiOutlinedInput-input.MuiInputBase-inputMultiline": {
                      padding: 0,
                    },
                  }}
                />
              ) : (
                <AppTypography value={mergedData?.deliveryNote} />
              )}
            </Box>
          </Grid> */}
          <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Shipping Instruction")}
              </Typography>
              {isEditMode ? (
                <CustomTextField
                  fullWidth
                  multiline
                  rows={2}
                  name="shippingInstruction"
                  value={editedValues.shippingInstruction || ""}
                  placeholder={t("Shipping Instruction")}
                  onChange={handleChange}
                  error={fieldErrors.shippingInstruction}
                  helperText={
                    fieldErrors.shippingInstruction
                      ? t("Shipping Instruction must be 255 characters or less")
                      : ""
                  }
                />
              ) : (
                <AppTypography
                  value={mergedData?.shippingInstruction} />
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </HeaderCard>
  );
};

export default AdditionalOrderInfo;

import {
  Alert,
  Box,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "@mui/material/styles";
import {
  BarReportFilled,
  Card as CardIcon,
  CircleCheckbox,
  CircleInfo,
  CommentFilled,
  TriangleAlert,
} from "@cw/rds/icons";
import BusyIndicator from "../../../utility/BusyIndicator";
import CustomTable from "../../../utility/Custom Components/CustomTable";
import CustomDeletePopover from "../../../utility/Custom Components/CustomDeletePopover";
import { getOrderBlockColumns } from "../adminTableConfigs";
import { useOrderBlockManager } from "./useOrderBlockManager";
import { CustomTextField } from "../../../UIComponents/CustomTextField";
import { HeaderCard } from "../../../UIComponents/HeaderCard";
import { AdminControlButton as AdminButton } from "../../../UIComponents/Button";
import { ButtonTypes } from "../../../UIComponents/UITypes";
import { useMultipleCursorPositions } from "../../../hooks/useCursorPosition";
import CustomSelect from "../../../UIComponents/CustomSelect";
import { useTranslation } from "react-i18next";

const fieldLabelSx = (theme) => ({
  mb: 1,
  fontWeight: "500",
  color: theme.palette.text.primary,
  fontSize: "14px",
  fontFamily: "'Roboto', sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

const getFieldLabel = (field) => {
  if (field === "orderBlock") return "Block Number";
  if (field === "priority") return "Priority";
  return "Description";
};

const getToastIcon = (type) => {
  switch (type) {
    case "success":
      return <CircleCheckbox />;
    case "error":
      return <ErrorIcon />;
    case "warning":
      return <TriangleAlert />;
    default:
      return <CircleInfo />;
  }
};

const gridResponsiveConfig = {
  country: {
    xs: 12,
    sm: 4,
    md: 4,
    lg: 2,
  },
  block: {
    xs: 12,
    sm: 4,
    md: 4,
    lg: 2,
  },
  priority: {
    xs: 12,
    sm: 4,
    md: 4,
    lg: 2
  },
  desc: {
    xs: 12,
    sm: 8,
    md: 6,
    lg: 4
  },
  action: {
    xs: 12,
    sm: 4,
    md: 3,
    lg: 2
  }
}

const OrderBlock = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { getInputRef, createCursorHandler, restoreCursorPositions } = useMultipleCursorPositions();
  
  const {
    formData,
    errors,
    rows,
    filteredOrderBlocks,
    editingRowId,
    editingData,
    editingErrors,
    deleteDialog,
    paginationModel,
    isLoading,
    isSubmitting,
    isDeleting,
    isFormValid,
    hasFormValues,
    searchTerm,
    toastMessage,
    setPaginationModel,
    setSearchTerm,
    closeToast,
    handleFormChange,
    clearForm,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSave,
    handleCancelEdit,
    handleDeleteClick,
    closeDeleteDialog,
    handleDeleteConfirm,
    org,
  } = useOrderBlockManager();

  // Restore cursor positions after formData updates
  useEffect(() => {
    restoreCursorPositions();
  }, [formData, restoreCursorPositions]);

  const columns = getOrderBlockColumns(
    null,
    editingRowId,
    editingData,
    editingErrors,
    handleEditChange,
    handleEdit,
    handleSave,
    handleCancelEdit,
    handleDeleteClick
  );
  const handleCountryChange = (event) => {
    org.handleCountryChange(event);
  };
  return (
    <>
      {isLoading && <BusyIndicator />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "20px",
          marginRight: "20px",
          paddingTop: "24px",
        }}
      >
        <HeaderCard>
          <CardContent>
            <Box sx={{ marginBottom: "14px" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "500",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "16px !important",
                }}
              >
                Set New Order Block
              </Typography>
            </Box>

            <Grid container
              spacing={{ xs: 2, sm: 3 }}
              alignItems="end"
              height="fit-content">
              <Grid item {...gridResponsiveConfig.block}>
                <Typography variant="subtitle2" sx={fieldLabelSx(theme)}>
                  <CardIcon size="small" />
                  Country
                </Typography>
                <FormControl fullWidth>
                  <CustomSelect
                    value={org.country}
                    onChange={handleCountryChange}
                    placeholder={t("Select Country")}
                    options={org?.countries?.map((c) => ({ key: c.countryId, value: c.countryName }))}
                  />
                </FormControl>
              </Grid>
              <Grid item {...gridResponsiveConfig.block}>
                <Typography variant="subtitle2" sx={fieldLabelSx(theme)}>
                  <CardIcon size="small" />
                  Block Number
                </Typography>
                <Tooltip
                  title="Valid numbers allowed: 1-99 only"
                  placement="top-start"
                  arrow
                >
                <CustomTextField
                  inputRef={getInputRef('orderBlock')}
                  size="small"
                  value={formData.orderBlock}
                  onChange={createCursorHandler('orderBlock', handleFormChange)}
                  error={Boolean(errors.orderBlock)}
                  placeholder="Enter Block Number"
                  fullWidth
                  inputProps={{ maxLength: 2 }}
                />
                </Tooltip>
              </Grid>

              <Grid item {...gridResponsiveConfig.priority}>
                <Typography variant="subtitle2" sx={fieldLabelSx(theme)}>
                  <BarReportFilled size="small" />
                  Priority
                </Typography>
                <Tooltip
                  title="Valid numbers allowed: 1-99 only"
                  placement="top-start"
                  arrow
                >
                <CustomTextField
                  inputRef={getInputRef('priority')}
                  size="small"
                  value={formData.priority}
                  onChange={createCursorHandler('priority', handleFormChange)}
                  error={Boolean(errors.priority)}
                  placeholder="Enter Priority"
                  fullWidth
                  inputProps={{ maxLength: 2 }}
                />
                </Tooltip>
              </Grid>

              <Grid item {...gridResponsiveConfig.desc}>
                <Typography variant="subtitle2" sx={fieldLabelSx(theme)}>
                  <CommentFilled size="small" />
                  Description
                </Typography>
                <Tooltip
                  title={
                    (formData.orderBlockDesc || "").length >= 255
                      ? "Maximum 255 characters allowed"
                      : "Minimum 3 characters required"
                  }
                  placement="top-start"
                  arrow
                >
                  <CustomTextField
                    inputRef={getInputRef('orderBlockDesc')}
                    size="small"
                    value={formData.orderBlockDesc}
                    onChange={createCursorHandler('orderBlockDesc', handleFormChange)}
                    error={Boolean(errors.orderBlockDesc)}
                    placeholder="Briefly describe this order block..."
                    fullWidth
                    rows={1}
                    inputProps={{ maxLength: 255 }}
                  />
                </Tooltip>
              </Grid>

              <Grid item {...gridResponsiveConfig.action} sx={{ display: "flex", marginLeft: "auto", justifyContent: "flex-end", marginLeft: "auto" }}>

                <Tooltip title="Save Order Block">
                  <span>
                    <AdminButton
                      action={ButtonTypes.SAVE}
                      onClick={handleSubmit}
                      disabled={!isFormValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Creating...
                        </>
                      ) : (
                        "Save"
                      )}
                    </AdminButton>
                  </span>
                </Tooltip>

                <Tooltip title="Clear Fields">
                  <span>
                    <AdminButton
                      action={ButtonTypes.CLEAR}
                      onClick={clearForm}
                      disabled={!hasFormValues}
                    >
                      Clear
                    </AdminButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>

            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: "12px" }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Please fix the following errors:
                  </Typography>
                  {Object.entries(errors).map(([field, error]) => (
                    <Typography key={field} variant="body2" sx={{ ml: 2, mb: 0.5 }}>
                      - <strong>{getFieldLabel(field)}</strong>: {error}
                    </Typography>
                  ))}
                </Box>
              </Alert>
            )}
          </CardContent>
        </HeaderCard>

        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 1 }}>
          <CustomTextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            sx={{
              width: { xs: "100%", sm: 220 },
              "& .MuiOutlinedInput-root": {
                fontSize: "14px",
                height: 36,
              },
            }}
            InputProps={{ autoComplete: "off" }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 400,
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Typography color="text.secondary" variant="h6">
                  Loading order blocks...
                </Typography>
              </Stack>
            </Box>
          ) : filteredOrderBlocks.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 400,
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <CircleInfo sx={{ fontSize: 48, color: "#9ca3af" }} />
                <Typography color="text.secondary" variant="h6">
                  {searchTerm ? "No matching order blocks found" : "No order blocks yet"}
                </Typography>
                <Typography color="text.secondary">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Create your first order block to get started"}
                </Typography>
              </Stack>
            </Box>
          ) : (
            <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", width: "100%" }}>
              <CustomTable
                rows={rows}
                Headercolumns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode="client"
                rowCount={rows.length}
              />
            </Box>
          )}
        </Paper>

        <CustomDeletePopover
          open={deleteDialog.open}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteConfirm}
          title="Confirm Deletion"
          message="Are you sure you want to delete this order block?"
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          itemName={`Order Block: ${deleteDialog.orderBlock}`}
          itemDescription={`Description: ${deleteDialog.description} | Priority: ${deleteDialog.priority || "N/A"
            }`}
          showItemDetails
          disabled={isDeleting}
          loading={isDeleting}
        />

        <Snackbar
          open={toastMessage.open}
          autoHideDuration={4000}
          onClose={closeToast}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={toastMessage.type}
            icon={getToastIcon(toastMessage.type)}
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {toastMessage.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default OrderBlock;

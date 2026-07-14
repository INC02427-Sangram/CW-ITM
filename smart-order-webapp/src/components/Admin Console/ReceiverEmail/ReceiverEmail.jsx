import { useState, useMemo, useEffect } from "react";
import {
  Box,
  CardContent,
  Tooltip,
  FormControl,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  Paper,
  Typography,
  Stack,
  Button,
  Alert,
} from "@cw/rds";
import { useTranslation } from "react-i18next";
import { setMessageToastForAdminConsole } from "../../../redux/reducers/appReducer";
import BusyIndicator from "../../../utility/BusyIndicator";
import useDebouncedSearch from "../../../hooks/useDebouncedSearch";
import useOrgHierarchy from "../../../hooks/useOrgHierarchy";
import useFormValidation from "../../../hooks/useFormValidation";
import { AdminControlButton as AdminButton } from "../../../UIComponents/Button";
import { useDispatch } from "react-redux";
import CustomTable from "../../../utility/Custom Components/CustomTable";
import { getReceiverEmailColumns } from "../adminTableConfigs";
import CustomDeletePopover from "../../../utility/Custom Components/CustomDeletePopover";
import { useQuery } from "@tanstack/react-query";
import { CustomTextField } from "../../../UIComponents/CustomTextField";
import CustomSelect from "../../../UIComponents/CustomSelect";
import { HeaderCard } from "../../../UIComponents/HeaderCard";
import { ButtonTypes } from "../../../UIComponents/UITypes";
import {
  addReceiverEmail,
  deleteReceiverEmail,
  getReceiverEmails,
} from "./schedulerService";
import {
  buildReceiverEmailPayload,
  filterReceiverEmails,
  getReceiverEmailDeleteDescription,
  getReceiverEmailStats,
  hasReceiverEmailFormValues,
  isDuplicateEmail,
  isReceiverEmailSaveDisabled,
  mapReceiverEmailRows,
  validateEmail,
} from "./schedulerUtils";
import CustomIcon from "../../../UIComponents/CustomIcon";

const gridResponsiveConfig = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
};

const ReceiverEmail = () => {
  const { t } = useTranslation();

  const theme = useTheme();

  const [inputValue, setInputValue] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [busyIndicatorFlag, setBusyIndicatorFlag] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
  page: 0,
  pageSize: 10,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    email: null,
  });
  const dispatch = useDispatch();

  // Org Hierarchy: Country → Sales Org
  const org = useOrgHierarchy({
    depth: 2,
    countrySelectBy: "name",
    reduxHelpers: { dispatch, setBusy: setBusyIndicatorFlag },
  });

  // Debounced search
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebouncedSearch();

  // Form validation
  const { formErrors, setError, clearError, clearAllErrors, checkDuplicate,hasErrors, revalidate } = useFormValidation(["emailError"]);

  const {
    data: sampleData = [],
    isPending: isEmailLoading,
    refetch: refetchEmailList,
  } = useQuery({
    queryKey: ['emails'], // works like useState for data, loading and error states
    queryFn: getReceiverEmails, // works like useEffect for fetching data
    gcTime: 5 * 60 * 1000, // Garbage collection time for the query cache (5 minutes)
    staleTime: 0, // Cache time for the query data (10 minutes)
    refetchInterval: 1 * 60 * 1000, // Refetch data every 10 minutes
  });

  const stats = getReceiverEmailStats(sampleData);

  const kpis = [
    {
      title: "Total Recipients",
      count: stats.total,
      icon: <CustomIcon iconName="Mail" library="rds" iconColor="var(--primary-main)" />,
      color: theme.palette.text.secondary,
    },
    {
      title: "Active Recipients",
      count: stats.active,
      icon: <CustomIcon iconName="CircleCheckbox" library="rds" iconColor="var(--success-main)" />,
      color: theme.palette.text.secondary,
    },
    {
      title: "Inactive Recipients",
      count: stats.inactive,
      icon: <CustomIcon iconName="CircleOff" library="rds" iconColor="var(--error-main)"/>,
      color: theme.palette.text.secondary,
    },
  ];

  // Countries are fetched automatically by useOrgHierarchy

  const handleInputChange = (event) => {
   const value = event.target.value;
   const trimmedValue = value.trim();
   setInputValue(value);
   const isValid =
   value.length === 0 || validateEmail(trimmedValue);
    setIsEmailValid(isValid);
    // Clear previous errors
    // Clear only email related error
    clearError("emailError");
    if (!isValid && value.length > 0) {
      setError("emailError", "Invalid email");
    } else {
      if (isDuplicateEmail(sampleData, trimmedValue)) {
        setError("emailError", "This Mail Box Address already exists");
      }
    }
  };

  const handleCountryChange = (event) => {
    org.handleCountryChange(event);
  };

  const handleSalesOrgChange = (event) => {
    org.handleSalesOrgChange(event);
  };

  const handleSubmit = () => {
    const selectedCountry = org.getSelectedCountryObj();

    const oPayload = buildReceiverEmailPayload({
      emailId: inputValue,
      selectedCountry,
      salesOrg: org.salesOrg,
    });

    setBusyIndicatorFlag(true);

    addReceiverEmail(
      oPayload,
      () => {
        refetchEmailList().finally(() => setBusyIndicatorFlag(false));
        handleClear();

        dispatch(
          setMessageToastForAdminConsole({
            visiblity: true,
            message: "Receiver's Email added successfully",
            type: "success",
          })
        );
      },
      (error) => {
        console.error("Error:", error);
        setBusyIndicatorFlag(false);
        dispatch(
          setMessageToastForAdminConsole({
            visiblity: true,
            message: "Duplicate mail box address",
            type: "error",
          })
        );
      },
    );
  };

  const handleClear = () => {
    setInputValue("");
    org.resetAll();
    setIsEmailValid(true);
    clearAllErrors();
  };

  const handleDeleteClick = (emailId) => {
    const email = sampleData.find((row) => row.emailId === emailId);
    if (email) {
      setDeleteDialog({ open: true, email });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog.email) return;

    setBusyIndicatorFlag(true);

    deleteReceiverEmail(
      deleteDialog.email.emailId,
      () => {
        refetchEmailList().finally(() => setBusyIndicatorFlag(false));
        dispatch(
          setMessageToastForAdminConsole({
            visiblity: true,
            message: "Receiver's Email deleted successfully",
            type: "success",
          })
        );
        setDeleteDialog({ open: false, email: null });
      },
      (error) => {
        console.error("Error:", error);
        setBusyIndicatorFlag(false);
        dispatch(
          setMessageToastForAdminConsole({
            visiblity: true,
            message: "Error deleting email",
            type: "error",
          })
        );
        setDeleteDialog({ open: false, email: null });
      }
    );
  };

  const filteredRows = useMemo(
    () => filterReceiverEmails(sampleData, debouncedSearchTerm),
    [debouncedSearchTerm, sampleData]
  );

  const rows = useMemo(() => mapReceiverEmailRows(filteredRows), [filteredRows]);

  useEffect(() => {
 if (
  formErrors.emailError ===
  "This Mail Box Address already exists"
) {
  const duplicateExists = isDuplicateEmail(sampleData, inputValue);

  if (!duplicateExists) {
    clearError("emailError");
  }
}

}, [
  sampleData,
  inputValue,
  org.country,
  org.salesOrg,
  formErrors.emailError,
  clearError,
]);

  const GRID_HEADER = 50;
  const GRID_ROW_HEIGHT = 44;
  const GRID_FOOTER = 56;
  const GRID_MAX_HEIGHT = GRID_HEADER + GRID_ROW_HEIGHT * 5 + GRID_FOOTER;
  const GRID_ROWS_AREA_HEIGHT = GRID_ROW_HEIGHT * 5;

  return (
    <>
      {(isEmailLoading || busyIndicatorFlag) && <BusyIndicator />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: "24px",
          paddingTop: "24px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        {/* Summary Cards */}
        <HeaderCard>
          <Box
            sx={{
              backgroundColor: theme.palette.background.default,
              width: "100%",

              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "500",
                color: theme.palette.text.primary,
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "16px !important",
              }}
            >
              Recipient Summary
            </Typography>
            {/* <Divider sx={{ borderColor: 'var(--divider-secondary)' }} /> */}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              paddingTop="0.5rem"
            >
              {kpis.map((kpi) => (
                <Paper
                  key={kpi.title}
                  sx={{
                  padding: "0.55rem 0.75rem",
                  borderRadius: "0.45rem",
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.palette.background.paper,
                  flex: 1,
                  minHeight: "64px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                >
                  <Stack spacing={0.15} alignItems="flex-start">
                    {kpi.icon}
                    <Typography variant="body2" sx={{ color: kpi.color, fontSize: "12px", lineHeight: 1.2 }}>
                      {kpi.title}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h6"
                     sx={{
                    color: theme.palette.text.primary,
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                  >
                    {kpi.count}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </HeaderCard>
        <HeaderCard>
          <CardContent sx={{ backgroundColor: theme.palette.background.default }}>
            <Box sx={{ marginBottom: "14px", }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "500",
                  color: theme.palette.text.primary,
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "16px !important",
                }}
              >
                Add New Email Recipient
              </Typography>
            </Box>

            <Grid
               container
              spacing={{ xs: 2, sm: 3 }}
              alignItems="end"
              height="fit-content"
            // height="fit-content"
            >
              <Grid item {...gridResponsiveConfig}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: theme.palette.text.primary,
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <CustomIcon iconName="Mail" library="rds" size="small" />
                  {t("Receiver's Email")}
                </Typography>
                <CustomTextField
                  placeholder={t("Add Mail Box Address")}
                  value={inputValue}
                  onChange={handleInputChange}
                  error={!isEmailValid}
                  fullWidth
                />
              </Grid>

              <Grid item {...gridResponsiveConfig}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    marginBottom: "8px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    color: theme.palette.text.primary,
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  <CustomIcon
                    iconName="Public"
                    library="mui"
                    size="small"
                    sx={{
                      fontSize: "16px",
                      marginRight: "4px",
                      verticalAlign: "middle",
                    }}
                  />
                  {t("Country")}
                </Typography>
                <FormControl fullWidth>
                  <CustomSelect
                    value={org.country}
                    onChange={handleCountryChange}
                    placeholder="Select a Country"
                    options={org?.countries?.map((country) => ({ key: country.countryName, value: country.countryName }))}
                  >
                  </CustomSelect>
                </FormControl>
              </Grid>

              <Grid item {...gridResponsiveConfig}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    marginBottom: "8px",
                    fontWeight: "500",
                    alignItems: "center",
                    display: "flex",
                    color: theme.palette.text.primary,
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  <CustomIcon
                    iconName="Business"
                    library="mui"
                    size="small"
                    sx={{
                      fontSize: "16px",
                      marginRight: "4px",
                      verticalAlign: "middle",
                    }}
                  />
                  Sales Organization
                </Typography>
                <FormControl fullWidth>
                  <CustomSelect
                    value={org.salesOrg}
                    onChange={handleSalesOrgChange}
                    disabled={!org.country}
                    placeholder="Select Sales Organization"
                    options={org?.salesOrgOptions.map((salesOrg) => ({ key: salesOrg, value: salesOrg }))}
                  />
                </FormControl>
              </Grid>

              <Grid item {...gridResponsiveConfig} sx={{ display: "flex", alignSelf: "flex-end", position: "relative",marginLeft: "auto", justifyContent: "flex-end" }}>

                <Tooltip title="Save Email">
                  <span>
                    <AdminButton
                      action={ButtonTypes.SAVE}
                      onClick={handleSubmit}
                      disabled={isReceiverEmailSaveDisabled({
                        isEmailValid,
                        email: inputValue,
                        country: org.country,
                        salesOrg: org.salesOrg,
                        formErrors,
                      })}
                    >
                      Save
                    </AdminButton>
                  </span>
                </Tooltip>

                <Tooltip title="Clear Fields">
                  <span>
                    <AdminButton
                      action={ButtonTypes.CLEAR}
                      onClick={handleClear}
                      disabled={!hasReceiverEmailFormValues({
                        email: inputValue,
                        country: org.country,
                        salesOrg: org.salesOrg,
                        distributionChannel: org.distributionChannel,
                        division: org.division,
                      })}
                    >
                      {t("Clear")}
                    </AdminButton>
                  </span>
                </Tooltip>
              </Grid>
              {formErrors.emailError && (
                <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                  Please fix the issue:
                  <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                    {formErrors.emailError && <li>{formErrors.emailError}</li>}
                  </ul>
                </Alert>
              )}
            </Grid>
          </CardContent>
        </HeaderCard>


        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            mb: 1,
          }}
        >
          <CustomTextField
            placeholder={t("Search…")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 220 },
            }}
            InputProps={{
              startAdornment: <CustomIcon iconName="SearchStatus" library="rds" />,
            }}
          />
        </Box>


        {/* Email Recipients Table */}
        <Box
          sx={{
            height: `${GRID_MAX_HEIGHT}px`,
            overflow: "hidden",
            marginBottom: "16px",

            "& .MuiDataGrid-root": { height: "100%" },
            "& .MuiDataGrid-main": { height: "100%" },

            "& .MuiDataGrid-virtualScroller": {
              height: `${GRID_ROWS_AREA_HEIGHT}px`,
              overflowY: "auto",
            },

            "& .MuiDataGrid-columnHeaders": {
              position: "sticky",
              top: 0,
              zIndex: 2,
            },

            "& .MuiDataGrid-footerContainer": {
              position: "sticky",
              bottom: 0,
              zIndex: 2,
              backgroundColor: "background.paper",
              "&::after": {
                content: '""',
                position: "absolute",
                backgroundColor: "background.paper",
                pointerEvents: "none",
              },
            },
          }}
        >
          <CustomTable
            rows={rows}
            Headercolumns={getReceiverEmailColumns(t, handleDeleteClick)}
            fixedRowHeight={GRID_ROW_HEIGHT}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={rows.length}
            paginationMode="client"
          />

          {sampleData?.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                padding: "48px 24px",
                color: "#6b7280",
                backgroundColor: theme.palette.background.default,
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                marginTop: "16px",
              }}
            >
              <CustomIcon
                iconName="Mail"
                library="rds"
                sx={{
                  fontSize: "48px",
                  color: "#d1d5db",
                  marginBottom: "16px",
                }}
              />
 
              <Typography
                variant="h6"
                sx={{ marginBottom: "8px", color: "#9ca3af" }}
              >
                No Email Recipients Found
              </Typography>
              <Typography variant="body2">
                Add your first email recipient using the form above
              </Typography>
            </Box>
          )}
        </Box>
      </Box >

      {/* Delete Confirmation Dialog */}
      < CustomDeletePopover
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, email: null })}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this email recipient?"
        confirmText="Delete"
        cancelText="Cancel"
        itemName={`Mail Box Address:${deleteDialog.email?.emailId}`}
        itemDescription={getReceiverEmailDeleteDescription(deleteDialog.email)}
        showItemDetails={true}
        fieldLabel="Email ID"
      />
    </>
  );
};

export default ReceiverEmail;

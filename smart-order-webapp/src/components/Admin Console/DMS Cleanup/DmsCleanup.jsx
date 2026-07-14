import { useState, useEffect, useMemo, useCallback } from "react";
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
} from "@cw/rds";
import { useTranslation } from "react-i18next";
import BusyIndicator from "../../../utility/BusyIndicator";
import { setMessageToastForAdminConsole } from "../../../redux/reducers/appReducer";
import useDebouncedSearch from "../../../hooks/useDebouncedSearch";
import useOrgHierarchy from "../../../hooks/useOrgHierarchy";
import useFormValidation from "../../../hooks/useFormValidation";
import { useDispatch } from "react-redux";
import CustomTable from "../../../utility/Custom Components/CustomTable";
import { getDmsColumns } from "../adminTableConfigs";
import CustomDeletePopover from "../../../utility/Custom Components/CustomDeletePopover";
import { CustomTextField } from "../../../UIComponents/CustomTextField";
import CustomSelect from "../../../UIComponents/CustomSelect";
import { HeaderCard } from "../../../UIComponents/HeaderCard";
import { AdminControlButton as AdminButton } from "../../../UIComponents/Button";
import { ButtonTypes } from "../../../UIComponents/UITypes";
import {
  addDmsSchedule,
  deleteDmsSchedule,
  getDmsSchedules,
  updateDmsSchedule,
} from "./dmsCleanupService";
import {
  DAYS_OF_WEEK,
  buildDmsSchedulePayload,
  filterDmsSchedules,
  getCountryCode,
  getCountryTimezones,
  getTimezoneLabel,
  hasScheduleChanges,
  mapDmsSchedules,
  prepareDraftFromRow,
} from "./dmsCleanupUtils";
import CustomIcon from "../../../UIComponents/CustomIcon";

const gridResponsiveConfig = {
  xs: 12,
  sm: 6,
  md: 4,
  lg: 3,
}

const DmsCleanup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const showToast = (message, type = "success") => {
    dispatch(
      setMessageToastForAdminConsole({ visiblity: true, message, type })
    );
  };

  const theme = useTheme();

  // Org hierarchy: Country → Sales Org
  const org = useOrgHierarchy({ depth: 2, countrySelectBy: "id" });

  const { searchTerm, setSearchTerm } = useDebouncedSearch();

  // Form validation (combinationError = duplicate, timeError = invalid time)
  const { formErrors, setError, clearError, clearAllErrors, checkDuplicate, hasErrors,revalidate, } = useFormValidation(["combinationError", "timeError"]);
  
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [busyIndicatorFlag, setBusyIndicatorFlag] = useState(false);
  const [clockTime, setClockTime] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState("");
  const [timezone, setTimezone] = useState("");
  const [timezones, setTimezones] = useState([]);
  const [sampleData, setSampleData] = useState([]);
  const [editingTimezones, setEditingTimezones] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const refreshSchedules = useCallback(
    (onSuccess, onError) => {
      getDmsSchedules(
        (response) => {
          const mappedSchedules = mapDmsSchedules(response?.data, org.countries);
          setSampleData(mappedSchedules);
          onSuccess?.(mappedSchedules);
        },
        onError
      );
    },
    [org.countries]
  );

  const filteredSampleData = useMemo(
    () => filterDmsSchedules(sampleData, searchTerm),
    [sampleData, searchTerm]
  );
  const handleCountryChange = (event) => {
    org.handleCountryChange(event);
    clearAllErrors();
    setTimezone("");
    setTimezones([]);

    const selectedId = event.target.value;
    const selectedCountryObj = org.countries.find((c) => c.countryId === selectedId);
    setTimezones(getCountryTimezones(selectedCountryObj?.countryCode));
  };

  const [editRowIndex, setEditRowIndex] = useState(null);
  const [rowDraft, setRowDraft] = useState({});

  const startEdit = (index) => {
    setEditRowIndex(index);
    const row = sampleData[index] || {};
    const draft = prepareDraftFromRow(row);

    setRowDraft(draft);
    clearAllErrors();
    setEditingTimezones(
      getCountryTimezones(getCountryCode(org.countries, row.country))
    );
  };

  const updateDraft = (field, value) => {
    setRowDraft((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = (index) => {
    const originalRow = sampleData[index];

    if (!hasScheduleChanges(originalRow, rowDraft)) {
      showToast("No changes made", "info");
      setEditRowIndex(null);
      setRowDraft({});
      return;
    }

    setBusyIndicatorFlag(true);
    const payload = buildDmsSchedulePayload({
      countryCode: getCountryCode(org.countries, rowDraft.country),
      time: rowDraft.time,
      timezone: rowDraft.timezone,
      weekDay: rowDraft.weekDay,
      dataRetentionPeriod: rowDraft.dataRetentionPeriod,
    });

    updateDmsSchedule(
      payload,
      () => {
        refreshSchedules(
          () => {
            setEditRowIndex(null);
            setRowDraft({});
            setBusyIndicatorFlag(false);
            showToast("DMS schedule updated successfully", "success");
          },
          (errorMessage) => {
            console.error("Failed to fetch DMS schedules:", errorMessage);
            setEditRowIndex(null);
            setRowDraft({});
            setBusyIndicatorFlag(false);
            showToast("Failed to modify DMS schedule", "error");
          }
        );
      },
      (errorMessage) => {
        console.error("Failed to modify DMS schedule:", errorMessage);
        setBusyIndicatorFlag(false);
        showToast("Failed to modify DMS schedule", "error");
      }
    );
  };

  const cancelEdit = () => {
    setEditRowIndex(null);
    setRowDraft({});
    clearAllErrors(); // Clear errors when canceling edit
  };

  const handleSubmit = () => {
    setBusyIndicatorFlag(true);
    const selectedCountryObj = org.getSelectedCountryObj();
    const payload = buildDmsSchedulePayload({
      countryCode: selectedCountryObj?.countryCode || org.country || "",
      time: clockTime,
      timezone,
      weekDay: weekDay,
      dataRetentionPeriod,
      normalizeWeekDay: false,
    });

    addDmsSchedule(
      payload,
      (res) => {
        if(res?.status?.toLowerCase() !== "failed"){
        org.resetAll();
        setClockTime("");
        setWeekDay("");
        setTimezone("");
        setTimezones([]);
        clearAllErrors();
        setDataRetentionPeriod("");

        refreshSchedules(
          () => {
            setBusyIndicatorFlag(false);
            showToast("DMS schedule added successfully", "success");
          },
          (errorMessage) => {
            console.error("Failed to fetch DMS schedules:", errorMessage);
            setBusyIndicatorFlag(false);
            showToast("Failed to add DMS schedule", "error");
          }
        );
      } else {
        setBusyIndicatorFlag(false);
        showToast(res?.message || "Failed to add DMS schedule", "error");
      }
      },
      (errorMessage) => {
        console.error("Failed to save DMS configuration:", errorMessage);
        setBusyIndicatorFlag(false);
        showToast("Failed to add DMS schedule", "error");
      }
    );
  };

  const handleDelete = (originalIndex) => {
    // Look up the item using its true original index
    const row = sampleData[originalIndex];
    if (!row) return;

    setItemToDelete(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    const row = itemToDelete;
    const countryCode = getCountryCode(org.countries, row.country);
    setBusyIndicatorFlag(true);

    deleteDmsSchedule(
      countryCode,
      () => {
        refreshSchedules(
          () => {
            setBusyIndicatorFlag(false);
            showToast("DMS schedule deleted successfully", "success");
            setDeleteDialogOpen(false);
            setItemToDelete(null);
          },
          (errorMessage) => {
            console.error("Failed to fetch DMS schedules:", errorMessage);
            setBusyIndicatorFlag(false);
            showToast("Failed to delete DMS schedule", "error");
            setDeleteDialogOpen(false);
            setItemToDelete(null);
          }
        );
      },
      (errorMessage) => {
        console.error("Failed to delete DMS schedule:", errorMessage);
        setBusyIndicatorFlag(false);
        showToast("Failed to delete DMS schedule", "error");
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    );
  };

  const rows = filteredSampleData;
  const rowsWithIndex = rows;

  // Fetch existing schedules once countries are loaded (for name mapping)
  useEffect(() => {
    if (org.countries && org.countries.length > 0) {
      setBusyIndicatorFlag(true);
      refreshSchedules(
        () => {
          setBusyIndicatorFlag(false);
        },
        (errorMessage) => {
          console.error("Failed to fetch DMS schedules:", errorMessage);
          setBusyIndicatorFlag(false);
        }
      );
    }
  }, [org.countries, refreshSchedules]);

  useEffect(() => {
  if (org.country) {
    checkDuplicate(
      sampleData,
      {
        country: org.getSelectedCountryName(),
      },
      `A DMS schedule already exists for Country "${org.getSelectedCountryName()}"`
    );
  } else {
    clearError("combinationError");
  }
}, [
  sampleData,
  org.country,
  checkDuplicate,
  clearError,
]);

  // Start editing on row click in the table
  const handleRowClick = (event, columns, tableRows, rowIndex) => {
    startEdit(rowIndex);
  };

console.log(rowsWithIndex, "///////")
  return (
    <>
      {busyIndicatorFlag && <BusyIndicator />}
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
        <HeaderCard>
          <CardContent>
            <Box sx={{ marginBottom: "14px" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "16px !important",
                }}
              >
                Add New DMS
              </Typography>
            </Box>

            <Grid
              container
              spacing={{ xs: 2, sm: 3 }}
              alignItems="end"
              height="fit-content">
              {/* Country Selector */}
              <Grid item {...gridResponsiveConfig}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: theme.palette.text.primary,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  <CustomIcon
                    iconName="Public"
                    library="mui"
                  />
                  {t("Country")}
                </Typography>
                <FormControl fullWidth>
                  <CustomSelect
                    value={org.country}
                    onChange={handleCountryChange}
                    placeholder="Select a Country"
                    options={org?.countries?.map((country) => ({ key: country.countryId, value: country.countryName }))}
                  >
                  </CustomSelect>
                </FormControl>
              </Grid>

              {/* Clock Picker (Time Input) */}
              <Grid item {...gridResponsiveConfig}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    marginBottom: "8px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    display: "flex",              // Flex container
                    alignItems: "center",         // Vertically center content
                    gap: "4px",                   // Space between icon and text
                  }}
                >
                  <CustomIcon
                    iconName="Clock"
                    library="rds"
                  />
                  {t("Time")}
                </Typography>

                <Tooltip
                  title={formErrors.timeError || ""}
                  open={!!formErrors.timeError}
                  arrow
                  placement="top"
                >
                  <span>
                  <CustomTextField
                    type="number"
                    value={clockTime}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (val >= 0 && val <= 23) {
                      setClockTime(String(val));
                        clearError("timeError");
                      } else if (e.target.value === "") {
                        setClockTime("");
                        clearError("timeError");
                      } else {
                        setError("timeError", "Please enter a valid hour between 0 and 23");
                      }
                    }}
                    inputProps={{ min: 0, max: 23, step: 1, inputMode: "numeric", pattern: "[0-9]*" }}
                    onWheel={(e) => e.currentTarget.blur()}
                    onBlur={() => clearError("timeError")}
                    error={!!formErrors.timeError}
                    placeholder="Hour (0-23)"
                  />
                  </span>
                </Tooltip>
              </Grid>

              {/* Day Selector */}
              <Grid item {...gridResponsiveConfig}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    marginBottom: "8px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    display: "flex",              // Flex container
                    alignItems: "center",         // Vertically center content
                    gap: "4px",                   // Space between icon and text
                  }}
                >
                  <CustomIcon
                    iconName="Calendar"
                    library="rds"
                    /> 
                    Day
                </Typography>
                <FormControl fullWidth>
                  <CustomSelect
                    value={weekDay}
                    onChange={(e) => setWeekDay(e.target.value)}
                    placeholder="Select Day"
                    options={DAYS_OF_WEEK.map((d, i) => ({ key: d, value: d }))}
                  />
                </FormControl>
              </Grid>

              {/* Data Retention Period Selector */}
              <Grid item {...gridResponsiveConfig}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    marginBottom: "8px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    display: "flex",              // Flex container
                    alignItems: "center",         // Vertically center content
                    gap: "4px",                   // Space between icon and text
                  }}
                >
                  <CustomIcon
                    iconName="Retention"
                    library="rds"
                  />
                  {t("Data Retention Period")}
                </Typography>
                <Tooltip
                  title={formErrors.dataRetentionPeriodError || ""}
                  open={!!formErrors.dataRetentionPeriodError}
                  arrow
                  placement="top"
                >
                  <span>
                <CustomTextField
                    type="number"
                    value={dataRetentionPeriod}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (val >= 1 && val <= 12) {
                        setDataRetentionPeriod(String(val));
                        clearError("dataRetentionPeriodError");
                      } else if (e.target.value === "") {
                        setDataRetentionPeriod("");
                        clearError("dataRetentionPeriodError");
                      } else {
                        setError("dataRetentionPeriodError", "Please enter a valid month between 1 and 12");
                      }
                    }}
                    inputProps={{ min: 1, max: 12, step: 1, inputMode: "numeric", pattern: "[0-9]*" }}
                    onWheel={(e) => e.currentTarget.blur()}
                    onBlur={() => clearError("dataRetentionPeriodError")}
                    error={!!formErrors.dataRetentionPeriodError}
                    placeholder="Months (1-12)"
                  />
                   </span>
                </Tooltip>
              </Grid>

              {/* Time Zone Selector */}
              <Grid item {...gridResponsiveConfig}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    marginBottom: "8px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    display: "flex",              // Flex container
                    alignItems: "center",         // Vertically center content
                    gap: "4px",                   // Space between icon and text
                  }}
                >
                  <CustomIcon
                    iconName="MapIcon"
                    library="rds"
                  />
                  {t("Time Zone")}
                </Typography>
                <FormControl fullWidth>
                  <CustomSelect
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="Select Time Zone"
                    disabled={!timezones.length}
                    options={timezones.map((tz, i) => ({ key: tz, value: getTimezoneLabel(tz) }))}
                  />
                </FormControl>
              </Grid>

              {/* Buttons */}
              <Grid item {...gridResponsiveConfig} sx={{ display: "flex", marginLeft: "auto", justifyContent: "flex-end",marginLeft: "auto" }}>
                <Tooltip title="Save">
                  <span>
                    <AdminButton
                      action={ButtonTypes.SAVE}
                      onClick={handleSubmit}
                      disabled={
                        !org.country ||
                        !clockTime ||
                        !weekDay ||
                        !timezone ||
                        !dataRetentionPeriod ||
                        hasErrors
                      }
                    >
                      Save
                    </AdminButton>
                  </span>
                </Tooltip>

                <Tooltip title="Clear Fields">
                  <span>
                    <AdminButton
                      action={ButtonTypes.CLEAR}
                      onClick={() => {
                        org.resetAll();
                        setClockTime("");
                        setWeekDay("");
                        setTimezone("");
                        setTimezones([]);
                        clearAllErrors();
                        setDataRetentionPeriod("");
                      }}
                      disabled={
                        !org.country &&
                        !clockTime &&
                        !weekDay &&
                        !timezone &&
                        !dataRetentionPeriod
                      }
                    >
                      {t("Clear")}
                    </AdminButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>

            {/* Error Display */}
            {(formErrors.combinationError || formErrors.timeError || formErrors.dataRetentionPeriodError) && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#ffebee",
                  borderRadius: "10px",
                }}
              >
                {formErrors.combinationError && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: formErrors.timeError ? 1 : 0,
                    }}
                  >
                    <CustomIcon iconName="Error" library="mui" sx={{ fontSize: 16 }} />
                    {formErrors.combinationError}
                  </Typography>
                )}
                {formErrors.timeError && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {formErrors.combinationError ? (
                      <Box sx={{ width: 16, height: 16 }} />
                    ) : (
                      <CustomIcon iconName="Error" library="mui" sx={{ fontSize: 16 }} />
                    )}
                    {formErrors.timeError}
                  </Typography>
                )}
                {formErrors.dataRetentionPeriodError && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {formErrors.combinationError || formErrors.timeError ? (
                      <Box sx={{ width: 16, height: 16 }} />
                    ) : (
                      <CustomIcon iconName="Error" library="mui" sx={{ fontSize: 16 }} />
                    )}
                    {formErrors.dataRetentionPeriodError}
                  </Typography>
                )}
              </Box>
            )}
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
          />
        </Box>

        {/* DMS Table Section with Fixed Height and Scroll */}
        <Paper
          elevation={0}
          sx={{
            //borderRadius: "12px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {sampleData?.length === 0 && !busyIndicatorFlag ? (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                backgroundColor: theme.palette.background.paper || '#ffffff',
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              <CustomIcon
                iconName="ActivityLog"
                library="rds"
                size="large"
                sx={{ fontSize: 64, color: "action.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No DMS Cleanup Schedules Found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Configure your DMS cleanup schedules to get started
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflow: "auto",
                width: "100%",
              }}
            >
              <CustomTable
                rows={rowsWithIndex}
                Headercolumns={getDmsColumns(
                  t,
                  editRowIndex,
                  rowDraft,
                  sampleData,
                  updateDraft,
                  startEdit,
                  saveEdit,
                  cancelEdit,
                  handleDelete,
                  editingTimezones
                )}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowCount={rows.length}
                paginationMode="client"
                fnRowClickHandler={handleRowClick}
              />
            </Box>
          )}
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <CustomDeletePopover
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this DMS schedule?"
        confirmText="Delete"
        cancelText="Cancel"
        itemName={
          "DMS Clean Up"
        }
        itemDescription={`Country: ${itemToDelete?.country} | Time: ${itemToDelete?.time} | Day: ${itemToDelete?.weekDay} | Timezone: ${itemToDelete?.timezone} | Data Retention Period: ${itemToDelete?.dataRetentionPeriod}`} showItemDetails={true}
      />
    </>
  );
};

export default DmsCleanup;

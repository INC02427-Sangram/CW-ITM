import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Card,
    CardContent,
    Tooltip,
    Select,
    FormControl,
    MenuItem,
    Alert,
    TextField,
} from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";
import { styled, useTheme } from "@mui/material/styles";
import moment from "moment-timezone";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Grid, Paper, Typography, Stack } from "@cw/rds";
import { Clock, MapIcon } from "@cw/rds/icons";

import BusyIndicator from "../../utility/BusyIndicator";
import fnServiceRequest from "../../utility/fnServiceRequest";
import { setMessageToastForAdminConsole } from "../../redux/reducers/appReducer";
import CustomTable from "../../utility/Custom Components/CustomTable";
import CustomDeletePopover from "../../utility/Custom Components/CustomDeletePopover";
import { getHanaSyncColumns } from "./adminTableConfigs";
import useDebouncedSearch from "../../hooks/useDebouncedSearch";
import useOrgHierarchy from "../../hooks/useOrgHierarchy";
import useFormValidation from "../../hooks/useFormValidation";
import { CustomTextField } from "../../UIComponents/CustomTextField";
import CustomSelect from "../../UIComponents/CustomSelect";
import { HeaderCard } from "../../UIComponents/HeaderCard";
import { AdminControlButton as AdminButton } from "../../UIComponents/Button";
import { ButtonTypes } from "../../UIComponents/UITypes";

import ErrorIcon from "@mui/icons-material/Error";
import PublicIcon from "@mui/icons-material/Public";
import BusinessIcon from "@mui/icons-material/Business";
import AltRouteIcon from '@mui/icons-material/AltRoute';

const StyledFormCard = styled(Card)(({ theme }) => ({
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e8e8e8",
    marginBottom: "14px",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    borderRadius: "10px",
    height: 38,
    // backgroundColor: theme.palette.background.default,
    "& .MuiOutlinedInput-notchedOutline": {
        borderRadius: "10px"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.light,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3026B9",
        borderWidth: "2px",
    },
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        height: 38,
        transition: "all 0.2s ease",
        "&:hover": {
            // backgroundColor: "#fafafa",
        },
        "&.Mui-focused": {
            backgroundColor: "theme.palette.background.default",
            "& fieldset": {
                borderColor: "#3026B9",
                borderWidth: "2px",
            },
        },
    },
}));

const gridResponsiveConfig = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 2,
    xl: 2,
};

const HanaSyncUp = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    const showToast = (message, type = "success") => {
        dispatch(setMessageToastForAdminConsole({ visiblity: true, message, type }));
    };

    // Org hierarchy: Country
    const org = useOrgHierarchy({ depth: 1, countrySelectBy: "id" });

    // Search
    const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebouncedSearch();

    // Form validation
    const { formErrors, setError, clearError, clearAllErrors, checkDuplicate, validateRequired, hasErrors, revalidate, } = useFormValidation(["validationError", "combinationError", "timeError",]);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    // Form State (fields not managed by org hierarchy)
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [timezone, setTimeZone] = useState("");

    // Options State (not managed by org hierarchy)
    const [timeZoneOptions, setTimeZoneOptions] = useState([]);

    // Table & General State
    const [tableData, setTableData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [rowDraft, setRowDraft] = useState({});
    const [editingTimezones, setEditingTimezones] = useState([]);
    const [busyIndicatorFlag, setBusyIndicatorFlag] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const fetchSchedules = () => {
        setBusyIndicatorFlag(true);

        const handleSuccess = (res) => {
            if (!res?.data || !Array.isArray(res.data)) {
                console.error("Unexpected response format:", res);
                showToast(t("Unexpected data format received from the server"), "error");
                setBusyIndicatorFlag(false);
                return;
            }

            const formattedData = res.data.map((item, idx) => ({
                syncConfigId: item.syncConfigId,
                countryCode: item.countryCode,
                country: item.countryName,
                hour: String(item.hour),
                minute: String(item.minute).padStart(2, '0'),
                timezone: item.timeZone,
                status: item.status
            }));

            setTableData(formattedData);
            setBusyIndicatorFlag(false);
        };

        const handleError = (errorMessage) => {
            console.error("API error:", errorMessage);
            showToast(t("Failed to getSync Configs"), "error");
            setBusyIndicatorFlag(false);
        };

        fnServiceRequest(
            "/JavaServices_Oauth1/api/v1/sync/getAllSyncConfigs",
            "GET",
            handleSuccess,
            handleError
        );
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    useEffect(() => {
        if (
            org.country
        ) {
            checkDuplicate(
                tableData,
                {
                    country: org.getSelectedCountryName(),
                },
                t("This schedule combination already exists.")
            );
        } else {
            clearError("combinationError");
        }
    }, [
        tableData,
        org.country,
        checkDuplicate,
        clearError,
        t,
    ]);

    // Filter rows based on search term
    const filteredRows = useMemo(() => {
        let dataWithOriginalIndex = (tableData || []).map((row, idx) => ({
            ...row,
            originalIndex: idx,
        }));
        // let filtered = tableData || [];
        let filtered = dataWithOriginalIndex;

        if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
            const term = debouncedSearchTerm.trim().toLowerCase();

            // Check if searching for active/inactive status
            if (term === "active" || term === "inactive") {
                filtered = filtered.filter((row) => {
                    const isActive = row?.status;
                    if (term === "active") return isActive;
                    if (term === "inactive") return !isActive;
                    return true;
                });
            } else {
                // Regular text search
                filtered = filtered.filter((row) => {
                    const haystack = [
                        row.country,
                        row.timezone,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    return haystack.includes(term);
                });
            }
        }

        return filtered;
    }, [debouncedSearchTerm, tableData]);

    const handleCountryChange = (event) => {
        org.handleCountryChange(event);
        clearAllErrors();
        setTimeZone("");
        setTimeZoneOptions([]);

        const selectedId = event.target.value;
        const selectedCountryObj = org.countries.find(c => c.countryId === selectedId);
        if (selectedCountryObj) {
            const code = selectedCountryObj.countryCode;
            setTimeZoneOptions(moment.tz.zonesForCountry(code) || []);
        }
    };

    const handleDistributionChannelChange = (event) => {
        org.handleDistributionChannelChange(event);
    };

    const clearForm = () => {
        org.resetAll();
        setHour("");
        setMinute("");
        setTimeZone("");
        setTimeZoneOptions([]);
        clearAllErrors();
    };

    const validateForm = () => {
        let isValid = true;

        const reqValid = validateRequired(
            { country: org.country, hour, minute, timezone },
            "Please fill in all required fields"
        );
        if (!reqValid) isValid = false;

        const isDuplicate = checkDuplicate(
            tableData,
            { country: org.getSelectedCountryName() },
            t("This schedule combination already exists.")
        );
        if (isDuplicate) isValid = false;

        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setBusyIndicatorFlag(true);
        const selectedCountryObj = org.getSelectedCountryObj();
        const payload = {
            country: selectedCountryObj.countryCode,
            hour: Number(hour),
            minute: Number(minute),
            timeZone: timezone,
        };

        console.log(payload);

        const handleSuccess = (res) => {
            setTableData(prev => [...prev, {
                ...payload,
                syncConfigId: Date.now(), // Temporary ID until API provides one
                country: selectedCountryObj.countryName,
                timezone: payload.timeZone,
                hour: String(payload.hour),
                minute: String(payload.minute).padStart(2, '0'),
            }]);
            showToast(t("Schedule added successfully!"), "success");
            clearForm();
            setBusyIndicatorFlag(false);
        };

        const handleError = (error) => {
            console.error("Failed to add sync config:", error);
            showToast(t("Failed to add schedule"), "error");
            setBusyIndicatorFlag(false);
        };

        fnServiceRequest(
            "/JavaServices_Oauth1/api/v1/sync/addSyncConfig",
            "POST",
            handleSuccess,
            handleError,
            payload,
        );
    };

    const startEdit = (index) => {
        const rowData = tableData[index];
        setEditRowIndex(index);
        setRowDraft({ ...rowData });
        if (rowData.countryCode) {
            setEditingTimezones(moment.tz.zonesForCountry(rowData.countryCode) || []);
        }
    };

    const cancelEdit = () => {
        setEditRowIndex(null);
        setRowDraft({});
        setEditingTimezones([]);
    };

    const saveEdit = (index) => {


        const editedRow = rowDraft || {};

        if (editedRow.hour === "" || editedRow.hour === null || editedRow.hour === undefined) {
            showToast(t("The Hour field is Mandatory."), "info");
            return;
        }

        setBusyIndicatorFlag(true);
        const originalRow = tableData[index];
        // If any editable field is left empty, revert it to original value
        const normalizedRow = {
            ...editedRow,
            hour:
                editedRow.hour === "" || editedRow.hour === null || editedRow.hour === undefined
                    ? originalRow.hour
                    : editedRow.hour,
            minute:
                editedRow.minute === "" || editedRow.minute === null || editedRow.minute === undefined
                    ? originalRow.minute
                    : editedRow.minute,
            timezone:
                editedRow.timezone === "" || editedRow.timezone === null || editedRow.timezone === undefined
                    ? originalRow.timezone
                    : editedRow.timezone,
        };

        // Check if anything actually changed after normalization
        const isTimeZoneChanged = normalizedRow.timezone !== originalRow.timezone;
        const isHourChanged = normalizedRow.hour !== originalRow.hour;
        const isMinuteChanged = normalizedRow.minute !== originalRow.minute;
        const isStatusChanged = normalizedRow.status !== originalRow.status;

        if (!isTimeZoneChanged && !isHourChanged && !isMinuteChanged && !isStatusChanged) {
            showToast(t("No changes made"), "info");
            setBusyIndicatorFlag(false);
            cancelEdit();
            return;
        }

        const payload = {
            countryCode: normalizedRow?.countryCode,
            countryName: normalizedRow?.country,
            hour: Number(normalizedRow.hour),
            minute: Number(normalizedRow.minute),
            timeZone: normalizedRow.timezone,
            status: normalizedRow.status,
        };

        const handleSuccess = (res) => {
            const updatedData = [...tableData];
            updatedData[index] = {
                ...updatedData[index],
                ...normalizedRow,
                minute: String(normalizedRow.minute).padStart(2, '0'),
            };
            setTableData(updatedData);

            showToast(t("Schedule updated successfully!"), "success");
            cancelEdit();
            setBusyIndicatorFlag(false);
        };

        const handleError = (error) => {
            console.error("Failed to update schedule:", error);
            let errorMessage = t("Failed to update schedule");

            // Handle specific API error messages
            if (error?.message) {
                if (error.message.includes("not found")) {
                    errorMessage = t("Sync configuration not found. It may have been deleted by another user.");
                } else {
                    errorMessage = error.message;
                }
            }

            showToast(errorMessage, "error");
            setBusyIndicatorFlag(false);
        };

        fnServiceRequest(
            "/JavaServices_Oauth1/api/v1/sync/updateSyncConfig",
            "POST",
            handleSuccess,
            handleError,
            payload
        );
    };

    const handleSyncNow = (row) => {
        setBusyIndicatorFlag(true);

        // Build the API URL with query parameters
        const apiUrl = `/JavaServices_Oauth1/api/v1/sync/syncNow?country=${encodeURIComponent(row.countryCode)}`;

        const handleSuccess = (res) => {
            if (res?.status === "SUCCESS" && res?.statusCode === 200) {
                showToast(`${t("Sync completed successfully for")} ${row.country}!`, "success");
            } else {
                showToast(`${t("Sync completed with status")}: ${res?.status || "Unknown"}`, "warning");
            }
            setBusyIndicatorFlag(false);
        };

        const handleError = (error) => {
            console.error("Sync failed:", error);
            let errorMessage = t("Sync failed");

            // Handle specific API error messages
            if (error?.message) {
                errorMessage = error.message;
            } else if (error?.statusCode) {
                errorMessage = `${t("Sync failed with status code")}: ${error.statusCode}`;
            }

            showToast(errorMessage, "error");
            setBusyIndicatorFlag(false);
        };

        fnServiceRequest(
            apiUrl,
            "GET",
            handleSuccess,
            handleError
        );
    };

    const handleDelete = (index) => {
        setItemToDelete(tableData[index]);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        setBusyIndicatorFlag(true);

        setTimeout(() => {
            setTableData(prev => prev.filter(row => row.syncConfigId !== itemToDelete.syncConfigId));
            showToast(t("Schedule deleted successfully!"), "success");
            setDeleteDialogOpen(false);
            setItemToDelete(null);
            setBusyIndicatorFlag(false);
        }, 1000);
    };

    const handleDraftChange = (field, value) => {
        setRowDraft(prev => ({ ...prev, [field]: value }));
    };

    const columns = getHanaSyncColumns(
        t,
        editRowIndex,
        rowDraft,
        handleDraftChange,
        saveEdit,
        cancelEdit,
        startEdit,
        handleDelete,
        editingTimezones,
        handleSyncNow
    );

    // const rowsWithIndex = filteredRows.map((r, idx) => ({ ...r, originalIndex: idx }));
    const rowsWithIndex = filteredRows;

    const handleRowClick = (event, cols, rows, rowIndex) => {
        if (editRowIndex === rowIndex || event.target.closest('button, input, .MuiSwitch-root, .MuiSelect-root')) {
            return;
        }
    };

    const isFormInvalid =
        !org.country ||
        hour === "" ||
        minute === "" ||
        !timezone ||
        hasErrors;
    const isFormEmpty = !org.country && hour === "" && minute === "" && !timezone;
    const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minuteOptions = ["00", "15", "30", "45"];

    return (
        <>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                {busyIndicatorFlag && <BusyIndicator />}
                <HeaderCard>
                    <CardContent sx={{ backgroundColor: theme.palette.background.default }}>
                        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                            {t("Add New Sync Schedule")}
                        </Typography>
                        <Grid container
                            spacing={{ xs: 2, sm: 3 }}
                            alignItems="end"
                            height="fit-content"
                        >

                            <Grid item {...gridResponsiveConfig}>
                                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <PublicIcon sx={{ fontSize: 16 }} /> {t("Country")}
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

                            <Grid item {...gridResponsiveConfig}>
                                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Clock size="small" sx={{ fontSize: 16 }} /> {t("Hour")}
                                </Typography>
                                <Tooltip
                                    title={formErrors.timeError || ""}
                                    open={!!formErrors.timeError}
                                    arrow
                                    placement="top"
                                >
                                    <span>
                                    <CustomTextField
                                        value={hour}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);

                                            if (Number.isNaN(val) && e.target.value !== "") {
                                                setError(
                                                    "timeError",
                                                    "Please enter a valid hour between 0 and 23"
                                                );
                                                return;
                                            }

                                            if (e.target.value === "") {
                                                setHour("");
                                                clearError("timeError");
                                                return;
                                            }

                                            if (val >= 0 && val <= 23) {
                                                setHour(String(val));
                                                clearError("timeError");
                                            } else {
                                                setError(
                                                    "timeError",
                                                    "Please enter a valid hour between 0 and 23"
                                                );
                                            }
                                        }}
                                        onBlur={() => clearError("timeError")}
                                        error={!!formErrors.timeError}
                                        placeholder={t("Hour(0-23)")}
                                        fullWidth
                                    />
                                    </span>
                                </Tooltip>
                            </Grid>

                            <Grid item {...gridResponsiveConfig}>
                                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Clock size="small" sx={{ fontSize: 16 }} /> {t("Minutes")}
                                </Typography>
                                <FormControl fullWidth>
                                    <CustomSelect
                                        value={minute}
                                        onChange={(e) => {
                                            setMinute(e.target.value);
                                            clearError("validationError");
                                        }}
                                        disabled={!hour}
                                        placeholder={t("MM")}
                                        options={minuteOptions.map((m) => ({ key: m, value: m }))}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item {...gridResponsiveConfig}>
                                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <MapIcon size="small" sx={{ fontSize: 16 }} /> {t("Time Zone")}
                                </Typography>
                                <FormControl fullWidth>
                                    <CustomSelect
                                        value={timezone}
                                        onChange={(e) => {
                                            setTimeZone(e.target.value);
                                            clearError("validationError");
                                        }}
                                        disabled={!org.country}
                                        placeholder={t("Select Time Zone")}
                                        options={timeZoneOptions.map((tz) => ({ key: tz, value: tz }))}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item {...gridResponsiveConfig} sx={{ display: "flex", marginLeft: "auto", justifyContent: "flex-end" }}>
                            <Tooltip title={t("Save")}>
                                <span>
                                    <AdminButton action={ButtonTypes.SAVE} onClick={handleSubmit} disabled={isFormInvalid}>
                                        {t("Save")}
                                    </AdminButton>
                                </span>
                            </Tooltip>
                            <Tooltip title={t("Clear Fields")}>
                                <span>
                                    <AdminButton action={ButtonTypes.CLEAR} onClick={clearForm} disabled={isFormEmpty}>
                                        {t("Clear")}
                                    </AdminButton>
                                </span>
                            </Tooltip>
                        </Grid>

                        {/* Error Messages */}
                        {(formErrors.validationError || formErrors.combinationError || formErrors.timeError) && (
                            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                                Please fix the issue:
                                <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                                    {formErrors.validationError && <li>{formErrors.validationError}</li>}
                                    {formErrors.combinationError && <li>{formErrors.combinationError}</li>}
                                    {formErrors.timeError && <li>{formErrors.timeError}</li>}
                                </ul>
                            </Alert>
                        )}
                    </CardContent>
                </HeaderCard>

                {/* Search Bar */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 1 }}>
                    <CustomTextField
                        placeholder={t("Search…")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            width: { xs: "100%", sm: 220 },
                        }}
                    />
                </Box>

                <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e2e8f0", flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {filteredRows.length === 0 && !busyIndicatorFlag ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100%' }} >
                            <Typography color="text.secondary" variant="h6">
                                {searchTerm ? t("No matching sync schedules found") : t("No Sync Schedules Found")}
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', width: '100%' }}>
                            <CustomTable
                                rows={rowsWithIndex}
                                Headercolumns={columns}
                                fnRowClickHandler={handleRowClick}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                rowCount={filteredRows.length}
                                paginationMode="client"
                            />
                        </Box>
                    )}
                </Paper>
            </Box>

            {/* Delete Confirmation Dialog */}
            <CustomDeletePopover
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this sync schedule?"
                confirmText="Delete"
                cancelText="Cancel"
                itemName={`Sync Schedule: ${itemToDelete?.country}`}
                itemDescription={
                    itemToDelete
                        ? `Country: ${itemToDelete.country || "N/A"}, Time: ${itemToDelete.hour}:${itemToDelete.minute} ${itemToDelete.timezone || "N/A"}, Status: ${itemToDelete.status ? "Active" : "Inactive"}`
                        : ""
                }
                showItemDetails={true}
                fieldLabel="Schedule Details"
            />
        </>
    );
};

export default HanaSyncUp;

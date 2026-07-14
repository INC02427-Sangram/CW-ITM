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
    Switch,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Grid, Paper, Typography, Stack, Button } from "@cw/rds";
import { CustomTextField } from "../../UIComponents/CustomTextField";
import CustomSelect from "../../UIComponents/CustomSelect";
import { HeaderCard } from "../../UIComponents/HeaderCard";
import { AdminControlButton as AdminButton } from "../../UIComponents/Button";
import { ButtonTypes } from "../../UIComponents/UITypes";
import PublicIcon from "@mui/icons-material/Public";
import BusinessIcon from "@mui/icons-material/Business";

import BusyIndicator from "../../utility/BusyIndicator";
import fnServiceRequest from "../../utility/fnServiceRequest";
import { setMessageToastForAdminConsole } from "../../redux/reducers/appReducer";
import CustomTable from "../../utility/Custom Components/CustomTable";
import { getCustomerDataConfigColumns } from "./adminTableConfigs";
import useDebouncedSearch from "../../hooks/useDebouncedSearch";
import useOrgHierarchy from "../../hooks/useOrgHierarchy";
import useFormValidation from "../../hooks/useFormValidation";

const StyledFormCard = styled(Card)(({ theme }) => ({
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e8e8e8",
    marginBottom: "14px",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    borderRadius: "10px",
    height: 38,
    "& .MuiOutlinedInput-notchedOutline": { borderRadius: "10px" },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.light,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3026B9",
        borderWidth: "2px",
    },
}));

const gridResponsiveConfig = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 2,
    xl: 1.5
};


const CustomerDataConfig = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    const showToast = (message, type = "success") => {
        dispatch(setMessageToastForAdminConsole({ visiblity: true, message, type }));
    };

    // Org hierarchy: Country → Sales Org
    const org = useOrgHierarchy({ depth: 2, countrySelectBy: "id" });

    // Search
    const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebouncedSearch();

    // Form State for all 5 flags
    const [billTo, setBillTo] = useState(false);
    const [payerTo, setPayerTo] = useState(false);
    const [duplicatePo, setDuplicatePo] = useState(false);
    const [materialLearning, setMaterialLearning] = useState(false);
    const [customerLearning, setCustomerLearning] = useState(false);

    // Table & General State
    const [tableData, setTableData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [rowDraft, setRowDraft] = useState({});
    const [busyIndicatorFlag, setBusyIndicatorFlag] = useState(false);

    // Form validation
    const { formErrors, setError, clearError, clearAllErrors, checkDuplicate, validateRequired, hasErrors } = useFormValidation(["validationError", "combinationError"]);


    // Fetch existing configurations and flatten the nested data for the table state

    const fetchConfigs = () => {
        setBusyIndicatorFlag(true);

        const handleSuccess = (res) => {
            if (res?.data && Array.isArray(res.data)) {
                const formattedData = res.data.map((item, index) => ({
                    id: `${item.country}-${item.salesOrg}-${index}`,
                    country: item.country,
                    salesOrg: item.salesOrg,
                    billTo: item.descriptionFlags["Bill To"],
                    payerTo: item.descriptionFlags["Payer To"],
                    duplicatePo: item.descriptionFlags["Duplicate PO"],
                    materialLearning: item.descriptionFlags["Material Learning Table"],
                    customerLearning: item.descriptionFlags["Customer Learning Table"],
                }));
                setTableData(formattedData);
            } else {
                showToast(t("No configuration data found."), "info");
                setTableData([]);
            }
            setBusyIndicatorFlag(false);
        };

        const handleError = (error) => {
            console.error("Failed to fetch configurations:", error);
            showToast(t("Error fetching configurations."), "error");
            setBusyIndicatorFlag(false);
        };

        fnServiceRequest(
            "/JavaServices_Oauth1/api/salesOrgConfiguration/GetAllConfigurations",
            "GET",
            handleSuccess,
            handleError
        );
    };

    useEffect(() => {
        setBusyIndicatorFlag(true);
        fetchConfigs();
    }, []);

    const filteredRows = useMemo(() => {
        if (!debouncedSearchTerm) return tableData;
        return tableData.filter(row =>
            row.country.toLowerCase().includes(debouncedSearchTerm) ||
            row.salesOrg.toLowerCase().includes(debouncedSearchTerm)
        );
    }, [debouncedSearchTerm, tableData]);


    const handleCountryChange = (event) => {
        org.handleCountryChange(event);
        clearAllErrors();
    };

    const handleSalesOrgChange = (event) => {
        org.handleSalesOrgChange(event);
        clearAllErrors();

        const selectedOrg = event.target.value;
        if (org.country && selectedOrg) {
            checkDuplicate(
                tableData,
                { country: org.getSelectedCountryName(), salesOrg: selectedOrg },
                t("This configuration already exists.")
            );
        }
    };

    const clearForm = () => {
        org.resetAll();
        setBillTo(false);
        setPayerTo(false);
        setDuplicatePo(false);
        setMaterialLearning(false);
        setCustomerLearning(false);
        clearAllErrors();
    };

    const validateForm = () => {
        const reqValid = validateRequired(
            { country: org.country, salesOrg: org.salesOrg },
            "Please select a Country and Sales Organization."
        );
        const isDuplicate = checkDuplicate(
            tableData,
            { country: org.getSelectedCountryName(), salesOrg: org.salesOrg },
            t("This configuration already exists.")
        );
        return reqValid && !isDuplicate;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        setBusyIndicatorFlag(true);

        const selectedCountryObj = org.getSelectedCountryObj();

        const payload = {
            salesOrg: org.salesOrg,
            country: selectedCountryObj.countryName,
            billTo: billTo,
            payerTo: payerTo,
            duplicatePO: duplicatePo,
            materialLearningTable: materialLearning,
            customerLearningTable: customerLearning
        };

        const handleSuccess = () => {
            showToast(t("Configuration saved successfully!"), "success");
            clearForm();
            fetchConfigs();
        };

        const handleError = (error) => {
            console.error("Failed to save configuration:", error);
            showToast(t("Failed to save configuration."), "error");
            setBusyIndicatorFlag(false);
        };

        fnServiceRequest(
            "/JavaServices_Oauth1/api/salesOrgConfiguration/CreateNewConfiguration",
            "POST",
            handleSuccess,
            handleError,
            payload
        );

    };

    const startEdit = (index) => {
        setEditRowIndex(index);
        setRowDraft({ ...filteredRows[index] });
    };

    const cancelEdit = () => {
        setEditRowIndex(null);
        setRowDraft({});
    };

    const saveEdit = () => {
        setBusyIndicatorFlag(true);
        const editedRow = rowDraft;

        const payload = {
            country: editedRow.country,
            salesOrg: editedRow.salesOrg,
            billTo: editedRow.billTo,
            payerTo: editedRow.payerTo,
            duplicatePO: editedRow.duplicatePo,
            materialLearningTable: editedRow.materialLearning,
            customerLearningTable: editedRow.customerLearning
        };

        console.log("Payload", payload);

        const handleSuccess = () => {
            showToast(t("Configuration updated successfully!"), "success");
            const updatedData = tableData.map(row =>
                row.id === editedRow.id ? editedRow : row
            );
            setTableData(updatedData);
            cancelEdit();
            setBusyIndicatorFlag(false);
        };

        const handleError = (error) => {
            console.error("Failed to update configuration:", error);
            showToast(t("Failed to update configuration."), "error");
            setBusyIndicatorFlag(false);
        };

        fnServiceRequest(
            "/JavaServices_Oauth1/api/salesOrgConfiguration/UpdateConfigurationStatus",
            "PUT",
            handleSuccess,
            handleError,
            payload
        );
    };

    const handleDraftChange = (field, value) => {
        setRowDraft(prev => ({ ...prev, [field]: value }));
    };

    const rowsWithIndex = filteredRows.map((r, idx) => ({ ...r, originalIndex: idx }));

    const columns = getCustomerDataConfigColumns(t, editRowIndex, rowDraft, handleDraftChange, saveEdit, cancelEdit, startEdit);
    const isFormInvalid = !org.country || !org.salesOrg || !!formErrors.combinationError;
    const isFormEmpty = !org.country && !org.salesOrg && !billTo && !payerTo && !duplicatePo && !materialLearning && !customerLearning;

    return (
        <Box sx={{ px: 3, pt: 3, pb: 2, display: 'flex', flexDirection: 'column' }}>
            {busyIndicatorFlag && <BusyIndicator />}
            <HeaderCard>
                <CardContent sx={{ backgroundColor: theme.palette.background.default }}>
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                        {t("Add New Customer Data Configuration")}
                    </Typography>
                    <Grid
                        container
                        spacing={{ xs: 2, sm: 3 }}
                        alignItems="end"
                        height="fit-content">

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
                                <BusinessIcon sx={{ fontSize: 16 }} /> {t("Sales Organization")}
                            </Typography>
                            <FormControl fullWidth>
                                <CustomSelect
                                    value={org.salesOrg}
                                    onChange={handleSalesOrgChange}
                                    disabled={!org.country}
                                    placeholder={t("Select Organization")}
                                    options={org?.salesOrgOptions?.map((o) => ({ key: o, value: o }))}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item {...gridResponsiveConfig}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>{t("Bill To")}</Typography>
                            <Switch checked={billTo} onChange={(e) => setBillTo(e.target.checked)} />
                        </Grid>

                        <Grid item {...gridResponsiveConfig}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>{t("Payer To")}</Typography>
                            <Switch checked={payerTo} onChange={(e) => setPayerTo(e.target.checked)} />
                        </Grid>

                        <Grid item {...gridResponsiveConfig}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>{t("Duplicate PO")}</Typography>
                            <Switch checked={duplicatePo} onChange={(e) => setDuplicatePo(e.target.checked)} />
                        </Grid>

                        <Grid item {...gridResponsiveConfig}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>{t("Material Learning")}</Typography>
                            <Switch checked={materialLearning} onChange={(e) => setMaterialLearning(e.target.checked)} />
                        </Grid>

                        <Grid item {...gridResponsiveConfig}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>{t("Customer Learning")}</Typography>
                            <Switch checked={customerLearning} onChange={(e) => setCustomerLearning(e.target.checked)} />
                        </Grid>

                        <Grid item {...gridResponsiveConfig} sx={{ display: "flex", marginLeft: "auto", justifyContent: "flex-end", marginLeft: "auto" }}>
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
                    </Grid>

                    {(formErrors.validationError || formErrors.combinationError) && (
                        <Alert severity="error" sx={{ mt: 1.5, width: "100%", py: 0.1 }}>
                            <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                                {formErrors.validationError && <li>{formErrors.validationError}</li>}
                                {formErrors.combinationError && <li>{formErrors.combinationError}</li>}
                            </ul>
                        </Alert>
                    )}
                </CardContent>
            </HeaderCard>

            <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 1 }}>
                <CustomTextField size="small" placeholder={t("Search…")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ width: { xs: "100%", sm: 250 } }} />
            </Box>

            <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e2e8f0", flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {filteredRows.length === 0 && !busyIndicatorFlag ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100%' }}>
                        <Typography color="text.secondary" variant="h6">{searchTerm ? t("No matching configurations found") : t("No Configurations Found")}</Typography>
                    </Box>
                ) : (
                    <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', width: '100%' }}>
                        <CustomTable rows={rowsWithIndex} Headercolumns={columns} paginationMode="client" />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default CustomerDataConfig;
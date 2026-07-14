import React, { useState, useEffect, useMemo, useRef } from "react";
import {
    Box,
    Card,
    CardContent,
    FormControl,
    MenuItem,
    Tooltip,
    Alert,
    Select,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import { Grid, Paper, Typography, Stack, Button } from "@cw/rds";
import { CustomTextField } from "../../UIComponents/CustomTextField";
import CustomSelect from "../../UIComponents/CustomSelect";
import { HeaderCard } from "../../UIComponents/HeaderCard";
import { AdminControlButton as AdminButton } from "../../UIComponents/Button";
import { ButtonTypes } from "../../UIComponents/UITypes";

import PublicIcon from "@mui/icons-material/Public";
import BusinessIcon from "@mui/icons-material/Business";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorIcon from "@mui/icons-material/Error";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";

import BusyIndicator from "../../utility/BusyIndicator";
import fnServiceRequest from "../../utility/fnServiceRequest";
import CustomTable from "../../utility/Custom Components/CustomTable";
import { getMaterialConfigColumns } from "./adminTableConfigs";
import { setMessageToastForAdminConsole } from "../../redux/reducers/appReducer";
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
    "& .MuiOutlinedInput-notchedOutline": {
        borderRadius: "10px",
    },
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
    lg: 3,
};

const AddMaterialConfig = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const showToast = (message, type = "success") => {
        dispatch(setMessageToastForAdminConsole({ visiblity: true, message, type }));
    };

    // Org hierarchy: Country → Sales Org
    const org = useOrgHierarchy({ depth: 2, countrySelectBy: "id" });

    // Search
    const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebouncedSearch();

    // Form validation
    const { formErrors, setError, clearError, clearAllErrors, checkDuplicate, hasErrors, revalidate } = useFormValidation(["validationError", "combinationError"]);

    // Form State
    const [selectedFile, setSelectedFile] = useState(null);

    // Table & General State
    const [tableData, setTableData] = useState([]);
    const [busyIndicatorFlag, setBusyIndicatorFlag] = useState(false);

    //View and Downloading
    const [viewOpen, setViewOpen] = useState(false);
    const [viewName, setViewName] = useState("");
    const [viewBase64, setViewBase64] = useState(null);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const fetchMaterialConfigs = () => {
        setBusyIndicatorFlag(true);

        const handleSuccess = (response) => {
            if (response?.data && Array.isArray(response.data)) {
                const formattedData = response.data.map(item => ({
                    ...item,
                    id: `${item.country}-${item.salesOrg}`
                }));
                setTableData(formattedData);
            } else {
                showToast(t("Received an unexpected data format from the server."), "error");
                setTableData([]);
            }
            setBusyIndicatorFlag(false);
        };

        const handleError = (error) => {
            console.error("Failed to fetch material list:", error);
            showToast(t("Failed to fetch the active material list."), "error");
            setTableData([]);
            setBusyIndicatorFlag(false);
        };

        fnServiceRequest(
            "/JavaServices_Oauth/api/salesOrder/getActiveMaterialList",
            "GET",
            handleSuccess,
            handleError
        );
    };

    useEffect(() => {
        setBusyIndicatorFlag(true);
        fetchMaterialConfigs();
    }, []);

    useEffect(() => {
        if (org.country && org.salesOrg) {
            checkDuplicate(
                tableData,
                {
                    country: org.getSelectedCountryName(),
                    salesOrg: org.salesOrg,
                },
                t("This Country and Sales Organization combination already exists.")
            );
        } else {
            clearError("combinationError");
        }
    }, [
        tableData,
        org.country,
        org.salesOrg,
        checkDuplicate,
        clearError,
        t,
    ]);

    const filteredRows = useMemo(() => {
        if (!debouncedSearchTerm) return tableData;
        return tableData.filter(
            (row) =>
                row.country.toLowerCase().includes(debouncedSearchTerm) ||
                row.salesOrg.toLowerCase().includes(debouncedSearchTerm)
        );
    }, [debouncedSearchTerm, tableData]);

    const handleCountryChange = (event) => {
        org.handleCountryChange(event);
        clearError("validationError");
    };

    const handleSalesOrgChange = (event) => {
        org.handleSalesOrgChange(event);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        clearError("validationError");
    };

    const clearForm = () => {
        org.resetAll();
        setSelectedFile(null);
        clearAllErrors();
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const base64ToBlob = (base64, mime) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mime });
    };

    const getExcelFile = (row, onSuccess) => {
        setBusyIndicatorFlag(true);
        const countryParam = encodeURIComponent(row.country);
        const salesOrgParam = encodeURIComponent(row.salesOrg);
        const url = `/JavaServices_Oauth/api/salesOrder/showAML?country=${countryParam}&salesOrg=${salesOrgParam}`;

        fnServiceRequest(
            url,
            "GET",
            (response) => {
                setBusyIndicatorFlag(false);
                if (response?.data?.base64) {
                    onSuccess(response.data.base64);
                } else {
                    showToast(t("Failed to retrieve file content."), "error");
                }
            },
            (err) => {
                setBusyIndicatorFlag(false);
                showToast(t("Error fetching file from server."), "error");
            }
        );
    };

    const handleViewDocument = (row) => {
        getExcelFile(row, (base64Data) => {
            setViewName(`Preview: ${row.country} - ${row.salesOrg}`);
            setViewBase64(base64Data);
            setViewOpen(true);
        });
    };

    const handleDownloadDocument = (row) => {
        getExcelFile(row, (base64Data) => {
            const mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const blob = base64ToBlob(base64Data, mime);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${row.country}_${row.salesOrg}_Active_Materials.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });
    };

    const handleDownloadSampleTemplate = () => {
        const link = document.createElement('a');
        link.href = '/Active_Materials.xlsx';
        link.setAttribute('download', 'Active_Materials.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCloseView = () => {
        setViewOpen(false);
        setViewBase64(null);
    };

    const handleStatusChange = (row) => {
        setBusyIndicatorFlag(true);
        const newStatus = !row.status;

        const payload = {
            country: row.country,
            salesOrg: row.salesOrg,
            status: newStatus,
        };

        const handleSuccess = (res) => {
            setTableData(prevData =>
                prevData.map(item =>
                    item.id === row.id ? { ...item, status: newStatus } : item
                )
            );
            showToast(t("Status updated successfully!"), "success");
            setBusyIndicatorFlag(false);
        };

        const handleError = (error) => {
            console.error("Failed to update material status:", error);
            showToast(t("Failed to update status"), "error");
            setBusyIndicatorFlag(false);
        };

        fnServiceRequest(
            "/JavaServices_Oauth/api/salesOrder/toggleActiveMaterialStatus",
            "POST",
            handleSuccess,
            handleError,
            payload
        );
    };

    const handleSave = () => {
        if (isFormInvalid) {
            if (!org.country || !org.salesOrg || !selectedFile) {
                setError("validationError", t("Please fill all fields and select a file."));
            }
            return;
        }
        setBusyIndicatorFlag(true);
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(",")[1];
            const selectedCountryObj = org.getSelectedCountryObj();
            const payload = {
                country: selectedCountryObj.countryName,
                salesOrg: org.salesOrg,
                base64: base64String,
            };
            const handleSuccess = () => {
                showToast(t("Configuration saved successfully!"), "success");
                fetchMaterialConfigs();
                clearForm();
                setBusyIndicatorFlag(false);
            };
            const handleError = () => {
                showToast(t("Failed to save configuration"), "error");
                setBusyIndicatorFlag(false);
            };
            fnServiceRequest("/JavaServices_Oauth/api/salesOrder/addActiveMaterial", "POST", handleSuccess, handleError, payload);
        };
        reader.onerror = () => {
            showToast(t("Failed to read the file."), "error");
            setBusyIndicatorFlag(false);
        };
        reader.readAsDataURL(selectedFile);
    };

    const rowsWithIndex = filteredRows.map((r, idx) => ({ ...r, originalIndex: idx }));

    const columns = getMaterialConfigColumns(
        t,
        handleStatusChange,
        handleViewDocument,
        handleDownloadDocument,
    );

    const isFormInvalid =
        !org.country ||
        !org.salesOrg ||
        !selectedFile ||
        hasErrors;
    const isFormEmpty = !org.country && !org.salesOrg && !selectedFile;

    return (
        <>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                {busyIndicatorFlag && <BusyIndicator />}
                <HeaderCard>
                    <CardContent sx={{ backgroundColor: theme.palette.background.default }}>
                        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                            {t("Add Active Material Configuration")}
                        </Typography>
                        <Grid container
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
                                        options={org?.countries?.map((country) => ({ key: country?.countryId, value: country?.countryName }))}
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
                                        placeholder={t("Select Sales Organization")}
                                        options={org?.salesOrgOptions?.map((salesOrg) => ({ key: salesOrg, value: salesOrg }))}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item {...gridResponsiveConfig}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 3 }}>
                                        <CloudUploadIcon sx={{ fontSize: 16 }} /> {t("Upload Document")}
                                    </Typography>
                                    <Tooltip title={t("Click to download sample template")}>
                                        <IconButton size="small" onClick={handleDownloadSampleTemplate}>
                                            <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, height: 38 }}>
                                    <Button variant="outlined" component="label" startIcon={<FileUploadOutlinedIcon />} sx={{ textTransform: 'none', flexShrink: 0 }} disabled={!!formErrors.combinationError}>
                                        {t("Choose File")}
                                        <input type="file" hidden accept=".xlsx, .xls, .csv" onChange={handleFileChange} ref={fileInputRef} />
                                    </Button>
                                    <Tooltip
                                        title={selectedFile ? selectedFile.name : ""}
                                        placement="top"
                                        arrow
                                        disableHoverListener={!selectedFile}
                                    >
                                        <Typography variant="primary" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                                            {selectedFile ? selectedFile.name : t("No file selected")}
                                        </Typography>
                                    </Tooltip>
                                </Box>
                            </Grid>



                            <Grid item {...gridResponsiveConfig} sx={{ display: "flex", marginLeft: "auto", justifyContent: "flex-end" }}>
                                <Tooltip title={t("Save")}>
                                    <span>
                                        <AdminButton action={ButtonTypes.SAVE} onClick={handleSave} disabled={isFormInvalid}>
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
                        {hasErrors && (
                            <Alert severity="error" sx={{ mt: 2, width: "100%", py: 0.1 }}>
                                <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                                    {formErrors.validationError && (
                                        <li>{formErrors.validationError}</li>
                                    )}

                                    {formErrors.combinationError && (
                                        <li>{formErrors.combinationError}</li>
                                    )}
                                </ul>
                            </Alert>
                        )}
                    </CardContent>
                </HeaderCard>

                <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 1 }}>
                    <CustomTextField size="small" placeholder={t("Search ...")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ width: { xs: "100%", sm: 250 } }} />
                </Box>

                <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e2e8f0", flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', width: '100%' }}>
                        <CustomTable rows={rowsWithIndex}
                            Headercolumns={columns}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            rowCount={filteredRows.length}
                            paginationMode="client"
                        />
                    </Box>
                </Paper>
            </Box>


            <Dialog open={viewOpen} onClose={handleCloseView} fullWidth maxWidth="lg">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {viewName}
                    <IconButton onClick={handleCloseView}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0, height: '75vh' }}>
                    {viewBase64 &&
                        <div>
                            {/* <ExcelViewer base64Data={viewBase64} /> */}
                        </div>

                    }
                </DialogContent>
            </Dialog>

        </>
    );
};

export default AddMaterialConfig;
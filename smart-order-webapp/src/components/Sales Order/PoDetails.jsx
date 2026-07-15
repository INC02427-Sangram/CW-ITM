import { useTheme } from '@emotion/react';
import React, { useCallback, useEffect, useState } from 'react'
import {
    Grid,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Divider,
    Stack,
    Popover,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip
} from "@mui/material";
import { useTranslation } from "react-i18next";
import fnServiceRequest from '../../utility/fnServiceRequest';
import { useParams } from 'react-router-dom';
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import { Close } from '@cw/rds/icons';
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import { HeaderControlButton as HeaderButton } from '../../UIComponents/Button';
import { ButtonTypes } from '../../UIComponents/UITypes';
import { useGetPODetails } from '../../hooks/useGetPODetails';
import { HeaderCard } from '../../UIComponents/HeaderCard';
import { AppTypography } from '../../UIComponents/AppTypography';

const PoDetails = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { orderHeaderId } = useParams();

    const gridResponsiveConfig = {
        xl: 2,
        lg: 2,
        md: 3,
        sm: 6,
        xs: 12,
    };
    // Use React Query hook for fetching PO details
    const { 
        poDetails, 
        isLoadingPODetails, 
        poDetailsError,
        refetch: refetchPODetails 
    } = useGetPODetails(orderHeaderId);

    // Customer search related state
    const [customerSearchAnchorEl, setCustomerSearchAnchorEl] = useState(null);
    const [customerSearchResults, setCustomerSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isCustomerSearching, setIsCustomerSearching] = useState(false);
    const [customerSearchForm, setCustomerSearchForm] = useState({
        salesOrg: "",
        postalCode: "",
        division: "",
        distChannel: "",
        name: "",
        city: ""
    });

    // Toast state
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessageType, setToastMessageType] = useState("info");
    const [toastMessageDescription, setToastMessageDescription] = useState("");


    const showToast = useCallback((message, type = "info") => {
        setToastMessageDescription(message);
        setToastMessageType(type);
        setToastOpen(true);
    }, []);

    // Style definitions for consistent labels
    const headerLabelSx = {
        color: theme.palette.text.primary,
        fontWeight: 600,
    };

    return (
        <>
            <HeaderCard
                sx={{
                    mb: 3,
                    mr: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    "&:hover": {
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    },
                }}
            >
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
                            {t("PO Details")}
                        </Typography>

                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2} wrap="wrap">
                        <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
                            <Box sx={{ mb: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    className="headerInfo-labels"
                                    sx={headerLabelSx}
                                >
                                    {t("Ship To Name")}
                                </Typography>
                                <AppTypography value={poDetails?.poShipToName} />
                            </Box>
                        </Grid>
                        <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
                            <Box sx={{ mb: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    className="headerInfo-labels"
                                    sx={headerLabelSx}
                                >
                                    {t("Ship To City")}
                                </Typography>
                                <AppTypography value={poDetails?.poShipToCity} />
                            </Box>
                        </Grid>
                        <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
                            <Box sx={{ mb: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    className="headerInfo-labels"
                                    sx={headerLabelSx}
                                >
                                    {t("Ship To Zip")}
                                </Typography>
                                <AppTypography value={poDetails?.poShipToZip} />
                            </Box>
                        </Grid>
                        <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
                            <Box sx={{ mb: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    className="headerInfo-labels"
                                    sx={headerLabelSx}
                                >
                                    {t("Ship To Street")}
                                </Typography>
                                <AppTypography value={poDetails?.poShipToStreet} />
                            </Box>
                        </Grid>
                        <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
                            <Box sx={{ mb: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    className="headerInfo-labels"
                                    sx={headerLabelSx}
                                >
                                    {t("Sold To Name")}
                                </Typography>
                                <AppTypography value={poDetails?.poSoldToName} />
                            </Box>
                        </Grid>
                        <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
                            <Box sx={{ mb: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    className="headerInfo-labels"
                                    sx={headerLabelSx}
                                >
                                    {t("Sold To City")}
                                </Typography>
                                <AppTypography value={poDetails?.poSoldToCity} />
                            </Box>
                        </Grid>
                        <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
                            <Box sx={{ mb: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    className="headerInfo-labels"
                                    sx={headerLabelSx}
                                >
                                    {t("Sold To Zip")}
                                </Typography>
                                <AppTypography value={poDetails?.poSoldToZip} />
                            </Box>
                        </Grid>
                        <Grid className="grid-item-flex grid-item-small" item {...gridResponsiveConfig}>
                            <Box sx={{ mb: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    className="headerInfo-labels"
                                    sx={headerLabelSx}
                                >
                                    {t("Sold To Street")}
                                </Typography>
                                <AppTypography value={poDetails?.poSoldToStreet} />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </HeaderCard>

            {/* Customer Search Toast */}
            <CustomMessageToast
                open={toastOpen}
                setOpen={setToastOpen}
                messageType={toastMessageType}
                messageDescription={toastMessageDescription}
                anchorPosition={{ vertical: "top", horizontal: "center" }}
            />

        </>
    )
}

export default PoDetails
import React, { useState, useEffect } from 'react';
import {
    Popover,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { green } from '@mui/material/colors';
import fnServiceRequest from "../../utility/fnServiceRequest";
import { Refresh } from '@cw/rds/icons';

const SystemHealthPopover = ({
    open,
    anchorEl,
    onClose
}) => {
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [healthError, setHealthError] = useState(false);

    const fetchServiceHealth = () => {
        setLoading(true);
        setHealthError(false);

        fnServiceRequest(
            "/JavaServices_Oauth/api/serviceHealth/getAllServices",
            "GET",
            (response) => {
                const serviceData = Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response)
                        ? response
                        : [];

                setServices(serviceData);
                setLastUpdated(new Date().toLocaleString());
                setHealthError(false);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching service health:", error);
                setServices([]);
                setHealthError(true);
                setLastUpdated(new Date().toLocaleString());
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        if (open) {
            fetchServiceHealth();
        }
    }, [open]);

    const handleRefresh = () => {
        fetchServiceHealth();
    };

    const calculateHealthPercentage = () => {
        if (healthError) return null;
        if (!Array.isArray(services) || services.length === 0) return 0;

        const healthyServices = services.filter(
            (service) => service.status?.toLowerCase() === "healthy"
        ).length;

        return Math.round((healthyServices / services.length) * 100);
    };

    const isServiceHealthy = (status) => {
        return status?.toLowerCase() === "healthy";
    };

    const healthPercentage = calculateHealthPercentage();
    const isSystemHealthy = !healthError && healthPercentage === 100;

    const indicatorColor = healthError
        ? "#9e9e9e"
        : isSystemHealthy
            ? green[500]
            : "#f44336";

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            PaperProps={{
                sx: {
                    width: 380,
                    height: 500,
                    p: 3,
                    borderRadius: 4,
                    boxShadow: 10,
                    bgcolor: "background.paper",
                },
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        color: green[800],
                    }}
                >
                    System Health
                </Typography>

                <IconButton
                    onClick={handleRefresh}
                    size="small"
                    disabled={loading}
                >
                    <Refresh
                        fontSize="small"
                        color={green[700]}
                    />
                </IconButton>
            </Box>

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                mb={2}
            >
                <Box
                    sx={{
                        width: 160,
                        height: 160,
                        borderRadius: "50%",
                        border: `1px solid ${indicatorColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        bgcolor: indicatorColor,
                    }}
                >
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            bgcolor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-45%, -40%)",
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontSize: "24px",
                                color: indicatorColor,
                                position: "absolute",
                            }}
                        >
                            {loading
                                ? "..."
                                : healthError
                                    ? "N/A"
                                    : `${healthPercentage}%`}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                position: "absolute",
                                bottom: 25,
                                fontSize: "10px",
                                color: indicatorColor,
                            }}
                        >
                            System Health
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Typography
                variant="body2"
                align="center"
                mb={1}
            >
                {healthError
                    ? "Monitoring unavailable"
                    : `Monitoring ${services.length} services`}
            </Typography>

            <Typography
                variant="caption"
                align="center"
                display="block"
                mb={3}
            >
                Last updated on: {lastUpdated}
            </Typography>

            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={100}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Loading services...
                    </Typography>
                </Box>
            ) : healthError ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height={100}
                    gap={1}
                >
                    <ErrorOutlineIcon
                        sx={{
                            color: "#f44336",
                            fontSize: 28,
                        }}
                    />

                    <Typography
                        variant="body2"
                        color="error"
                    >
                        Unable to fetch service health
                    </Typography>
                </Box>
            ) : services.length === 0 ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={100}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        No services found
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        maxHeight: 200,
                        overflowY: "auto",
                    }}
                >
                    {services.map((service, index) => {
                        const serviceHealthy = isServiceHealthy(service.status);

                        return (
                            <Box
                                key={index}
                                sx={{
                                    backgroundColor: serviceHealthy
                                        ? green[50]
                                        : "#ffebee",
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    border: `1px solid ${
                                        serviceHealthy
                                            ? green[200]
                                            : "#ffcdd2"
                                    }`,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                    >
                                        {service.serviceName}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: serviceHealthy
                                                ? green[600]
                                                : "#f44336",
                                            fontWeight: serviceHealthy
                                                ? "normal"
                                                : "bold",
                                        }}
                                    >
                                        {service.status} - Response time:{" "}
                                        {service.responseTimeMs}ms
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        backgroundColor: "white",
                                        borderRadius: "50%",
                                        padding: "4px",
                                        boxShadow: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CheckCircleIcon
                                        sx={{
                                            color: serviceHealthy
                                                ? green[500]
                                                : "#f44336",
                                            fontSize: 20,
                                        }}
                                    />
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Popover>
    );
};

export default SystemHealthPopover;
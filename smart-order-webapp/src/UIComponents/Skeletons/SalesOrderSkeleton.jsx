import React from "react";
import { Box, Grid, Skeleton, Paper, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const TABS = [
    "All", "To Be Reviewed", "Created", "Created With Block",
    "Queued", "Cancelled", "Pending For Approval", "Rejected",
];

// Sales Order table column configuration
const TABLE_COLS = [
    { flex: 1.7 },  // Request ID
    { flex: 1.2 },  // Ship To ID
    { flex: 1.2 },  // Sold To ID
    { flex: 0.6 },  // Sales Org
    { flex: 1.4 },  // Created Date
    { flex: 0.8 },  // PO Number
    { flex: 1.1 },  // Total Items
    { flex: 0.7 },  // Validation Status (checkmark)
    { flex: 1.1 },  // Created By
    { flex: 0.8 },  // Document Status (pill)
];

const DEFAULT_ROW_STATUS_TYPES = [
    "created", "toBeReviewed", "created", "created",
    "toBeReviewed", "toBeReviewed", "queued", "rejected",
    "queued", "created",
];

const getThemeKeyFromStatus = (status) => {
    if (!status) return null;
    const normalized = status.toLowerCase().replace(/\s+/g, "");
    const statusMapping = {
        tobereviewed: "toBeReviewed",
        drafted: "toBeReviewed",
        created: "created",
        createdwithblock: "created",
        queued: "queued",
        cancelled: "cancelled",
        pendingforapproval: "pendingForApproval",
        rejected: "rejected",
    };
    return statusMapping[normalized] || null;
};

/** Base skeleton — all sizing via sx props using relative units */
const Sk = ({ sx = {}, ...props }) => {
    const theme = useTheme();
    return (
        <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
                bgcolor: theme.palette.background.datagridHeader || "#e5e7eb",
                borderRadius: "4px",
                animationDuration: "2.2s",
                "&::after": {
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                },
                ...sx,
            }}
            {...props}
        />
    );
};

/** Status pill skeleton */
const StatusPill = ({ themeKey, delay = 0, theme }) => {
    console.log("Theme Key", themeKey);

    const statusConfig = theme.palette.statusChips?.[themeKey];
    console.log("Status Config", statusConfig);

    const bg = statusConfig?.bg || theme.palette.statusChips?.created?.bg || "#e5e7eb";
    console.log("BG", bg);

    return (
        <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
                width: "90%",
                height: "2.8dvh",
                minHeight: "18px",
                maxHeight: "28px",
                borderRadius: "999px",
                bgcolor: bg,
                animationDelay: `${delay}s`,
                "&::after": {
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                },
            }}
        />
    );
};

const SalesOrderSkeleton = ({ status }) => {
    console.log("Status isn Skeleton", status);

    const theme = useTheme();

    const statusValue = Array.isArray(status)
        ? (status.length > 0 ? status[0] : null)
        : status;
    const statusThemeKey = statusValue ? getThemeKeyFromStatus(statusValue) : null;

    return (
        <Box
            sx={{
                bgcolor: theme.palette.background.paper,
                minHeight: "100dvh",
                p: { xs: "1.5dvh 4vw", md: "1.5dvh 1vw" },
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            {/* ── Header: title block + action icons ── */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: "1dvh",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: "1dvh" }}>
                    <Sk sx={{ width: "10vw", minWidth: 100, height: "3.5dvh", minHeight: 24, maxHeight: 36, borderRadius: "5px" }} />
                    <Sk sx={{ width: "15vw", minWidth: 160, height: "1.6dvh", minHeight: 12, maxHeight: 18 }} />
                </Box>
                <Box sx={{ display: "flex", gap: "0.6vw" }}>
                    {[1, 2, 3].map((i) => (
                        <Sk
                            key={i}
                            sx={{
                                width: "2.8dvh", height: "2.8dvh",
                                minWidth: 22, minHeight: 22,
                                maxWidth: 32, maxHeight: 32,
                                borderRadius: "6px",
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* ── Sales Order List title + date badge ── */}
            <Box sx={{ mb: "1dvh" }}>
                <Box sx={{ display: "flex", gap: "1.2vw", alignItems: "center" }}>
                    <Sk sx={{ width: "8vw", minWidth: 140, height: "3dvh", minHeight: 22, maxHeight: 34, borderRadius: "5px" }} />
                    <Sk sx={{ width: "10vw", minWidth: 120, height: "3dvh", minHeight: 22, maxHeight: 34, borderRadius: "999px" }} />
                </Box>
            </Box>

            {/* ── Tabs ── */}
            <Box
                sx={{
                    display: "flex",
                    gap: "0.3vw",
                    borderBottom: "2px solid #e2e8f2",
                    mt: "2dvh",
                    mb: "2.5dvh",
                    overflowX: "auto",
                }}
            >
                {TABS.map((tab, i) => {
                    const isActive = statusValue ? tab === statusValue : i === 0;
                    return (
                        <Skeleton
                            key={tab}
                            variant="rectangular"
                            animation="wave"
                            sx={{
                                width: `clamp(${i === 0 ? 36 : 60}px, ${i === 0 ? 3 : tab.length * 0.6 + 2}vw, ${i === 0 ? 52 : 160}px)`,
                                height: "4dvh",
                                minHeight: 30,
                                maxHeight: 42,
                                flexShrink: 0,
                                borderRadius: "6px 6px 0 0",
                                bgcolor: isActive ? "#c7d6f7" : "#eaecf3",
                                borderBottom: isActive ? `2.5px solid ${theme.palette.primary.main}` : "none",
                                "&::after": {
                                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                                },
                            }}
                        />
                    );
                })}
            </Box>

            {/* ── Filters card ── */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: "14px",
                    p: "2dvh 2vw",
                    mb: "2.5dvh",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.06)",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "1.8dvh" }}>
                    <Sk sx={{ width: "5vw", minWidth: 56, height: "1.8dvh", minHeight: 13, maxHeight: 20 }} />
                    <Sk sx={{ width: "2dvh", height: "2dvh", minWidth: 16, minHeight: 16, maxWidth: 24, maxHeight: 24, borderRadius: "4px" }} />
                </Box>
                <Grid container spacing={{ xs: 1.5, md: 2 }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Sk sx={{ width: `${40 + (i % 3) * 10}%`, height: "1.4dvh", minHeight: 10, maxHeight: 15, mb: "0.8dvh" }} />
                            <Sk sx={{ height: "4dvh", minHeight: 30, maxHeight: 42, borderRadius: "7px" }} />
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* ── Table card ── */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: "14px",
                    p: "1dvh 1.2vw 1.6dvh",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.06)",
                }}
            >
                {/* Column headers */}
                <Box sx={{ display: "flex", gap: "1vw", px: "1vw", pb: "1.5dvh", borderBottom: "2px solid #e2e8f2" }}>
                    {TABLE_COLS.map(({ flex }, i) => (
                        <Box key={i} sx={{ flex }}>
                            <Sk sx={{ height: "2.5dvh", minHeight: 12, maxHeight: 36, width: "80%" }} />
                        </Box>
                    ))}
                </Box>

                {/* Data rows */}
                {Array.from({ length: 7 }).map((_, rowIdx) => (
                    <Box
                        key={rowIdx}
                        sx={{
                            display: "flex",
                            gap: "1vw",
                            alignItems: "center",
                            px: "1vw",
                            py: "1.2dvh",
                            borderRadius: "6px",
                            bgcolor: rowIdx % 2 === 0 ? "#fafbfe" : "transparent",
                        }}
                    >
                        {TABLE_COLS.map(({ flex }, colIdx) => (
                            <Box key={colIdx} sx={{ flex }}>
                                {colIdx === TABLE_COLS.length - 1 ? (
                                    <StatusPill
                                        themeKey={statusThemeKey || DEFAULT_ROW_STATUS_TYPES[rowIdx]}
                                        delay={rowIdx * 0.08}
                                        theme={theme}
                                    />
                                ) : colIdx === 0 ? (
                                    <Sk sx={{ height: "1.5dvh", minHeight: 11, maxHeight: 16, width: "92%", animationDelay: `${rowIdx * 0.08}s` }} />
                                ) : colIdx === 7 && rowIdx % 3 === 1 ? (
                                    <Sk sx={{ width: "2dvh", height: "2dvh", minWidth: 14, minHeight: 14, maxWidth: 22, maxHeight: 22, borderRadius: "50%", animationDelay: `${rowIdx * 0.08}s` }} />
                                ) : (
                                    <Sk sx={{ height: "1.5dvh", minHeight: 11, maxHeight: 16, width: `${55 + ((colIdx + rowIdx) % 4) * 8}%`, animationDelay: `${rowIdx * 0.08}s` }} />
                                )}
                            </Box>
                        ))}
                    </Box>
                ))}

                <Divider sx={{ my: "1.5dvh", borderColor: "#e2e8f2" }} />

                {/* Pagination */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1vw", pr: "0.5vw" }}>
                    <Sk sx={{ width: "8vw", minWidth: 80, height: "3dvh", minHeight: 26, maxHeight: 36, borderRadius: "7px" }} />
                    <Sk sx={{ width: "4vw", minWidth: 44, height: "3dvh", minHeight: 26, maxHeight: 36, borderRadius: "7px" }} />
                    <Sk sx={{ width: "6vw", minWidth: 60, height: "3dvh", minHeight: 26, maxHeight: 36, borderRadius: "7px" }} />
                    <Sk sx={{ width: "3dvh", height: "2.8dvh", minWidth: 22,minHeight: 26, maxWidth: 32, maxHeight: 36, borderRadius: "6px" }} />
                    <Sk sx={{ width: "3dvh", height: "2.8dvh", minWidth: 22, minHeight: 26, maxWidth: 32, maxHeight: 36, borderRadius: "6px" }} />
                </Box>
            </Paper>
        </Box>
    );
};

export default SalesOrderSkeleton;

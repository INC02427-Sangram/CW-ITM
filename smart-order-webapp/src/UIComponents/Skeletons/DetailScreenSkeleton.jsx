import React from "react";
import { Box, Grid, Skeleton, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Detail table column configuration
const DETAIL_TABLE_COLS = [
  { flex: "5%", type: "checkbox" },      // Checkbox
  { flex: "4%", width: "80%" },          // S.No
  { flex: "8%", width: "90%" },          // Item No
  { flex: "8%", width: "85%" },          // Material ID
  { flex: "10%", width: "90%" },         // Material Description
  { flex: "10%", width: "95%" },         // SAP Material ID
  { flex: "15%", width: "100%" },        // SAP Material Description
  { flex: "7%", width: "70%" },          // Quantity
  { flex: "8%", width: "75%" },          // Unit Price
  { flex: "8%", width: "80%" },          // Net Price
  { flex: "5%", width: "70%" },          // EAN
  { flex: "5%", width: "80%" },          // UOM
  { flex: "12%", width: "60%" },         // Exception Type
  { flex: "5%", type: "action" },        // Action icon
  { flex: "5%", type: "action" },        // Edit icon
];

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

const DetailScreenSkeleton = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        minHeight: "100dvh",
        p: { xs: "3dvh 4vw", md: "3dvh 2.5vw" },
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header - Title + Status + Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: "3dvh",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
          <Sk sx={{ width: "32vw", minWidth: 300, height: "3.2dvh", minHeight: 22, maxHeight: 34 }} />
          <Sk sx={{ width: "8vw", minWidth: 100, height: "3.2dvh", minHeight: 22, maxHeight: 34, borderRadius: "999px" }} />
        </Box>

        <Box sx={{ display: "flex", gap: "1.5vw" }}>
          <Sk sx={{ width: "10vw", minWidth: 120, height: "4.2dvh", minHeight: 32, maxHeight: 42, borderRadius: "6px" }} />
          <Sk sx={{ width: "12vw", minWidth: 140, height: "4.2dvh", minHeight: 32, maxHeight: 42, borderRadius: "6px" }} />
        </Box>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          gap: "0.3vw",
          borderBottom: "2px solid #e2e8f2",
          mb: "3dvh",
        }}
      >
        {["Basic Details", "Additional Details", "PO Details"].map((tab, i) => (
          <Skeleton
            key={tab}
            variant="rectangular"
            animation="wave"
            sx={{
              width: `clamp(${i === 0 ? 100 : i === 1 ? 120 : 90}px, ${i === 0 ? 9 : i === 1 ? 11 : 7}vw, ${i === 0 ? 140 : i === 1 ? 180 : 120}px)`,
              height: "4dvh",
              minHeight: 30,
              maxHeight: 42,
              flexShrink: 0,
              borderRadius: "6px 6px 0 0",
              bgcolor: i === 0 ? "#c7d6f7" : "#eaecf3",
              borderBottom: i === 0 ? `2.5px solid ${theme.palette.primary.main}` : "none",
              "&::after": {
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
              },
            }}
          />
        ))}
      </Box>

      {/* Order Header Information Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "14px",
          p: "2dvh 2vw",
          mb: "3dvh",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "2.5dvh" }}>
          <Sk sx={{ width: "15vw", minWidth: 160, height: "2.2dvh", minHeight: 16, maxHeight: 24 }} />
          <Box sx={{ display: "flex", gap: "1vw" }}>
            <Sk sx={{ width: "10vw", minWidth: 120, height: "4.2dvh", minHeight: 32, maxHeight: 42, borderRadius: "6px" }} />
            <Sk sx={{ width: "6vw", minWidth: 70, height: "4.2dvh", minHeight: 32, maxHeight: 42, borderRadius: "6px" }} />
          </Box>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
              <Sk sx={{ width: "60%", height: "1.4dvh", minHeight: 10, maxHeight: 15, mb: "0.8dvh" }} />
              <Sk sx={{ height: "4dvh", minHeight: 28, maxHeight: 40, borderRadius: "6px" }} />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Sales Item List Section */}
      <Box sx={{ mb: "3dvh" }}>
        {/* Title + Summary Chips */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "1.5vw", mb: "2dvh" }}>
          <Sk sx={{ width: "10vw", minWidth: 120, height: "3.5dvh", minHeight: 24, maxHeight: 36 }} />
          <Sk sx={{ width: "10vw", minWidth: 120, height: "3.5dvh", minHeight: 24, maxHeight: 36, borderRadius: "999px" }} />
          <Sk sx={{ width: "10vw", minWidth: 120, height: "3.5dvh", minHeight: 24, maxHeight: 36, borderRadius: "999px" }} />
          <Sk sx={{ width: "2.8dvh", height: "2.8dvh", minWidth: 20, minHeight: 20, maxWidth: 28, maxHeight: 28, borderRadius: "50%" }} />
        </Box>


        {/* Table */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "14px",
            p: "2dvh 1.2vw 1.6dvh",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        >
          {/* Table Header */}
          <Box sx={{ display: "flex", gap: "1vw", px: "1vw", pb: "1.5dvh", borderBottom: "2px solid #e2e8f2" }}>
            {DETAIL_TABLE_COLS.map((col, i) => (
              <Box key={i} sx={{ flex: col.flex }}>
                <Sk sx={{ height: "1.6dvh", minHeight: 12, maxHeight: 18, width: "80%" }} />
              </Box>
            ))}
          </Box>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, rowIdx) => (
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
              {DETAIL_TABLE_COLS.map((col, colIdx) => (
                <Box key={colIdx} sx={{ flex: col.flex }}>
                  {col.type === "checkbox" ? (
                    <Sk sx={{ width: "2dvh", height: "2dvh", minWidth: 14, minHeight: 14, maxWidth: 22, maxHeight: 22, borderRadius: "50%", animationDelay: `${rowIdx * 0.08}s` }} />
                  ) : col.type === "action" ? (
                    <Sk sx={{ width: "2.2dvh", height: "2.2dvh", minWidth: 16, minHeight: 16, maxWidth: 24, maxHeight: 24, borderRadius: "4px", animationDelay: `${rowIdx * 0.08}s` }} />
                  ) : (
                    <Sk sx={{ height: "1.5dvh", minHeight: 11, maxHeight: 16, width: col.width, animationDelay: `${rowIdx * 0.08}s` }} />
                  )}
                </Box>
              ))}
            </Box>
          ))}

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1vw", mt: "2dvh", pr: "0.5vw" }}>
            <Sk sx={{ width: "8vw", minWidth: 80, height: "1.5dvh", minHeight: 11, maxHeight: 16 }} />
            <Sk sx={{ width: "4vw", minWidth: 44, height: "3.5dvh", minHeight: 26, maxHeight: 36, borderRadius: "7px" }} />
            <Sk sx={{ width: "6vw", minWidth: 60, height: "1.5dvh", minHeight: 11, maxHeight: 16 }} />
            <Sk sx={{ width: "2.8dvh", height: "2.8dvh", minWidth: 22, minHeight: 22, maxWidth: 32, maxHeight: 32, borderRadius: "6px" }} />
            <Sk sx={{ width: "2.8dvh", height: "2.8dvh", minWidth: 22, minHeight: 22, maxWidth: 32, maxHeight: 32, borderRadius: "6px" }} />
          </Box>
        </Paper>
      </Box>

      {/* Footer Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1.5vw", mt: "3dvh" }}>
        <Sk sx={{ width: "9vw", minWidth: 100, height: "4.6dvh", minHeight: 34, maxHeight: 46, borderRadius: "6px" }} />
        <Sk sx={{ width: "9vw", minWidth: 100, height: "4.6dvh", minHeight: 34, maxHeight: 46, borderRadius: "6px" }} />
        <Sk sx={{ width: "11vw", minWidth: 130, height: "4.6dvh", minHeight: 34, maxHeight: 46, borderRadius: "6px" }} />
      </Box>
    </Box>
  );
};

export default DetailScreenSkeleton;
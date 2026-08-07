import { Box, Card, CardContent, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ReusableTypography from "./ReusableTypography";

export default function KpiCard({ label, value, trend, trendUp, subtitle }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid var(--divider-primary, #d1d5db)",
        borderRadius: "8px",
        backgroundColor: "var(--background-paper, #fafaff)",
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <ReusableTypography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 500, mb: 0.5, mr: 3 }}
        >
          {label}
        </ReusableTypography>
        <ReusableTypography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "var(--kpi-card-text, #1d1d11)",
            mb: 1,
          }}
        >
          {value}
        </ReusableTypography>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          {trend && (
            <Chip
              size="small"
              icon={
                trendUp ? (
                  <TrendingUpIcon sx={{ fontSize: 14 }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 14 }} />
                )
              }
              label={trend}
              sx={{
                height: 24,
                fontWeight: 600,
                fontSize: 12,
                backgroundColor: trendUp
                  ? "var(--success-light, #eaf5e9)"
                  : "var(--error-light, #fce9ed)",
                color: trendUp
                  ? "var(--success-dark, #2d5f24)"
                  : "var(--error-dark, #a9001a)",
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          )}
          {subtitle && (
            <ReusableTypography variant="caption" color="text.secondary">
              {subtitle}
            </ReusableTypography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

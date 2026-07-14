import { Box, Chip, IconButton, Tooltip, Paper } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";

/**
 * SummaryChipsSection Component
 * Displays summary information as chips with overflow tooltip
 * 
 * @param {Array} summaryData - Array of summary items with key, label, and value
 * @param {boolean} showSummaryChips - Whether to show the chips
 * @param {number} maxVisibleChips - Maximum number of chips to show inline (default: 2)
 */
const SummaryChipsSection = ({ 
  summaryData = [], 
  showSummaryChips = true,
  maxVisibleChips = 2 
}) => {
  const theme = useTheme();

  const activeSummary = summaryData.filter(s => s?.value != null);
  const visibleSummaryChips = activeSummary.slice(0, maxVisibleChips);
  const hiddenSummaryChips = activeSummary.slice(maxVisibleChips);

  if (!showSummaryChips) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        opacity: showSummaryChips ? 1 : 0,
        transform: showSummaryChips ? "translateX(0)" : "translateX(-20px)",
        transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      {visibleSummaryChips.map((item, index) => {
        const chipColor =
          theme.palette.summaryChips?.[item?.key] ||
          theme.palette.summaryChips?.default || { bg: "#e0e0e0", text: "#000000" };

        return (
          <Chip
            key={`vis-${index}`}
            label={`${item.label}: ${item.value}`}
            size="small"
            sx={{
              backgroundColor: chipColor.bg,
              color: chipColor.text,
              fontWeight: "500",
              fontSize: "12px",
              height: "28px",
              borderRadius: "14px",
              border: `1px solid ${chipColor.bg}`,
              transition: "all 0.2s ease",
              opacity: showSummaryChips ? 1 : 0,
              transform: showSummaryChips ? "translateY(0)" : "translateY(-10px)",
              transitionDelay: showSummaryChips ? `${index * 0.1}s` : "0s",
              "&:hover": {
                transform: "translateY(-2px) scale(1.05)",
                boxShadow: `0 4px 12px ${chipColor.bg}50`,
                backgroundColor: chipColor.text,
                color: "#ffffff",
              },
            }}
          />
        );
      })}

      {hiddenSummaryChips.length > 0 && (
        <Tooltip
          placement="top-start"
          arrow
          enterTouchDelay={0}
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: 'transparent',
                color: 'inherit',
                p: 0,
                boxShadow: 'none',
                border: 'none',
              },
            },
            arrow: {
              sx: {
                color: (theme) => theme.palette.background.paper,
              },
            },
          }}
          title={
            <Box
              component={Paper}
              elevation={3}
              sx={{
                p: 1,
                borderRadius: 2,
                maxWidth: 500,
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {hiddenSummaryChips.map((item, i) => {
                  const chipColor =
                    theme.palette.summaryChips?.[item?.key] ||
                    theme.palette.summaryChips?.default || { bg: '#e0e0e0', text: '#000' };
                  return (
                    <Chip
                      key={`hid-${i}`}
                      label={`${item.label}: ${item.value}`}
                      size="small"
                      sx={{
                        backgroundColor: chipColor.bg,
                        color: chipColor.text,
                        fontWeight: 500,
                        fontSize: '12px',
                        height: '26px',
                        borderRadius: '14px',
                        border: `1px solid ${chipColor.bg}`,
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          }
        >
          <IconButton size="small" sx={{ p: 0.5, ml: 0.5 }}>
            <InfoIcon fontSize="small" color="disabled" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default SummaryChipsSection;

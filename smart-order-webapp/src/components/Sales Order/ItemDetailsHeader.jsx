import { Typography, IconButton, useMediaQuery } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InfoIcon from "@mui/icons-material/Info";
import { useTranslation } from "react-i18next";
import SummaryChipsSection from "./SummaryChipsSection";

/**
 * ItemDetailsHeader Component
 * Displays the item list title, count, toggle button, and summary chips
 * 
 * @param {string} title - Title to display
 * @param {number} itemCount - Number of items to display in title
 * @param {boolean} showSummaryChips - Whether summary chips are visible
 * @param {Function} onToggleSummary - Handler to toggle summary visibility
 * @param {Array} summaryData - Array of summary data items
 * @param {boolean} deletedMode - Whether in deleted mode
 */
const ItemDetailsHeader = ({
  title,
  itemCount = 0,
  showSummaryChips = true,
  onToggleSummary,
  summaryData = [],
  deletedMode = false,
}) => {
  const { t } = useTranslation();

  const isKeyPadMobile = useMediaQuery("(max-width:370px)");

  return (
    <div className="heading" style={{ flex: "1 1 auto", minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "19px",
            textAlign: "left",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {title} ({itemCount})
        </Typography>

        {!deletedMode && (
          <IconButton
            onClick={onToggleSummary}
            sx={{
              color: "#3026B9",
              backgroundColor: "#EAE9FF",
              "&:hover": {
                backgroundColor: "#D1CFFF",
              },
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              transition: "all 0.3s ease",
              border: showSummaryChips
                ? "2px solid #3026B9"
                : "1px solid #EAE9FF",
              boxShadow: showSummaryChips
                ? "0 2px 8px rgba(48, 38, 185, 0.2)"
                : "none",
              transform: showSummaryChips ? "rotate(0deg)" : "rotate(0deg)",
            }}
            title={showSummaryChips ? t("Hide Summary") : t("Show Summary")}
          >
            {showSummaryChips ? (
              <ArrowForwardIosIcon sx={{ fontSize: "14px" }} />
            ) : (
              <InfoIcon fontSize="small" />
            )}
          </IconButton>
        )}

        {!deletedMode && showSummaryChips && (
          <SummaryChipsSection
            summaryData={summaryData}
            showSummaryChips={showSummaryChips}
            maxVisibleChips={isKeyPadMobile ? 1 : 2}
          />
        )}
      </div>
    </div>
  );
};

export default ItemDetailsHeader;

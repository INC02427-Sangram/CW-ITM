import React, { useState } from "react";
import { Box, Typography, Divider, Stack, CircularProgress, Popover } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HeaderControlButton as Button } from "./Button";
import { ButtonTypes } from "./UITypes";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Chip } from "@cw/rds";
import { useMediaQuery } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import Popover from "@mui/material/Popover";

export const OrderHeaderSection = ({
  title = "Order Header Information",
  exceptionTypeArray = [],
  editMode = false,
  isSaving = false,
  isRestricted = false,
  status = "",
  onEditToggle,
  onCancel,
  onSave,
  onCustomerSearchClick,
  t = (key) => key, // Translation function
}) => {
  const theme = useTheme();
  const isBelowTabletView = useMediaQuery(theme.breakpoints.down("md"));
  const showEditButton = (status === "toBeReviewed" || status === "pendingForApproval" || status === "rejected") && !isRestricted;
  const [menuAnchor, setMenuAnchor] = useState(null);
  const ViewModeActionButtons = () => (
    <>
      <Stack direction={isBelowTabletView ? "column" : "row"} spacing={1}>
        <Button
          action={ButtonTypes.DEFAULT}
          size="small"
          startIcon={<SearchIcon />}
          onClick={(event) => {
            onCustomerSearchClick(event);
            setMenuAnchor(null);
          }}
        >
          Customer Search
        </Button>
        <Button
          style={{
            display: showEditButton ? "inline-flex" : "none",
          }}
          action={ButtonTypes.EDIT}
          size="small"
          startIcon={<EditIcon />}
          onClick={() => {
            onEditToggle();
            setMenuAnchor(null);
          }}
        >
          Edit
        </Button>
      </Stack>
    </>
  )

  const EditModeActionButtons = () => (
    <>
      <Stack direction={isBelowTabletView ? "column" : "row"} spacing={1}>
        <Button
          action={ButtonTypes.DEFAULT}
          size="small"
          startIcon={<SearchIcon />}
          onClick={(event) => {
            onCustomerSearchClick(event);
            setMenuAnchor(null);
          }}
        >
          Customer Search
        </Button>

        <Button
          action={ButtonTypes.CLEAR}
          size="small"
          startIcon={<CloseIcon />}
          onClick={(event) => {
            onCancel(event);
            setMenuAnchor(null);
          }}
          disabled={isSaving}
        >
          {t("Cancel")}
        </Button>

        <Button
          action={ButtonTypes.SAVE}
          size="small"
          startIcon={isSaving ? <CircularProgress size={14} /> : <SaveIcon />}
          disabled={isSaving}
          onClick={() => {
            onSave();
            setMenuAnchor(null);
          }}
        >
          {isSaving ? t("Saving…") : t("Save")}
        </Button>
      </Stack>
    </>
  )

  const ActionButtons = () => (
    <>
      {!editMode ? (
        <ViewModeActionButtons />
      ) : (
        <EditModeActionButtons />
      )}
    </>
  )

  const ExceptionChips = () => (
    <>
      {exceptionTypeArray.map((item, ind) => {
        // Normalize item key to match the theme key
        const key = item
          .replace(/\s+/g, "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .replace(/^./, (c) => c.toLowerCase());

        const chipColors =
          theme.palette.exceptionChips[key] ||
          theme.palette.exceptionChips.default;

        return (
          <Chip
            key={ind}
            label={item}
            size="small"
            style={{
              height: "1.75rem",
              margin: "0.5rem",
              backgroundColor: chipColors.bg,
              color: chipColors.text,
              border: `1px solid ${chipColors.bg}`,
              fontWeight: 500,
            }}
          />
        );
      })}
    </>
  )

  return (
    <>
      <Box
        sx={{
          display: {
            xs: "grid",
            md: "flex",
          },
          gridTemplateColumns: {
            xs: "auto auto",
          },
          gridTemplateRows: {
            xs: "auto auto",
          },
          "@media (max-width: 389px)": {
            gridTemplateColumns: "1fr",
          },
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" >
            {title}
          </Typography>
          <Box sx={{
            display: {
              xs: "none",
              sm: "block"
            }
          }}>
            <ExceptionChips />
          </Box>
        </Box>
        <Box sx={{
          display: {
            xs: "block",
            sm: "none"
          },
          gridColumn: {
            xs: "1/3",
            sm: "auto"
          },
          gridRow: {
            xs: "2/3",
            sm: "auto"
          },
          "@media (max-width: 389px)": {
            gridColumn: "1/2",
            gridRow: "3/4",
          }
        }}>
          <ExceptionChips />
        </Box>
        {
          isBelowTabletView ? (
            <>
              <Button
                action={ButtonTypes.DEFAULT}
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{
                  alignSelf: "flex-start",
                  justifySelf: "flex-end",
                  "@media (max-width: 389px)": {
                    gridColumn: "1/2",
                    gridRow: "2/3",
                    justifySelf: "stretch",
                    width: "100% !important",
                  },
                }}
              >
                Actions
              </Button>
              <Popover
                open={Boolean(menuAnchor)}
                anchorEl={menuAnchor}
                onClose={() => setMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: { p: 1 },
                }}
              >
                <ActionButtons />
              </Popover>
            </>
          ) : (
            <ActionButtons />
          )
        }

      </Box >
      <Divider sx={{ mb: 2 }} />
    </>
  );
};

export default OrderHeaderSection;

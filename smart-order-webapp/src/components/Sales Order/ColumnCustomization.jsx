import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Box,
  IconButton,
  Switch,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  setCurrentColumnsList,
  setSoColumnList,
} from "../../redux/reducers/appReducer";
import fnServiceRequest from "../../utility/fnServiceRequest";
import { HeaderControlButton as CustomButton } from "../../UIComponents/Button";
import { ButtonTypes } from "../../UIComponents/UITypes";

// Fields that cannot be hidden by the user (default for Sales Order list)
const LOCKED_FIELDS = ["Request ID", "Exception Type", "Edit", "Action", "Status"];

const ColumnCustomizationDialog = ({
  visible,
  setVisibility,
  columns,
  defaultColumns,
  userEmail,
  // Optional: override which fields are locked (non-hideable). Defaults to SO list locked fields.
  lockedFields = LOCKED_FIELDS,
  // Optional: custom apply handler. When provided, the caller handles Redux + persistence.
  // When NOT provided, falls back to the original SO-list behavior (setSoColumnList + backend API).
  onApply,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [customizedColumns, setCustomizedColumns] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [changesMade, setChangesMade] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mobileLeftExpanded, setMobileLeftExpanded] = useState(true);
  const [mobileRightExpanded, setMobileRightExpanded] = useState(false);

  // Initialize columns when the dialog opens
  useEffect(() => {
    if (visible && columns?.length) {
      setCustomizedColumns(columns.map((c) => ({ ...c })));
      setChangesMade(false);
      setSearchText("");
      setMobileLeftExpanded(true);
      setMobileRightExpanded(false);
    }
  }, [visible, columns]);

  const handleClose = () => {
    setVisibility(false);
  };

  // Toggle column visibility
  const handleToggleVisibility = (fieldName) => {
    setCustomizedColumns((prev) =>
      prev.map((col) =>
        col.fieldName === fieldName ? { ...col, visible: !col.visible } : col
      )
    );
    setChangesMade(true);
  };

  // Drag end handler for reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(customizedColumns);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setCustomizedColumns(items);
    setChangesMade(true);
  };

  // Reset to default column order and visibility from applicationConfig
  const handleReset = () => {
    if (defaultColumns?.length) {
      const reset = defaultColumns.map((c) => ({ ...c }));
      setCustomizedColumns(reset);
      setChangesMade(true);
    }
  };

  // Build the payload for the API and dispatch to Redux
  const handleApply = () => {
    if (onApply) {
      // Custom apply handler supplied (e.g. ItemDetails for item-level columns).
      // The caller is fully responsible for Redux dispatch + persistence.
      setSaving(true);
      onApply(customizedColumns);
      setSaving(false);
      setChangesMade(false);
      // Note: caller is responsible for closing the dialog (setVisibility)
    } else {
      // ── Original SO list behavior — untouched ──────────────────────────
      // Update Redux immediately
      dispatch(setSoColumnList(customizedColumns));
      dispatch(setCurrentColumnsList(customizedColumns));

      // Persist to backend
      const columnsPayload = customizedColumns.map((col, idx) => ({
        fieldName: col.fieldName,
        visible: col.visible,
        order: idx,
      }));

      setSaving(true);
      const url = `/JavaServices_Oauth/api/salesOrder/saveUserColumnPreferences`;
      fnServiceRequest(
        url,
        "POST",
        () => {
          setSaving(false);
          setChangesMade(false);
          setVisibility(false);
        },
        (err) => {
          console.error("Failed to save column preferences:", err);
          setSaving(false);
          // Still close — Redux is already updated so the UI reflects the change
          setChangesMade(false);
          setVisibility(false);
        },
        {
          email: userEmail,
          moduleName: "Sales Order",
          columns: columnsPayload,
        }
      );
    }
  };

  // Filtered list for the left-panel search
  const filteredColumns = customizedColumns.filter((col) =>
    (col.fieldName || "").toLowerCase().includes(searchText.toLowerCase())
  );

  // Visible / hidden counts
  const visibleCount = customizedColumns.filter((c) => c.visible).length;
  const hiddenCount = customizedColumns.length - visibleCount;

  const renderLeftPanel = () => (
    <>
      <Box sx={{ px: { xs: 2, sm: 2 }, pt: 2, pb: 1, flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {t("Show / Hide Columns")}
          </Typography>
          {hiddenCount > 0 && (
            <Chip
              label={`${hiddenCount} hidden`}
              size="small"
              color="default"
              variant="outlined"
              sx={{ fontSize: "11px", height: "20px" }}
            />
          )}
          {visibleCount > 0 && (
            <Chip
              label={`${visibleCount} visible`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: "11px", height: "20px" }}
            />
          )}
        </Box>

        <TextField
          size="small"
          placeholder={t("Search columns...")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontSize: "13px",
              bgcolor: theme.palette.background.paper,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 1,
          pb: 1,
        }}
      >
        {filteredColumns.map((col) => {
          const locked = lockedFields.includes(col.fieldName);
          return (
            <ListItem
              key={col.fieldName}
              onClick={() => !locked && handleToggleVisibility(col.fieldName)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                py: 0.8,
                mb: 0.5,
                borderRadius: "10px",
                cursor: locked ? "default" : "pointer",
                transition: "all 0.15s ease",
                bgcolor: col.visible
                  ? theme.palette.primary.main + "0A"
                  : "transparent",
                "&:hover": locked
                  ? {}
                  : {
                      bgcolor: col.visible
                        ? theme.palette.primary.main + "14"
                        : theme.palette.action.hover,
                    },
                opacity: locked ? 0.55 : 1,
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                {col.visible ? (
                  <VisibilityIcon fontSize="small" color="primary" />
                ) : (
                  <VisibilityOffIcon fontSize="small" color="disabled" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={t(col.fieldName)}
                primaryTypographyProps={{ fontSize: "13px", fontWeight: col.visible ? 500 : 400 }}
              />
              <Switch
                checked={!!col.visible}
                size="small"
                disabled={locked}
                onChange={() => !locked && handleToggleVisibility(col.fieldName)}
                onClick={(e) => e.stopPropagation()}
              />
            </ListItem>
          );
        })}
      </Box>
    </>
  );

  const renderRightPanel = () => (
    <>
      <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: 2, pb: 1, flexShrink: 0 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {t("Column Order")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t("Drag to reorder columns")}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: { xs: 1, sm: 1.5 },
          pb: 1,
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {customizedColumns.map((col, index) => (
                  <Draggable key={col.fieldName} draggableId={col.fieldName} index={index}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: 1.5,
                          py: 0.8,
                          mb: 0.5,
                          borderRadius: "10px",
                          bgcolor: snapshot.isDragging
                            ? theme.palette.action.selected
                            : col.visible
                            ? theme.palette.background.paper
                            : theme.palette.action.disabledBackground,
                          border: `1px solid ${
                            snapshot.isDragging
                              ? theme.palette.primary.main
                              : theme.palette.divider
                          }`,
                          boxShadow: snapshot.isDragging ? 3 : 0,
                          transition: "box-shadow 0.15s ease",
                          opacity: col.visible ? 1 : 0.5,
                        }}
                      >
                        <DragIndicatorIcon
                          fontSize="small"
                          sx={{ color: theme.palette.text.disabled, flexShrink: 0 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            minWidth: 20,
                            color: theme.palette.text.secondary,
                            fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ flex: 1, fontSize: "13px", fontWeight: col.visible ? 500 : 400 }}
                        >
                          {t(col.fieldName)}
                        </Typography>
                        {!col.visible && (
                          <Chip
                            label={t("Hidden")}
                            size="small"
                            sx={{ fontSize: "10px", height: "18px" }}
                          />
                        )}
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </>
  );

  return (
    <Dialog
      open={visible}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : "16px",
          height: isMobile ? "100%" : "85vh",
          maxHeight: isMobile ? "100%" : "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          pt: 2,
          px: { xs: 2, sm: 3 },
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ViewColumnIcon color="primary" fontSize="small" />
          <Typography variant="h6" fontWeight={600} fontSize={{ xs: "1rem", sm: "1.1rem" }}>
            {t("Customize Columns")}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ flexShrink: 0 }} />

      {/* ── Body ────────────────────────────────────────── */}
      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isMobile ? (
          <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <Accordion
              expanded={mobileLeftExpanded}
              onChange={() => setMobileLeftExpanded((prev) => !prev)}
              disableGutters
              sx={{
                boxShadow: "0px 4px 6px -4px rgba(200, 205, 235, 0.9)",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                mx: 1,
                mt: 1,
                overflow: "hidden",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  minHeight: "44px",
                  px: 1.5,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {t("Show / Hide Columns")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0, display: "flex", flexDirection: "column", minHeight: 0 }}>
                {renderLeftPanel()}
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={mobileRightExpanded}
              onChange={() => setMobileRightExpanded((prev) => !prev)}
              disableGutters
              sx={{
                boxShadow: "0px 4px 6px -4px rgba(200, 205, 235, 0.9)",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                mx: 1,
                mt: 1,
                overflow: "hidden",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  minHeight: "44px",
                  px: 1.5,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {t("Column Order")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0, display: "flex", flexDirection: "column", minHeight: 0 }}>
                {renderRightPanel()}
              </AccordionDetails>
            </Accordion>
          </Box>
        ) : (
          <Grid
            container
            sx={{
              flex: 1,
              minHeight: 0,
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* ── Left panel ──────────────────────────────── */}
            <Grid
              item
              xs={12}
              sm={5}
              sx={{
                borderRight: { xs: "none", sm: `1px solid ${theme.palette.divider}` },
                borderBottom: { xs: `1px solid ${theme.palette.divider}`, sm: "none" },
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                height: "100%",
              }}
            >
              {renderLeftPanel()}
            </Grid>

            {/* ── Right panel ─────────────────────────────── */}
            <Grid
              item
              xs={12}
              sm={7}
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                height: "100%",
              }}
            >
              {renderRightPanel()}
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <Divider sx={{ flexShrink: 0 }} />

      {/* ── Footer ──────────────────────────────────────── */}
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 1 },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          flexShrink: 0,
        }}
      >
        <CustomButton
          type={ButtonTypes.SECONDARY}
          onClick={handleReset}
          startIcon={<RestartAltIcon fontSize="small" />}
          size="small"
          sx={{ fontSize: { xs: "12px", sm: "13px" } }}
        >
          {t("Reset to Default")}
        </CustomButton>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClose}
            sx={{ fontSize: { xs: "12px", sm: "13px" } }}
          >
            {t("Cancel")}
          </Button>
          <CustomButton
            type={ButtonTypes.PRIMARY}
            size="small"
            onClick={handleApply}
            disabled={!changesMade || saving}
            sx={{ fontSize: { xs: "12px", sm: "13px" } }}
          >
            {saving ? t("Saving...") : t("Apply")}
          </CustomButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnCustomizationDialog;
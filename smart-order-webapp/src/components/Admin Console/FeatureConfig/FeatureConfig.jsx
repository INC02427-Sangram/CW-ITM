/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  TextField,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Draggable from "react-draggable";
import BusyIndicator from "../../../utility/BusyIndicator";
import CustomIcon from "../../../UIComponents/CustomIcon";
import {
  makeDragId,
  parseDragId,
  buildGroupedFeatures,
  getMandatoryItems,
  injectMandatoryFeatures,
  buildSavePayload,
  computeHasChanges,
} from "./featureConfig.utils";
import {
  fetchAllFeatures,
  fetchConfigForCountryAndSalesOrg,
  saveFeatureConfig,
} from "./featureConfig.services";

// ── DraggablePaper (for draggable Dialog) ─────────────────────────────────────

const DraggablePaper = forwardRef(function DraggablePaper(props, ref) {
  const nodeRef = useMemo(() => {
    let _current = null;
    return {
      get current() {
        return _current;
      },
      set current(value) {
        _current = value;
        if (typeof ref === "function") ref(value);
        else if (ref) ref.current = value;
      },
    };
  }, [ref]);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#feature-submit-preview"
      cancel={
        '[class*="MuiDialogContent-root"],[class*="MuiDialogActions-root"]'
      }
    >
      <Paper ref={nodeRef} {...props} />
    </Draggable>
  );
});

// ── DraggableItem ─────────────────────────────────────────────────────────────

function DraggableItem({ id, onDoubleClick, isMandatory }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const { item } = parseDragId(id);

  return (
    <Paper
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      onDoubleClick={() => onDoubleClick(id)}
      sx={{
        p: 1.25,
        mb: 1,
        cursor: "pointer",
        borderRadius: 2,
        border: isMandatory ? "1px solid #f59e0b" : "1px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(15, 23, 42, 0.08)",
        fontSize: "0.875rem",
        color: "#374151",
        display: "flex",
        alignItems: "center",
        gap: 1,
        backgroundColor: isMandatory ? "#fffbeb" : "#fff",
        opacity: isDragging ? 0.3 : 1,
      }}
    >
      <Box
        component="span"
        {...listeners}
        sx={{
          color: isMandatory ? "#f59e0b" : "#9ca3af",
          fontSize: "1rem",
          cursor: isMandatory ? "not-allowed" : "grab",
          lineHeight: 1,
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        {isMandatory ? "🔒" : "⠿"}
      </Box>
      {item}
      {isMandatory && (
        <Chip
          label="Required"
          size="small"
          sx={{
            ml: "auto",
            backgroundColor: "#fef3c7",
            color: "#92400e",
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 20,
          }}
        />
      )}
    </Paper>
  );
}

// ── DropZone ──────────────────────────────────────────────────────────────────

const DropZone = ({ id, items, onDoubleClick, variant, mandatoryItems }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: 120,
        p: 1.25,
        borderRadius: 2,
        backgroundColor: isOver
          ? "#eff6ff"
          : variant === "selected"
            ? "#f0fdf4"
            : "#fff7f1",
        border: isOver
          ? "1px dashed #2563eb"
          : variant === "selected"
            ? "1px dashed #86efac"
            : "1px dashed #e99c5e",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      {items.length === 0 && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: "block", textAlign: "center", mt: 3 }}
        >
          Drop items here
        </Typography>
      )}
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => {
          const { item: desc } = parseDragId(item);
          return (
            <DraggableItem
              key={item}
              id={item}
              onDoubleClick={onDoubleClick}
              isMandatory={mandatoryItems.has(desc)}
            />
          );
        })}
      </SortableContext>
    </Box>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function DragDropFeatureConfig() {
  const dispatch = useDispatch();
  const countryOrgData = useSelector(
    (state) => state.appReducer.dataLevelAccess,
  );

  const countries = useMemo(
    () =>
      (countryOrgData || []).map((c) => ({
        code: c.countryCode,
        name: c.countryName,
        id: c.country_id,
      })),
    [countryOrgData],
  );

  const getSalesOrgsForCountry = (countryCode) => {
    const found = (countryOrgData || []).find(
      (c) => c.countryCode === countryCode,
    );
    return found ? found.salesOrgs : [];
  };

  // ── state ─────────────────────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState(
    countries[0]?.code || "",
  );
  const [selectedSalesOrgs, setSelectedSalesOrgs] = useState([]);
  const activeSalesOrg = selectedSalesOrgs[0] || "";

  const [allFeatures, setAllFeatures] = useState([]);
  const [state, setState] = useState({});
  const [savedSnapshot, setSavedSnapshot] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "" });
  const [search, setSearch] = useState("");

  // ── derived ───────────────────────────────────────────────────────────────
  const groupedFeatures = useMemo(
    () => buildGroupedFeatures(allFeatures),
    [allFeatures],
  );

  const hasChanges = useMemo(
    () =>
      computeHasChanges({
        state,
        savedSnapshot,
        selectedCountry,
        activeSalesOrg,
        groupedFeatures,
      }),
    [state, savedSnapshot, selectedCountry, activeSalesOrg, groupedFeatures],
  );

  // ── effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const orgs = getSalesOrgsForCountry(selectedCountry);
    setSelectedSalesOrgs(orgs.length ? [orgs[0].salesOrg] : []);
  }, [selectedCountry, countryOrgData]);

  useEffect(() => {
    fetchAllFeatures({
      setLoading,
      onSuccess: setAllFeatures,
    });
  }, []);

  useEffect(() => {
    if (!selectedCountry || !activeSalesOrg) return;
    fetchConfigForCountryAndSalesOrg({
      country: selectedCountry,
      salesOrg: activeSalesOrg,
      setLoading,
      onSuccess: ({ newOrgState }) => {
        const enrichedOrgState = { ...newOrgState };
        allFeatures
          .filter((f) => f.isMandatory && f.isActive)
          .forEach(({ categoryDesc, featureDesc }) => {
            const current = enrichedOrgState[categoryDesc] || [];
            if (!current.includes(featureDesc)) {
              enrichedOrgState[categoryDesc] = [...current, featureDesc];
            }
          });

        // state gets mandatory features pre-selected so they appear in Selected column
        setState((prev) => ({
          ...prev,
          [selectedCountry]: {
            ...(prev[selectedCountry] || {}),
            [activeSalesOrg]: enrichedOrgState,
          },
        }));
        // snapshot stays as raw API data so unsaved mandatory features show as "Added"
        // and the user is prompted to submit/save them
        setSavedSnapshot((prev) => ({
          ...prev,
          [selectedCountry]: {
            ...(prev[selectedCountry] || {}),
            [activeSalesOrg]: newOrgState,
          },
        }));
      },
    });
  }, [selectedCountry, activeSalesOrg]);

  // force mandatory into state after allFeatures is ready; snapshot is left as-is
  // so the diff shows mandatory features as "Added" and prompts the user to save
  useEffect(() => {
    if (!allFeatures.length || !selectedCountry || !activeSalesOrg) return;
    const mandatoryFeatures = allFeatures.filter(
      (f) => f.isMandatory && f.isActive,
    );
    if (!mandatoryFeatures.length) return;

    setState((prev) =>
      injectMandatoryFeatures(
        prev,
        mandatoryFeatures,
        selectedCountry,
        activeSalesOrg,
      ),
    );
  }, [allFeatures, selectedCountry, activeSalesOrg]);

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleSelectAll = (category, availableItems) => {
    setState((prev) => {
      const countryState = prev[selectedCountry] || {};
      const orgState = countryState[activeSalesOrg] || {};
      const current = orgState[category] || [];
      return {
        ...prev,
        [selectedCountry]: {
          ...countryState,
          [activeSalesOrg]: {
            ...orgState,
            [category]: [...new Set([...current, ...availableItems])],
          },
        },
      };
    });
  };

  const handleRemoveAll = (category, mandatoryItems) => {
    setState((prev) => {
      const countryState = prev[selectedCountry] || {};
      const orgState = countryState[activeSalesOrg] || {};
      const current = orgState[category] || [];
      return {
        ...prev,
        [selectedCountry]: {
          ...countryState,
          [activeSalesOrg]: {
            ...orgState,
            [category]: current.filter((i) => mandatoryItems.has(i)),
          },
        },
      };
    });
  };

  const handleMove = (item, category, toSelected) => {
    if (!toSelected) {
      const mandatory = getMandatoryItems(allFeatures, category);
      if (mandatory.has(item)) {
        setToast({
          open: true,
          message: `"${item}" is a required feature and cannot be removed.`,
        });
        return;
      }
    }
    setState((prev) => {
      const countryState = prev[selectedCountry] || {};
      const orgState = countryState[activeSalesOrg] || {};
      const selected = orgState[category] || [];
      const updated = toSelected
        ? [...new Set([...selected, item])]
        : selected.filter((i) => i !== item);

      return {
        ...prev,
        [selectedCountry]: {
          ...countryState,
          [activeSalesOrg]: { ...orgState, [category]: updated },
        },
      };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const { category: activeCategory, item: activeItem } = parseDragId(
      active.id,
    );
    const overId = over.id;
    const currentSelected =
      state?.[selectedCountry]?.[activeSalesOrg]?.[activeCategory] || [];
    const isActiveSelected = currentSelected.includes(activeItem);

    if (overId === `${activeCategory}||selected`) {
      if (!isActiveSelected) handleMove(activeItem, activeCategory, true);
      return;
    }
    if (overId === `${activeCategory}||available`) {
      if (isActiveSelected) handleMove(activeItem, activeCategory, false);
      return;
    }

    const { category: overCategory, item: overItem } = parseDragId(overId);
    if (activeCategory !== overCategory) return;

    const isOverSelected = currentSelected.includes(overItem);

    if (!isActiveSelected && isOverSelected) {
      handleMove(activeItem, activeCategory, true);
      return;
    }
    if (isActiveSelected && !isOverSelected) {
      handleMove(activeItem, activeCategory, false);
      return;
    }
    if (isActiveSelected && isOverSelected) {
      const oldIndex = currentSelected.indexOf(activeItem);
      const newIndex = currentSelected.indexOf(overItem);
      if (oldIndex !== newIndex) {
        const reordered = arrayMove(currentSelected, oldIndex, newIndex);
        setState((prev) => ({
          ...prev,
          [selectedCountry]: {
            ...prev[selectedCountry],
            [activeSalesOrg]: {
              ...prev[selectedCountry]?.[activeSalesOrg],
              [activeCategory]: reordered,
            },
          },
        }));
      }
    }
  };

  const handleSave = () => {
    const payload = buildSavePayload({
      allFeatures,
      state,
      selectedCountry,
      activeSalesOrg,
      selectedSalesOrgs,
      countryOrgData,
    });
    saveFeatureConfig({
      payload,
      setLoading,
      onSuccess: () => setSavedSnapshot(JSON.parse(JSON.stringify(state))),
      dispatch,
    });
  };

  const handleReset = () => setState(JSON.parse(JSON.stringify(savedSnapshot)));
  const handleSubmitClick = () => setPreviewOpen(true);
  const handleConfirmSubmit = () => {
    setPreviewOpen(false);
    handleSave();
  };

  const salesOrgsForCountry = getSalesOrgsForCountry(selectedCountry);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <Box
      p={{ xs: 1, md: 2 }}
      m={2}
      sx={{
        mb: "60px",
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      {loading && <BusyIndicator />}

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast({ open: false, message: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setToast({ open: false, message: "" })}
          sx={{ fontWeight: 600 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Toolbar */}
      <Grid
        container
        alignItems="center"
        mb={3}
        sx={{
          p: 2,
          backgroundColor: (theme) => theme.palette.background.paper,
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
        }}
      >
        {/* Country */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          display={"flex"}
          alignItems="center"
          gap={1}
          sx={{
            pr: { xs: 1, md: 2 },
            pb: { xs: 2, md: 0 },
          }}
        >
          <Typography variant="body2" fontWeight={500} color="text.secondary">
            Country:
          </Typography>
          <Select
            size="small"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            sx={{
              width: "100%",
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            {countries.map(({ code, name }) => (
              <MenuItem key={code} value={code}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Sales Org multi-select */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          display={"flex"}
          alignItems="center"
          gap={1}
          sx={{
            pr: { xs: 1, md: 2 },
            pb: { xs: 2, md: 0 },
          }}
        >
          <Typography
            variant="body2"
            fontWeight={500}
            color="text.secondary"
            sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            Sales Org:
          </Typography>
          <Select
            size="small"
            multiple
            value={selectedSalesOrgs}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 0) setSelectedSalesOrgs(value);
            }}
            disabled={!salesOrgsForCountry.length}
            renderValue={(selected) => (
              <Box display="flex" gap={0.5} flexWrap="wrap">
                {selected.map((org) => (
                  <Chip key={org} label={org} size="small" />
                ))}
              </Box>
            )}
            sx={{
              width: "100%",
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            {salesOrgsForCountry.map(({ salesOrg }) => (
              <MenuItem key={salesOrg} value={salesOrg}>
                <Checkbox checked={selectedSalesOrgs.includes(salesOrg)} />
                <ListItemText primary={salesOrg} />
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          display={"flex"}
          alignItems="center"
          gap={1}
          sx={{
            pr: { xs: 1, md: 2 },
            pb: { xs: 2, md: 0 },
          }}
        >
          {" "}
          {selectedSalesOrgs.length > 1 && (
            <Typography variant="caption" color="text.secondary">
              Config will be applied to{" "}
              <strong>{selectedSalesOrgs.length} sales orgs</strong> on save
            </Typography>
          )}
        </Grid>

        {/* Search */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          display={"flex"}
          alignItems="center"
          gap={1}
          sx={{
            pr: { xs: 1, md: 2 },
            pb: { xs: 2, md: 0 },
          }}
        >
          <TextField
            size="small"
            placeholder="Search features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{
              width: "100%",
              backgroundColor: (theme) => theme.palette.background.paper,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
            InputProps={{
              startAdornment: (
                <CustomIcon
                  iconName="SearchStatus"
                  library="rds"
                  size="small"
                  sx={{ marginRight: 8 }}
                />
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* DnD grid */}
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <Grid container spacing={3}>
          {Object.entries(groupedFeatures).map(([category, features]) => {
            const mandatoryItems = getMandatoryItems(allFeatures, category);
            const selectedAll =
              state?.[selectedCountry]?.[activeSalesOrg]?.[category] || [];
            const selected = (
              state?.[selectedCountry]?.[activeSalesOrg]?.[category] || []
            )
              .filter((f) => f.toLowerCase().includes(search.toLowerCase()))
              .sort((a, b) => {
                const aM = mandatoryItems.has(a) ? 0 : 1;
                const bM = mandatoryItems.has(b) ? 0 : 1;
                return aM - bM;
              });

            const available = features.filter(
              (f) =>
                !selected.includes(f) &&
                f.toLowerCase().includes(search.toLowerCase()),
            );

            if (available.length === 0 && selected.length === 0) return null;

            return (
              <Grid item xs={12} key={category}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    backgroundColor: (theme) => theme.palette.background.paper,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    mb={1}
                    fontSize="1rem"
                    textTransform="uppercase"
                    letterSpacing={1}
                    color={(theme) => theme.palette.text.primary}
                    sx={{ borderLeft: "3px solid #1976d2", pl: 1 }}
                  >
                    {category}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" mb={1} gap={1}>
                        <Typography
                          flex={1}
                          sx={{
                            fontWeight: 600,
                            color: (theme) => theme.palette.text.primary,
                          }}
                        >
                          Available
                        </Typography>
                        <Chip
                          label={available.length}
                          size="small"
                          sx={{
                            backgroundColor: "#fef3c7",
                            color: "#78350f",
                            fontWeight: 600,
                          }}
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={available.length === 0}
                          onClick={() => handleSelectAll(category, available)}
                          sx={{
                            textTransform: "none",
                            fontSize: "0.7rem",
                            py: 0.25,
                            px: 1,
                            minWidth: 0,
                          }}
                        >
                          Select All
                        </Button>
                      </Box>
                      <DropZone
                        id={`${category}||available`}
                        items={available.map((i) => makeDragId(category, i))}
                        mandatoryItems={mandatoryItems}
                        onDoubleClick={(id) => {
                          const { item } = parseDragId(id);
                          handleMove(item, category, true);
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" mb={1} gap={1}>
                        <Typography
                          flex={1}
                          sx={{
                            fontWeight: 600,
                            color: (theme) => theme.palette.text.primary,
                          }}
                        >
                          Selected
                        </Typography>
                        <Chip
                          label={selected.length}
                          size="small"
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.success.light,
                            color: (theme) => theme.palette.success.dark,
                            fontWeight: 600,
                          }}
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={
                            selectedAll.filter((f) => !mandatoryItems.has(f))
                              .length === 0
                          }
                          onClick={() =>
                            handleRemoveAll(category, mandatoryItems)
                          }
                          sx={{
                            textTransform: "none",
                            fontSize: "0.7rem",
                            py: 0.25,
                            px: 1,
                            minWidth: 0,
                          }}
                        >
                          Remove All
                        </Button>
                      </Box>
                      <DropZone
                        id={`${category}||selected`}
                        items={selected.map((i) => makeDragId(category, i))}
                        mandatoryItems={mandatoryItems}
                        onDoubleClick={(id) => {
                          const { item } = parseDragId(id);
                          handleMove(item, category, false);
                        }}
                        variant="selected"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        <DragOverlay>
          {activeId ? (
            <Paper
              sx={{
                p: 1.25,
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 24px rgba(15,23,42,0.18)",
                backgroundColor: "#fff",
                fontSize: "0.875rem",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "grabbing",
              }}
            >
              {parseDragId(activeId).item}
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperComponent={DraggablePaper}
      >
        <DialogTitle
          sx={{ fontWeight: 700, cursor: "move", userSelect: "none" }}
          id="feature-submit-preview"
        >
          Preview Changes — {selectedCountry} / {selectedSalesOrgs.join(", ")}
        </DialogTitle>
        <DialogContent dividers>
          {selectedSalesOrgs.length > 1 && (
            <Box
              mb={2}
              p={1.5}
              sx={{
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 2,
              }}
            >
              <Typography fontSize="0.875rem" color="#1e40af">
                This config will be applied to all{" "}
                <strong>{selectedSalesOrgs.length}</strong> selected sales orgs:{" "}
                <strong>{selectedSalesOrgs.join(", ")}</strong>
              </Typography>
            </Box>
          )}

          {Object.entries(groupedFeatures).map(([category]) => {
            const prev =
              savedSnapshot?.[selectedCountry]?.[activeSalesOrg]?.[category] ||
              [];
            const curr =
              state?.[selectedCountry]?.[activeSalesOrg]?.[category] || [];
            const added = curr.filter((i) => !prev.includes(i));
            const removed = prev.filter((i) => !curr.includes(i));
            const reordered = curr.filter(
              (i) => prev.includes(i) && curr.indexOf(i) !== prev.indexOf(i),
            );
            if (!added.length && !removed.length && !reordered.length)
              return null;

            return (
              <Box
                key={category}
                mb={2}
                sx={{
                  p: 2,
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  backgroundColor: (theme) => theme.palette.background.paper,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                }}
              >
                <Typography
                  fontWeight={700}
                  fontSize="0.85rem"
                  textTransform="uppercase"
                  letterSpacing={1}
                  sx={{ borderLeft: "3px solid #1976d2", pl: 1, mb: 1 }}
                >
                  {category}
                </Typography>
                <Grid container spacing={2}>
                  {added.length > 0 && (
                    <Grid item md={4} xs={12}>
                      {added.map((i) => (
                        <Box
                          key={i}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={0.5}
                          sx={{ borderRadius: 1, p: 1 }}
                        >
                          <Chip
                            label="Added"
                            size="small"
                            sx={{
                              backgroundColor: "#dcfce7",
                              color: "#166534",
                              fontWeight: 600,
                            }}
                          />
                          <Typography fontSize="0.875rem">{i}</Typography>
                        </Box>
                      ))}
                    </Grid>
                  )}
                  {removed.length > 0 && (
                    <Grid item md={4} xs={12}>
                      {removed.map((i) => (
                        <Box
                          key={i}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={0.5}
                        >
                          <Chip
                            label="Removed"
                            size="small"
                            sx={{
                              backgroundColor: "#fee2e2",
                              color: "#991b1b",
                              fontWeight: 600,
                            }}
                          />
                          <Typography fontSize="0.875rem">{i}</Typography>
                        </Box>
                      ))}
                    </Grid>
                  )}
                  {reordered.length > 0 && (
                    <Grid item md={4} xs={12}>
                      {reordered.map((i) => (
                        <Box
                          key={i}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={0.5}
                        >
                          <Chip
                            label="Reordered"
                            size="small"
                            sx={{
                              backgroundColor: "#fef3c7",
                              color: "#78350f",
                              fontWeight: 600,
                            }}
                          />
                          <Typography fontSize="0.875rem">
                            {i} → position {curr.indexOf(i) + 1}
                          </Typography>
                        </Box>
                      ))}
                    </Grid>
                  )}
                </Grid>
              </Box>
            );
          })}

          {!hasChanges && (
            <Typography color="text.secondary" textAlign="center" py={2}>
              No changes detected.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setPreviewOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmSubmit}
            sx={{ textTransform: "none !important", fontWeight: 600 }}
          >
            Confirm Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "60px",
          borderTop: "1px solid #e5e7eb",
          backgroundColor: (theme) => theme.palette.background.paper,
          backdropFilter: "blur(8px)",
          boxShadow: "0 -4px 12px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box
          display="flex"
          gap={2}
          justifyContent="flex-end"
          alignItems="center"
          px={4}
          height="100%"
        >
          <Button
            onClick={handleReset}
            variant="outlined"
            color="warning"
            sx={{ textTransform: "none !important", fontWeight: 600 }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitClick}
            disabled={!hasChanges}
            sx={{
              px: 4,
              fontWeight: 600,
              boxShadow: "none",
              textTransform: "none !important",
              "&:hover": { boxShadow: "0 2px 8px rgba(25,118,210,0.3)" },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

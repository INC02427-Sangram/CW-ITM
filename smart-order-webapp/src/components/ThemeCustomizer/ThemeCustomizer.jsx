import { useState, useEffect, Fragment } from "react";
import {
  Dialog,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Box, Button as RdsButton, Card, CardContent, Tabs, Tab, Stack, Typography,} from "@cw/rds";
import { All, GridView, CircleIcon, DocumentIcon, People, } from '@cw/rds/icons';

import { lightTheme } from "../../theme/theme";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";

/* editable groups ------------------------------------------------- */
const BUTTON_KEYS = ["save", "clear", "edit"];
const BUTTON_COLOR_KEYS = ["bg", "text", "hover", "disabledBg", "disabledText"];
const CHIP_COLOR_KEYS = ["bg", "text"];

/* small colour picker + hex input -------------------------------- */
const ColorInput = ({ value, onChange }) => (
  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
    {/* swatch – no border, circular */}
    <Box
      component="input"
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        width: 24,
        height: 24,
        p: 0,
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        background: "transparent",
      }}
      aria-label="choose colour"
    />
    {/* hex – underline only (variant="standard") */}
    <TextField
      variant="standard"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      sx={{ flex: 1, minWidth: 80 }}
      InputProps={{ disableUnderline: true, sx: { fontSize: 13 } }}
    />
  </Box>
);

const ThemeCustomizer = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const muiTheme = useTheme();

  const isLight = muiTheme.palette.mode === "light";
  if (!isLight) return null; // don’t render controls in Dark

  /* ------------ working copy of palette parts ------------------ */
  const [draft, setDraft] = useState(() => ({
    buttonStyles: structuredClone(muiTheme.palette.buttonStyles || {}),
    chipGroups: structuredClone(
      Object.fromEntries(
        Object.entries(muiTheme.palette).filter(([k]) => k.endsWith("Chips"))
      )
    ),
    datagridHeader: muiTheme.palette.background?.datagridHeader || "#EAE9FF",
  }));

  /* refresh when mode / theme toggles */
  useEffect(() => {
    setDraft({
      buttonStyles: structuredClone(muiTheme.palette.buttonStyles || {}),
      chipGroups: structuredClone(
        Object.fromEntries(
          Object.entries(muiTheme.palette).filter(([k]) => k.endsWith("Chips"))
        )
      ),
      datagridHeader: muiTheme.palette.background?.datagridHeader || "#EAE9FF",
    });
  }, [muiTheme.palette]);

  /* ---------- helpers to update tiny pieces -------------------- */
  const setBtn = (btn, key, hex) =>
    setDraft((p) => ({
      ...p,
      buttonStyles: {
        ...p.buttonStyles,
        [btn]: { ...p.buttonStyles[btn], [key]: hex },
      },
    }));

  const setChip = (grp, chip, key, hex) =>
    setDraft((p) => ({
      ...p,
      chipGroups: {
        ...p.chipGroups,
        [grp]: {
          ...p.chipGroups[grp],
          [chip]: { ...p.chipGroups[grp][chip], [key]: hex },
        },
      },
    }));

  const setGridHdr = (hex) => setDraft((p) => ({ ...p, datagridHeader: hex }));

  const updatedPalette = () => ({
    ...muiTheme.palette,
    buttonStyles: draft.buttonStyles,
    background: {
      ...muiTheme.palette.background,
      datagridHeader: draft.datagridHeader,
    },
    ...draft.chipGroups,
  });

  const [tab, setTab] = useState(0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{ sx: { width: 620 } }}
    >
      <Card sx={{ padding: "1rem", height: "80vh", display: "flex", flexDirection: "column" }}>

        <Stack gap="0.5rem" mb={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6Medium" align="center" noWrap>
              Theme Customizer
            </Typography>

            <Tooltip title="Reset Light theme to defaults">
              <IconButton
                size="small"
                onClick={() => {
                  const base = lightTheme.palette;
                  setDraft({
                    buttonStyles: structuredClone(base.buttonStyles || {}),
                    chipGroups: structuredClone(
                      Object.fromEntries(
                        Object.entries(base).filter(([k]) => k.endsWith("Chips"))
                      )
                    ),
                    datagridHeader: base.background?.datagridHeader || "#EAE9FF",
                  });
                  dispatch({ type: "PALETTE/UPDATE", payload: null });
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
            <Tab
              icon={<GridView size="xsmall" />}
              iconPosition="start"
              value={0}
              label={
                <Box display="flex" alignItems="center" gap="0.5rem">
                  Buttons
                </Box>
              }
            />
            <Tab
              icon={<CircleIcon size="xsmall" />}
              iconPosition="start"
              value={1}
              label={
                <Box display="flex" alignItems="center" gap="0.5rem">
                  Chips
                </Box>
              }
            />
            <Tab
              icon={<DocumentIcon size="xsmall" />}
              iconPosition="start"
              value={2}
              label={
                <Box display="flex" alignItems="center" gap="0.5rem">
                  Table
                </Box>
              }
            />
          </Tabs>
        </Stack>

        <Box sx={{ overflowY: "auto", flex: 1, pr: 1 }}>
          {tab === 0 && (
            <Stack gap="1rem">
              {BUTTON_KEYS.map((btn) => (
                <Card
                  key={btn}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    background: (theme) => theme.palette.background.paper,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, pl: 5 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ textTransform: "capitalize", mb: 1 }}
                    >
                      {btn}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap="1rem">
                      {BUTTON_COLOR_KEYS.map((ck) => (
                        <Stack key={ck} spacing={0.5}>
                          <ColorInput
                            value={draft.buttonStyles?.[btn]?.[ck] ?? "#cccccc"}
                            onChange={(hex) => setBtn(btn, ck, hex)}
                          />
                          <Typography variant="caption">{ck}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

          )}

          {/* ---------------- CHIPS ------------------ */}
          {tab === 1 && (
            <Stack gap="1rem">
              {Object.entries(draft.chipGroups).map(([grp, chips]) => (
                <Card
                  key={grp}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    background: (theme) => theme.palette.background.paper,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, pl: 5 }}>
                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', mb: 1 }}>
                      {grp}
                    </Typography>
                    {Object.keys(chips).map((chip) => (
                      <Stack direction="row" gap="1rem" flexWrap="wrap" key={chip} sx={{ mb: 2 }}>
                        {CHIP_COLOR_KEYS.map((ck) => (
                          <Stack spacing={0.5} key={ck}>
                            <ColorInput
                              value={chips[chip][ck]}
                              onChange={(hex) => setChip(grp, chip, ck, hex)}
                            />
                            <Typography variant="caption">
                              {chip} • {ck}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}


          {/* ---------------- TABLE ------------------ */}
          {tab === 2 && (
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                background: (theme) => theme.palette.background.paper,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
                maxWidth: 300, // Optional: maintain similar width as original
              }}
            >
              <CardContent sx={{ p: 3, pl: 5 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  DataGrid Header
                </Typography>
                <ColorInput value={draft.datagridHeader} onChange={setGridHdr} />
              </CardContent>
            </Card>
          )}

        </Box>

        <Stack direction="row" justifyContent="flex-end" gap={1} mt={2}>
          <RdsButton
            variant="ghost"
            size="small"
            onClick={onClose}
            style={{
              backgroundColor: muiTheme.palette.buttonStyles.clear.bg,
              color: muiTheme.palette.buttonStyles.clear.text,
            }}
          >
            Cancel
          </RdsButton>
          <RdsButton
            size="small"
            startIcon={<SaveIcon />}
            onClick={() => {
              dispatch({ type: "PALETTE/UPDATE", payload: updatedPalette() });
              onClose();
            }}
            style={{
              backgroundColor: muiTheme.palette.buttonStyles.save.bg,
              color: muiTheme.palette.buttonStyles.save.text,
            }}
          >
            Apply
          </RdsButton>
        </Stack>


      </Card>
    </Dialog>
  );
};

export default ThemeCustomizer;

import React, { forwardRef, useMemo, useState } from "react";
import {
  Popover,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import InfoIcon from "@mui/icons-material/Info";
import { Close } from '@cw/rds/icons';
import fnServiceRequest from "../../utility/fnServiceRequest";
import BusyIndicator from "../../utility/BusyIndicator";
import { HeaderControlButton as CustomButton } from "../../UIComponents/Button";
import { ButtonTypes } from "../../UIComponents/UITypes";
import Draggable from "react-draggable";

const DraggablePaper = forwardRef(function DraggablePaper(props, ref) {
  const nodeRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const setRefs = (instance) => {
    nodeRef.current = instance;
    if (typeof ref === "function") {
      ref(instance);
    } else if (ref) {
      ref.current = instance;
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#check-stock-popover-title"
      onStart={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
    >
      <Paper
        ref={setRefs}
        {...props}
        style={{
          ...props.style,
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          willChange: 'transform',
        }}
      />
    </Draggable>
  );
});

const StockSearchPopover = ({ open, onClose, onToast }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Stock search state
  const [stockSearchResults, setStockSearchResults] = useState([]);
  const [hasStockSearched, setHasStockSearched] = useState(false);
  const [isStockSearching, setIsStockSearching] = useState(false);
  const [stockSearchForm, setStockSearchForm] = useState({
    materialId: "",
    plant: ""
  });

  const handleStockSearchClose = () => {
    setStockSearchResults([]);
    setHasStockSearched(false);
    setIsStockSearching(false);
    setStockSearchForm({
      materialId: "",
      plant: ""
    });
    onClose();
  };

  const handleStockSearchFormChange = (field, value) => {
    setStockSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStockSearch = () => {
    if (!stockSearchForm.materialId.trim()) {
      onToast?.("error", t("Please fill in Material ID"));
      return;
    }

    setHasStockSearched(true);
    setIsStockSearching(true);

    const payload = {
      materialId: stockSearchForm.materialId.trim(),
      plant: stockSearchForm.plant.trim()
    };

    fnServiceRequest(
      "/JavaServices_Oauth/api/odata/stockDetermination",
      "POST",
      (response) => {
        console.log("Stock search response:", response);
        setIsStockSearching(false);
        if (response?.data && Array.isArray(response.data)) {
          setStockSearchResults(response.data);
          onToast?.("success", t("Stock search completed successfully"));
        } else {
          setStockSearchResults([]);
          onToast?.("info", t("No stock data found"));
        }
      },
      (error) => {
        console.error("Stock search failed:", error);
        setIsStockSearching(false);
        onToast?.("error", t("Stock search failed. Please try again."));
      },
      payload
    );
  };

  const handleNewSearch = () => {
    setStockSearchResults([]);
    setHasStockSearched(false);
    setIsStockSearching(false);
  };

  const MemoDraggablePaper = useMemo(() => DraggablePaper, []);

  // Memoized so anchorPosition ref stays stable — prevents Popover re-render on every parent render
  const anchorPosition = useMemo(
    () =>
      typeof window !== "undefined"
        ? { top: window.innerHeight / 2, left: window.innerWidth / 2 }
        : undefined,
    []
  );

  const gridResponsiveConfig = {
    xs: 12,
    sm: 6,
  }
  return (
    <Popover
      open={open}
      anchorEl={null}
      onClose={handleStockSearchClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      slots={{ paper: MemoDraggablePaper }}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: {
          width: {
            xs: '70dvw',
            lg: '50dvw'
          },
          height: {
            xs: '70dvh',
            sm: 'fit-content',
          },
          p: 3,
          backgroundColor: theme.palette.background.paper,
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0,0,0,0.24), 0 2px 8px rgba(0,0,0,0.16)',
        }
      }}
      sx={{
        '& .MuiPopover-paper': {
          position: 'fixed',
          margin: 0
        }
      }}
    >
      {isStockSearching && (
        <BusyIndicator />
      )}
      {!hasStockSearched ? (
        <>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}>
            <Box
              id="check-stock-popover-title"
              sx={{
                display: "flex",
                alignItems: "center",
                marginRight: "auto",
                gap: 1,
                cursor: "move",
                userSelect: "none",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Check Stock
              </Typography>
              <Tooltip title="Material ID is required" arrow>
                <InfoIcon
                  sx={{
                    fontSize: '20px',
                    color: theme.palette.info.main,
                    cursor: 'help'
                  }}
                />
              </Tooltip>
            </Box>


            <Grid container sx={{ margin:"30px" }} spacing={2}>
              <Grid item {...gridResponsiveConfig}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, }}>
                    Material ID
                  </Typography>
                  <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                </Box>
                <TextField
                  size="small"
                  fullWidth
                  value={stockSearchForm.materialId}
                  onChange={(e) => handleStockSearchFormChange('materialId', e.target.value)}
                  placeholder="Enter Material ID"
                />
              </Grid>

              <Grid item {...gridResponsiveConfig}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, }}>
                    Plant
                  </Typography>
                </Box>
                <TextField
                  size="small"
                  fullWidth
                  value={stockSearchForm.plant}
                  onChange={(e) => handleStockSearchFormChange('plant', e.target.value)}
                  placeholder="Enter Plant"
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                right: 24,
                display: 'flex',
                gap: 2,
                marginTop: "auto !important",
                justifyContent: 'flex-end',
              }}>
              <CustomButton
                action={ButtonTypes.CANCEL}
                onClick={handleStockSearchClose}
              >
                Cancel
              </CustomButton>
              <CustomButton
                action={ButtonTypes.SEARCH}
                onClick={handleStockSearch}
                disabled={!stockSearchForm.materialId.trim() || isStockSearching}
                startIcon={isStockSearching ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {isStockSearching ? "Searching..." : "Search"}
              </CustomButton>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box
              id="check-stock-popover-title"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: 1,
                cursor: "move",
                userSelect: "none",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Search Results ({stockSearchResults.length})
              </Typography>
              <CustomButton
                action={ButtonTypes.CANCEL}
                onClick={handleStockSearchClose}
              >
                <Close size={16} />
              </CustomButton>
            </Box>
          </Box>

          {stockSearchResults.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                backgroundColor: theme.palette.background.default,
                borderRadius: 2,
                border: `2px dashed ${theme.palette.divider}`,
                minHeight: 200
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 2,
                  fontWeight: 500
                }}
              >
                No Stock Data Found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  maxWidth: 400
                }}
              >
                No stock records found for the specified Material ID and Plant. Please try different search parameters.
              </Typography>
              <CustomButton
                action={ButtonTypes.CANCEL}
                onClick={handleNewSearch}
              >
                Try New Search
              </CustomButton>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 400,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        fontSize: '0.875rem',
                        padding: '12px 16px',
                        borderBottom: `2px solid ${theme.palette.primary.dark}`
                      }}
                    >
                      Material Id
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        fontSize: '0.875rem',
                        padding: '12px 16px',
                        borderBottom: `2px solid ${theme.palette.primary.dark}`
                      }}
                    >
                      Plant
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        fontSize: '0.875rem',
                        padding: '12px 16px',
                        borderBottom: `2px solid ${theme.palette.primary.dark}`
                      }}
                    >
                      Storage Location
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        fontSize: '0.875rem',
                        padding: '12px 16px',
                        borderBottom: `2px solid ${theme.palette.primary.dark}`
                      }}
                    >
                      Stock
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockSearchResults.map((row, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        '&:nth-of-type(even)': {
                          backgroundColor: theme.palette.action.hover,
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.action.selected,
                        }
                      }}
                    >
                      <TableCell
                        sx={{
                          padding: '12px 16px',
                          fontSize: '0.875rem',
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          color: theme.palette.text.primary
                        }}
                      >
                        {row.material}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '12px 16px',
                          fontSize: '0.875rem',
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          color: theme.palette.text.primary
                        }}
                      >
                        {row.plant}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '12px 16px',
                          fontSize: '0.875rem',
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          color: theme.palette.text.primary
                        }}
                      >
                        {row.storageLocation}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '12px 16px',
                          fontSize: '0.875rem',
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          color: theme.palette.text.primary
                        }}
                      >
                        {row.stock}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Popover>
  );
};

export default StockSearchPopover;

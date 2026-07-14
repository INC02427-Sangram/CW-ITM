import React, { forwardRef, useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HeaderControlButton as Button } from "../../../UIComponents/Button";
import { ButtonTypes } from "../../../UIComponents/UITypes";
import InfoIcon from "@mui/icons-material/Info";
import { Close } from '@cw/rds/icons';
import { CustomTextField } from "../../../UIComponents/CustomtextField";
import fnServiceRequest from "../../../utility/fnServiceRequest";
import BusyIndicator from "../../../utility/BusyIndicator";
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
      handle="#customer-search-popover-title"
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

/**
 * Customer Search Popover Component
 */
const CustomerSearchPopover = ({
  anchorEl,
  onClose,
  salesOrderData,
  showToast
}) => {
  const theme = useTheme();

  const [customerSearchResults, setCustomerSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isCustomerSearching, setIsCustomerSearching] = useState(false);
  const [customerSearchParty, setCustomerSearchParty] = useState("shipto");
  const [customerSearchForm, setCustomerSearchForm] = useState({
    salesOrg: salesOrderData?.salesOrg || "",
    postalCode: "",
    division: "",
    distChannel: "",
    name: "",
    city: ""
  });

  useEffect(() => {
    if (salesOrderData?.salesOrg) {
      setCustomerSearchForm(prev => ({
        ...prev,
        salesOrg: salesOrderData.salesOrg,
        division: salesOrderData.division || "",
        distChannel: salesOrderData.distChannel || ""
      }));
    }
  }, [salesOrderData]);

  const hasMandatoryFieldFilled = () => {
    return customerSearchForm.postalCode?.trim() ||
      customerSearchForm.name?.trim() ||
      customerSearchForm.city?.trim();
  };

  const handleCustomerSearchFormChange = (field, value) => {
    setCustomerSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomerSearch = () => {
    const mandatoryFields = ['name', 'city', 'postalCode'];
    const hasMandatoryField = mandatoryFields.some(field =>
      customerSearchForm[field] && customerSearchForm[field].trim() !== ''
    );

    if (!hasMandatoryField) {
      showToast("Please fill in at least one of the mandatory fields: Name, City, or Postal Code", "error");
      return;
    }

    setHasSearched(true);
    setIsCustomerSearching(true);

    const customerFlag = customerSearchParty === "shipto" ? "SH" : "SP";

    const payload = {
      salesOrg: salesOrderData?.salesOrg,
      distributionChannel: customerSearchForm.distChannel,
      division: customerSearchForm.division,
      name: customerSearchForm.name,
      city: customerSearchForm.city,
      postalCode: customerSearchForm.postalCode,
      customerFlag: customerFlag
    };

    fnServiceRequest(
      "/JavaServices_Oauth/api/odata/searchCustomer",
      "POST",
      (response) => {
        console.log("Customer search response:", response);
        setIsCustomerSearching(false);
        if (response?.data && Array.isArray(response.data)) {
          setCustomerSearchResults(response.data);
          showToast("Customer search completed successfully", "success");

          setCustomerSearchForm({
            salesOrg: "",
            postalCode: "",
            division: "",
            distChannel: "",
            name: "",
            city: ""
          });
        } else {
          setCustomerSearchResults([]);
          showToast("No results found", "info");
        }
      },
      (error) => {
        console.error("Customer search failed:", error);
        setIsCustomerSearching(false);
        showToast("Customer search failed. Please try again.", "error");
      },
      payload
    );
  };

  const handleClose = () => {
    setCustomerSearchResults([]);
    setHasSearched(false);
    setIsCustomerSearching(false);
    setCustomerSearchParty("shipto");
    setCustomerSearchForm({
      salesOrg: salesOrderData?.salesOrg || "",
      postalCode: "",
      division: salesOrderData?.division || "",
      distChannel: salesOrderData?.distChannel || "",
      name: "",
      city: ""
    });
    onClose();
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
    md: 4,
    lg: 3
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      onClose={handleClose}
      slots={{ paper: MemoDraggablePaper }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: {
          width: {
            xs: '80%',
            md: '70%',
            lg: '60%',
          },
          justifySelf: 'center',
          overflow: 'auto',
          p: 3,
          backgroundColor: theme.palette.background.paper,
          position: 'relative',
          maxHeight: '80%',
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
      {isCustomerSearching && <BusyIndicator />}

      {!hasSearched ? (
        <>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box
                id="customer-search-popover-title"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "move",
                  userSelect: "none",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                >
                  Customer Search
                </Typography>

                <Tooltip
                  title="One of the three fields (Postal Code, Name, or City) is mandatory"
                  arrow
                >
                  <InfoIcon
                    sx={{
                      fontSize: "20px",
                      color: theme.palette.info.main,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <RadioGroup
                row
                name="use-radio-group"
                value={customerSearchParty}
                onChange={(e) => setCustomerSearchParty(e.target.value)}
              >
                <FormControlLabel
                  value="soldto"
                  control={<Radio />}
                  label="Sold To"
                  componentsProps={{ typography: { sx: { fontWeight: 'bold', color: theme.palette.text.primary } } }}
                />
                <FormControlLabel
                  value="shipto"
                  control={<Radio />}
                  label="Ship To"
                  componentsProps={{ typography: { sx: { fontWeight: 'bold', color: theme.palette.text.primary } } }}
                />
              </RadioGroup>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item {...gridResponsiveConfig}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Postal Code
                </Typography>
                {!hasMandatoryFieldFilled() && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
              </Box>
              <CustomTextField
                value={customerSearchForm.postalCode}
                onChange={(e) => {
                  const value = e.target.value;

                  // allow only alphanumeric
                  const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, "");

                  handleCustomerSearchFormChange('postalCode', cleanedValue);
                }}
                placeholder=""
              />
            </Grid>

            <Grid item {...gridResponsiveConfig}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Name
                </Typography>
                {!hasMandatoryFieldFilled() && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
              </Box>
              <CustomTextField
                value={customerSearchForm.name}
                onChange={(e) => handleCustomerSearchFormChange('name', e.target.value)}
                placeholder=""
              />
            </Grid>

            <Grid item {...gridResponsiveConfig}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  City
                </Typography>
                {!hasMandatoryFieldFilled() && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
              </Box>
              <CustomTextField
                value={customerSearchForm.city}
                onChange={(e) => handleCustomerSearchFormChange('city', e.target.value)}
                placeholder=""
              />
            </Grid>

            <Grid item {...gridResponsiveConfig}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Sales Organization
              </Typography>
              <CustomTextField
                value={customerSearchForm?.salesOrg}
                onChange={(e) => handleCustomerSearchFormChange('salesOrg', e.target.value)}
                placeholder=""
                disabled={true}
              />
            </Grid>

            <Grid item {...gridResponsiveConfig}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Distribution Channel
              </Typography>
              <CustomTextField
                value={customerSearchForm.distChannel}
                onChange={(e) => handleCustomerSearchFormChange('distChannel', e.target.value)}
                placeholder=""
              />
            </Grid>

            <Grid item {...gridResponsiveConfig}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Division
              </Typography>
              <CustomTextField
                value={customerSearchForm.division}
                onChange={(e) => handleCustomerSearchFormChange('division', e.target.value)}
                placeholder=""
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
            <Button
              action={ButtonTypes.CLEAR}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              action={ButtonTypes.DEFAULT}
              onClick={handleCustomerSearch}
              disabled={!customerSearchForm.postalCode && !customerSearchForm.name && !customerSearchForm.city || isCustomerSearching}
              startIcon={isCustomerSearching ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {isCustomerSearching ? "Searching..." : "Search"}
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box
              id="customer-search-popover-title"
              sx={{
                cursor: "move",
                userSelect: "none",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Search Results ({customerSearchResults.length})
              </Typography>
            </Box>
            <Button
              action={ButtonTypes.CLEAR}
              onClick={handleClose}
            >
              <Close size={16} />
            </Button>
          </Box>

          {customerSearchResults.length === 0 ? (
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
                No Data Found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  maxWidth: 400
                }}
              >
                No customer records found matching your search criteria. Please try different search parameters.
              </Typography>
              <Button
                action={ButtonTypes.DEFAULT}
                onClick={() => {
                  setCustomerSearchResults([]);
                  setHasSearched(false);
                  setIsCustomerSearching(false);
                  setCustomerSearchForm({
                    salesOrg: salesOrderData?.salesOrg || "",
                    postalCode: "",
                    division: salesOrderData?.division || "",
                    distChannel: salesOrderData?.distChannel || "",
                    name: "",
                    city: ""
                  });
                }}
              >
                Try New Search
              </Button>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 500,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {['Customer', 'Sales Org', 'Distribution Channel', 'Division', 'Name', 'City', 'Postal Code', 'Street'].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          fontWeight: 600,
                          backgroundColor: theme.palette.background.datagridHeader,
                          color: theme.palette.text.secondary,
                          fontSize: '0.875rem',
                          padding: '12px 16px',
                          borderBottom: `2px solid ${theme.palette.primary.dark}`
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerSearchResults.map((row, index) => (
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
                      <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem', borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }}>
                        {row.customer}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem', borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }}>
                        {row.salesOrg}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem', borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }}>
                        {row.distributionChannel}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem', borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }}>
                        {row.division}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem', borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }}>
                        {row.name}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem', borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }}>
                        {row.city}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem', borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }}>
                        {row.postalCode}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px', fontSize: '0.875rem', borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }}>
                        {row.street}
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

export default CustomerSearchPopover;

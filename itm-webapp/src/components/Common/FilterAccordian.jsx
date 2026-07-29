import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FilterAccordian = ({
  title = "Filters",
  initialValues = {},
  defaultExpanded = false,
  onSearch,
  onClear,
  filterFieldsComponent,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      disableGutters
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px !important",
        boxShadow: "none",
        "&:before": { display: "none" },
        width: "100%",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: "#e9e9f8",
          borderRadius: expanded ? "8px 8px 0 0" : "8px",
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#2f3136" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 3 }}>
        <Box>{filterFieldsComponent ? filterFieldsComponent : <></>}</Box>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
        >
          <Button variant="outlined" onClick={onClear}>
            Clear
          </Button>
          <Button variant="contained" onClick={onSearch}>
            Search
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterAccordian;

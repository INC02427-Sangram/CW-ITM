import React, { useState, useEffect } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MaterialAccordion = ({
  row,
  index,
  columns,
  renderCell,
  renderEditableField,
  renderReadOnlyField,
}) => {
  const excludedKeys = ["serial", "actions", "expenses"];
  const [expanded, setExpanded] = useState(row.editing || false);

  console.log("MaterialAccordion row:", row);
  useEffect(() => {
    setExpanded(row.editing || false);
    return () => {
      console.log("Expanded", expanded);
    };
  }, [row.editing]);
  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded((prev) => !prev)}
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
        sx={{ px: 2, backgroundColor: "#e9e9f8" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography component="span" sx={{ fontSize: 13 }}>
              #{index + 1}
            </Typography>
            <Typography component="span" sx={{ fontSize: 13 }}>
              {row.supplier || "-"}
            </Typography>
            <Typography component="span" sx={{ fontSize: 13 }}>
              {row.material || "-"}
            </Typography>
          </Box>
          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {renderCell(row, index, "expenses")}
            {renderCell(row, index, "actions")}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          px: 2,
          backgroundColor: "rgb(255 255 255)",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
          }}
        >
          {columns
            .filter((c) => excludedKeys.indexOf(c.key) === -1)
            .map((col) => (
              <Box key={`${row.id}-${col.key}`}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b7280",
                    mb: 0.5,
                  }}
                >
                  {col.label}
                </Typography>
                {renderCell(row, index, col.key)}
              </Box>
            ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default MaterialAccordion;

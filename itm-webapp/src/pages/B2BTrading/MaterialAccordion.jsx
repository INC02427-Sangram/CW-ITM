import React from "react";
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
  readOnly,
}) => {
  return (
    <Accordion
      disableGutters
      sx={{borderRadius: "8px !important" }}
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
              gap: 0.5,
            }}
          >
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
            .filter((c) => c.key !== "serial" && c.key !== "actions")
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
                <Box>
                  {row.editing
                    ? renderEditableField(row, col.key)
                    : col.key === "expenses"
                      ? renderCell(row, index, "expenses")
                      : renderReadOnlyField(row, col.key)}
                </Box>
              </Box>
            ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default MaterialAccordion;

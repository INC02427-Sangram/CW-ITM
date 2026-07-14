import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * Reusable form field component with label and input
 * Handles both edit and read-only modes
 */
export const FormField = ({
  label,
  required = false,
  gridWidth = 4,
  editMode = false,
  value,
  renderInput,
  renderReadOnly,
  className = "headerInfo-labels",
}) => {
  const theme = useTheme();

  const headerLabelSx = {
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: "0.875rem",
    mb: 0.5,
  };

  return (
    <Grid item xs={gridWidth}>
      <Typography variant="subtitle2" className={className} sx={headerLabelSx}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </Typography>
      {editMode ? renderInput() : renderReadOnly()}
    </Grid>
  );
};

export default FormField;

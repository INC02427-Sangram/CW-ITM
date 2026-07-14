import React from "react";
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

// Standardizing the Header Height for all inputs (TextField, Select, etc.)
const HEADER_INPUT_HEIGHT = "40px";

const headerBaseStyles = (theme, multiline) => ({
    width: "100%",
    "& .MuiInputBase-root": {
        height: multiline ? "auto" : `${HEADER_INPUT_HEIGHT} !important`,
        minHeight: multiline ? "auto" : `${HEADER_INPUT_HEIGHT}`,
        fontSize: "0.875rem",
        fontFamily: "'Roboto', sans-serif",
    },
    "& .MuiOutlinedInput-input": {
        height: multiline ? "auto !important" : `${HEADER_INPUT_HEIGHT} !important`,
        padding: multiline ? "8px 0px" : "0 14px",
        boxSizing: "border-box",
        overflow:"auto"
    },
    // Specific for Selects within TextFields
    "& .MuiSelect-select": {
        height: `${HEADER_INPUT_HEIGHT} !important`,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
    },
});

const StyledTextField = styled(TextField)(({ theme, multiline }) => ({
    ...headerBaseStyles(theme, multiline),
}));

export const CustomTextField = React.forwardRef(({ children, ...props }, ref) => {
    return (
        <StyledTextField 
            ref={ref}
            size="small" 
            autoComplete="off"
            {...props} 
        >
            {children}
        </StyledTextField>
    );
});
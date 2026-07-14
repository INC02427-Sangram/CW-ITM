import React from "react";
import { Select, MenuItem, Typography, OutlinedInput, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { menuItemDropdownSx } from "./styles/menuItemDropdownSx";
/**
 * Shared MenuProps for consistent dropdown styling
 */
export const getStandardSelectProps = (customWidth = "fit-content") => ({
    anchorOrigin: { vertical: "bottom", horizontal: "left" },
    transformOrigin: { vertical: "top", horizontal: "left" },
    PaperProps: {
        sx: {
            maxHeight: 300,
            width: customWidth,
            fontSize: "14px",
            marginTop: "8px",
            boxShadow: " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            padding: "5px 5px"
        },
    },
});


const CustomSelect = ({
    options = null,
    value,
    onChange,
    name,
    placeholder = "Select option",
    height = "40px",
    sx = {},
    children,
    ...props
}) => {
    const theme = useTheme();
    console.log("Options", options);

    return (
        <Select
            size="small"
            displayEmpty
            name={name}
            value={value || ""}
            onChange={onChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
                if (!selected || selected === "" || (Array.isArray(selected) && selected.length === 0)) {
                    return (
                        <Typography
                            sx={{
                                color: "#999",
                                fontStyle: "italic",
                                fontSize: "0.875rem",
                            }}
                        >
                            {placeholder}
                        </Typography>
                    );
                }
                // If using options array, find and display the label
                if (options && Array.isArray(options)) {
                    const selectedOption = options.find((item) => item.key === selected);
                    return selectedOption ? selectedOption.value : selected;
                }
                return selected;
            }}
            MenuProps={getStandardSelectProps()}
            sx={{
                height: `${height} !important`,
                "& .MuiOutlinedInput-root": {
                    height: `${height} !important`,
                    padding: 0,
                },
                "& .MuiSelect-select": {
                    height: `${height} !important`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    boxSizing: "border-box",
                    fontSize: "0.875rem",
                },
                ...sx,
            }}
            {...props}
        >

            {/* Render options if provided, otherwise use children */}
            {options && Array.isArray(options)
                ? options.map((item) => (
                    <MenuItem key={item.key} value={item.key} sx={menuItemDropdownSx(theme)}>
                        {item.value}
                    </MenuItem>
                ))
                : children}

            {/* dont change this options mapping rather change the object array structure in parent component where you call it */}
        </Select>
    );
};

export default CustomSelect;
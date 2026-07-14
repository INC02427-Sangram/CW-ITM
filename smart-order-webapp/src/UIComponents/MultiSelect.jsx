import React from "react";
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  Box,
  OutlinedInput,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getStandardSelectProps } from "./CustomSelect";
import { menuItemDropdownSx } from "./styles/menuItemDropdownSx";

const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  name,
  placeholder = "Select options",
  height = "40px",
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  return (
    <Select
      size="small"
      multiple
      displayEmpty
      name={name}
      value={value}
      onChange={onChange}
      input={<OutlinedInput />}
      renderValue={(selected) => {
        if (!Array.isArray(selected) || selected.length === 0) {
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
        return selected
          .map((key) => options.find((item) => item.key === key)?.value)
          .filter(Boolean)
          .join(", ");
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

      {/* Options with Checkboxes */}
      {options?.map((item) => (
        <MenuItem key={item.key} value={item.key} sx={menuItemDropdownSx(theme)}>
          <Checkbox
            checked={(value || []).indexOf(item.key) > -1}
            sx={{ padding: "0 8px 0 0" }}
          />
          <ListItemText
            primary={item.value}
            primaryTypographyProps={{ fontSize: "0.875rem" }}
          />
        </MenuItem>
      ))}
    </Select>
  );
};

export default MultiSelect;

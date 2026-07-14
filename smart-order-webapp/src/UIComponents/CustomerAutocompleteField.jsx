import React from "react";
import { MenuItem, ListItemText, Box, Typography } from "@mui/material";
import CustomAutocomplete from "./CustomAutocomplete";
import { menuItemDropdownSx } from "./styles/menuItemDropdownSx";
import { useTheme } from "@mui/material/styles";

/**
 * Specialized autocomplete field for customer selection
 * with search functionality and read-only display
 */
export const CustomerAutocompleteField = (props) => {
  const theme = useTheme();

  const renderCustomerOption = (props, option) => {
    const { key, ...otherProps } = props;
    return (
      <MenuItem {...otherProps} sx={menuItemDropdownSx(theme)} key={key}>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {option.sapCustomerId || ""}
              </Typography>
              <Typography sx={{ ml: 1, fontSize: "0.875rem", color: "text.secondary" }}>
                {option.sapCustomerName1 ?? option.sapCustomerName ?? ""}
              </Typography>
            </Box>
          }
        />
      </MenuItem>
    );
  };

  return (
    <CustomAutocomplete
      {...props} // 👈 🔥 pure pass-through
      renderOption={renderCustomerOption}
    />
  );
};
export default CustomerAutocompleteField;

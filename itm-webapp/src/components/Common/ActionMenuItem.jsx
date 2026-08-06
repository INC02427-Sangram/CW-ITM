import React from "react";
import {
  MenuList,
  MenuItem,
  ListItemIcon,
  Tooltip,
  IconButton,
} from "@mui/material";
import ReusableTypography from "./ReusableTypography";
const ActionMenuItem = ({ title, icon, tooltipTitle, onClick }) => {
  return (
    <>
      <MenuItem onClick={onClick} sx={{margin:"0px !important"}}>
        <ListItemIcon>
          <Tooltip title={tooltipTitle}>
            <IconButton size="small">
              {icon}
            </IconButton>
          </Tooltip>
        </ListItemIcon>
        <ReusableTypography variant="inherit">{title}</ReusableTypography>
      </MenuItem>
    </>
  );
};

export default ActionMenuItem;

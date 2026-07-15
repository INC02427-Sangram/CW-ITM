import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Tab } from "@mui/material";
import PropTypes from "prop-types";

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: "450",
    fontSize: "0.875rem",
    marginRight: theme.spacing(1),
    color: "#424242",
    backgroundColor: "#f5f5f5", // Default background color
    borderRadius: "8px",

    "&.Mui-selected": {
      backgroundColor: "#EAE9FF", // Selected tab background color
      color: "#3730c7", // Selected tab text color
      fontWeight: "600",
    },

    "&:hover": {
      backgroundColor: "#e0e0e0", // Hover effect
    },

    "&.Mui-focusVisible": {
      backgroundColor: "#EAE9FF",
    },
  })
);

const StyledTabSplitScreen = styled((props) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: "500",
  fontSize: "0.75rem",
  marginRight: theme.spacing(1.5),
  color: "#424242",
  backgroundColor: "#f5f5f5", // Default background color
  borderRadius: "8px",

  "&.Mui-selected": {
    backgroundColor: "#EAE9FF", // Different selected tab color
    color: "#3730c7", // Selected tab text color
      fontWeight: "600",
  },

  "&:hover": {
    backgroundColor: "#e0e0e0", // Hover effect
  },

  "&.Mui-focusVisible": {
    backgroundColor: "#EAE9FF",
  },
}));

export { StyledTab, StyledTabSplitScreen };

export default TabPanel;

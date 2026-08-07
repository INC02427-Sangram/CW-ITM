import React from "react";
import {
  styled,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../CommonMUI/CustomButton";
import ReusableTypography from "./ReusableTypography";

// Must live outside the component — defining styled() inside render creates a
// new component type every render and remounts the dialog when children update
// (e.g. after a file is added to the dropzone), which corrupts layout/styles.
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CustomDialogBox = ({ title, open, handleClose, component }) => {
  return (
    <BootstrapDialog
      fullWidth
      maxWidth="md"
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        id="customized-dialog-title"
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <ReusableTypography
          sx={{ fontSize: "2rem", fontWeight: 600, color: "#2f3136" }}
        >
          {title}
        </ReusableTypography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: "#2f3136", flexShrink: 0 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ overflow: "auto" }}>
        {component}
      </DialogContent>
      <DialogActions>
        <CustomButton autoFocus onClick={handleClose}>
          Submit
        </CustomButton>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default CustomDialogBox;

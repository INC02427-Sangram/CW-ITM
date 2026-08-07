import React from "react";
import {
  styled,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions 
} from "@mui/material";
import ReusableButtons from "./ReusableButtons";
import CloseIcon from "@mui/icons-material/Close";
const CustomDialogBox = ({ open, handleClose, component }) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Modal title
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>{component}</DialogContent>
        <DialogActions>
          <ReusableButtons autoFocus onClick={handleClose}>
            Save changes
          </ReusableButtons>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default CustomDialogBox;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { Button } from "@cw/rds";
import { Trash, CircleInfo } from "@cw/rds/icons";
import { useTheme } from "@mui/material/styles";


const CustomDeletePopover = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  itemName = "",
  itemDescription = "",
  showItemDetails = false,
  fieldLabel = "Item",
  requireNotes = false,
  notes = "",
  onNotesChange = () => { },
}) => {

  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          width: "30vw",
          backgroundColor: "white"
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#dc2626",
          fontWeight: "600",
        }}
      >
        <Trash />
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>

        {requireNotes && (
          <TextField
            label="Notes / Remarks"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            sx={{ mb: 2 }}
            placeholder="Please add a brief reason before deleting…"
          />
        )}


        {showItemDetails && itemName && (
          <Box
            sx={{
              p: 2,
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              mb: 2,
            }}
          >
            {itemName && (
              <Typography variant="body2" color="text.secondary">
                <strong>{fieldLabel}:</strong> {itemName}
              </Typography>
            )}
            {itemDescription && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Description:</strong> {itemDescription}
              </Typography>
            )}
          </Box>
        )}

        <Box
          sx={{
            p: 2,
            backgroundColor: "#fef2f2",
            borderRadius: "8px",
            border: "1px solid #fecaca",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CircleInfo color="warning" />
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="seconadry2"
          sx={{
            height: 42,
            minWidth: 50,
            px: 2,
            textTransform: "none !important",
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            backgroundColor: "transparent",
            borderRadius: "12px",
            fontWeight: 600,
            '&.Mui-disabled': {
              borderColor: theme.palette.action.disabled,
              color: theme.palette.action.disabled,
              backgroundColor: 'transparent',
            },
          }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="primary"
          sx={{
            height: 42,
            minWidth: 50,
            px: 2,
            fontWeight: 600,
            borderRadius: "12px",
            textTransform: "none !important",
            backgroundColor: theme.palette.buttonStyles.delete.bg,
            color: theme.palette.buttonStyles.delete.text,
            '&:hover': {
              backgroundColor: theme.palette.buttonStyles.delete.hover,
            },
            '&.Mui-disabled': {
              backgroundColor: theme.palette.buttonStyles.delete.disabledBg,
              color: theme.palette.buttonStyles.delete.disabledText,
              boxShadow: 'none',
              opacity: 1,
            },
          }}
          disabled={requireNotes && !notes.trim()}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDeletePopover;


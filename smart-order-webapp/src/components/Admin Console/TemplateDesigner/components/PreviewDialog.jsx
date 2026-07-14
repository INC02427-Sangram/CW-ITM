import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import SaveIcon from "@mui/icons-material/Save";
import EmailPreview from "./EmailPreview";
import { useTheme } from "@mui/material/styles";
import { AdminControlButton as AdminButton } from "../../../../UIComponents/Button";
import { ButtonTypes } from "../../../../UIComponents/UITypes";

/**
 * Preview Dialog Component
 * Modal dialog for full template preview
 */
const PreviewDialog = ({ open, onClose, selectedTemplate, templateConfig }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
          width: { xs: "calc(100% - 24px)", sm: "100%" },
          margin: { xs: "12px", sm: "32px" },
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          pb: 2, 
          background: "linear-gradient(135deg, #3026B9 0%, #2518A3 100%)",
          color: "white",
          position: "relative"
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "600", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}
        >
          <PreviewIcon sx={{ mr: 1.5, fontSize: "24px" }} />
          Email Template Preview
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: "#f8f9fa" }}>
        <Box sx={{ p: { xs: 1, sm: 2 }, display: "flex", justifyContent: "center", backgroundColor: "#f8f9fa" }}>
          <EmailPreview template={selectedTemplate} templateConfig={templateConfig} />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          backgroundColor: "white",
          borderTop: "1px solid #e0e0e0",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1,
          "& > :not(:first-of-type)": {
            marginLeft: { xs: 0, sm: 1 },
          },
        }}
      >
        <AdminButton 
          action={ButtonTypes.CLEAR}
          onClick={onClose}
        >
          Close
        </AdminButton>
        <AdminButton
          action={ButtonTypes.SAVE}
          startIcon={<SaveIcon />}
          onClick={onClose}
        >
          Use This Template
        </AdminButton>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewDialog;

import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const AttachmentDialogHeader=({title,onClose})=>{


    return (
        <DialogTitle sx={{ m: 0, p: { xs: 1.5, sm: 2 } }} >
          <span className="dialog-title-container">
            <span style={{ 
              fontWeight: 600, 
              fontSize: "clamp(14px, 4vw, 18px)", 
              lineHeight: "21px" 
            }}>
              {title}
            </span>
            
              <IconButton
                aria-label="close"
                title={"Close"}
                onClick={onClose}
                sx={{
                  color: "#323232",
                  padding: { xs: "4px", sm: "8px" },
                }}
              >
                <CloseIcon />
              </IconButton>
           
          </span>
        </DialogTitle>
      );

}
export default AttachmentDialogHeader;
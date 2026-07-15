import { IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Button from "@mui/material/Button";
import AttachmentDialog from "../../utility/Custom Components/AttachmentDialog";
import { useState } from "react";
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import { useSelector } from "react-redux";
import BusyIndicator from "../../utility/BusyIndicator";
import { useTranslation } from "react-i18next";
import adminConsoleAdminConfiguration from "../Admin Console/config";
import {Upload } from '@cw/rds/icons';
import { useTheme } from "@mui/material/styles";
const ManualFileUploadOption = () => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const theme = useTheme();
  const [dialogVisibility, setDialogVisibility] = useState(null);
  const fileUploadMessage = useSelector(
    (state) => state.appReducer.fileUploadMessage
  );
  const [open, setOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({
    vertical: "bottom",
    horizontal: "center",
  });
  const [busyIndicatorFlag, setBusyIndicatorFlag] = useState(false);
  return (
    <>
      <IconButton
        title={t("Upload PO")}
        onClick={() => setDialogVisibility((prev) => !prev)}
        sx={{ color: theme.palette.text.primary ,height: "2rem"}} // Adjust styling if needed
      >
        <Upload fontSize="medium" />
      </IconButton>
      <AttachmentDialog
        dialogVisibility={dialogVisibility}
        setDialogVisibility={setDialogVisibility}
        busyIndicatorFlag={busyIndicatorFlag}
        setBusyIndicatorFlag={setBusyIndicatorFlag}
      />
      {busyIndicatorFlag && <BusyIndicator />}
 
      {fileUploadMessage.visiblity && (
        <CustomMessageToast
          open={true}
          setOpen={setOpen}
          messageType={fileUploadMessage.type}
          messageDescription={fileUploadMessage?.message}
          anchorPosition={anchorPosition}
        />
      )}
    </>
  );
};
export default ManualFileUploadOption;
 
 
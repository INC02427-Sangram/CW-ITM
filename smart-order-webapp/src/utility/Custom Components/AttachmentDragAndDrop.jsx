import { DropzoneAreaBase } from "material-ui-dropzone";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { toBytes } from "../utilityFunctions";
 
const AttachmentDragAndDrop = ({
  maxFileSize,
  handleUpload,
  filesLimit,
  dropzoneText,
}) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const theme = useTheme();
 
  return (
    <>
      <Box
        className="Dropzone-container"
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          ".MuiDropzoneArea-root": {
            bgcolor: theme.palette.background.paper,
            border: `2px dashed ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
            borderRadius: 2,
            "&:hover": {
              borderColor: theme.palette.primary.main,
            },
          },
          ".MuiDropzoneArea-textContainer": {
            color: theme.palette.text.secondary,
          },
          ".MuiSvgIcon-root": {
            color: theme.palette.text.secondary,
          },
          ".MuiTypography-root": {
            color: theme.palette.text.secondary,
          },
        }}
      >
        <DropzoneAreaBase
          Icon={false}
          acceptedFiles={[
            "application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.slideshow, application/vnd.openxmlformats-officedocument.presentationml.presentation, text/plain, application/pdf, image/jpeg, image/png, image/jpg, .odt, odp, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.odt,.odp,.rtf",
          ]}
          dropzoneText={dropzoneText}
          filesLimit={filesLimit}
          onAdd={(files) => handleUpload(files)}
          maxFileSize={toBytes(maxFileSize, "MB")}
          showPreviewsInDropzone={true}
          showAlerts={["error", "info"]}
          alertSnackbarProps={{
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
          autoHideDuration: 4000,
          className: "dropzone-snackbar",
          }}
        />
      </Box>
 
      <Box
        component="span"
        className="Dropzone-note-text"
        sx={{
          color: theme.palette.text.secondary,
          display: "inline-block",
          mt: 1,
        }}
      >
        {t("Max limit of over all file size is")} {maxFileSize} MB
      </Box>
    </>
  );
};
 
export default AttachmentDragAndDrop;
 
 
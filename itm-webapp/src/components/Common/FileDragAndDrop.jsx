import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { DropzoneAreaBase } from "material-ui-dropzone";
const FileDragAndDrop = ({ acceptedFiles, filesLimit, handleUpload }) => {
  const theme = createTheme({
    palette: {
      background: { paper: "#ffffff" },
      text: { secondary: "#6b6b6b" },
      divider: "#d9dee7",
      primary: { main: "#1976d2" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
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
          ".MuiDropzonePreviewList-root": {
            mt: 2,
            p: 1,
            bgcolor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          ".MuiDropzonePreviewChip-root": {
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            bgcolor: "transparent",
          },
          ".MuiDropzonePreviewChip-avatar": {
            color: theme.palette.text.secondary,
          },
          ".MuiDropzonePreviewChip-deleteIcon": {
            color: theme.palette.text.secondary,
          },
        }}
      >
        <DropzoneAreaBase
          acceptedFiles={acceptedFiles}
          dropzoneText={"Hello Sibasis, Drag and drop a file here or click"}
          filesLimit={filesLimit}
          onAdd={(files) => handleUpload(files)}
          maxFileSize={1024 * 1024 * 10} // 10 MB
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
        {"Max limit of over all file size is"} 10 MB
      </Box>
    </ThemeProvider>
  );
};

export default FileDragAndDrop;

import React, { useRef, useState } from "react";
import { Button, Stack, Snackbar, Alert } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import PreviewIcon from "@mui/icons-material/Visibility";

const ConfigUpload = () => {
  const fileInputRef = useRef(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");
  const [anchorPosition] = useState({ vertical: "bottom", horizontal: "center" });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      // Simulate file type check
      if (allowedTypes.includes(file.type)) {
        console.log("Valid file uploaded:", file.name);
        // setUploadSuccess(true);
        // setUploadError(false);
        setToastType("success");
        setToastMessage("Uploaded successfully!");
        setToastOpen(true);
        // TODO: Handle actual upload here
      } else {
        console.error("Invalid file type:", file.type);
        // setUploadError(true);
        // setUploadSuccess(false);
        setToastType("success");
        setToastMessage("Uploaded successfully!");
        setToastOpen(true);
      }
    }
  };

  const handlePreviewClick = () => {
    console.log("Preview Previous Template clicked");
    // TODO: Add logic for previewing previous uploads
  };

  return (
    <div style={{ padding: "20px" }}>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={handleUploadClick}
        >
          Upload Template
        </Button>

        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<PreviewIcon />}
          onClick={handlePreviewClick}
        >
          Preview Previous Template
        </Button>
      </Stack>

      {/* Success Snackbar */}
      {/* <Snackbar
        open={uploadSuccess}
        autoHideDuration={3000}
        onClose={() => setUploadSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setUploadSuccess(false)}>
          Uploaded successfully!
        </Alert>
      </Snackbar> */}

      {/* Error Snackbar */}
      {/* <Snackbar
        open={uploadError}
        autoHideDuration={3000}
        onClose={() => setUploadError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setUploadError(false)}>
          Invalid file type. Please upload an Excel file (.xls or .xlsx).
        </Alert>
      </Snackbar> */}
       {/* Reusable Snackbar */}
      <CustomMessageToast
        open={toastOpen}
        setOpen={setToastOpen}
        messageType={toastType}
        messageDescription={toastMessage}
        anchorPosition={anchorPosition}
      />
    </div>
  );
};

export default ConfigUpload;

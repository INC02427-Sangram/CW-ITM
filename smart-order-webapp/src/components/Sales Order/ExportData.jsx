import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomDatePicker from "../../UIComponents/CustomDatePicker";
import dayjs from "dayjs";
import fnServiceRequest from "../../utility/fnServiceRequest";
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import { HeaderControlButton as HeaderButton } from "../../UIComponents/Button";
import { ButtonTypes } from "../../UIComponents/UITypes";
export default function ExportDataDialog({ open, onClose }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorFlag, setErrorFlag] = useState({
    visiblity: false,
    errorMessage: null,
  });
  const [toastOpen, setToastOpen] = useState(false);

  const anchorPosition = {
    vertical: "bottom",
    horizontal: "center",
  };

  const handleCancel = () => {
    setStartDate(null);
    setEndDate(null);
    onClose();
  };

  const handleExport = () => {
    if (startDate && endDate) {
      setLoading(true);
      const formattedStartDate = dayjs(startDate).format("MMDDYYYY");
      const formattedEndDate = dayjs(endDate).format("MMDDYYYY");

      const payload = {
        customerId: "",
        exceptionType: [],
        poNumber: "",
        createdDateFrom: formattedStartDate,
        createdDateTo: formattedEndDate,
        requestedDateFrom: "",
        requestedDateTo: "",
        documentProcessStatus: [],
        salesOrg: [],
        singleDate: "",
        orderHeaderId: "",
        distChannel: "",
        orderType: "",
        sapOrderId: "",
      };

      const sUrl = "/JavaServices_Oauth/api/salesOrder/exportData";

      fnServiceRequest(
        sUrl,
        "POST",
        (response) => handleExportSuccess(response, formattedStartDate, formattedEndDate),
        (error) => handleExportError(error),
        payload
      );
    } else {
      setErrorFlag({
        visiblity: true,
        errorMessage: "Please select both start date and end date"
      });
    }
  };

  const handleExportSuccess = (response, startDate, endDate) => {
    setLoading(false);

    // Check if response indicates no data available
    if (response && response.message === "No data available in the given date ranges") {
      setErrorFlag({
        visiblity: true,
        errorMessage: "No data available in the given date ranges"
      });
      return;
    }

    // Handle the response based on your API structure
    let blobData;
    if (response?.data?.base64) {
      // Convert base64 to binary
      const byteCharacters = atob(response.data.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blobData = byteArray;
    } else {
      // Handle as binary response if needed
      blobData = response;
    }

    // Use the filename from response or generate one
    const filename = response.fileName || `exported_data_${startDate}_to_${endDate}.xlsx`;

    // Create blob and download
    const blob = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    onClose();
  };

  const handleExportError = (error) => {
    setLoading(false);
    console.error("Error exporting data", error);
    setErrorFlag({
      visiblity: true,
      errorMessage: "Failed to export data. Please try again."
    });
  };

  return (
    <>
      {errorFlag.visiblity && (
        <CustomMessageToast
          open={errorFlag.visiblity}
          setOpen={setToastOpen}
          messageType={"error"}
          messageDescription={errorFlag.errorMessage}
          anchorPosition={anchorPosition}
          setErrorFlagForInvalidDate={setErrorFlag}
        />
      )}
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Select Date Range for Exporting Data</DialogTitle>
       
      <DialogContent sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2, 
      mt: 1,
      pt: '20px !important',  
      overflow: 'visible',     
      width: { 
        xs: '80vw',
        sm: '60vw',
        md: "25vw"
      } 
    }}>
          <CustomDatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            sx={{ width: '100%', mb: 2, mt: 1 }}
            minDate={dayjs('2025-04-01')}
            shouldDisableDate={(date) => dayjs(date).isBefore('2025-04-01')}
          />
          <CustomDatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            sx={{ width: '100%' }}
            disabled={!startDate}
            minDate={startDate}
            shouldDisableDate={(date) => startDate && dayjs(date).isBefore(startDate)}
          />
        </DialogContent>
        <DialogActions>
          <HeaderButton onClick={handleCancel} disabled={loading}>Cancel</HeaderButton>
          <HeaderButton
            action={ButtonTypes.APPLY}
            onClick={handleExport}
            color="primary"
            disabled={loading}
          >
            {loading ? "Exporting..." : "Export"}
          </HeaderButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTable from "../../utility/Custom Components/CustomTable";
import { useTranslation } from "react-i18next";
import fnServiceRequest from "../../utility/fnServiceRequest";
import EmlViewer from "../Document Management/EmlViewer";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Unprocessed() {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const [emlOpen, setEmlOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [emlData, setEmlData] = useState({ base64: "" });
  const [emlError, setEmlError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const columns = [
    {
      fieldName: "Process Status ID",
      fieldBinding: "processStatusId",
      fieldLabel: t("Process Status ID") || "Process Status ID",
      type: "id",
      visible: true,
      pinned: false,
    },
    {
      fieldName: "Email Subject",
      fieldBinding: "emailSubject",
      fieldLabel: t("Email Subject") || "Email Subject",
      visible: true,
      pinned: false,
    },
    {
      fieldName: "Sender Email",
      fieldBinding: "senderEmail",
      fieldLabel: t("Sender Email") || "Sender Email",
      visible: true,
      pinned: false,
    },
    {
      fieldName: "Receiver Email",
      fieldBinding: "emailReceived",
      fieldLabel: t("Receiver Email") || "Receiver Email",
      visible: true,
      pinned: false,
    },
    {
      fieldName: "Exception Type",
      fieldBinding: "exceptionType",
      fieldLabel: t("Error") || "Error",
      visible: true,
      pinned: false,
      type: "exceptionType",
    },
    {
      fieldName: "Country",
      fieldBinding: "country",
      fieldLabel: t("Country") || "Country",
      visible: true,
      pinned: false,
    },
    {
      fieldName: "Sales Org",
      fieldBinding: "salesOrg",
      fieldLabel: t("Sales Org") || "Sales Org",
      visible: true,
      pinned: false,
    },
    {
      fieldName: "Created On",
      fieldBinding: "createdDate",
      fieldLabel: t("Created On") || "Created On",
      type: "date",
      visible: true,
      pinned: false,
    },
    {
      fieldName: "Last Modified",
      fieldBinding: "lastModifiedDate",
      fieldLabel: t("Last Modified") || "Last Modified",
      type: "date",
      visible: true,
      pinned: false,
    },
    {
      fieldName: "Created By",
      fieldBinding: "createdBy",
      fieldLabel: t("Created By") || "Created By",
      visible: true,
      pinned: false,
    },
  ];

  const fnRowClickHandler = (oEvent, columns, rows, index) => {
    const row = rows[index];
    const url = `/JavaServices_Oauth/api/unprocessedOrder/getEml?msgUUID=${row.msgUUID}&userId=${row.emailReceived}`;
    fnServiceRequest(
      url,
      "GET",
      (response) => {
        setEmlData({ base64: response.data });
      },
      (error) => {
        console.error("Error fetching email details:", error);
        setEmlError("Failed to load email details. Please try again.");
      },
    );
    setEmlOpen(true);
  };

  const handleSortingChange = (sortModel) => {
    console.log("Sorting changed:", sortModel);
  };

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };
  const dialogCloseHandler = () => {
    setEmlOpen(false);
    setEmlData({ base64: "" });
    setEmlError(null);
  };
  useEffect(() => {
    const url = `/JavaServices_Oauth/api/unprocessedOrder/getUnprocessedOrders`;

    const payload = {
      pageNumber: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      unprocessOrderFilterDataDto: {
        exceptionType: [],
        createdDateFrom: null,
        createdDateTo: null,
        requestedDateFrom: null,
        requestedDateTo: null,
        documentProcessStatus: [],
        salesOrg: [],
        singleDate: null,
        sapOrderId: null,
        senderEmail: null,
        receiverEmail: null,
        msgUUID: null,
      },
    };

    const fetchData = () => {
      try {
        fnServiceRequest(
          url,
          "POST",
          (response) => {
            const result = response.data;
            setRowData(result ?? []);
            setTotalRecords(response?.totalRecords ?? 0);
          },
          (error) => {
            console.error("Error fetching unprocessed orders:", error);
          },
          payload,
        );
      } catch (error) {
        console.error("Error fetching unprocessed orders:", error);
      }
    };

    fetchData();
  }, [paginationModel]);

  return (
    <div>
      <Dialog
        open={emlOpen}
        onClose={dialogCloseHandler}
        TransitionComponent={Transition}
        PaperProps={{
          sx: { minWidth: 600 },
        }}
      >
        <Box
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
          padding={2}
          minWidth={200}
        >
          <DialogTitle
            id="email-details-dialog-title"
            sx={{
              p: 0,
            }}
          >
            Email Details
          </DialogTitle>
          <IconButton aria-label="close" onClick={dialogCloseHandler}>
            <CloseIcon />
          </IconButton>
        </Box>

        {emlData.base64 ? (
          <EmlViewer
            base64Data={emlData.base64}
            type={"UnprocessedEmlViewer"}
          />
        ) : emlError ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "150px",
              height: "100%",
            }}
          >
            <Typography variant="body1" color="error">
              {emlError}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "150px",
              height: "100%",
            }}
          >
            <Typography variant="body1">Loading email details...</Typography>
          </Box>
        )}
      </Dialog>
      <Box sx={{ p: 2 }}>
        {columns && Array.isArray(columns) && columns.length > 0 ? (
          <CustomTable
            rows={rowData}
            Headercolumns={columns}
            fnRowClickHandler={fnRowClickHandler}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            rowCount={totalRecords}
            paginationMode="server"
            onSortModelChange={handleSortingChange}
          />
        ) : (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Loading table configuration...
          </div>
        )}
      </Box>
    </div>
  );
}

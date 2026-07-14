import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  Card,
  CardContent
} from "@mui/material";
import { Alert, Switch } from '@cw/rds'
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import fnServiceRequest from "../../../utility/fnServiceRequest";
import CustomMessageToast from "../../../utility/Custom Components/CustomMessageToast";
import CustomTable from "../../../utility/Custom Components/CustomTable";
import { getManualReviewColumns } from "../adminTableConfigs";
import { useTheme } from "@mui/material/styles";
import BusyIndicator from "../../../utility/BusyIndicator";
import CustomIcon from "../../../UIComponents/CustomIcon";

const ManualReviewTable = ({
  manualReviewData,
  setManualReviewData,
  setBusyIndicatorFlag,
  busyIndicatorFlag,
  fnGetAllActiveEmail,
  filteredManualReviewData,
  setFilteredManualReviewData,
}) => {
  const dispatch = useDispatch();

  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const theme = useTheme();
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [rowDraft, setRowDraft] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceRef = useRef(null);

  const [allSchedulerChecked, setAllSchedulerChecked] = useState(false);
  const [allManualChecked, setAllManualChecked] = useState(false);

  const [visibleRows, setVisibleRows] = useState(manualReviewData || []);
  const [globalScheduler, setGlobalScheduler] = useState(true); // global scheduler

  const modernSwitchStyles = {
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#28a745",
      "&:hover": {
        backgroundColor: "rgba(40, 167, 69, 0.04)",
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#28a745",
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#ced4da",
    },
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  useEffect(() => {
    setVisibleRows(manualReviewData || []);
    setFilteredManualReviewData?.(manualReviewData || []);
  }, [manualReviewData]);

  useEffect(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (!term) {
      setVisibleRows(manualReviewData || []);
      setFilteredManualReviewData?.(manualReviewData || []);
      return;
    }

    const filtered = (manualReviewData || []).filter((row) => {
      const haystack = [
        row.country,
        row.salesOrg,
        row.email,
        row.frequency?.toString(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });

    setVisibleRows(filtered);
    setFilteredManualReviewData?.(filtered);
  }, [debouncedSearchTerm, manualReviewData, setFilteredManualReviewData]);
  useEffect(() => {
    // Fetch the initial status of the Global Scheduler
    fnServiceRequest(
      "/JavaServices_Oauth1/api/v1/manualReview/getGlobalSchedulerStatus", // Replace with the actual endpoint
      "GET",
      (response) => {
        if (response.status === "SUCCESS") {
          setGlobalScheduler(response.data); // Assuming the response contains the status
        }
      },
      (error) => {
        console.error("Error fetching global scheduler status:", error);
      }
    );
  }, []);
  const updateDraft = (field, val) =>
    setRowDraft((prev) => ({ ...prev, [field]: val }));

  const startEdit = (idx) => {
    setEditRowIndex(idx);
    setRowDraft({ ...filteredManualReviewData[idx] });
  };

  const cancelEdit = () => {
    setEditRowIndex(null);
    setRowDraft(null);
  };

  useEffect(() => {
    if (rowDraft) {
      console.log("rowDraft:", rowDraft);
    }
  }, [rowDraft]);

  const saveEdit = () => {
    const original = filteredManualReviewData[editRowIndex];

    // Validate frequency - must be a positive integer
    const frequency = Number(rowDraft.frequency);
    if (!rowDraft.frequency || frequency <= 0 || !Number.isInteger(frequency)) {
      openToast("info", t("Frequency must be a positive integer"));
      return;
    }

     const freqChanged = Number(original.frequency) !== frequency;
  const manualChanged = original.manualReviewStatus !== rowDraft.manualReviewStatus;
  const schedulerChanged = original.emailSchedulerStatus !== rowDraft.emailSchedulerStatus;

  if (!freqChanged && !manualChanged && !schedulerChanged) {
    openToast("info", t("No changes made"));
    cancelEdit();
    return;
  }

    const payload = {
      emailId: rowDraft.emailId,
      frequency: frequency,
      countryCode: rowDraft.country,
      salesOrg: rowDraft.salesOrg,
      manualReviewStatus: rowDraft.manualReviewStatus,
      emailSchedulerStatus: rowDraft.emailSchedulerStatus,
    };

    setBusyIndicatorFlag(true);
  const typeForToggle = (val) => (val ? "success" : "warning");

  // Helper to show multiple toasts sequentially (prevents overlap)
  const showToastsSequentially = (items, delay = 1100) => {
    items.forEach((it, i) => {
      setTimeout(() => openToast(it.type, t(it.msg)), i * delay);
    });
  };
    fnServiceRequest(
      "/JavaServices_Oauth1/api/v1/manualReview/modifyEmail",
      "POST",
      () => {
        fnGetAllActiveEmail(
          setBusyIndicatorFlag,
          dispatch,
          t,
          setManualReviewData,
          setFilteredManualReviewData
        );
        const changes = [];
      if (schedulerChanged) {
        changes.push({
          type: typeForToggle(rowDraft.emailSchedulerStatus),
          msg: rowDraft.emailSchedulerStatus
            ? "Email scheduler enabled"
            : "Email scheduler disabled",
        });
      }
      if (manualChanged) {
        changes.push({
          type: typeForToggle(rowDraft.manualReviewStatus),
          msg: rowDraft.manualReviewStatus
            ? "Manual review enabled"
            : "Manual review disabled",
        });
      }
      if (freqChanged) {
        changes.push({
          type: "success",
          msg: `Frequency updated to ${frequency}`,
        });
      }

      // If multiple things changed, show multiple toasts (one after another)
      if (changes.length > 0) {
        showToastsSequentially(changes);
      } else {
        // Fallback (shouldn't hit due to guard above)
        openToast("success", t("Manual review updated successfully"));
      }

      cancelEdit();
    },
      (err) => {
        setBusyIndicatorFlag(false);
        openToast("error", t("Update failed"));
      },
      payload
    );
  };

  const [toast, setToast] = useState({
    open: false,
    type: "success",
    msg: "",
  });

  const anchorPosition = { vertical: "bottom", horizontal: "center" };
  const openToast = (type, msg) => {
    setToast({ open: true, type, msg });
  };

  // Define rows for DataGrid
  const rows = visibleRows.map((row, index) => ({
    id: row.reviewId || index,
    originalIndex: index,
    country: row.country,
    salesOrg: row.salesOrg,
    emailId: row.emailId,
    emailSchedulerStatus: row.emailSchedulerStatus,
    manualReviewStatus: row.manualReviewStatus,
    frequency: row.frequency,
  }));

  const handleGlobalSchedulerChange = (event) => {
  const newStatus = event.target.checked;

  fnServiceRequest(
    `/JavaServices_Oauth1/api/v1/manualReview/updateGlobalSchedulerStatus?status=${newStatus}`,
    "POST",
    () => {
      const msg = newStatus
        ? "Global Scheduler status turned on successfully"
        : "Global Scheduler status turned off successfully";
      openToast("success", t(msg));
      setGlobalScheduler(newStatus);
    },
    (error) => {
      openToast("error", t("Failed to update Global Scheduler status"));
    }
  );
};
  return (
    <>
      {busyIndicatorFlag && <BusyIndicator />}
      <CustomMessageToast
        open={toast.open}
        setOpen={(open) => setToast((p) => ({ ...p, open }))}
        messageType={toast.type}
        messageDescription={toast.msg}
        anchorPosition={anchorPosition}
        autoHideDuration={4000}
      />

      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {t("Global Scheduler")}
            </Typography>
            <Switch
              checked={globalScheduler}
              onChange={handleGlobalSchedulerChange}
              //sx={modernSwitchStyles}
            />
          </Box>
          <TextField
            size="small"
            placeholder={t("Search…")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: '100%', sm: 220 },
              "& .MuiOutlinedInput-root": {
                fontSize: "14px",
                height: 36,
              },
            }}
            InputProps={{ autoComplete: "off" }}
          />
        </Box>
        {/* </Box> */}
        {!globalScheduler && (


          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            Table is disabled as global scheduler is off
          </Alert>

        )}
        {/* Table */}
        <Box sx={{
          height: "calc(50vh - 10px)",

          mt: 1,
          width: "100%",
          overflow: "auto",
          position: 'relative',
          "& .MuiDataGrid-root": {
            border: "1px solid #e1e5e9",
          },
        }}>

          {visibleRows && visibleRows.length > 0 ? (
            <Box sx={{ position: 'relative' }}>
              <CustomTable
                rows={rows}
                Headercolumns={getManualReviewColumns(
                  t,
                  editRowIndex,
                  rowDraft,
                  updateDraft,
                  startEdit,
                  saveEdit,
                  cancelEdit
                )}
                maxHeight="400px"
                paginationModel={{ page: 0, pageSize: 10 }}
                onPaginationModelChange={() => { }}
                rowCount={rows.length}
                paginationMode="client"
                sx={{
                  minWidth: { xs: '800px', md: '100%' },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #e1e5e9',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f0f0f0',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f8f9fa',
                  },
                }}
              />

              {!globalScheduler && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)', // light overlay
                    pointerEvents: 'all', // block interaction
                    zIndex: 2,
                  }}
                >

                </Box>
              )}
            </Box>

          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                backgroundColor: '#ffffff',
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
              }}
            >
              <CustomIcon
                iconName="Mail"
                library="rds"
                sx={{ fontSize: 64, color: "action.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No manual review configurations yet
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Configure your manual review settings to get started
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
      {/* </Card> */}
    </>
  );
};

export default ManualReviewTable;
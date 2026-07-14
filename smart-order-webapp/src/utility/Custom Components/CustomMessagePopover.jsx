import React, { useEffect, useState, useRef, useCallback } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { setBusyIndicatorForDetailScreen } from "../../redux/reducers/appReducer";
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTheme } from "@mui/material/styles";
import { HeaderControlButton as HeaderButton } from "../../UIComponents/Button";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setMessagePopoverVisibility,
  setMessagePopoverStatus,
  setDeletedItems,
} from "../../redux/reducers/appReducer";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import { useTranslation } from "react-i18next";
import { ButtonTypes } from "../../UIComponents/UITypes";
import Tooltip from "@mui/material/Tooltip";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

const CustomMessagePopover = ({ popOverMessageObj, cancelService, deleteService, confirmService, scheduleService, inactivityContinue, inactivityLeave, }) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const theme = useTheme();
  const [pickedDate, setPickedDate] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0 });

  const handleDragMouseDown = useCallback((e) => {
    isDragging.current = true;
    dragOrigin.current = { x: e.clientX - dragPos.x, y: e.clientY - dragPos.y };
    e.preventDefault();
  }, [dragPos]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      setDragPos({ x: e.clientX - dragOrigin.current.x, y: e.clientY - dragOrigin.current.y });
    };
    const onMouseUp = () => { isDragging.current = false; };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const primaryButtonStyle = {
    height: 42,
    minWidth: 50,
    padding: "0 16px",
    fontWeight: 600,
    borderRadius: "12px",
    textTransform: "none",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.primary.main}`,
  };

  const secondaryButtonStyle = {
    height: 42,
    minWidth: 50,
    padding: "0 16px",
    textTransform: "none",
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    backgroundColor: "transparent",
    borderRadius: "12px",
    fontWeight: 600,
  };

  // Auto-navigate after 3 seconds for concurrent editing case
  useEffect(() => {
    if (popOverMessageObj?.status && popOverMessageObj.status.includes("Order is currently being edited by")) {
      const timer = setTimeout(() => {
        dispatch(setMessagePopoverVisibility(false));
        dispatch(setDeletedItems([]));
        dispatch(
          setMessagePopoverStatus({
            status: null,
            orderId: null,
          })
        );
        dispatch(setBusyIndicatorForDetailScreen(true));
        navigate(`/salesOrder`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [popOverMessageObj?.status, dispatch, navigate]);

  let statusObject;

  // this popOverMessageObj.status is used for switch case and it gives a statusObject which can be used by the popover

  // console.log(popOverMessageObj);

  switch (popOverMessageObj?.status) {
    case "Success":
      statusObject = {
        subHeaderMessage: popOverMessageObj?.orderId
          ? (t("salesOrderCreatedToastMsg") + " " + popOverMessageObj.orderId)
          : (popOverMessageObj?.message || t("salesOrderCreatedToastMsg")),
        Icon: <CheckCircleIcon color="success" />,
        background: "green",
        btnText: [t("ok")],
      };
      break;

    case "Run Simulation":
      statusObject = {
        subHeaderMessage: "Do you want to run a simulation now?",
        Icon: <WarningIcon sx={{ color: "orange" }} />,
        background: "orange",
        btnText: [t("YES"), t("NO")],
      };
      break;

    case "Schedule Simulation":
      statusObject = {
        subHeaderMessage: [
          "Simulation has been done successfully",
          "Pick a date to run the simulation"
        ],
        Icon: <CheckCircleIcon color="success" />,
        background: "green",
        btnText: [t("ok"), t("close")],
      };
      break;



    case "SAP Error Message":
      statusObject = {
        subHeaderMessage: Boolean(popOverMessageObj.errorMessageFromEcc)
          ? popOverMessageObj.errorMessageFromEcc
          : "Unable to process, please try again",
        Icon: <ErrorIcon sx={{ color: "red" }} />,
        background: "red",
        btnText: Boolean(popOverMessageObj.orderId) ? [t("ok")] : [t("close")],
      };
      break;

    case "Inactivity Warning":
      statusObject = {
        subHeaderMessage: [
          popOverMessageObj?.message || "You will be thrown out of this Sales Order due to Inactivity.",
          `Auto exit in ${popOverMessageObj?.countdownSeconds ?? 60}s...`,
        ],
        Icon: <WarningIcon sx={{ color: "orange" }} />,
        background: "orange",
        btnText: [t("Continue") || "Continue"],
      };
      break;
    case "SAP Processing Message":
      statusObject = {
        subHeaderMessage: Boolean(popOverMessageObj.errorMessageFromEcc)
          ? popOverMessageObj.errorMessageFromEcc
          : "Unable to process, please try again",
        Icon: Boolean(popOverMessageObj.errorMessageFromEcc) ? (
          <WarningIcon sx={{ color: "orange" }} />
        ) : (
          <ErrorIcon sx={{ color: "red" }} />
        ),
        background: Boolean(popOverMessageObj.errorMessageFromEcc)
          ? "orange"
          : "red",
        btnText: Boolean(popOverMessageObj.orderId) ? [t("ok")] : [t("close")],
      };
      break;

    case "Error":
      statusObject = {
        subHeaderMessage: Boolean(popOverMessageObj.errorMessageFromEcc)
          ? popOverMessageObj.errorMessageFromEcc
          : "Unable to process, please try again",
        Icon: <ErrorIcon sx={{ color: "red" }} />,
        background: Boolean(popOverMessageObj.errorMessageFromEcc)
          ? "orange"
          : "red",
        btnText: Boolean(popOverMessageObj.orderId) ? [t("ok")] : [t("close")],
      };
      break;
    case "Material Unavailable":
      statusObject = {
        subHeaderMessage: t("materialUnavailableToastMsg"),
        Icon: <ErrorIcon sx={{ color: "red" }} />,
        background: "red",
        btnText: ["Close"],
      };
      break;
    case "PO Already Exists":
      statusObject = {
        subHeaderMessage: "Unable to submit since order contains Exception :Duplicate PO" || "PO Already Exists" || t("poAlreadyExists"),
        Icon: <ErrorIcon sx={{ color: "red" }} />,
        background: "red",
        btnText: ["Close" || "close"],
      };
      break;
    case "Cancel":
      statusObject = {
        subHeaderMessage: t("OrderCancelled"),
        Icon: <CheckCircleIcon color="success" />,
        background: "green",
        btnText: [t("ok")],
      };
      break;
    case "Warning":
      statusObject = {
        subHeaderMessage: t("cancelWarning"),
        Icon: <WarningIcon sx={{ color: "orange" }} />,
        background: "orange",
        btnText: [t("YES"), t("NO")],
      };
      break;
    case "Delete":
      statusObject = {
        subHeaderMessage: t("deleteWarning"),
        Icon: <WarningIcon sx={{ color: "orange" }} />,
        background: "orange",
        btnText: [t("YES"), t("NO")],
      };
      break;
    case "Order Deleted":
      statusObject = {
        subHeaderMessage: t("OrderDeleted"),
        Icon: <CheckCircleIcon sx={{ color: "success" }} />,
        background: "green",
        btnText: [t("ok")],
      };
      break;
    case "Empty Salesorg":
      statusObject = {
        subHeaderMessage: "Salesorg is missing in header Info, please add it first.",
        Icon: <WarningIcon sx={{ color: "orange" }} />,
        background: "orange",
        btnText: [t("ok")],
      };
      break;
    case "Info":
      statusObject = {
        subHeaderMessage: popOverMessageObj?.message || "Kindly Claim The Task To Proceed",
        Icon: <WarningIcon sx={{ color: "orange" }} />,
        background: "orange",
        btnText: ["OK"],
      };
      break;
    default:
      // Handle custom messages that start with "Order is currently being edited by"
      // If it’s the “concurrent edit” string, keep your special case:
      if (popOverMessageObj?.status?.includes("Order is currently being edited by")) {
        statusObject = {
          subHeaderMessage: popOverMessageObj.status,
          Icon: <WarningIcon sx={{ color: "orange" }} />,
          background: "orange",
          btnText: [t("ok")],
        };
      } else {
        // Generic fallback for any unknown status
        statusObject = {
          subHeaderMessage:
            popOverMessageObj?.errorMessageFromEcc ||
            popOverMessageObj?.message ||
            popOverMessageObj?.status ||
            t("Unable to process, please try again"),
          Icon: <ErrorIcon sx={{ color: "red" }} />,
          background: "red",
          btnText: [t("close")],
        };
      }

  }

  return (
    // Centered overlay
    <div
      className="popover-layer"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1400,
        padding: 8,
      }}
    >
      {/* Card */}
      <div
        className="popover-utility"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        style={{
          position: "relative",
          top: "unset",
          left: "unset",
          transform: `translate(${dragPos.x}px, ${dragPos.y}px)`,
          width: "min(380px, 92vw)",
          maxHeight: "85vh",
          overflow: "auto",
          borderRadius: 12,
          boxShadow: "0 10px 24px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
          background: "#fff",
        }}
      >
        {/* Header */}
        <div
          className="header-status"
          onMouseDown={handleDragMouseDown}
          onDragStart={(e) => e.preventDefault()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "move",
            userSelect: "none",
            WebkitUserDrag: "none",
          }}
        >
          {statusObject?.Icon}
          <span className="status">{popOverMessageObj?.status}</span>
        </div>

        {/* Colored divider */}
        <Divider style={{ background: statusObject?.background, height: 2 }} />

        {/* Body */}
        <div className="subheader-message">
          {Array.isArray(statusObject?.subHeaderMessage)
            ? statusObject.subHeaderMessage.map((line, i) => (
              <p key={i} style={{ margin: i === 0 ? "0 0 6px" : 0 }}>{line}</p>
            ))
            : <p style={{ margin: 0 }}>{statusObject?.subHeaderMessage}</p>}

          {popOverMessageObj?.status === "Schedule Simulation" && (
            <div style={{ marginTop: 8, marginleft: 16 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs} style={{ marginleft: "16px" }}>
                <DatePicker
                  format="MM-DD-YYYY"
                  value={pickedDate}
                  onChange={(newValue) => setPickedDate(newValue)}
                  minDate={dayjs().add(1, "day")}
                  shouldDisableDate={(date) => !date.isAfter(dayjs().startOf("day"))}
                  slots={{
                    day: (dayProps) => {
                      const isDisabled = !dayProps.day.isAfter(dayjs().startOf("day"));
                      const label = dayProps.day.isSame(dayjs(), "day")
                        ? "Today's date cannot be selected"
                        : isDisabled
                          ? "Past dates cannot be selected"
                          : null;

                      if (isDisabled && label) {
                        return (
                          <Tooltip
                            title={label}
                            placement="top"
                            arrow
                            PopperProps={{
                              disablePortal: false,
                              sx: { zIndex: 9999 },
                            }}
                            slotProps={{
                              tooltip: {
                                sx: { fontSize: "0.72rem" },
                              },
                            }}
                          >
                            <span style={{ display: "inline-block" }}>
                              <PickersDay {...dayProps} disabled />
                            </span>
                          </Tooltip>
                        );
                      }
                      return <PickersDay {...dayProps} />;
                    },
                  }}
                  slotProps={{
                    popper: { sx: { zIndex: 2001 } },
                    textField: {
                      size: "small",
                      placeholder: "MM-DD-YYYY",
                      sx: { width: 200, m: 0, ml: 2 },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          )}
        </div>


        <Divider style={{ height: 1 }} />

        {/* Footer */}
        <div
          className="footer"
          style={{ display: "flex", justifyContent: "flex-end", gap: 6, padding: "10px 14px" }}
        >
          <HeaderButton
            action={ButtonTypes.YES}
            style={{
              display:
                popOverMessageObj?.status !== "Warning" &&
                  popOverMessageObj?.status !== "Delete" &&
                  popOverMessageObj?.status !== "Run Simulation" &&
                  popOverMessageObj?.status !== "Schedule Simulation" &&
                  popOverMessageObj?.status !== "Inactivity Warning"
                  ? "block"
                  : "none",
            }}
            onClick={() => {
              if (
                popOverMessageObj?.status === "Success" ||
                popOverMessageObj?.status === "Cancel" ||
                popOverMessageObj?.status === "SAP Processing Message" ||
                popOverMessageObj?.status === "Order Deleted" ||
                (popOverMessageObj?.status &&
                  popOverMessageObj.status.includes("Order is currently being edited by"))
              ) {
                setTimeout(() => {
                  dispatch(setBusyIndicatorForDetailScreen(true));
                  navigate(`/salesOrder`);
                }, 1500);
              }
              dispatch(setMessagePopoverVisibility(false));
              dispatch(setDeletedItems([]));
              dispatch(
                setMessagePopoverStatus({
                  status: null,
                  orderId: null,
                })
              );
            }}
          >
            {statusObject?.btnText?.at(0)}
          </HeaderButton>

          {/* YES/NO for Run Simulation (unchanged logic) */}
          <div
            style={{
              display: popOverMessageObj?.status === "Run Simulation" ? "flex" : "none",
              gap: 6,
            }}
          >
            <HeaderButton
              action={ButtonTypes.YES}
              onClick={() => {
                if (typeof confirmService === "function") confirmService();
              }}
            >
              {statusObject?.btnText?.at(0)}
            </HeaderButton>
            <HeaderButton
              action={ButtonTypes.NO}
              style={secondaryButtonStyle}
              onClick={() => {
                dispatch(setMessagePopoverVisibility(false));
                dispatch(setMessagePopoverStatus({ status: null }));
              }}
            >
              {statusObject?.btnText?.at(1)}
            </HeaderButton>
          </div>

          {/* Inactivity warning Continue only */}
          <div
            style={{
              display: popOverMessageObj?.status === "Inactivity Warning" ? "flex" : "none",
              gap: 6,
            }}
          >
            <HeaderButton
              action={ButtonTypes.YES}
              onClick={() => {
                if (typeof inactivityContinue === "function") inactivityContinue();
              }}
            >
              {statusObject?.btnText?.at(0)}
            </HeaderButton>
          </div>

          {/* OK/Close for Schedule Simulation (unchanged logic) */}
          <div
            style={{
              display: popOverMessageObj?.status === "Schedule Simulation" ? "flex" : "none",
              gap: 6,
            }}
          >
            <HeaderButton
              action={ButtonTypes.YES}
              disabled={
                !pickedDate ||
                !pickedDate.isValid() ||
                !pickedDate.isAfter(dayjs().startOf("day"))
              }
              onClick={() => {
                if (
                  typeof scheduleService === "function" &&
                  pickedDate &&
                  pickedDate.isValid() &&
                  pickedDate.isAfter(dayjs().startOf("day"))
                ) {
                  scheduleService(pickedDate.toDate());
                }
              }}
            >
              {statusObject?.btnText?.at(0)}
            </HeaderButton>
            <HeaderButton
              action={ButtonTypes.NO}
              // style={secondaryButtonStyle}
              onClick={() => {
                dispatch(setMessagePopoverVisibility(false));
                dispatch(setMessagePopoverStatus({ status: null }));
              }}
            >
              {statusObject?.btnText?.at(1)}
            </HeaderButton>
          </div>

          {/* Warning Yes/No (unchanged logic) */}
          <div
            style={{
              display: popOverMessageObj?.status === "Warning" ? "flex" : "none",
              gap: 6,
            }}
          >
            <HeaderButton
              action={ButtonTypes.YES}
              onClick={() => {
                cancelService();
              }}
            >
              {statusObject?.btnText?.at(0)}
            </HeaderButton>
            <HeaderButton
              action={ButtonTypes.NO}
              // style={secondaryButtonStyle}
              onClick={() => {
                dispatch(setMessagePopoverVisibility(false));
                dispatch(
                  setMessagePopoverStatus({
                    status: null,
                  })
                );
              }}
            >
              {statusObject?.btnText?.at(1)}
            </HeaderButton>
          </div>

          {/* Delete Yes/No (unchanged logic) */}
          <div
            style={{
              display: popOverMessageObj?.status === "Delete" ? "flex" : "none",
              gap: 6,
            }}
          >
            <HeaderButton
              action={ButtonTypes.YES}
              onClick={() => {
                deleteService();
              }}
            >
              {statusObject?.btnText?.at(0)}
            </HeaderButton>
            <HeaderButton
              action={ButtonTypes.NO}
              // style={secondaryButtonStyle}
              onClick={() => {
                dispatch(setMessagePopoverVisibility(false));
                dispatch(
                  setMessagePopoverStatus({
                    status: null,
                  })
                );
              }}
            >
              {statusObject?.btnText?.at(1)}
            </HeaderButton>
          </div>
        </div>
      </div>
    </div>
  );


};

export default CustomMessagePopover;
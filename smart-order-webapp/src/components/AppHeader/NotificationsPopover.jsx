import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Fragment,
} from "react";
import {
  Popover,
  Box,
  Typography,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EmailIcon from "@mui/icons-material/Email";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { blue } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useSelector } from "react-redux";

const NotificationItem = styled(ListItem)({
  padding: "12px 16px",
  "&:hover": { backgroundColor: "#f5f5f5" },
});
const TimeStamp = styled(Typography)({
  fontSize: "12px",
  color: "#757575",
  textAlign: "right",
});


const getVisual = (type) => {
  switch (type) {
    case "EmailSchedulerUpdate":
      return { icon: <EmailIcon />, color: "#2196f3" };
    case "ManualReviewUpdate":
      return { icon: <TaskAltIcon />, color: "#ffb300" };
    case "OrderBlockPrecedingUpdate":
      return { icon: <BlockIcon />, color: "#e53935" };
    case "SuccessfulSalesOrderCreation":
      return { icon: <CheckCircleIcon />, color: "#43a047" };
    case "PurchaseOrderExtractionFailure":
      return { icon: <ReportProblemIcon />, color: "#d32f2f" };
    case "SalesOrderSubmissionFailure":
      return { icon: <CancelIcon />, color: "#8e24aa" };
    case "EmailAddressAddition":
      return { icon: <PersonAddAlt1Icon />, color: "#6d4c41" };
    default:
      return { icon: <EmailIcon />, color: blue[600] };
  }
};

export default function NotificationsPopover({
  open,
  anchorEl,
  onClose,
  notifications,
  setNotifications,
}) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [snoozeAnchorEl, setSnoozeAnchorEl] = useState(null);
  const [snoozeUntil, setSnoozeUntil] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const baseUrl_Websocket = import.meta.env.VITE_WEBSOCKET_BASE_URL;
  const [selectedNotification, setSelectedNotification] = useState(null);

  const user = useSelector((state) => state.appReducer.userDetails);

const stompRef = useRef(null);
  

  // Laptop's local timezone (e.g., "Asia/Kolkata")
const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Parse server timestamp:
// - dd/MM/yyyy, HH:mm:ss (assume UTC)
// - or ISO / epoch if server changes later
const parseServerTimestampUTC = (input) => {
  if (typeof input === "number") {
    return input < 1e12 ? input * 1000 : input; // seconds -> ms
  }
  if (typeof input === "string") {
    // dd/MM/yyyy, HH:mm:ss
    const m = input.match(
      /^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2}):(\d{2})$/
    );
    if (m) {
      const [ , dd, MM, yyyy, hh, mm, ss ] = m;
      // Build UTC milliseconds
      return Date.UTC(
        Number(yyyy),
        Number(MM) - 1,
        Number(dd),
        Number(hh),
        Number(mm),
        Number(ss)
      );
    }
    // Fallback: try ISO parse (may include 'Z')
    const parsed = Date.parse(input);
    if (!Number.isNaN(parsed)) return parsed;
  }
  // Last resort: now
  return Date.now();
};

const toLocalTimestamp = (msOrStr) => {
  const ms =
    typeof msOrStr === "number" ? msOrStr : parseServerTimestampUTC(msOrStr);
  const d = new Date(ms); // this is in the laptop's local timezone

  const pad = (n) => String(n).padStart(2, "0");
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const YYYY = d.getFullYear();

  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());

  return `${MM}-${DD}-${YYYY}, ${hh}:${mm}:${ss}`;
};


  const markNotificationRead = (notificationId) => {
    const client = stompRef.current;
    if (!client?.connected) {
      console.warn("[WS] STOMP client not connected – cannot mark read");
      return;
    }
    const payload = {
      notificationId,
      isRead: true,
    };

    client.publish({
      destination: "/app/markRead",
      body: JSON.stringify(payload),
    });

    // Helpful local log so you see it immediately
    console.log("[WS] ➡️  Sent /app/markRead", payload);
  };

  const attachSubscription = useCallback(() => {
    const client = stompRef.current;
    if (!client || !client.connected || client.subscribed) return;

    console.log("[WS] Subscribing to /topic/order");
    client.subscription = client.subscribe("/topic/order", (msg) => {
      console.log("[WS] Received message:", msg.body);

      if (!isEnabled) return;
      if (snoozeUntil && Date.now() < snoozeUntil) return;

      try {
        const data = JSON.parse(msg.body);
        const items = Array.isArray(data) ? data : [data];

        const formattedList = items
          .filter((p) => p.userEmail === user?.email)
          .map((p, idx) => ({
            id: p.id ?? Date.now() + idx,
            requestId: p.requestId ?? "-",
            message:
              p.action ?? p.notificationType.replace(/([A-Z])/g, " $1").trim(),
            notificationType: p.notificationType,
            createdAt: parseServerTimestampUTC(p.timestamp ?? p.time),
            timestamp: toLocalTimestamp(p.timestamp ?? p.time),
            read: p.isRead ?? false,
          }));
        console.log(`[WS] Current user: ${user?.email}`);
        console.log(
          "[WS] Notifications received for this user:",
          formattedList
        );

        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const newUnique = formattedList.filter((n) => !existingIds.has(n.id));
          return [...newUnique, ...prev];
        });
      } catch (err) {
        console.error("Bad WebSocket payload", err);
      }
    });
    client.subscribed = true;
  }, [isEnabled, snoozeUntil, setNotifications, user?.email]);

  useEffect(() => {
    console.log("[WS] Initializing WebSocket connection...");
    stompRef.current = new Client({
      webSocketFactory: () =>
        new SockJS(`/JavaServices_Oauth/ws`, {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        }),
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
      onConnect: (frame) => {
        console.log("[WS] Connected – session id:", frame.headers["session"]);
        attachSubscription();
      },
      onWebSocketError: (err) => console.error("[WS] Socket error", err),
      onStompError: (frame) => console.error("[WS] Broker error", frame.body),
    });

    stompRef.current.activate();

    return () => {
      console.log("[WS] Disconnecting WebSocket");
      stompRef.current?.deactivate();
    };
  }, [attachSubscription]);

  useEffect(() => {
    const c = stompRef.current;
    if (!c) return;

    console.log("[WS] Notification toggle changed. isEnabled =", isEnabled);

    if (isEnabled) {
      if (c.connected) attachSubscription();
      console.log("[UI] Notifications turned ON");
    } else if (c.subscription) {
      console.log("[UI] Notifications turned OFF – unsubscribing...");
      c.subscription.unsubscribe();
      c.subscribed = false;
    }
  }, [isEnabled, attachSubscription]);
  
 const ONE_DAY = 24 * 60 * 60 * 1000;
 const isOlderThanOneDay = (n) => {
  const ms = n?.createdAt ?? parseServerTimestampUTC(n?.timestamp ?? n?.time);
  return Date.now() - ms > ONE_DAY;
 };

  useEffect(() => {
   const stored = JSON.parse(localStorage.getItem("notifications")) || [];
   const withRaw = stored.map((n) => ({
     ...n,
    // ensure we always have a raw ms value to format from
     createdAt: n.createdAt ?? parseServerTimestampUTC(n.timestamp ?? n.time),
   }));
   setNotifications(withRaw);
 }, [setNotifications]);

 // REMOVE this entire useEffect that calls setNotifications()

// Instead, compute derived list when rendering:
const recentNotifications = notifications.filter((n) => !isOlderThanOneDay(n));

 
  useEffect(() => {
    if (notifications.length) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const handleToggleNotifications = () => {
    setIsEnabled((prev) => !prev);
  };

  const handleMarkAllRead = () => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleSnoozeClick = (e) => setSnoozeAnchorEl(e.currentTarget);

  const handleSnoozeSelect = (minutes) => {
    const until = Date.now() + minutes * 60000;
    setSnoozeUntil(until);
    setSnoozeAnchorEl(null);
  };

  const snoozeLeft = snoozeUntil
    ? Math.max(0, Math.ceil((snoozeUntil - Date.now()) / 60000))
    : 0;

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 380, maxHeight: 500, borderRadius: 2, boxShadow: 5 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#64B5F6",
            color: "white",
          }}
        >
          <Typography variant="h6">
            Notifications {snoozeLeft ? `(snoozed ${snoozeLeft}m)` : ""}
          </Typography>
          <Box>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={handleMarkAllRead}
            >
              <CheckIcon />
            </IconButton>

          </Box>
        </Box>

        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <FormControl
            size="small"
            sx={{
              minWidth: 240,
            }}
          >
            <InputLabel id="filter-type-label">
              Filter Notification Type
            </InputLabel>

            <Select
              labelId="filter-type-label"
              id="filter-type"
              value={filterType}
              label="Filter Notification Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="ALL">All Types</MenuItem>
              <MenuItem value="EmailSchedulerUpdate">
                Email Scheduler Update
              </MenuItem>
              <MenuItem value="ManualReviewUpdate">
                Manual Review Update
              </MenuItem>
              <MenuItem value="OrderBlockPrecedingUpdate">
                Order Block Preceding Update
              </MenuItem>
              <MenuItem value="SuccessfulSalesOrderCreation">
                Successful Sales Order Creation
              </MenuItem>
              <MenuItem value="PurchaseOrderExtractionFailure">
                Purchase Order Extraction Failure
              </MenuItem>
              <MenuItem value="SalesOrderSubmissionFailure">
                Sales Order Submission Failure
              </MenuItem>

              <MenuItem value="EmailAddressAddition">
                Email Address Addition
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        {recentNotifications.length  ? (
          <List sx={{ maxHeight: 350, overflow: "auto", p: 0 }}>
            {recentNotifications
              .filter(
                (n) => filterType === "ALL" || n.notificationType === filterType
              )
              .map((n, idx) => {
                const { icon, color } = getVisual(n.notificationType);
                return (
                  <Fragment key={n.id}>
                    <NotificationItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: color, width: 36, height: 36 }}>
                          {icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{
                                display: "block",
                                fontWeight: n.read ? "normal" : "bold",
                              }}
                            >
                              {n.message}
                            </Typography>
                             <TimeStamp>
   {n.createdAt ? toLocalTimestamp(n.createdAt) : toLocalTimestamp(n.timestamp)}
 </TimeStamp>
                          </>
                        }
                      />
                    </NotificationItem>
                    {idx < recentNotifications.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </Fragment>
                );
              })}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        )}
      </Popover>
    </>
  );
}

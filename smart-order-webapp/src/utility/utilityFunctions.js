import { use } from "react";
import getDocumentTypeByFileName from "./getDocumentTypeByFileName";
import { useSelector } from "react-redux";
import moment from "moment";

const getUserNameFromEmailId = (email) => {
  const raw = typeof email === "string" ? email.trim() : "";
  if (!raw || !raw.includes("@")) return "";
  const local = raw.split("@")[0] || "";
  if (!local) return "";

  // Convert 'first.last' to 'First Last', handle single-part as 'First'
  const parts = local.split(".").filter(Boolean);
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
  if (parts.length >= 2) {
    return `${cap(parts[0])} ${cap(parts[1])}`.trim();
  }
  return cap(parts[0] || local);
};
const formatNotificationDate = (selectedDate) => {
  const date = new Date(selectedDate);

  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];

  // Extract the time components (12-hour format)
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = String(hours % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Construct the formatted date and time string
  const formattedDateTime = `${day} ${month} ${hours}:${minutes} ${ampm}`;

  return formattedDateTime;
};
// this function takes input as moduleName and returns the path like for Sales Order it will return salesOrder

export const getModuleNameFromPathName = (pathName) => {
  if (!pathName) return "Sales Order";
  const normalizedPath = pathName.split("?")[0].replace(/^\/|\/$/g, "");
  //    Example: "/salesOrder/123?q=test" -> "salesOrder/123"
  const firstSegment = normalizedPath.split("/")[0];
  //    Example: "salesOrder/123" -> "salesOrder"
  switch (firstSegment) {
    case "dashboard":
      return "Dashboard";
    case "salesOrder":
      return "Sales Order";
    case "documentManagement":
      return "Document Management";
    case "adminConsole":
      return "Config Cockpit";
    case "tracking":
      return "Tracking";
    case "workspace":
      return "Workspace";
    default:
      return "Sales Order";
  }
};
export const getPathNameFromModuleName = (moduleName) => {
  // Create a mapping of all possible translations to their respective paths
  const modulePathMap = {
    "Dashboard": "dashboard",
    "Sales Order": "salesOrder",
    "Admin Console": "adminConsole",
    "Config Cockpit": "configCockpit",
    "Document Management": "documentManagement",
    "Workzone": "workzone",
    // Add translations for each language you support
  };

  // Return the mapped path or a default
  return modulePathMap[moduleName] || moduleName.toLowerCase().replace(/\s/g, "");
};
function padTo2Digits(num) {
  return num.toString().padStart(2, 0);
}
function formatDate(date) {
  const appSettings = useSelector((state) => state.appReducer.appSettings);
  if (!date) return "-";

  let mUtc;
  if (typeof date === "string") {
    if (/\d{4}-\d{2}-\d{2}T/.test(date)) {
      mUtc = moment.utc(date);
    } else {
      mUtc = moment.utc(date, [
        moment.ISO_8601,
        "YYYY-MM-DD HH:mm:ss",
        "MM/DD/YYYY HH:mm:ss",
        "YYYY/MM/DD HH:mm:ss",
      ], true);
      if (!mUtc.isValid()) {
        const d = new Date(date);
        mUtc = moment.utc(d.getTime());
      }
    }
  } else if (typeof date === "number") {
    mUtc = moment.utc(date);
  } else {
    // Date object
    mUtc = moment.utc(date.getTime());
  }

  const mLocal = mUtc.local();
  return mLocal.format(`${appSettings.dateFormat}(${appSettings.timeFormat})`);
}
const getDateRange = (rangeValue) => {
  const today = new Date();
  let startDate, endDate;
  switch (rangeValue) {
    case "10": // This Week
      const firstDayOfWeek = today.getDate() - today.getDay(); // Sunday is the first day of the week
      startDate = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek);
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Today
      break;
    case "20": // This Month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Today
      break;
    case "25": // Last One Month (Rolling)
      startDate = new Date(today);
      startDate.setMonth(startDate.getMonth() - 1); // same date last month
      endDate = new Date(today); // today
      break;
    case "30": // Last Month
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of the last month
      break;
    case "40": // Current Quarter
      const currentMonth = today.getMonth();
      const currentQuarter = Math.floor(currentMonth / 3);
      startDate = new Date(today.getFullYear(), currentQuarter * 3, 1); // First month of the quarter
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Today
      break;
    case "50": // Last Quarter
      const currentMonth1 = today.getMonth(); // 0 = Jan, 11 = Dec
      const currentYear = today.getFullYear();
      const currentQuarter1 = Math.floor(currentMonth1 / 3); // 0 = Q1, 1 = Q2, 2 = Q3, 3 = Q4
      let lastQuarter = currentQuarter1 - 1;
      let yearOfLastQuarter = currentYear;
      if (lastQuarter < 0) {
        lastQuarter = 3; // Q4
        yearOfLastQuarter -= 1; // previous year
      }
      startDate = new Date(yearOfLastQuarter, lastQuarter * 3, 1); // First day of last quarter
      endDate = new Date(yearOfLastQuarter, (lastQuarter + 1) * 3, 0); // Last day of last quarter
      break;
    case "60": // Current Year to Date
      startDate = new Date(today.getFullYear(), 0, 1); // January 1st of the current year
      endDate = today; // Today
      break;
    default:
      startDate = new Date(today);
      startDate.setMonth(startDate.getMonth() - 1);
      endDate = new Date(today);
  }
  return { startDate, endDate };
};
function formatDate1(date) {
  date = new Date(date);

  // Function to pad single digits with leading zeros
  function padTo2Digits(number) {
    return number < 10 ? "0" + number : number;
  }

  // Extract date components
  var day = padTo2Digits(date.getDate());
  var month = padTo2Digits(date.getMonth() + 1);
  var year = date.getFullYear();

  // Combine date and time in desired format
  return `${month}/${day}/${year}`;
}
function formatCustomerId(customerId) {
  if (customerId === null) {
    return "";
  }
  let firstNonZeroIndex = 0;
  while (
    firstNonZeroIndex < customerId?.length &&
    customerId[firstNonZeroIndex] === "0"
  ) {
    firstNonZeroIndex++;
  }
  return customerId?.slice(firstNonZeroIndex);
}
const Capitalize = (string) => {
  return (
    string?.at(0)?.toUpperCase() +
    string?.slice(1, string?.length)?.toLowerCase()
  );
};

const getEmbedUrl = (base64, documentName, documentType) => {
  var u8_2 = new Uint8Array(
    atob(base64)
      .split("")
      .map(function (c) {
        return c.charCodeAt(0);
      })
  );
  var blob = new Blob([u8_2], {
    type: getDocumentTypeByFileName(documentType),
    name: documentName,
  });

  const embedURL = URL.createObjectURL(blob);
  return embedURL;
};
const toBytes = (size, type) => {
  const supportedTypes = ["B", "KB", "MB", "GB", "TB"];
  const key = supportedTypes.indexOf(type);
  return size * 1024 ** key;
};

const getBase64 = (file) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    // Use a regex to remove data url part
    const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");

  };
  reader.readAsDataURL(file);
};

const trimJson = (data) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value
    ]))
}

export {
  getUserNameFromEmailId,
  formatNotificationDate,
  // getPathNameFromModuleName,
  formatDate,
  getDateRange,
  formatDate1,
  formatCustomerId,
  Capitalize,
  getEmbedUrl,
  getBase64,
  toBytes,
  trimJson
};


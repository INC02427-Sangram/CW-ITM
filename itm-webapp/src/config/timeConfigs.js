const dateFormatOptions = [
  {
    key: "DD MMM YYYY",
    value: "DD MMM YYYY (01 Apr 2025)",
    type: "Common Formats",
  },
  {
    key: "MMM DD, YYYY",
    value: "MMM DD, YYYY (Apr 01, 2025)",
    type: "Common Formats",
  },
  {
    key: "YYYY MMM DD",
    value: "YYYY MMM DD (2025 Apr 01)",
    type: "Common Formats",
  },
  { key: "DD-MM-YYYY", value: "DD-MM-YYYY (01-04-2025)", type: "With Hyphens" },
  { key: "MM-DD-YYYY", value: "MM-DD-YYYY (04-01-2025)", type: "With Hyphens" },
  { key: "YYYY-MM-DD", value: "YYYY-MM-DD (2025-04-01)", type: "With Hyphens" },
  { key: "DD/MM/YYYY", value: "DD/MM/YYYY (01/04/2025)", type: "With Slashes" },
  { key: "MM/DD/YYYY", value: "MM/DD/YYYY (04/01/2025)", type: "With Slashes" },
  { key: "YYYY/MM/DD", value: "YYYY/MM/DD (2025/04/01)", type: "With Slashes" },
];

const languageOptions = [
  { key: "en", value: "English" },
  { key: "hi", value: "Hindi" },
  { key: "de", value: "German" },
  { key: "es", value: "Spanish" },
  { key: "fr", value: "French" },
];

const timeFormats = [
  {
    key: "hh:mm:ss A",
    value: "hh:mm:ss A",
    label: "12-hour (01:34 AM)",
  },
  {
    key: "HH:mm:ss",
    value: "HH:mm:ss",
    label: "24-hour (13:34)",
  },
];

const dateSettings = [
  { key: "10",value:"10", label: "This Week" },
  { key: "20", value: "20", label: "This Month" },
  { key: "25", value: "25", label: "Last One Month" },
  { key: "30", value: "30", label: "Last Month" },
  { key: "40", value: "40", label: "Current Quater" },
  { key: "50", value: "50", label: "Last Quater" },
  { key: "60", value: "60", label: "Current Year to Date" },
];

export { dateFormatOptions, languageOptions, timeFormats, dateSettings };

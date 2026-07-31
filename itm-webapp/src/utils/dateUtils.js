const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const toYYYYMMDD = (val) => {
  if (!val) return "";

  // Dayjs instance
  if (val && typeof val === "object" && typeof val.isValid === "function") {
    if (!val.isValid()) return "";
    const y = val.year();
    const m = String(val.month() + 1).padStart(2, "0");
    const d = String(val.date()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // Native Date
  if (val instanceof Date && !Number.isNaN(val.getTime())) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, "0");
    const d = String(val.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const s = String(val).trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // MM-DD-YY or MM-DD-YYYY
  const mmdd = s.match(/^(\d{1,2})-(\d{1,2})-(\d{2}|\d{4})$/);
  if (mmdd) {
    let [, mm, dd, yy] = mmdd;
    if (yy.length === 2) yy = `20${yy}`; // assume 20xx
    return `${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(
      2,
      "0",
    )}`;
  }

  return "";
};

export const toMMDDYY = (val) => {
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${mm}${dd}${yyyy}`;
};

export const isValidDate = (val) => {
  if (!val) return false;
  const d = new Date(val);
  return !Number.isNaN(d.getTime());
};

export const isApiSuccess = (res) =>
  res?.status === true ||
  res?.status === "SUCCESS" ||
  res?.statusCode === 200 ||
  /success/i.test(String(res?.message || ""));

// Converts a display-formatted date ("01/Jan/2024") back to ISO ("2024-01-01").
// Values already in another format (e.g. ISO) are passed through untouched.
const toISODate = (value) => {
  if (!value) return "";
  const match = /^(\d{2})\/([A-Za-z]{3})\/(\d{4})$/.exec(String(value).trim());
  if (!match) return value;
  const [, day, mon, year] = match;
  const monthIndex = MONTHS.indexOf(mon);
  if (monthIndex === -1) return value;
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${day}`;
};

export { toISODate };

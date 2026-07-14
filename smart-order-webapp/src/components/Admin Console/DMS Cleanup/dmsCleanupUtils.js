import moment from "moment-timezone";

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const normalizeDay = (weekDay = "") =>
  weekDay ? weekDay.charAt(0).toUpperCase() + weekDay.slice(1).toLowerCase() : "";

export const getCountryByValue = (countries = [], value = "") => {
  return countries.find(
    (country) =>
      country.countryName === value ||
      country.countryId === value ||
      country.countryCode === value
  );
};

export const getCountryCode = (countries = [], value = "") =>{
 let countryCode = getCountryByValue(countries, value)?.countryCode || value || "";
 return countryCode;
}
export const getCountryTimezones = (countryCode = "") => {
  if (!countryCode) return [];

  try {
    return moment.tz.zonesForCountry(countryCode) || [];
  } catch (error) {
    console.error("Error fetching timezones for country code:", countryCode, error);
    return [];
  }
};

export const getTimezoneLabel = (timezone) => {
  const offset = moment().tz(timezone).format("Z");
  return `${timezone} (UTC${offset})`;
};

export const mapDmsSchedules = (data = [], countries = []) =>
  (Array.isArray(data) ? data : []).map((item, index) => {
    const countryName =
      getCountryByValue(countries, item.countryCode)?.countryName || item.countryName;

    return {
      id: index + 1,
      country: countryName,
      time: item?.time ? item?.time.substring(0, 5) : "",
      weekDay: normalizeDay(item?.weekDay),
      dataRetentionPeriod: item?.dataRetentionPeriod || "",
      timezone: item?.timeZone || "",
    };
  });

export const filterDmsSchedules = (schedules = [], searchTerm = "") => {
  const indexedSchedules = schedules.map((item, index) => ({
    ...item,
    originalIndex: index,
  }));

  if (!searchTerm || !searchTerm.trim()) return indexedSchedules;

  const query = searchTerm.toLowerCase();
  return indexedSchedules.filter(
    (item) =>
      (item.country || "").toLowerCase().includes(query) ||
      (item.time || "").toLowerCase().includes(query) ||
      (item.weekDay || "").toLowerCase().includes(query) ||
      (item.timezone || "").toLowerCase().includes(query)
  );
};

export const prepareDraftFromRow = (row = {}) => {
  const draft = {
    ...row,
    time: row.time || "",
    weekDay: normalizeDay(row.weekDay),
    timezone: row.timezone || "",
    country: row.country || "",
  };

  if (typeof draft.time === "string" && draft.time.includes(":")) {
    const [hour] = draft.time.split(":");
    draft.time = hour;
  }

  return draft;
};

export const hasScheduleChanges = (originalRow = {}, draft = {}) => {
  let draftTime = draft.time;
  if (typeof draftTime === "string" && !draftTime.includes(":")) {
    draftTime = `${String(draftTime).padStart(2, "0")}:00`;
  }

  return (
    draftTime !== originalRow.time ||
    normalizeDay(draft.weekDay) !== normalizeDay(originalRow.weekDay) ||
    draft.timezone !== originalRow.timezone ||
    draft.dataRetentionPeriod !== originalRow.dataRetentionPeriod
  );
};

export const buildDmsSchedulePayload = ({
  countryCode,
  time,
  timezone,
  weekDay,
  dataRetentionPeriod,
  normalizeWeekDay = true,
}) => {
  const hour = time !== undefined && time !== null && time !== ""
    ? String(time).padStart(2, "0")
    : "00";

  return {
    countryCode,
    time: `${hour}:00:00`,
    timeZone: timezone || "",
    weekDay: normalizeWeekDay ? (weekDay || "").toLowerCase() : weekDay,
    dataRetentionPeriod: dataRetentionPeriod || "",
  };
};

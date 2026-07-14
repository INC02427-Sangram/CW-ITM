export const validateEmail = (email = "") => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isDuplicateEmail = (rows = [], email = "") => {
  if (!email) return false;
  
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) return false;

  return rows.some(
    (row) => (row.emailId || "").trim().toLowerCase() === normalizedEmail
  );
};

export const buildReceiverEmailPayload = ({
  emailId,
  selectedCountry,
  distributionChannel,
  division,
  salesOrg,
}) => ({
  emailId,
  frequency: 0,
  distChannelCode: distributionChannel,
  division,
  countryCode: selectedCountry?.countryCode || "",
  schedulerName: "Default Scheduler",
  salesOrg,
  manualReviewStatus: true,
  emailSchedulerStatus: true,
});

export const filterReceiverEmails = (rows = [], searchTerm = "") => {
  const term = searchTerm.trim().toLowerCase();

  if (!term) return rows;

  if (term === "active") {
  return rows.filter(
    (row) => row.configStatus === true
  );
}

if (term === "inactive") {
  return rows.filter(
    (row) => row.configStatus === false
  );
}

  return rows.filter((row) => {
    const haystack = [
      row.emailId,
      row.countryName,
      row.salesOrg,
      row.distChannelCode,
      row.division,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(term);
  });
};

export const mapReceiverEmailRows = (rows = []) =>
  rows.map((row, index) => ({
    id: index,
    status: row?.manualReviewStatus ? "CREATED" : "TO BE REVIEWED",
    emailId: row?.emailId,
    countryName: row.countryName,
    salesOrg: row.salesOrg,
    configStatus:
    typeof row?.configStatus === "boolean"
    ? row.configStatus
    : "-",
  }));

export const getReceiverEmailStats = (rows = []) => ({
  total: rows.length,

  active: rows.filter(
    (row) => row.configStatus === true
  ).length,

  inactive: rows.filter(
    (row) => row.configStatus !== true
  ).length,
});

export const hasReceiverEmailFormValues = ({
  email,
  country,
  salesOrg,
  distributionChannel,
  division,
}) => Boolean(email || country || salesOrg || distributionChannel || division);

export const isReceiverEmailSaveDisabled = ({
  isEmailValid,
  email,
  country,
  salesOrg,
  formErrors,
}) =>
  !isEmailValid ||
  !email ||
  !country ||
  !salesOrg ||
  formErrors.emailError !== "" ;
export const getReceiverEmailDeleteDescription = (email) => {
  if (!email) return "";

  const azureStatus =
    email.configStatus !== undefined
      ? email.configStatus
        ? "Active"
        : "Inactive"
      : "N/A";

  return `Country: ${email.countryName || "N/A"} | Sales Org: ${
    email.salesOrg || "N/A"
  } | Distribution Channel: ${email.distChannelCode || "N/A"} | Division: ${
    email.division || "N/A"
  } | Azure Status: ${azureStatus}`;
};

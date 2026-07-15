/**
 * Utility functions for ItemDetails component
 * These functions handle validation, calculations, and data transformations
 */

/**
 * Check if a row has meaningful data (non-empty fields or non-zero values)
 * @param {Object} row - The row data to check
 * @returns {boolean} - True if row has meaningful data
 */
export const hasMeaningfulData = (row) => {
  if (!row) return false;

  // string-ish fields
  const textFields = [
    'poMaterialNumber',
    'poMatDescription',
    'sapMaterialNumber',
    'sapMatDescription',
    'poUom',
    'sapUom',
    'exceptionType',
    'comment',
  ];
  const anyText = textFields.some(
    (k) => row[k] && String(row[k]).trim() !== ""
  );

  // numeric fields
  const anyNumber =
    [row.sapQuantity, row.poQuantity, row.poUnitPrice, row.poTotalAmount]
      .some((v) => v !== null && v !== undefined && Number(v) !== 0);

  return anyText || anyNumber;
};

/**
 * Mandatory fields configuration for item validation
 */
export const MANDATORY_FIELDS = [
  "sapMaterialNumber",
  "sapMatDescription",
  "poQuantity",
  "poUom",
  "poUnitPrice",
];

/**
 * Mandatory field labels for display messages
 */
export const MANDATORY_FIELD_LABELS = {
  poQuantity: "PO Quantity",
  poUom: "PO UOM",
  poUnitPrice: "Unit Price",
  sapMaterialNumber: " SAP Material Number",
  sapMatDescription: "SAP Material Description",
  sapQuantity: "SAP Quantity",
  sapUom: "SAP UOM",
  poTotalAmount: "Net Price",
};

/**
 * Validate mandatory fields in an item
 * @param {Object} item - The item to validate
 * @param {Array} mandatoryFields - Array of mandatory field names
 * @returns {Array} - Array of missing field names
 */
export const validateMandatoryFields = (item, mandatoryFields = MANDATORY_FIELDS) => {
  return mandatoryFields.filter((field) => {
    const value = item[field];
    return !value || value.toString().trim() === "";
  });
};

/**
 * Calculate summary data from item list
 * @param {Array} itemList - List of items
 * @param {Object} salesItemdata - Sales item data containing totals
 * @returns {Object} - Calculated summary data
 */
export const calculateSummaryData = (itemList = [], salesItemdata = {}) => {
  let validItems = 0;
  let invalidItems = 0;
  let otherExceptions = 0;


  itemList?.forEach((item) => {
    if (item.exceptionType === "Invalid Material") {
      invalidItems += 1;
    } else if (
      item.exceptionType === "Resolved" ||
      item.exceptionType === "" ||
      item.exceptionType === null
    ) {
      validItems += 1;
    } else if (item.exceptionType) {
      otherExceptions += 1;
    }
  });

  const netQuantity = salesItemdata?.poTotalQuantity || 0;
  const netPrice = parseFloat((salesItemdata?.poTotalAmount || 0).toFixed(2));
  const sapNetQuantity = salesItemdata?.sapTotalQuantity || 0;
  const sapNetPrice = salesItemdata?.sapTotalAmount || 0;
  const totalItems = salesItemdata?.itemList?.length || 0;

  return {
    netQuantity,
    netPrice,
    sapNetQuantity,
    sapNetPrice,
    totalItems,
    validItems,
    invalidItems,
    otherExceptions,
  };
};

/**
 * Create summary data array for display
 * @param {Object} summary - Summary data object
 * @param {Function} t - Translation function
 * @returns {Array} - Array of summary items with labels and values
 */
export const createSummaryDataArray = (summary, t) => {
  return [
    { key: "netQuantity", label: t("Net Quantity"), value: summary.netQuantity },
    { key: "netPrice", label: t("Net Price"), value: summary.netPrice },
    { key: "sapNetQuantity", label: t("SAP Net Quantity"), value: summary.sapNetQuantity },
    { key: "sapNetPrice", label: t("SAP Net Price"), value: summary.sapNetPrice },
    { key: "totalItems", label: t("Total Items"), value: summary.totalItems },
    { key: "validItems", label: t("Valid Items"), value: summary.validItems },
    { key: "invalidItems", label: t("Invalid Items"), value: summary.invalidItems },
    { key: "otherExceptions", label: t("Other Exceptions"), value: summary.otherExceptions },
  ];
};

/**
 * Calculate net amount from quantity and unit price
 * @param {number} quantity - Quantity value
 * @param {number} unitPrice - Unit price value
 * @returns {number} - Calculated net amount (rounded to 2 decimals)
 */
export const calculateNetAmount = (quantity, unitPrice) => {
  const qtyNum = Number(quantity) || 0;
  const priceNum = Number(unitPrice) || 0;
  return qtyNum && priceNum ? Number((qtyNum * priceNum).toFixed(2)) : 0;
};

/**
 * Generate a unique temporary order item ID
 * @returns {string} - Temporary ID with timestamp and random component
 */
export const generateTempOrderItemId = () => {
  return `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

/**
 * Check if order item ID is temporary
 * @param {string} orderItemId - Order item ID to check
 * @returns {boolean} - True if ID is temporary
 */
export const isTempOrderItemId = (orderItemId) => {
  return String(orderItemId).startsWith("temp_");
};

// Normalizes exceptionType into an array of trimmed, non-empty strings
// regardless of whether it comes as: null, "", a single string,
// a delimited string ("Invalid Material,UOM Not Found"), or an array.
const getExceptionList = (exceptionType) => {
  if (exceptionType === null || exceptionType === undefined) return [];
  if (Array.isArray(exceptionType)) {
    return exceptionType.map((e) => (e ?? "").trim()).filter(Boolean);
  }
  return String(exceptionType)
    .split(/[,;]/)
    .map((e) => e.trim())
    .filter(Boolean);
};

/**
 * Filter items by exception type
 * @param {Array} items - Array of items to filter
 * @param {string} filterType - Filter type ("All", "Invalid Material", "Valid Material", "Other Exceptions")
 * @returns {Array} - Filtered items
 */
export const filterItemsByExceptionType = (items, filterType) => {
  if (filterType === "Invalid Material") {
    // Show item if "Invalid Material" is ANY one of its exceptions,
    // even if other exceptions (e.g. UOM not found) are also present.
    return items.filter((item) =>
      getExceptionList(item.exceptionType).includes("Invalid Material")
    );
  } else if (filterType === "Other Exceptions") {
    // Show item if it has at least one exception that is NOT
    // "Invalid Material", "Resolved", or empty — even if
    // "Invalid Material" also co-exists on that same item.
    return items.filter((item) => {
      const exceptions = getExceptionList(item.exceptionType);
      return exceptions.some(
        (exc) => exc !== "Invalid Material" && exc !== "Resolved"
      );
    });
  } else if (filterType === "Valid Material") {
    // Show item only if it has NO exceptions at all, or every
    // exception listed is "Resolved".
    return items.filter((item) => {
      const exceptions = getExceptionList(item.exceptionType);
      return (
        exceptions.length === 0 ||
        exceptions.every((exc) => exc === "Resolved")
      );
    });
  } else {
    return items; // "All"
  }
};

/**
 * Create new material object for adding to item list
 * @param {Array} itemDetailRow - Current item list
 * @returns {Object} - New material object
 */
export const createNewMaterialObject = (itemDetailRow = []) => {
  let maxSerialNumber = itemDetailRow?.reduce((max, item) => {
    const serial = Number(item.soItemNumber);
    return serial > max ? serial : max;
  }, 0);

  const firstItem = itemDetailRow?.at(0) || {};

  return {
    sapMaterialNumber: "",
    sapMatDescription: "",
    sapQuantity: "",
    poQuantity: "",
    exceptionType: "",
    itemId: " ",
    poMaterialNumber: "",
    poMatDescription: "",
    sapUom: "",
    poTotalAmount: "",
    poUom: "",
    sapUnitPrice: "",
    sapTotalAmount: "",
    key: itemDetailRow?.length,
    newMaterialCheck: true,
    soItemNumber: maxSerialNumber + 1,
    orderItemId: generateTempOrderItemId(),
    conditionType: firstItem.conditionType,
    conditionValue: firstItem.conditionValue,
    orderHeaderId: firstItem.orderHeaderId,
    shipTo: firstItem.shipTo,
    textLine: firstItem.textLine,
    updateFlag: firstItem.updateFlag,
    message: firstItem.message,
    messageType: firstItem.messageType,
    refDocType: firstItem.refDocType,
  };
};

/**
 * Create payload for updating item
 * @param {Object} updatedItem - Updated item data
 * @param {Object} userDetails - User details
 * @param {number} netAmount - Calculated net amount
 * @returns {Object} - API payload object
 */
export const createUpdateItemPayload = (updatedItem, userDetails, netAmount) => {
  return {
    sapTotalAmount: Number(updatedItem.sapTotalAmount) || 0,
    sapTotalQuantity: Number(updatedItem.sapQuantity) || 0,
    poTotalAmount: netAmount,
    poTotalQuantity: Number(updatedItem.poQuantity) || 0,
    itemList: [
      {
        orderItemId:
          updatedItem.orderItemId && String(updatedItem.orderItemId).startsWith("temp")
            ? null
            : updatedItem.orderItemId,
        poMaterialNumber: updatedItem.poMaterialNumber || "",
        poMatDescription: updatedItem.poMatDescription || "",
        sapQuantity: Number(updatedItem.sapQuantity) || 0,
        poQuantity: Number(updatedItem.poQuantity) || 0,
        poUnitPrice: Number(updatedItem.poUnitPrice) || 0,
        poUom: updatedItem.poUom || "",
        poTotalAmount: Number(netAmount) || 0,
        poCurrency: updatedItem.poCurrency || "USD",
        exceptionType: updatedItem.exceptionType || "",
        sapMaterialNumber: updatedItem.sapMaterialNumber || "",
        sapMatDescription: updatedItem.sapMatDescription || "",
        sapUom: updatedItem.sapUom || "",
        sapUnitPrice: Number(updatedItem.sapUnitPrice) || 0,
        sapTotalAmount: Number(updatedItem.sapTotalAmount) || 0,
        createdBy: userDetails?.firstName + " " + userDetails?.lastName,
        createdDate: new Date().toISOString(),
        lastModifiedBy: userDetails?.email,
        lastModifiedDate: new Date().toISOString(),
      },
    ],
  };
};

/**
 * Fields to track for audit purposes
 */
export const FIELDS_TO_TRACK = {
  poMaterialNumber: "Material Number",
  poMatDescription: "Material Description",
  // sapQuantity: "SAP Quantity",
  poQuantity: "PO Quantity",
  poUnitPrice: "Unit Price",
  exceptionType: "Exception Type",
  sapMaterialNumber: "SAP Material ID",
  sapMatDescription: "SAP Material Description",
  sapItemNumber: "Item No",
  sapUom: "SAP UOM",
  poTotalAmount: "Net Price",
};

/**
 * Get changed fields between original and updated item
 * @param {Object} originalItem - Original item data
 * @param {Object} updatedItem - Updated item data
 * @param {Object} fieldsToTrack - Fields to check for changes
 * @returns {Array} - Array of changed field names
 */
export const getChangedFields = (originalItem, updatedItem, fieldsToTrack = FIELDS_TO_TRACK) => {
  return Object.keys(fieldsToTrack).filter((field) => {
    const oldVal = originalItem[field] ?? "";
    const newVal = updatedItem[field] ?? "";
    const norm = (v) => (typeof v === "number" ? String(v) : String(v).trim());
    return norm(oldVal) !== norm(newVal);
  });
};

/**
 * Generic storage key for detail columns (kept for backward compatibility).
 */
export const DETAIL_COLUMNS_STORAGE_KEY = "detailColumnList";

/**
 * Single localStorage key for item-level column preferences, shared across all statuses.
 * The merge logic in ItemDetails filters columns by the current status's defaultModuleColumns,
 * so Action/Edit columns never bleed into statuses that don't have them.
 */
export const getDetailColumnsStorageKey = () => "detailColumnList_item";

/**
 * Drop-down filter options for item level filtering
 */
export const DROP_DOWN_FILTER_OPTIONS = [
  "All",
  "Invalid Material",
  "Valid Material",
  "Other Exceptions",
];

/**
 * Customize data array based on visible columns
 * @param {Array} rows - Array of row data
 * @param {Array} columnList - Array of column configurations
 * @returns {Array} - Customized data array
 */
export const customizeDataArray = (rows = [], columnList = []) => {
  return rows.map((rowData) => {
    const adjustedRow = {};
    columnList?.forEach((column) => {
      if (column.visible) {
        if (Array.isArray(column.fieldBinding)) {
          column.fieldBinding.forEach((field) => {
            adjustedRow[field] = rowData[field];
          });
        } else {
          adjustedRow[column.fieldBinding] = rowData[column.fieldBinding];
        }
      }
    });
    return adjustedRow;
  });
};

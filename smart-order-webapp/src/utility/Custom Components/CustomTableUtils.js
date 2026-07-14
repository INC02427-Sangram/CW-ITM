/**
 * Utility functions for CustomTable component
 */

/**
 * Check if a row is empty (all key fields are blank)
 * @param {Object} row - The row object to check
 * @returns {boolean} - True if row is empty
 */
export const isRowEmpty = (row) => {
  return (
    !row?.sapMaterialNumber &&
    !row?.sapMatDescription &&
    !row?.poQuantity &&
    !row?.poUnitPrice &&
    !row?.sapUom &&
    !row?.poTotalAmount
  );
};

/**
 * Get priority color based on priority number
 * @param {string|number} priority - Priority value
 * @returns {string} - Color identifier (error, warning, success)
 */
export const getPriorityColor = (priority) => {
  const num = parseInt(priority);
  if (num <= 3) return "error";
  if (num <= 6) return "warning";
  return "success";
};

/**
 * Compute net price from quantity and unit price
 * @param {string|number} qty - Quantity value
 * @param {string|number} unitPrice - Unit price value
 * @returns {string} - Computed net price or empty string
 */
export const computeNetPrice = (qty, unitPrice) => {
  if (qty === undefined || unitPrice === undefined || qty === "" || unitPrice === "") {
    return "";
  }
  const q = Number(qty);
  const p = Number(unitPrice);
  if (Number.isNaN(q) || Number.isNaN(p)) return "";
  return (q * p).toFixed(2);
};

/**
 * Check if row has unsaved changes
 * @param {Object} row - The row object
 * @param {Object} unsavedRow - Object containing unsaved changes by row ID
 * @returns {boolean} - True if row has changes
 */
export const rowHasChanges = (row, unsavedRow) => {
  const draft = unsavedRow?.[row.orderItemId];
  if (!draft) return false;
  return Object.keys(draft).some((k) => {
    const oldVal = row[k] ?? "";
    const newVal = draft[k] ?? "";
    // Normalize values for comparison
    const normalizeValue = (v) => {
      if (v === null || v === undefined) return "";
      return String(v).trim();
    };
    return normalizeValue(oldVal) !== normalizeValue(newVal);
  });
};

/**
 * Normalize value for comparison
 * @param {any} v - Value to normalize
 * @returns {string} - Normalized string value
 */
export const normalizeValue = (v) => {
  if (v === null || v === undefined) return "";
  return String(v).trim();
};

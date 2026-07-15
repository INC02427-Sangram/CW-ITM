/**
//Checks whether a combination of field values already exists in the given data array.
 *
 * @param {Array<Object>} data        - The existing rows/records to check against
 * @param {Object}        newValues   - Key-value pairs representing the new combination, e.g. { country: "US", salesOrg: "1000" }
 * @param {number|null}   excludeIndex - Optional row index to skip (useful during editing)
 * @returns {boolean} true if a duplicate combination exists, false otherwise
 *
 * @example
 * // Check if Country + SalesOrg combination already exists
 * const isDuplicate = validateUniqueCombination(
 *   tableData,
 *   { country: "Germany", salesOrg: "1000" }
 * );
 *
 * // During editing, exclude the current row
 * const isDuplicate = validateUniqueCombination(
 *   tableData,
 *   { country: "Germany", salesOrg: "1000" },
 *   editRowIndex
 * );
 */

const validateUniqueCombination = (data, newValues, excludeIndex = null) => {
  if (!data || !Array.isArray(data) || !newValues) return false;

  const fields = Object.keys(newValues);

  // All field values must be truthy for a meaningful check
  const allFilled = fields.every((key) => {
    const val = newValues[key];
    return val !== undefined && val !== null && val !== "";
  });
  if (!allFilled) return false;

  return data.some((row, index) => {
    if (excludeIndex !== null && index === excludeIndex) return false;

    return fields.every((key) => {
      const rowVal = (row[key] ?? "").toString().trim().toLowerCase();
      const newVal = (newValues[key] ?? "").toString().trim().toLowerCase();
      return rowVal === newVal;
    });
  });
};

export default validateUniqueCombination;

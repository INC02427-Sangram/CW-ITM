/**
 * ColumnValueGetters.js
 * 
 * Provides valueGetter functions for different column types in CustomTable.
 * These functions are used by DataGrid for sorting and internal data handling.
 */

import { formatCustomerId } from "./CellRenderers";

/**
 * Get the appropriate valueGetter function for a column
 * @param {Object} col - Column configuration
 * @returns {Function} ValueGetter function for DataGrid
 */
export const getColumnValueGetter = (col) => {
  return (value, row) => {
    switch (col.type) {
      case "date":
        return row[col.fieldBinding]
          ? new Date(row[col.fieldBinding]).getTime()
          : null;

      case "reqdate":
        return row[col.fieldBinding]
          ? new Date(row[col.fieldBinding]).getTime()
          : null;

      case "successFlag":
        return row[col.fieldBinding] === "true" ? 1 : 0;

      case "customer":
        const customerName = row[col.fieldBinding[0]] || "";
        const customerId = row[col.fieldBinding[1]]
          ? `(${formatCustomerId(row[col.fieldBinding[1]])})`
          : "";
        return customerName === "-" && customerId === "-"
          ? "-"
          : customerName + customerId;

      case "status":
        return row[col.fieldBinding] || "";

      case "sNo":
        return row.soItemNumber || 0;

      case "checkBox":
        return row.checkbox || false;

      case "exceptionType":
        return row[col.fieldBinding] || "";

      case "icons":
        return row.exceptionType &&
          row.exceptionType !== "Resolved" &&
          row.exceptionType !== ""
          ? 1
          : 0;

      default:
        if (Array.isArray(col.fieldBinding)) {
          return col.fieldBinding.map((field) => row[field]).join(" - ");
        } else {
          return row[col.fieldBinding];
        }
    }
  };
};

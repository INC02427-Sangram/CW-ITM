/**
 * Customer-related utility functions for BasicDetails component
 */

/**
 * Get the default customer from a list
 * @param {Array} list - List of customers
 * @returns {Object|null} - Default customer or null
 */
export const getDefaultCustomer = (list = []) => {
  if (list.length === 1 && list[0]?.selectedCustomer) return list[0];   
  return list.find((c) => c?.selectedCustomer) || null;
};
/**
 * Convert a boolean-like value to boolean
 * @param {any} v - Value to convert
 * @returns {boolean}
 */
export const toBool = (v) => v === true || v === "true";

/**
 * Build label for customer autocomplete
 * @param {Object} c - Customer object
 * @returns {string} - Formatted label
 */
export const buildLabel = (c) =>
  c ? `${c.sapCustomerId ?? ""} - ${c.sapCustomerName1 ?? c.sapCustomerName ?? ""}` : "";

/**
 * Format customer address
 * @param {Object} obj - Customer object
 * @returns {string} - Formatted address
 */
export const formatAddress = (obj) => {
  if (!obj) return "";
  const { sapCustomerStreet1, sapCustomerCity, sapCustomerState, sapCustomerPostalCode } = obj;
  return [sapCustomerStreet1, sapCustomerCity, sapCustomerState, sapCustomerPostalCode]
    .filter(Boolean)
    .join(", ");
};

/**
 * Build save payload by removing unnecessary lists
 * @param {Object} data - Order data
 * @returns {Object} - Cleaned payload
 */
export const buildSavePayload = (data) => ({
  ...data,
  shipToList: [],
  soldToList: [],
  billToList: [],
  payerToList: [],
  salesOrderItemList: [],
});

/**
 * Normalize string for comparison
 * @param {string} s - String to normalize
 * @returns {string} - Normalized string
 */
export const normalize = (s) => String(s || "").trim().toLowerCase();

/**
 * Drop a specific tag from CSV string
 * @param {string} csv - Comma-separated tags
 * @param {string} tag - Tag to remove
 * @returns {string} - Updated CSV string
 */
export const dropTagFromCsv = (csv, tag) => {
  const target = normalize(tag);
  return String(csv || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((ex) => normalize(ex) !== target)
    .join(",");
};

/**
 * Check if line items contain a specific exception tag
 * @param {Array} itemDetail - Line items
 * @param {string} tag - Tag to check
 * @returns {boolean}
 */
export const lineItemsHaveTag = (itemDetail, tag) => {
  const target = normalize(tag);
  const items = Array.isArray(itemDetail) ? itemDetail : [];
  return items.some((row) => {
    const tags = String(row?.exceptionType || "")
      .split(",")
      .map((x) => normalize(x))
      .filter(Boolean);
    return tags.includes(target);
  });
};

/**
 * Normalize a customer object (from search API or DB) to the backend save format.
 * partnerFunction: "SH" = shipTo, "SP" = soldTo, "BP" = billTo, "PY" = payerTo
 */
export const normalizeCustomerForSave = (customer, partnerFunction, orderHeaderId) => ({
  salesHeaderCustomerId: null,
  orderHeaderId: orderHeaderId || null,
  sapCustomerId: customer.sapCustomerId ?? customer.customerNum ?? "",
  sapCustomerName1: customer.sapCustomerName1 ?? customer.name1 ?? "",
  sapCustomerName2: null,
  sapCustomerCity: customer.sapCustomerCity ?? customer.city ?? "",
  sapCustomerStreet1: customer.sapCustomerStreet1 ?? customer.street ?? "",
  sapCustomerStreet2: null,
  sapCustomerState: customer.sapCustomerState ?? customer.region ?? "",
  sapCustomerPostalCode: customer.sapCustomerPostalCode ?? customer.postCode ?? "",
  partnerFunction: customer.partnerFunction || partnerFunction,
  selectedCustomer: customer.selectedCustomer ?? false,
  createdBy: null,
  createdDate: null,
  salesOrderHeader: null,
});

/**
 * Map customer list from API response
 * @param {Array} customerList - Raw customer list
 * @returns {Array} - Mapped customer list
 */
export const mapCustomerList = (customerList) => {
  const isSingleCustomer = customerList.length === 1;
  return customerList.map((r) => ({
    ...r,
    sapCustomerName: r.name1?.trim() ?? "",
    sapCustomerId: r.customerNum ?? "",
    sapCustomerAddress: [r.street, r.postCode, r.city]
      .filter(Boolean)
      .join(", "),
    selectedCustomer: isSingleCustomer,
  }));
};

// Shared user role constants
export const ROLE_CUSTOMER_SALES_REP = "CUSTOMER_SALES_REP";

/**
 * Case-insensitive check if userRole matches CUSTOMER_SALES_REP.
 */
export function checkIsCSR(userRole) {
  if (!userRole) return false;
  const normalize = (r) => r?.toUpperCase?.().replace(/\s+/g, "_") || "";
  if (typeof userRole === "string") {
    return normalize(userRole) === ROLE_CUSTOMER_SALES_REP;
  }
  if (Array.isArray(userRole)) {
    return userRole.some((r) => normalize(r) === ROLE_CUSTOMER_SALES_REP);
  }
  return false;
}

export default {
  ROLE_CUSTOMER_SALES_REP,
  checkIsCSR,
};

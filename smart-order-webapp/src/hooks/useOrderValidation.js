import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Custom hook for order validation logic
 */
export const useOrderValidation = () => {
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState({
    nullMaterial: { visible: false, message: null },
    emptyMaterialList: { visible: false, message: null },
    exceptionType: { visible: false, message: null },
  });

  /**
   * Check if there are unsaved rows in the order
   */
  const checkForUnsavedRows = (salesOrderDetails) => {
    const raw = salesOrderDetails?.salesOrderItemList;
    const salesOrderItemList = Array.isArray(raw) ? raw : [];

    return salesOrderItemList.some((row) => {
      return (
        !row.sapMatDescription ||
        !row.sapMaterialNumber ||
        !row.poQuantity ||
        !row.poMaterialNumber ||
        !row.sapUom
      );
    });
  };

  /**
   * Validate order header information
   */
  const validateHeader = (isHeaderValid) => {
    if (!isHeaderValid) {
      return {
        isValid: false,
        message: "Order header information is not filled",
      };
    }
    return { isValid: true };
  };

  /**
   * Validate material list for unsaved rows
   */
  const validateUnsavedRows = (salesOrderDetails) => {
    const raw = salesOrderDetails?.salesOrderItemList;
    const salesOrderItemList = Array.isArray(raw) ? raw : [];

    if (
      salesOrderItemList.some((item) => item.newMaterialCheck) &&
      checkForUnsavedRows(salesOrderDetails)
    ) {
      return {
        isValid: false,
        message:
          "There are unsaved/empty rows. Please save them before submitting to SAP.",
      };
    }
    return { isValid: true };
  };

  /**
   * Validate line items for exceptions
   */
  const validateLineItems = (itemDetailRow, skipInvalidMatCheck = false) => {
    let filteredItems = Array.isArray(itemDetailRow) ? [...itemDetailRow] : [];
    filteredItems = filteredItems.filter(
      (item) => !(item.newMaterialCheck && item.poQuantity === null)
    );

    if (!filteredItems || filteredItems.length === 0) {
      return {
        isValid: false,
        message: t("emptyMaterialList"),
      };
    }

    if (!skipInvalidMatCheck) {
      const hasExceptions = filteredItems.some(
        (item) => item.exceptionType && item.exceptionType.trim() !== ""
      );

      if (hasExceptions) {
        return {
          isValid: false,
          message:
            "The order contains exceptions in item list, Please fix and submit.",
        };
      }
    }

    return { isValid: true, filteredItems };
  };

  /**
   * Validate header-level exceptions (e.g. Duplicate PO)
   */
  const validateHeaderExceptions = (salesOrderDetails) => {
    const exceptionTypes = (salesOrderDetails?.exceptionType || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (exceptionTypes.includes("Duplicate PO")) {
      return {
        isValid: false,
        message: "The order contains exceptions, Please fix and submit.",
      };
    }
    return { isValid: true };
  };

  /**
   * Comprehensive validation for order submission
   */
  const validateForSubmission = (
    isHeaderValid,
    salesOrderDetails,
    itemDetailRow,
    skipInvalidMatCheck = false
  ) => {
    // Validate header
    const headerValidation = validateHeader(isHeaderValid);
    if (!headerValidation.isValid) {
      return headerValidation;
    }

    // Validate header-level exceptions (Duplicate PO, etc.)
    const headerExceptionValidation = validateHeaderExceptions(salesOrderDetails);
    if (!headerExceptionValidation.isValid) {
      return headerExceptionValidation;
    }

    // Validate unsaved rows
    const unsavedRowsValidation = validateUnsavedRows(salesOrderDetails);
    if (!unsavedRowsValidation.isValid) {
      return unsavedRowsValidation;
    }

    // Validate line items
    const lineItemsValidation = validateLineItems(
      itemDetailRow,
      skipInvalidMatCheck
    );
    if (!lineItemsValidation.isValid) {
      return lineItemsValidation;
    }

    return { isValid: true };
  };

  /**
   * Set validation error message
   */
  const setError = (errorType, message) => {
    setValidationErrors((prev) => ({
      ...prev,
      [errorType]: { visible: true, message },
    }));
  };

  /**
   * Clear validation error
   */
  const clearError = (errorType) => {
    setValidationErrors((prev) => ({
      ...prev,
      [errorType]: { visible: false, message: null },
    }));
  };

  /**
   * Clear all validation errors
   */
  const clearAllErrors = () => {
    setValidationErrors({
      nullMaterial: { visible: false, message: null },
      emptyMaterialList: { visible: false, message: null },
      exceptionType: { visible: false, message: null },
    });
  };

  return {
    validationErrors,
    checkForUnsavedRows,
    validateHeader,
    validateUnsavedRows,
    validateHeaderExceptions,
    validateLineItems,
    validateForSubmission,
    setError,
    clearError,
    clearAllErrors,
  };
};

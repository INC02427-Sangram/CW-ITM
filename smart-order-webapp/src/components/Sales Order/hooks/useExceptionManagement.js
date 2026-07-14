import { useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setSalesOrderDetails } from "../../../redux/reducers/appReducer";
import { lineItemsHaveTag, dropTagFromCsv } from "../utils/customerUtils";

/**
 * Custom hook for managing exception types
 * @param {Object} salesOrderDetailsRef - Ref to sales order details
 * @param {Array} itemDetail - Line items
 * @param {Object} salesOrderDetails - Current sales order details
 * @returns {Object} - Exception management utilities
 */
export const useExceptionManagement = (salesOrderDetailsRef, itemDetail, salesOrderDetails) => {
  const dispatch = useDispatch();

  /**
   * Derive header chips: hide "Invalid Material" / "UOM Not Found" if no line item has them
   */
  const exceptionTypeArray = useMemo(() => {
    const rawExceptions = String(salesOrderDetails?.exceptionType || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // GUARD: If the item list is empty, display the header exceptions exactly as they came from the backend
    if (!itemDetail || itemDetail.length === 0) {
      return rawExceptions;
    }

    const n = s => String(s || "").trim().toLowerCase(),
      w = new Set(["invalid material", "uom not found"]),
      L = new Set((itemDetail || [])
        .flatMap(r => String(r?.exceptionType || "")
          .split(",").map(n).filter(Boolean)));
    return String(salesOrderDetails?.exceptionType || "")
      .split(",").map(s => s.trim()).filter(Boolean)
      .filter(tag => !w.has(n(tag)) || L.has(n(tag)));
  }, [salesOrderDetails?.exceptionType, itemDetail]);

  /**
   * Purge "Invalid Material" tag if no line items have it
   */
  const purgeInvalidMaterialTag = useCallback(() => {
    const TAG = "Invalid Material";

    // if any line item still has it, do nothing
    if (lineItemsHaveTag(itemDetail, TAG)) return;

    const prev = salesOrderDetailsRef.current?.exceptionType || "";
    const next = dropTagFromCsv(prev, TAG);

    if (next !== prev) {
      dispatch(
        setSalesOrderDetails({
          ...salesOrderDetailsRef.current,
          exceptionType: next,
        })
      );
      console.log(`[purge] removed "${TAG}" from header. prev="${prev}" → next="${next}"`);
    }
  }, [itemDetail, salesOrderDetailsRef, dispatch]);

  /**
   * Purge "UOM Not Found" tag if no line items have it
   */
  const purgeUomNotFoundTag = useCallback(() => {
    const TAG = "UOM Not Found";

    // if any line item still has it, do nothing
    if (lineItemsHaveTag(itemDetail, TAG)) return;

    const prev = salesOrderDetailsRef.current?.exceptionType || "";
    const next = dropTagFromCsv(prev, TAG);

    if (next !== prev) {
      dispatch(
        setSalesOrderDetails({
          ...salesOrderDetailsRef.current,
          exceptionType: next,
        })
      );
      console.log(`[purge] removed "${TAG}" from header. prev="${prev}" → next="${next}"`);
    }
  }, [itemDetail, salesOrderDetailsRef, dispatch]);

  /**
   * Remove "Multiple Sold To" tag if resolved
   */
  const removeMultipleSoldToIfResolved = useCallback((exceptionsCsv, order) => {
    if (order?.soldToId) {
      return dropTagFromCsv(exceptionsCsv, "Multiple Sold To");
    }
    return exceptionsCsv;
  }, []);

  /**
   * Remove "Multiple Ship To" tag if resolved
   */
  const removeMultipleShipToIfResolved = useCallback((csv, order) => {
    if (order?.shipToId) {
      return dropTagFromCsv(csv, "Multiple Ship To");
    }
    return csv;
  }, []);

  /**
   * Remove "Multiple Bill To" tag if resolved
   */
  const removeMultipleBillToIfResolved = useCallback((csv, order) => {
    if (order?.billToId) {
      return dropTagFromCsv(csv, "Multiple Bill To");
    }
    return csv;
  }, []);

  /**
   * Remove "Multiple Payer To" tag if resolved
   */
  const removeMultiplePayerToIfResolved = useCallback((csv, order) => {
    if (order?.payerToId) {
      return dropTagFromCsv(csv, "Multiple Payer To");
    }
    return csv;
  }, []);

  return {
    exceptionTypeArray,
    purgeInvalidMaterialTag,
    purgeUomNotFoundTag,
    removeMultipleSoldToIfResolved,
    removeMultipleShipToIfResolved,
    removeMultipleBillToIfResolved,
    removeMultiplePayerToIfResolved,
  };
};

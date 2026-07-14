import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { setSalesOrderDetails } from "../../../redux/reducers/appReducer";
import fnServiceRequest from "../../../utility/fnServiceRequest";
import { dropTagFromCsv, normalizeCustomerForSave } from "../utils/customerUtils";
import { trimJson } from "../../../utility/utilityFunctions";

/**
 * Custom hook for order save functionality
 * @param {Object} params - Hook parameters
 * @returns {Object} - Save state and handlers
 */
export const useOrderSave = ({
  salesOrderData,
  setSalesOrderData,
  salesOrderDetails,
  salesOrderDetailsRef,
  selectedShipTo,
  selectedSoldTo,
  selectedBillTo,
  selectedPayerTo,
  userDetails,
  getOrderHeaderById,
  setEditMode,
  showToast,
  removeMultipleShipToIfResolved,
  removeMultipleSoldToIfResolved,
  removeMultipleBillToIfResolved,
  removeMultiplePayerToIfResolved,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Save audit entry
   */
  const fnSaveAudit = useCallback((payload) => {
    console.log("AUDIT PAYLOAD:", payload);
    fnServiceRequest(
      `/JavaServices_Oauth/api/audit/saveAudit`,
      "POST",
      (response) => { },
      (error) => {
        console.error("Audit API error:", error);
      },
      payload
    );
  }, []);

  /**
   * Validate duplicate PO
   */
  const validateDuplicatePo = useCallback((order) => {
    const payload = {
      salesOrg: salesOrderData?.salesOrg || "",
      distChan: salesOrderData?.distChannel || "",
      poNum: salesOrderData?.poNumber || "",
      sapSoldToId: selectedSoldTo?.sapCustomerId || "",
      division: salesOrderData?.division || "",
      orderId: salesOrderData?.orderHeaderId || "",
    };

    fnServiceRequest(
      "/JavaServices_Oauth/api/odata/checkPoDuplicate",
      "POST",
      (res) => {
        const isDup = res?.data?.isDuplicate === true;

        const latest =
          (typeof salesOrderDetailsRef !== "undefined" && salesOrderDetailsRef?.current) ||
          salesOrderDetails ||
          order ||
          {};

        const prev = typeof latest.exceptionType === "string" ? latest.exceptionType : "";
        const tags = new Set(
          prev.split(",").map(s => s.trim()).filter(Boolean)
        );

        if (isDup) {
          tags.add("Duplicate PO");
        } else {
          tags.delete("Duplicate PO");
        }

        const next = Array.from(tags).join(",");
        if (next !== prev) {
          dispatch(setSalesOrderDetails({ ...latest, exceptionType: next }));
        }
      },
      (err) => {
        console.error("Duplicate-PO check failed:", err);
      },
      payload
    );
  }, [salesOrderData, salesOrderDetailsRef, salesOrderDetails, dispatch]);

  /**
   * Post save checks
   */
  const handlePostSaveChecks = useCallback((order) => {
    const { soldToId, shipToId } = order || {};

    if (soldToId && shipToId) {
      const current = (salesOrderDetailsRef.current?.exceptionType || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const updated = current.filter((ex) => ex !== "Customer Unavailable");
      const updatedExceptionType = updated.join(",");

      if (updatedExceptionType !== order?.exceptionType) {
        dispatch(
          setSalesOrderDetails({
            ...salesOrderDetailsRef.current,
            exceptionType: updatedExceptionType,
          })
        );
      }
    }
  }, [salesOrderDetailsRef, dispatch]);

  /**
   * Handle save
   */
  const handleSave = useCallback(() => {
    setIsSaving(true);

    const fieldsToTrack = {
      poNumber: "PO Number",
      shipToId: "Ship To ID",
      shipToName: "Ship To Name",
      soldToId: "Sold To ID",
      soldToName: "Sold To Name",
      poOrderType: "Order Type",
      distChannel: "Distribution Channel",
      division: "Division",
      deliveryBlock: "Delivery Block",
      salesOrg: "Sales Org",
      payerToId: " Payer To Id ",
      payerToName: "Payer To Name",
      billToId: "Bill To Id",
      billToName: "Bill To Name",
    };

    const originalData = salesOrderDetails;

    const orderId = salesOrderData?.orderHeaderId;

    const filterAndNormalize = (arr, partnerFunction) => {
      const list = Array.isArray(arr) ? arr : [];
      const selected = list.filter((c) => c.selectedCustomer);
      const source = selected.length > 0 ? selected : list;
      return source.map((c) => normalizeCustomerForSave(c, partnerFunction, orderId));
    };

    const payload = {
      ...salesOrderData,
      shipTo: filterAndNormalize(salesOrderData?.shipTo ?? salesOrderData?.shipToList, "SH"),
      soldTo: filterAndNormalize(salesOrderData?.soldTo ?? salesOrderData?.soldToList, "SP"),
      billTo: filterAndNormalize(salesOrderData?.billTo ?? salesOrderData?.billToList, "BP"),
      payerTo: filterAndNormalize(salesOrderData?.payerTo ?? salesOrderData?.payerToList, "PY"),
      shipToList: undefined,
      soldToList: undefined,
      billToList: undefined,
      payerToList: undefined,
    };
    const trimmedPayload = trimJson(payload);
    
    fnServiceRequest(
      "/JavaServices_Oauth/api/salesOrder/saveOrder",
      "POST",
      (res) => {
        const savedData = res?.data || payload;
        setSalesOrderData(savedData);

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['customDetails'] });
        queryClient.invalidateQueries({ queryKey: ['poDetails'] });

        const prevHeader = salesOrderDetailsRef.current || {};
        const prevExceptions = savedData.exceptionType ?? prevHeader.exceptionType ?? "";

        let nextExceptions = prevExceptions;

        // Mock mergedData to preserve exception removal logic checks on flat keys
        const checkKeys = {
          shipToId: selectedShipTo?.sapCustomerId,
          soldToId: selectedSoldTo?.sapCustomerId,
          billToId: selectedBillTo?.sapCustomerId,
          payerToId: selectedPayerTo?.sapCustomerId,
        };

        nextExceptions = removeMultipleShipToIfResolved(nextExceptions, checkKeys);
        nextExceptions = removeMultipleSoldToIfResolved(nextExceptions, checkKeys);
        nextExceptions = removeMultipleBillToIfResolved(nextExceptions, checkKeys);
        nextExceptions = removeMultiplePayerToIfResolved(nextExceptions, checkKeys);

        const nextHeader = {
          ...prevHeader,
          ...savedData,
          exceptionType: nextExceptions,
        };

        dispatch(setSalesOrderDetails(nextHeader));

        setEditMode(false);
        setIsSaving(false);
        showToast(res?.message || "Sales order saved successfully", res?.status === "SUCCESS" ? "success" : "info");

        // Audit tracking
        Object.keys(fieldsToTrack).forEach((field) => {
          let oldValue = originalData[field] || "";
          let newValue = salesOrderData[field] || "";

          // Provide values for removed flat fields manually for audit
          if (field === "shipToId") {
            oldValue = (originalData.shipTo || originalData.shipToList || []).find(c => c.selectedCustomer)?.sapCustomerId || "";
            newValue = selectedShipTo?.sapCustomerId || "";
          } else if (field === "soldToId") {
            oldValue = (originalData.soldTo || originalData.soldToList || []).find(c => c.selectedCustomer)?.sapCustomerId || "";
            newValue = selectedSoldTo?.sapCustomerId || "";
          } else if (field === "billToId") {
            oldValue = (originalData.billTo || originalData.billToList || []).find(c => c.selectedCustomer)?.sapCustomerId || "";
            newValue = selectedBillTo?.sapCustomerId || "";
          } else if (field === "payerToId") {
            oldValue = (originalData.payerTo || originalData.payerToList || []).find(c => c.selectedCustomer)?.sapCustomerId || "";
            newValue = selectedPayerTo?.sapCustomerId || "";
          } else if (field === "shipToName") {
            const oldC = (originalData.shipTo || originalData.shipToList || []).find(c => c.selectedCustomer);
            oldValue = oldC ? (oldC.sapCustomerName1 || oldC.sapCustomerName) : "";
            newValue = selectedShipTo?.sapCustomerName1 || selectedShipTo?.sapCustomerName || "";
          } else if (field === "soldToName") {
            const oldC = (originalData.soldTo || originalData.soldToList || []).find(c => c.selectedCustomer);
            oldValue = oldC ? (oldC.sapCustomerName1 || oldC.sapCustomerName) : "";
            newValue = selectedSoldTo?.sapCustomerName1 || selectedSoldTo?.sapCustomerName || "";
          } else if (field === "billToName") {
            const oldC = (originalData.billTo || originalData.billToList || []).find(c => c.selectedCustomer);
            oldValue = oldC ? (oldC.sapCustomerName1 || oldC.sapCustomerName) : "";
            newValue = selectedBillTo?.sapCustomerName1 || selectedBillTo?.sapCustomerName || "";
          } else if (field === "payerToName") {
            const oldC = (originalData.payerTo || originalData.payerToList || []).find(c => c.selectedCustomer);
            oldValue = oldC ? (oldC.sapCustomerName1 || oldC.sapCustomerName) : "";
            newValue = selectedPayerTo?.sapCustomerName1 || selectedPayerTo?.sapCustomerName || "";
          }

          if (oldValue !== newValue) {
            fnSaveAudit({
              salesOrderHeader: { orderHeaderId: salesOrderData?.orderHeaderId },
              action: "Updated",
              entityName: "SalesOrderHeader",
              lastModifiedBy: userDetails?.email,
              lastModifiedDate: new Date().toISOString(),
              createdBy: userDetails?.firstName + " " + userDetails?.lastName,
              createdDate: new Date().toISOString(),
              oldValue: oldValue,
              newValue: newValue,
              remarks: `${fieldsToTrack[field]} Updated from ${oldValue || "-"} to ${newValue || "-"}`,
            });
          }
        });

        handlePostSaveChecks({ ...savedData, soldToId: selectedSoldTo?.sapCustomerId, shipToId: selectedShipTo?.sapCustomerId });

        getOrderHeaderById(() => {
          validateDuplicatePo({ ...savedData, soldToId: selectedSoldTo?.sapCustomerId });
        });
      },
      (err) => {
        console.error("Failed to save order:", err);
        setIsSaving(false);
      },
      trimmedPayload
    );

    console.log("selected shipto  after save", selectedShipTo?.sapCustomerId);
    console.log("selected soldto  after save", selectedSoldTo?.sapCustomerId);
  }, [
    salesOrderData,
    salesOrderDetails,
    selectedShipTo,
    selectedSoldTo,
    selectedBillTo,
    selectedPayerTo,
    setSalesOrderData,
    queryClient,
    getOrderHeaderById,
    salesOrderDetailsRef,
    removeMultipleShipToIfResolved,
    removeMultipleSoldToIfResolved,
    removeMultipleBillToIfResolved,
    removeMultiplePayerToIfResolved,
    dispatch,
    setEditMode,
    showToast,
    userDetails,
    fnSaveAudit,
    validateDuplicatePo,
    handlePostSaveChecks,
  ]);

  return {
    isSaving,
    handleSave,
    validateDuplicatePo,
    handlePostSaveChecks,
  };
};

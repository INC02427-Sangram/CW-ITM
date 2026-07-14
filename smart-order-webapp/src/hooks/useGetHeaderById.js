import { useDispatch } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  setSalesOrderDetails,
  setPoDetails,
  setAdditionalDetails,
  setStatus,
} from "../redux/reducers/appReducer";
import fnServiceRequest from "../utility/fnServiceRequest";
import { Capitalize } from "../utility/utilityFunctions";
import {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
} from "../dataStore/docProcessStatus";

/**
 * Custom hook to fetch sales order header by ID
 * @param {string} orderHeaderId - The order header ID to fetch
 * @param {boolean} exceptionScreenFlag - Flag to disable query when true
 * @returns {object} Hook result with data, loading state, error, and refetch function
 */
export const useGetHeaderById = (
  orderHeaderId,
  exceptionScreenFlag = false,
) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const loadingCountRef = useRef(0);
  // Fetch function
  const fetchData = useCallback(
    (onSuccess) => {
      // Don't fetch if conditions aren't met
      loadingCountRef.current += 1;
      if (!orderHeaderId || exceptionScreenFlag) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const sUrl = `/JavaServices_Oauth/api/salesOrder/getOrderHeaderById?headerId=${orderHeaderId}`;

      fnServiceRequest(
        sUrl,
        "GET",
        (response) => {
          setData(response);
          setIsLoading(false);

          // Dispatch all three sections to Redux
          // Support both new nested structure (headerDetails/poDetails/additionalDetails)
          // and old flat structure for backwards compatibility
          const isNewStructure = response?.data?.headerDetails !== undefined;
          const headerDetails = isNewStructure
            ? response?.data?.headerDetails
            : response?.data;
          const poDetails = response?.data?.poDetails;
          const additionalDetails = response?.data?.additionalDetails;

          // Dispatch header details (with customer arrays)
          if (headerDetails) {
            dispatch(
              setSalesOrderDetails({
                ...headerDetails,
                billToFlag: true,
                payerToFlag: true,
              }),
            );
          }

          // Dispatch PO details
          if (poDetails) {
            dispatch(setPoDetails(poDetails));
          }

          // Dispatch additional details
          if (additionalDetails) {
            dispatch(setAdditionalDetails(additionalDetails));
          }

          const docStatus =
            headerDetails?.docProcessStatus || headerDetails?.orderStatus;

          if (docStatus === "To Be Reviewed" || docStatus === "Drafted") {
            dispatch(setStatus("toBeReviewed"));
          } else if (docStatus === "Created With Block") {
            dispatch(setStatus("createdWithBlock"));
          } else if (docStatus === DOC_STATUS_PENDING_FOR_APPROVAL) {
            dispatch(setStatus("pendingForApproval"));
          } else if (docStatus === DOC_STATUS_REJECTED) {
            dispatch(setStatus("rejected"));
          } else {
            dispatch(setStatus(Capitalize(docStatus)));
          }

          // Allow callers to chain logic after header data is in Redux
          if (typeof onSuccess === "function") {
            onSuccess(headerDetails);
          }
        },
        (err) => {
          console.error("Error fetching sales order header:", err);
          setError(err);
          setIsLoading(false);
        },
      );
    },
    [orderHeaderId, exceptionScreenFlag, dispatch],
  );

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Provide a manual refetch function
  const getOrderHeaderById = useCallback(
    (onSuccess) => {
      loadingCountRef.current = 0;
      if (orderHeaderId) {
        fetchData(onSuccess);
      }
    },
    [orderHeaderId, fetchData],
  );

  return {
    data,
    isLoading,
    error,
    getOrderHeaderById,
    refetch: fetchData, // Alias for compatibility
    loadingCount: loadingCountRef.current, // Expose call count for debugging
  };
};

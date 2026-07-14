import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdditionalDetails } from "../redux/reducers/appReducer";
import fnServiceRequest from "../utility/fnServiceRequest";

/**
 * Custom hook to save additional details
 * Sends the complete additionalDetails object as received from getOrderHeaderById
 * Updates Redux on success, keeps previous data on failure
 * 
 * @param {string} orderHeaderId - The order header ID
 * @returns {object} Hook result with save function, loading state, and error
 */
export const useSaveAdditionalDetails = (orderHeaderId) => {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Get current additionalDetails from Redux (for rollback on failure)
  const currentAdditionalDetails = useSelector((state) => state.appReducer.additionalDetails);

  /**
   * Save additional details to backend
   * @param {object} additionalDetailsData - Complete additionalDetails object with all fields
   * @returns {Promise} Resolves with response data or rejects with error
   */
  const saveAdditionalDetails = useCallback(
    async (additionalDetailsData) => {
      if (!orderHeaderId) {
        const err = new Error("Order Header ID is required");
        setError(err);
        return Promise.reject(err);
      }

      setIsSaving(true);
      setError(null);

      const sUrl = `/JavaServices_Oauth/api/salesOrder/updateAdditionalDetails?headerId=${orderHeaderId}`;

      return new Promise((resolve, reject) => {
        fnServiceRequest(
          sUrl,
          "POST",
          (response) => {
            setIsSaving(false);

            if (response.statusCode === 200 && response.status === "SUCCESS") {
              // Update Redux with the saved data returned from backend
              if (response.data) {
                dispatch(setAdditionalDetails(response.data));
              }
              
              setError(null);
              resolve(response);
            } else {
              const errorMessage = response.message || "Failed to save additional details";
              const err = new Error(errorMessage);
              setError(err);
              
              // Keep previous data in Redux (no change on failure)
              reject(err);
            }
          },
          (err) => {
            console.error("Error saving additional details:", err);
            setIsSaving(false);
            
            const errorMessage = err?.message || "Error saving additional details. Please try again.";
            const error = new Error(errorMessage);
            setError(error);
            
            // Keep previous data in Redux (no change on failure)
            reject(error);
          },
          additionalDetailsData
        );
      });
    },
    [orderHeaderId, dispatch]
  );

  return {
    saveAdditionalDetails,
    isSaving,
    error,
    currentAdditionalDetails,
  };
};

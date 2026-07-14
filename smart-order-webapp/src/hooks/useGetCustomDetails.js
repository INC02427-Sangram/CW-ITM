import { useSelector } from "react-redux";

/**
 * Custom hook to get additional/custom details from Redux store
 * @param {string} orderHeaderId - The order header ID (kept for compatibility)
 * @param {boolean} enabled - Flag to enable/disable (kept for compatibility)
 * @returns {object} Hook result with data from Redux store
 */
export const useGetCustomDetails = (orderHeaderId, enabled = true) => {
  // Read additionalDetails from Redux store
  const additionalDetails = useSelector((state) => state.appReducer.additionalDetails);

  return {
    data: additionalDetails,
    customDetails: additionalDetails,
    isLoading: false,
    isLoadingCustomDetails: false,
    error: null,
    customDetailsError: null,
    isSuccess: !!additionalDetails && Object.keys(additionalDetails).length > 0,
    isFetching: false,
  };
};

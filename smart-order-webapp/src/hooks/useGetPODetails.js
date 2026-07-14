import { useSelector } from "react-redux";

/**
 * Custom hook to get PO details from Redux store
 * @param {string} orderHeaderId - The order header ID (kept for compatibility)
 * @param {boolean} enabled - Flag to enable/disable (kept for compatibility)
 * @returns {object} Hook result with data from Redux store
 */
export const useGetPODetails = (orderHeaderId, enabled = true) => {
  // Read poDetails from Redux store
  const poDetails = useSelector((state) => state.appReducer.poDetails);

  return {
    data: poDetails,
    poDetails: poDetails,
    isLoading: false,
    isLoadingPODetails: false,
    error: null,
    poDetailsError: null,
    isSuccess: !!poDetails && Object.keys(poDetails).length > 0,
    isFetching: false,
  };
};

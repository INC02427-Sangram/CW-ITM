import { useState, useRef, useEffect } from "react";
import fnServiceRequest from "../fnServiceRequest";

/**
 * Custom hook for material search functionality
 * Handles debounced API calls for material search by description and number
 */
export const useMaterialSearch = (currentOrderId) => {
  const [materialDescSearch, setMaterialDescSearch] = useState([]);
  const [materialIdSearch, setMaterialIdSearch] = useState([]);

  // Debounce timers
  const descDebounceRef = useRef(null);
  const idDebounceRef = useRef(null);

  // Request IDs to ignore stale responses
  const descReqIdRef = useRef(0);
  const idReqIdRef = useRef(0);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (descDebounceRef.current) clearTimeout(descDebounceRef.current);
      if (idDebounceRef.current) clearTimeout(idDebounceRef.current);
    };
  }, []);

  /**
   * Fetch materials by description with debouncing
   * @param {string} desc - Material description to search
   * @param {string} rowId - Row ID for tracking
   */
  const fetchMaterialsByDesc = (desc, rowId) => {
    if (!desc || !currentOrderId || !rowId) {
      return;
    }
    const myReq = ++descReqIdRef.current; // Tag this request
    const url = `/JavaServices_Oauth/api/odata/getMaterialSearch?materialDesc=${encodeURIComponent(desc)}&orderId=${encodeURIComponent(currentOrderId)}`;
    fnServiceRequest(
      url,
      "GET",
      (res) => {
        if (myReq !== descReqIdRef.current) return; // Stale response
        const list = res?.data?.itemList ?? [];
        setMaterialDescSearch(list);
      },
      (err) => {
        console.error("Material search by desc error:", err);
        if (myReq !== descReqIdRef.current) return; // Stale response
        setMaterialDescSearch([]);
      }
    );
  };

  /**
   * Fetch materials by material number with debouncing
   * @param {string} num - Material number to search
   * @param {string} rowId - Row ID for tracking
   */
  const fetchMaterialsByNumber = (num, rowId) => {
    if (!num || !currentOrderId || !rowId) {
      return;
    }
    const myReq = ++idReqIdRef.current; // Tag this request
    const url = `/JavaServices_Oauth/api/odata/getMaterialSearch?materialNumber=${encodeURIComponent(num)}&orderId=${encodeURIComponent(currentOrderId)}`;
    fnServiceRequest(
      url,
      "GET",
      (res) => {
        if (myReq !== idReqIdRef.current) return; // Stale response
        const list = res?.data?.itemList ?? [];
        setMaterialIdSearch(list);
      },
      (err) => {
        console.error("Material search by number error:", err);
        if (myReq !== idReqIdRef.current) return; // Stale response
        setMaterialIdSearch([]);
      }
    );
  };

  /**
   * Debounced search by description
   * @param {string} value - Search value
   * @param {string} rowId - Row ID
   * @param {number} delay - Debounce delay in ms (default: 350)
   */
  const debouncedSearchByDesc = (value, rowId, delay = 350) => {
    if (descDebounceRef.current) clearTimeout(descDebounceRef.current);
    
    // Clear the other search results when typing in this field
    setMaterialIdSearch([]);
    
    const q = (value || "").trim();
    
    // Immediately clear results if input is empty
    if (q.length === 0) {
      setMaterialDescSearch([]);
      return;
    }
    
    // Clear results immediately if less than minimum length
    if (q.length < 2) {
      setMaterialDescSearch([]);
      return;
    }
    
    // Debounce the search for non-empty input
    descDebounceRef.current = setTimeout(() => {
      fetchMaterialsByDesc(q, rowId);
    }, delay);
  };

  /**
   * Debounced search by material number
   * @param {string} value - Search value
   * @param {string} rowId - Row ID
   * @param {number} delay - Debounce delay in ms (default: 300)
   */
  const debouncedSearchByNumber = (value, rowId, delay = 300) => {
    if (idDebounceRef.current) clearTimeout(idDebounceRef.current);
    
    // Clear the other search results when typing in this field
    setMaterialDescSearch([]);
    
    const q = (value || "").trim();
    
    // Immediately clear results if input is empty or less than 2 characters
    if (q.length < 2) {
      setMaterialIdSearch([]);
      return;
    }
    
    // Debounce the search for valid input (2+ characters)
    idDebounceRef.current = setTimeout(() => {
      fetchMaterialsByNumber(q, rowId);
    }, delay);
  };

  /**
   * Clear material search results
   */
  const clearMaterialSearch = () => {
    setMaterialDescSearch([]);
    setMaterialIdSearch([]);
  };

  return {
    materialDescSearch,
    materialIdSearch,
    setMaterialDescSearch,
    setMaterialIdSearch,
    fetchMaterialsByDesc,
    fetchMaterialsByNumber,
    debouncedSearchByDesc,
    debouncedSearchByNumber,
    clearMaterialSearch,
  };
};

import { useState, useRef } from "react";
import fnServiceRequest from "../../../utility/fnServiceRequest";
import { mapCustomerList } from "../utils/customerUtils";

/**
 * Debounce helper function
 */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    console.log("Debounced function called");
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const DEBOUNCE_DELAY = 1000;

/**
 * Custom hook for customer search functionality
 * @param {Function} language - Current language
 * @returns {Object} - Search state and handlers
 */
export const useCustomerSearch = (language) => {
  // Ship To Search State
  const [isShipToSearching, setIsShipToSearching] = useState(false);
  const [shipToInputValue, setShipToInputValue] = useState("");
  const [apiShipToOptions, setApiShipToOptions] = useState([]);

  // Sold To Search State
  const [isSoldToSearching, setIsSoldToSearching] = useState(false);
  const [soldToInputValue, setSoldToInputValue] = useState("");
  const [apiSoldToOptions, setApiSoldToOptions] = useState([]);

  // Bill To Search State
  const [isBillToSearching, setIsBillToSearching] = useState(false);
  const [billToInputValue, setBillToInputValue] = useState("");
  const [apiBillToOptions, setApiBillToOptions] = useState([]);

  // Payer To Search State
  const [isPayerToSearching, setIsPayerToSearching] = useState(false);
  const [payerToInputValue, setPayerToInputValue] = useState("");
  const [apiPayerToOptions, setApiPayerToOptions] = useState([]);

  /**
   * Success handler for Ship To search
   */
  const fnSuccessHandlerForShipTo = (list) => {
    setIsShipToSearching(false);
    setApiShipToOptions(list);
  };

  /**
   * Success handler for Sold To search
   */
  const fnSuccessHandlerForSoldTo = (list) => {
    setIsSoldToSearching(false);
    setApiSoldToOptions(list);
  };

  /**
   * Customer name search handler for Ship To ID
   */
  const fnCustomerNameSearchHandlerForShipToId = (customerId, salesOrderData) => {
    if (!customerId) return;
    const { division, salesOrg, distChannel, language, shipToId } = salesOrderData;

    let sUrl = "";

    if (!shipToId) {
      // CASE: Ship-To NOT present → use master search
      sUrl = `/JavaServices_Oauth/api/odata/getCustomerSearchList?customerNumber=${customerId}&salesOrg=${salesOrg}&division=${division}&distChannel=${distChannel}&language=${language}`;
    } else {
      // EXISTING FLOW
      sUrl = `/JavaServices_Oauth/api/odata/getPartnerSearch?customerNum=${customerId}&customerNum2=${shipToId}&salesOrg=${salesOrg}&division=${division}&distChan=${distChannel}&language=${language}&partnerFunctionFlag=S`;
    }

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        const results = response?.data.customerList ?? [];
        const list = results.map((r) => ({
          ...r,
          sapCustomerId: r.customerNum ?? "",
          sapCustomerName1: r.name1?.trim() ?? "",
          sapCustomerName: r.name1?.trim() ?? "",
          sapCustomerCity: r.city || "",
          sapCustomerStreet1: r.street || "",
          sapCustomerState: r.region || "",
          sapCustomerPostalCode: r.postCode || "",
        }));
        fnSuccessHandlerForShipTo(list);
      },
      (error) => {
        console.error("Customer search failed", error);
        setIsShipToSearching(false);
      }
    );
  };

  /**
   * Customer name search handler for Sold To ID
   */
  const fnCustomerNameSearchHandlerForSoldToId = (customerId, salesOrderData) => {
    if (!customerId) return;
    const { division, salesOrg, distChannel, language, shipToId } = salesOrderData;

    let sUrl = "";
    if (!shipToId) {
      // When Ship To is not present, use master search
      sUrl = `/JavaServices_Oauth/api/odata/getCustomerSearchList?customerNumber=${customerId}&salesOrg=${salesOrg}&division=${division}&distChannel=${distChannel}&language=${language}`;
    } else {
      // Existing flow: use partner search with Ship To
      sUrl = `/JavaServices_Oauth/api/odata/getPartnerSearch?customerNum=${customerId}&customerNum2=${shipToId}&salesOrg=${salesOrg}&division=${division}&distChan=${distChannel}&language=${language}&partnerFunctionFlag=${"S"}`;
    }

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        const results = response?.data.customerList ?? [];
        const list = results.map((r) => ({
          ...r,
          sapCustomerId: r.customerNum ?? "",
          sapCustomerName1: r.name1?.trim() ?? "",
          sapCustomerName: r.name1?.trim() ?? "",
          sapCustomerCity: r.city || "",
          sapCustomerStreet1: r.street || "",
          sapCustomerState: r.region || "",
          sapCustomerPostalCode: r.postCode || "",
        }));
        fnSuccessHandlerForSoldTo(list);
      },
      (error) => {
        setIsSoldToSearching(false);
        console.error("Customer search failed", error);
      }
    );
  };

  // Debounced search refs
  const debouncedShipToSearch = useRef(
    debounce(fnCustomerNameSearchHandlerForShipToId, DEBOUNCE_DELAY)
  ).current;

  const debouncedSoldToSearch = useRef(
    debounce(fnCustomerNameSearchHandlerForSoldToId, DEBOUNCE_DELAY)
  ).current;

  return {
    // Ship To
    isShipToSearching,
    setIsShipToSearching,
    shipToInputValue,
    setShipToInputValue,
    apiShipToOptions,
    setApiShipToOptions,
    debouncedShipToSearch,
    
    // Sold To
    isSoldToSearching,
    setIsSoldToSearching,
    soldToInputValue,
    setSoldToInputValue,
    apiSoldToOptions,
    setApiSoldToOptions,
    debouncedSoldToSearch,
    
    // Bill To
    isBillToSearching,
    setIsBillToSearching,
    billToInputValue,
    setBillToInputValue,
    apiBillToOptions,
    setApiBillToOptions,
    
    // Payer To
    isPayerToSearching,
    setIsPayerToSearching,
    payerToInputValue,
    setPayerToInputValue,
    apiPayerToOptions,
    setApiPayerToOptions,
  };
};

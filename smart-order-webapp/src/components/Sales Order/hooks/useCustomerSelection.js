import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSalesOrderDetails } from "../../../redux/reducers/appReducer";
import fnServiceRequest from "../../../utility/fnServiceRequest";
import {
  getDefaultCustomer,
  mapCustomerList,
  buildLabel,
} from "../utils/customerUtils";

const isFilled = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== "" &&
  String(value).trim().toLowerCase() !== "null";

const getCustomerDistChannel = (customer) =>
  customer?.disCh ?? customer?.distChannel;

const getCustomerDivision = (customer) => customer?.division;

/**
 * Custom hook for managing customer selection and related API calls
 * @param {Object} params - Hook parameters
 * @returns {Object} - Customer selection state and handlers
 */
export const useCustomerSelection = ({
  salesOrderDetailsRef,
  salesOrderData,
  setSalesOrderData, // setSalesOrderData is the react state setter for salesOrderData
  salesOrderDetails,
  billToVisible,
  payerToVisible,
  language,
  setShipToInputValue,
  setSoldToInputValue,
  setBillToInputValue,
  setPayerToInputValue,
  setSelectedBillTo,
  setSelectedPayerTo,
  setApiBillToOptions,
  setApiPayerToOptions,
  setIsBillToSearching,
  setIsPayerToSearching,
  setApiSoldToOptions,
  setIsSoldToSearching,
  editMode,
  setEditMode,
  status,
}) => {
  const dispatch = useDispatch();

  const shipToDropdown =
    salesOrderDetails?.shipTo ?? salesOrderDetails?.shipToList ?? [];
  const soldToDropdown =
    salesOrderDetails?.soldTo ?? salesOrderDetails?.soldToList ?? [];
  const billToDropdown =
    salesOrderDetails?.billTo ?? salesOrderDetails?.billToList ?? [];
  const payerToDropdown =
    salesOrderDetails?.payerTo ?? salesOrderDetails?.payerToList ?? [];

  const [selectedShipTo, setSelectedShipTo] = useState(
    getDefaultCustomer(shipToDropdown),
  );
  const [selectedSoldTo, setSelectedSoldTo] = useState(
    getDefaultCustomer(soldToDropdown),
  );

  // Sync selected customers when Redux state loads/updates after mount
  useEffect(() => {
    const def = getDefaultCustomer(shipToDropdown);
    if (def && !selectedShipTo) setSelectedShipTo(def);
  }, [shipToDropdown.length]);

  useEffect(() => {
    const def = getDefaultCustomer(soldToDropdown);
    if (def && !selectedSoldTo) setSelectedSoldTo(def);
  }, [soldToDropdown.length]);

  /**
   * Get Bill To and Payer To by Sold To
   */
  const getBillToPayerToBySoldTo = useCallback(
    (customerNum, division, salesOrg, distChan) => {
      const billToPayerToFlags = [
        ...(billToVisible ? ["B"] : []),
        ...(payerToVisible ? ["P"] : []),
      ];
      if (!billToPayerToFlags.length) return;

      billToPayerToFlags.forEach((flag) => {
        const sUrl = `/JavaServices_Oauth/api/odata/getBillToPayerToBySoldTo?customerNum=${customerNum}&division=${division}&salesOrg=${salesOrg}&distChan=${distChan}&language=${language}&billToPayerToFlag=${flag}`;

        fnServiceRequest(
          sUrl,
          "GET",
          (response) => {
            const customerList = response?.data?.customerList ?? [];
            const list = mapCustomerList(customerList);

            console.log(`Mapped list for flag ${flag}:`, list);

            if (flag === "B") {
              if (list.length === 0) {
                setApiBillToOptions([]);
                setSelectedBillTo(null);
                setSalesOrderData((prev) => ({ ...prev, billTo: [], billToList: [] }));
              } else {
                console.log("Customer of B", list);
                const defaultCustomer = getDefaultCustomer(list);
                setApiBillToOptions(list);
                setSelectedBillTo(defaultCustomer);
                setSalesOrderData((prev) => {
                  const updatedList = list.map((c) => ({
                    ...c,
                    selectedCustomer: defaultCustomer
                      ? c.sapCustomerId === defaultCustomer.sapCustomerId
                      : false,
                  }));
                  return { ...prev, billTo: updatedList, billToList: updatedList };
                });
                if (defaultCustomer) {
                  setBillToInputValue(buildLabel(defaultCustomer));
                }
              }
              setIsBillToSearching(false);
            } else if (flag === "P") {
              if (list.length === 0) {
                setApiPayerToOptions([]);
                setSelectedPayerTo(null);
                setSalesOrderData((prev) => ({ ...prev, payerTo: [], payerToList: [] }));
              } else {
                console.log("Customer of P", list);
                const defaultCustomer = getDefaultCustomer(list);
                setApiPayerToOptions(list);
                setSelectedPayerTo(defaultCustomer);
                setSalesOrderData((prev) => {
                  const updatedList = list.map((c) => ({
                    ...c,
                    selectedCustomer: defaultCustomer
                      ? c.sapCustomerId === defaultCustomer.sapCustomerId
                      : false,
                  }));
                  return { ...prev, payerTo: updatedList, payerToList: updatedList };
                });
                if (defaultCustomer) {
                  setPayerToInputValue(buildLabel(defaultCustomer));
                }
              }
              setIsPayerToSearching(false);
            }
          },
          (error) => {
            console.error(
              `Failed to fetch Bill To/Payer To for flag ${flag}:`,
              error,
            );
            if (flag === "B") {
              setIsBillToSearching(false);
            } else if (flag === "P") {
              setIsPayerToSearching(false);
            }
          },
        );
      });
    },
    [
      language,
      billToVisible,
      payerToVisible,
      setSalesOrderData,
      setApiBillToOptions,
      setSelectedBillTo,
      setIsBillToSearching,
      setBillToInputValue,
      setApiPayerToOptions,
      setSelectedPayerTo,
      setIsPayerToSearching,
      setPayerToInputValue,
    ],
  );

  /**
   * Get Ship To by Sold To
   */
  const getShipToBySoldTo = useCallback(
    (customerNum, division, salesOrg, distChan) => {
      if (!customerNum) return;

      const sUrl = `/JavaServices_Oauth/api/odata/getShipToBySoldTo?customerNum=${customerNum}&division=${division}&salesOrg=${salesOrg}&distChan=${distChan}`;

      fnServiceRequest(
        sUrl,
        "GET",
        (response) => {
          const customerList = response?.data?.customerList ?? [];
          const isSingleCustomer = customerList.length === 1;

          const list = customerList.map((r) => ({
            ...r,
            sapCustomerId: r.customerNum || "",
            sapCustomerName1: r.name1 || "",
            sapCustomerName: r.name1 || "",
            sapCustomerCity: r.city || "",
            sapCustomerStreet1: r.street || "",
            sapCustomerState: r.region || "",
            sapCustomerPostalCode: r.postCode || "",
            selectedCustomer: isSingleCustomer,
          }));

          // When Sold To is prior, always sync division/distChannel from the API response.
          // This also handles switching to a different Sold To with a different sales area.
          const firstResult = list[0];
          if (firstResult) {
            const fromApiDiv = isFilled(firstResult.division)
              ? firstResult.division
              : division;
            const fromApiDist = isFilled(firstResult.disCh ?? firstResult.distChannel)
              ? (firstResult.disCh ?? firstResult.distChannel)
              : distChan;
            setSalesOrderData((prev) => ({
              ...prev,
              ...(isFilled(fromApiDiv) ? { division: fromApiDiv } : {}),
              ...(isFilled(fromApiDist) ? { distChannel: fromApiDist } : {}),
            }));
          }

          if (isSingleCustomer) {
            const first = list[0];
            setSelectedShipTo(first);

            setSalesOrderData((prev) => {
              const current = prev.shipTo || prev.shipToList || [];
              const updated = current.map((c) => ({
                ...c,
                selectedCustomer: c.sapCustomerId === first.sapCustomerId,
              }));
              if (!current.find((c) => c.sapCustomerId === first.sapCustomerId))
                updated.push({ ...first, selectedCustomer: true });
              return { ...prev, shipTo: updated, shipToList: updated };
            });

            setShipToInputValue(
              `${first.sapCustomerId} - ${first.sapCustomerName1 ?? first.sapCustomerName}`,
            );
          } else {
            setSelectedShipTo(null);

            setSalesOrderData((prev) => {
              const current = prev.shipTo || prev.shipToList || [];
              const updated = current.map((c) => ({
                ...c,
                selectedCustomer: false,
              }));
              return { ...prev, shipTo: updated, shipToList: updated };
            });

            setShipToInputValue("");
          }
        },
        (error) => {
          console.error("Failed to fetch ShipTo by SoldTo:", error);
        },
      );
    },
    [dispatch, salesOrderDetailsRef, setSalesOrderData, setShipToInputValue],
  );

  /**
   * Ship To change handler
   */
  const shipToChangeHandler = useCallback(
    (_, newValue, isShipToPrior) => {
      const shipToArr =
        salesOrderDetails?.shipTo ?? salesOrderDetails?.shipToList ?? [];
      if (!editMode && Array.isArray(shipToArr) && shipToArr.length > 1) {
        setEditMode(true);
      }
      if (!newValue) {
        setSelectedShipTo(null);
        if (isShipToPrior) {
          setSelectedSoldTo(null);
          setSelectedBillTo(null);
          setSelectedPayerTo(null);
        }
      }

      setSelectedShipTo(newValue || null);

      if (!newValue?.sapCustomerId) return;

      const soldToArr = salesOrderData?.soldTo ?? salesOrderData?.soldToList ?? [];
      const isSoldToEmpty = !soldToArr.find((c) => c.selectedCustomer);
      if (!isSoldToEmpty && !isShipToPrior) return;

      const { division, salesOrg = "", distChannel } = salesOrderData;
      const selectedDivision = getCustomerDivision(newValue);
      const selectedDistChannel = getCustomerDistChannel(newValue);
      const effectiveDivision =
        isShipToPrior && isFilled(selectedDivision)
          ? selectedDivision
          : division;
      const effectiveDistChannel =
        isShipToPrior && isFilled(selectedDistChannel)
          ? selectedDistChannel
          : distChannel;

      const sUrl = `/JavaServices_Oauth/api/odata/getSoldToByShipTo?customerNum=${newValue.sapCustomerId}&division=${effectiveDivision || ""}&salesOrg=${salesOrg}&distChan=${effectiveDistChannel || ""}`;

      fnServiceRequest(
        sUrl,
        "GET",
        (response) => {
          const list = (response?.data?.customerList ?? []).map((r) => ({
            ...r,
            sapCustomerId: r.customerNum || "",
            sapCustomerName1: r.name1 || "",
            sapCustomerName: r.name1 || "",
            sapCustomerCity: r.city || "",
            sapCustomerStreet1: r.street || "",
            sapCustomerState: r.region || "",
            sapCustomerPostalCode: r.postCode || "",
          }));

          // When Ship To is prior, always sync division/distChannel from the API response.
          // DB-loaded customer objects don't carry disCh/division, so we derive them here.
          // This also handles switching to a different Ship To with a different sales area.
          const firstResult = list[0];
          const resolvedDivision = isFilled(firstResult?.division)
            ? firstResult.division
            : effectiveDivision;
          const resolvedDistChannel = isFilled(firstResult?.disCh ?? firstResult?.distChannel)
            ? (firstResult.disCh ?? firstResult.distChannel)
            : effectiveDistChannel;

          if (firstResult && (isShipToPrior || isSoldToEmpty)) {
            setSalesOrderData((prev) => ({
              ...prev,
              ...(isFilled(resolvedDivision) ? { division: resolvedDivision } : {}),
              ...(isFilled(resolvedDistChannel) ? { distChannel: resolvedDistChannel } : {}),
            }));
          }

          const isSingleCustomer = list.length === 1;
          if (isSingleCustomer) {
            const first = list[0];
            setSelectedSoldTo(first);

            setSalesOrderData((prev) => {
              const current = prev.soldTo || prev.soldToList || [];
              const updated = current.map((c) => ({
                ...c,
                selectedCustomer: c.sapCustomerId === first.sapCustomerId,
              }));
              if (!current.find((c) => c.sapCustomerId === first.sapCustomerId))
                updated.push({ ...first, selectedCustomer: true });
              return { ...prev, soldTo: updated, soldToList: updated };
            });

            setSoldToInputValue(
              first ? `${first.sapCustomerId} - ${first.sapCustomerName1}` : "",
            );

            setApiSoldToOptions(list);
            setIsSoldToSearching(false);

            if (first && (billToVisible || payerToVisible)) {
              getBillToPayerToBySoldTo(
                first.sapCustomerId,
                resolvedDivision,
                salesOrg,
                resolvedDistChannel,
              );
            }
          } else {
            setSelectedSoldTo(null);
            setSalesOrderData((prev) => {
              const current = prev.soldTo || prev.soldToList || [];
              const updated = current.map((c) => ({
                ...c,
                selectedCustomer: false,
              }));
              return { ...prev, soldTo: updated, soldToList: updated };
            });
            setSoldToInputValue("");
            setApiSoldToOptions(list);
            setIsSoldToSearching(false);
          }
        },
        (errorMsg) => {
          console.error("Failed to fetch sold-to by ship-to:", errorMsg);
        },
      );
    },
    [
      editMode,
      salesOrderDetails,
      setEditMode,
      setSalesOrderData,
      salesOrderData,
      dispatch,
      salesOrderDetailsRef,
      setSoldToInputValue,
      setApiSoldToOptions,
      setIsSoldToSearching,
      billToVisible,
      payerToVisible,
      getBillToPayerToBySoldTo,
    ],
  );

  /**
   * Sold To change handler
   */
  const soldToChangeHandler = useCallback(
    (_, newValue, isSoldToPrior) => {
      const soldToArr =
        salesOrderDetails?.soldTo ?? salesOrderDetails?.soldToList ?? [];
      if (!editMode && Array.isArray(soldToArr) && soldToArr.length > 1) {
        setEditMode(true);
      }

      const { division, salesOrg, distChannel } = salesOrderData;
      const selectedDivision = getCustomerDivision(newValue);
      const selectedDistChannel = getCustomerDistChannel(newValue);
      const effectiveDivision =
        isSoldToPrior && isFilled(selectedDivision)
          ? selectedDivision
          : division;
      const effectiveDistChannel =
        isSoldToPrior && isFilled(selectedDistChannel)
          ? selectedDistChannel
          : distChannel;
      const shipToArr =
        salesOrderData?.shipTo ?? salesOrderData?.shipToList ?? [];
      const isShipToEmpty = !shipToArr.find((c) => c.selectedCustomer);
      if (!newValue) {
        setSelectedSoldTo(null);
        setSelectedBillTo(null);
        setSelectedPayerTo(null);
        if (isSoldToPrior) {
          setSelectedShipTo(null);
        }
      }
      setSelectedSoldTo(newValue);

      if (newValue?.sapCustomerId && (isShipToEmpty || isSoldToPrior)) {
        getShipToBySoldTo(
          newValue.sapCustomerId,
          effectiveDivision,
          salesOrg,
          effectiveDistChannel,
        );
      }

      if (newValue?.sapCustomerId && (billToVisible || payerToVisible)) {
        getBillToPayerToBySoldTo(
          newValue.sapCustomerId,
          effectiveDivision,
          salesOrg,
          effectiveDistChannel,
        );
      }
    },
    [
      editMode,
      salesOrderDetails,
      setEditMode,
      salesOrderData,
      setSalesOrderData,
      getShipToBySoldTo,
      billToVisible,
      payerToVisible,
      getBillToPayerToBySoldTo,
    ],
  );

  /**
   * Bill To change handler
   */
  const billToChangeHandler = useCallback(
    (_, newValue) => {
      if (
        !editMode &&
        Array.isArray(billToDropdown) &&
        billToDropdown.length > 1
      ) {
        setEditMode(true);
      }

      setSelectedBillTo(newValue);
    },
    [editMode, billToDropdown, setEditMode, setSelectedBillTo],
  );

  /**
   * Payer To change handler
   */
  const payerToChangeHandler = useCallback(
    (_, newValue) => {
      if (
        !editMode &&
        Array.isArray(payerToDropdown) &&
        payerToDropdown.length > 1
      ) {
        setEditMode(true);
      }

      setSelectedPayerTo(newValue || null);
    },
    [editMode, payerToDropdown, setEditMode, setSelectedPayerTo],
  );

  return {
    selectedShipTo,
    setSelectedShipTo,
    selectedSoldTo,
    setSelectedSoldTo,
    shipToDropdown,
    soldToDropdown,
    billToDropdown,
    payerToDropdown,
    getBillToPayerToBySoldTo,
    getShipToBySoldTo,
    shipToChangeHandler,
    soldToChangeHandler,
    billToChangeHandler,
    payerToChangeHandler,
  };
};

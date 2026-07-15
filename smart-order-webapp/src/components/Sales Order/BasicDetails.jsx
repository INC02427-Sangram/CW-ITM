import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Grid, Box, Typography, CardContent } from "@mui/material";
import { CustomTextField } from "../../UIComponents/CustomTextField";
import { HeaderCard } from "../../UIComponents/HeaderCard";
import { AppTypography } from "../../UIComponents/AppTypography";
import { CustomerAutocompleteField } from "../../UIComponents/CustomerAutocompleteField";
import { OrderHeaderSection } from "../../UIComponents/OrderHeaderSection";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { checkIsCSR } from "../../dataStore/userRoles";
import BillToField from "./BillToField";
import PayerToField from "./PayerToField";
import { setSalesOrderDetails } from "../../redux/reducers/appReducer";
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import { useSelector, useDispatch } from "react-redux";
import fnGetDistributionChannelName from "../../utility/fnGetDistributionChannelName";
import { menuItemDropdownSx } from "../../UIComponents/styles/menuItemDropdownSx";
import ShipToFields from "./ShipToFields";
import SoldToFields from "./SoldToFields";
import { fetchConfigForCountryAndSalesOrg } from "../Admin Console/FeatureConfig/featureConfig.services";
// Custom hooks and utilities
import { useExceptionManagement } from "./hooks/useExceptionManagement";
import { useCustomerSearch } from "./hooks/useCustomerSearch";
import { useCustomerSelection } from "./hooks/useCustomerSelection";
import { useOrderSave } from "./hooks/useOrderSave";
import CustomerSearchPopover from "./components/CustomerSearchPopover";
import {
  toBool,
  buildLabel,
  formatAddress,
  getDefaultCustomer,
} from "./utils/customerUtils";
const BasicDetails = ({
  gridItemWidth,
  salesOrderData,
  setSalesOrderData,
  splitScreenFlag,
  validate,
  setValidate,
  poAlreadyExistsToast,
  setPoAlreadyExistsToast,
  setPoWarning,
  poWarning,
  getOrderHeaderById,
}) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const GRID_WIDTH = 3;
  const gridResponsiveConfig =
    gridItemWidth > GRID_WIDTH
      ? {
          xl: 6,
          lg: 6,
          md: 6,
          sm: 6,
          xs: 12,
        }
      : {
          xl: 2,
          lg: 2,
          md: 3,
          sm: 6,
          xs: 12,
        };

  const theme = useTheme();
  const dispatch = useDispatch();

  // Style definitions for BillToField and PayerToField components
  const headerLabelSx = {
    color: theme.palette.text.primary,
    fontWeight: 600,
  };

  const getAppTypographySx = (themeParam) => ({
    backgroundColor: themeParam.palette.background.paper,
    padding: "8px 12px",
    borderRadius: "4px",
    minHeight: "20px",
  });

  const outlinedInputBaseSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.background.paper,
    },
  };

  const salesOrderDetails = useSelector(
    (state) => state.appReducer.salesOrderDetails,
  );
  const itemDetail = useSelector((state) => state.appReducer.lineItemList);
  const status = useSelector((state) => state.appReducer.status);
  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const distributionChannelList = useSelector(
    (state) => state.appReducer.distributionChannelList,
  );
  const userRole = useSelector((state) => state.appReducer.userDetails.roles);

  const salesOrderDetailsRef = useRef(salesOrderDetails || {});
  useEffect(() => {
    salesOrderDetailsRef.current = salesOrderDetails || {};
  }, [salesOrderDetails]);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessageType, setToastMessageType] = useState("info");
  const [toastMessageDescription, setToastMessageDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [customerSearchAnchorEl, setCustomerSearchAnchorEl] = useState(null);
  const [selectedBillTo, setSelectedBillTo] = useState(null);
  const [selectedPayerTo, setSelectedPayerTo] = useState(null);

  const [sequencedShipToSoldToStates, setSequencedShipToSoldToStates] =
    useState({});

  const billToVisible = sequencedShipToSoldToStates["BILL_TO"]?.isEnabled ?? toBool(salesOrderData?.billToFlag);
  const payerToVisible = sequencedShipToSoldToStates["PAYER_TO"]?.isEnabled ?? toBool(salesOrderData?.payerToFlag);
  const isBillToMandatory = sequencedShipToSoldToStates["BILL_TO"]?.isMandatory ?? false;
  const isPayerToMandatory = sequencedShipToSoldToStates["PAYER_TO"]?.isMandatory ?? false;

  const showToast = useCallback((message, type = "info") => {
    setToastMessageDescription(message);
    setToastMessageType(type);
    setToastOpen(true);
  }, []);

  // Use custom hooks
  const customerSearchHook = useCustomerSearch(language);

  const {
    isShipToSearching,
    setIsShipToSearching,
    shipToInputValue,
    setShipToInputValue,
    apiShipToOptions,
    setApiShipToOptions,
    debouncedShipToSearch,
    isSoldToSearching,
    setIsSoldToSearching,
    soldToInputValue,
    setSoldToInputValue,
    apiSoldToOptions,
    setApiSoldToOptions,
    debouncedSoldToSearch,
    isBillToSearching,
    setIsBillToSearching,
    billToInputValue,
    setBillToInputValue,
    apiBillToOptions,
    setApiBillToOptions,
    isPayerToSearching,
    setIsPayerToSearching,
    payerToInputValue,
    setPayerToInputValue,
    apiPayerToOptions,
    setApiPayerToOptions,
  } = customerSearchHook;

  const customerSelectionHook = useCustomerSelection({
    salesOrderDetailsRef,
    salesOrderData,
    setSalesOrderData,
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
  });

  const {
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
  } = customerSelectionHook;

  const exceptionMgmt = useExceptionManagement(
    salesOrderDetailsRef,
    itemDetail,
    salesOrderDetails,
  );

  const {
    exceptionTypeArray,
    purgeInvalidMaterialTag,
    purgeUomNotFoundTag,
    removeMultipleSoldToIfResolved,
    removeMultipleShipToIfResolved,
    removeMultipleBillToIfResolved,
    removeMultiplePayerToIfResolved,
  } = exceptionMgmt;

  const orderSaveHook = useOrderSave({
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
  });

  const { isSaving, handleSave, validateDuplicatePo, handlePostSaveChecks } =
    orderSaveHook;

  const isFilled = (value) =>
    value !== undefined &&
    value !== null &&
    String(value).trim() !== "" &&
    String(value).trim().toLowerCase() !== "null";

  const getCustomerDistChannel = (customer) =>
    customer?.disCh ?? customer?.distChannel;

  const getCustomerDivision = (customer) => customer?.division;

  const overrideShipToChangeHandler = (e, newVal, isShipToPrior) => {
    const selectedDistChannel = getCustomerDistChannel(newVal);
    const selectedDivision = getCustomerDivision(newVal);

    setSalesOrderData((prev) => {
      let currentList = prev.shipTo || prev.shipToList || [];
      let updatedList = currentList.map((c) => ({
        ...c,
        selectedCustomer: newVal
          ? c.sapCustomerId === newVal.sapCustomerId
          : false,
      }));
      if (
        newVal &&
        !currentList.find((c) => c.sapCustomerId === newVal.sapCustomerId)
      ) {
        updatedList.push({ ...newVal, selectedCustomer: true });
      }
      return {
        ...prev,
        ...(isShipToPrior && isFilled(selectedDistChannel)
          ? { distChannel: selectedDistChannel }
          : {}),
        ...(isShipToPrior && isFilled(selectedDivision)
          ? { division: selectedDivision }
          : {}),
        shipTo: updatedList,
        shipToList: updatedList,
      };
    });
    shipToChangeHandler(e, newVal, isShipToPrior);
  };

  const overrideSoldToChangeHandler = (e, newVal, isSoldToPrior) => {
    const selectedDistChannel = getCustomerDistChannel(newVal);
    const selectedDivision = getCustomerDivision(newVal);

    setSalesOrderData((prev) => {
      let currentList = prev.soldTo || prev.soldToList || [];
      let updatedList = currentList.map((c) => ({
        ...c,
        selectedCustomer: newVal
          ? c.sapCustomerId === newVal.sapCustomerId
          : false,
      }));
      if (
        newVal &&
        !currentList.find((c) => c.sapCustomerId === newVal.sapCustomerId)
      ) {
        updatedList.push({ ...newVal, selectedCustomer: true });
      }
      return {
        ...prev,
        ...(isSoldToPrior && isFilled(selectedDistChannel)
          ? { distChannel: selectedDistChannel }
          : {}),
        ...(isSoldToPrior && isFilled(selectedDivision)
          ? { division: selectedDivision }
          : {}),
        soldTo: updatedList,
        soldToList: updatedList,
      };
    });
    soldToChangeHandler(e, newVal, isSoldToPrior);
  };

  const overrideBillToChangeHandler = (e, newVal) => {
    setSalesOrderData((prev) => {
      let currentList = prev.billTo || prev.billToList || [];
      let updatedList = currentList.map((c) => ({
        ...c,
        selectedCustomer: newVal
          ? c.sapCustomerId === newVal.sapCustomerId
          : false,
      }));
      if (
        newVal &&
        !currentList.find((c) => c.sapCustomerId === newVal.sapCustomerId)
      ) {
        updatedList.push({ ...newVal, selectedCustomer: true });
      }
      return { ...prev, billTo: updatedList, billToList: updatedList };
    });
    billToChangeHandler(e, newVal);
  };

  const overridePayerToChangeHandler = (e, newVal) => {
    setSalesOrderData((prev) => {
      let currentList = prev.payerTo || prev.payerToList || [];
      let updatedList = currentList.map((c) => ({
        ...c,
        selectedCustomer: newVal
          ? c.sapCustomerId === newVal.sapCustomerId
          : false,
      }));
      if (
        newVal &&
        !currentList.find((c) => c.sapCustomerId === newVal.sapCustomerId)
      ) {
        updatedList.push({ ...newVal, selectedCustomer: true });
      }
      return { ...prev, payerTo: updatedList, payerToList: updatedList };
    });
    payerToChangeHandler(e, newVal);
  };

  const handleEditToggle = () => setEditMode((prev) => !prev);

  const handleCancel = () => {
    setSalesOrderData(() => salesOrderDetails);
    console.log("salesOrderDetails fater cancel", salesOrderDetails);

    setSelectedShipTo(() => getDefaultCustomer(shipToDropdown));
    setSelectedSoldTo(() => getDefaultCustomer(soldToDropdown));
    setSelectedBillTo(() => getDefaultCustomer(billToDropdown));
    setSelectedPayerTo(() => getDefaultCustomer(payerToDropdown));

    setShipToInputValue(() => buildLabel(getDefaultCustomer(shipToDropdown)));
    setSoldToInputValue(() => buildLabel(getDefaultCustomer(soldToDropdown)));
    setBillToInputValue(() => buildLabel(getDefaultCustomer(billToDropdown)));
    setPayerToInputValue(() => buildLabel(getDefaultCustomer(payerToDropdown)));

    setEditMode(false);
  };

  const PoNumberMaxLength = 20;

  const [fieldErrors, setFieldErrors] = useState({
    poNumber: false,
  });
  const FIELD_LIMITS = {
    poNumber: PoNumberMaxLength,
  };
  const handleTextChange = (event) => {
    const { name, value } = event.target;
    const limit = FIELD_LIMITS[name];
    // Handle limited fields
    if (limit) {
      // show error if user tries exceeding limit
      setFieldErrors((prev) => ({
        ...prev,
        [name]: value.trim().length > limit,
      }));

      // prevent storing extra chars
      const trimmedValue = value.slice(0, limit);

      setSalesOrderData((prev) => {
        if (prev[name] === trimmedValue) return prev;

        return {
          ...prev,
          [name]: trimmedValue,
        };
      });

      return;
    }
    setSalesOrderData((prev) => {
      if (prev[name] === value) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleCustomerSearchClick = (event) => {
    setCustomerSearchAnchorEl(event.currentTarget);
  };

  const handleCustomerSearchClose = () => {
    setCustomerSearchAnchorEl(null);
  };

  useEffect(() => {
    console.log("Edit Mode Sibasis");

    if (editMode) {
      console.log("Edit Mode is ON", buildLabel(selectedShipTo));

      setShipToInputValue(() => buildLabel(selectedShipTo));
      setSoldToInputValue(() => buildLabel(selectedSoldTo));
      setBillToInputValue(() => buildLabel(selectedBillTo));
      setPayerToInputValue(() => buildLabel(selectedPayerTo));
    }
  }, [
    editMode,
    selectedShipTo,
    selectedSoldTo,
    selectedBillTo,
    selectedPayerTo,
  ]);

  useEffect(() => {
    const id = salesOrderDetails?.orderHeaderId;
    if (!id) return;
    setSalesOrderData(salesOrderDetails);
    console.log("salesOrderDetails", salesOrderDetails);

    setSelectedShipTo(
      getDefaultCustomer(
        salesOrderDetails?.shipTo ?? salesOrderDetails?.shipToList ?? [],
      ),
    );
    setSelectedSoldTo(
      getDefaultCustomer(
        salesOrderDetails?.soldTo ?? salesOrderDetails?.soldToList ?? [],
      ),
    );
    setSelectedBillTo(
      getDefaultCustomer(
        salesOrderDetails?.billTo ?? salesOrderDetails?.billToList ?? [],
      ),
    );
    setSelectedPayerTo(
      getDefaultCustomer(
        salesOrderDetails?.payerTo ?? salesOrderDetails?.payerToList ?? [],
      ),
    );

    fetchConfigForCountryAndSalesOrg({
      country: salesOrderDetails?.countryCode,
      salesOrg: salesOrderDetails?.salesOrg,
      onSuccess: ({ newOrgState, sequencedShipToSoldToStates }) => {
        setSequencedShipToSoldToStates((prev) => sequencedShipToSoldToStates);
      },
      onError: (error) => {
        console.error(
          "Error fetching config for",
          salesOrderDetails?.countryCode,
          salesOrderDetails?.salesOrg,
          error,
        );
      },
      setLoading: (loading) => {
        console.log("Loading state for config fetch:", loading);
      },
    });
  }, [salesOrderDetails?.orderHeaderId]);

  const getSelectedCustomerFromSalesOrderData = (customerKey) => {
    const customerList =
      salesOrderData?.[customerKey] ??
      salesOrderData?.[`${customerKey}List`] ??
      [];

    return (
      customerList.find((customer) => customer?.selectedCustomer === true) ||
      null
    );
  };

  const getCustomerName = (customer) =>
    customer?.sapCustomerName ?? customer?.sapCustomerName1;

  const checkFieldsFilled = () => {
    if (editMode) return false;

    const selectedShipToCustomer = getSelectedCustomerFromSalesOrderData("shipTo");
    const selectedSoldToCustomer = getSelectedCustomerFromSalesOrderData("soldTo");
    const selectedBillToCustomer = getSelectedCustomerFromSalesOrderData("billTo");
    const selectedPayerToCustomer = getSelectedCustomerFromSalesOrderData("payerTo");

    const requiredFields = [
      { key: "poNumber", value: salesOrderData?.poNumber },
      { key: "sapCustomerId", value: selectedShipToCustomer?.sapCustomerId },
      { key: "sapCustomerName", value: getCustomerName(selectedShipToCustomer) },
      { key: "soldToId", value: selectedSoldToCustomer?.sapCustomerId },
      { key: "soldToName", value: getCustomerName(selectedSoldToCustomer) },
      { key: "poType", value: salesOrderData?.poOrderType ?? salesOrderData?.poType },
      { key: "salesOrg", value: salesOrderData?.salesOrg },
      { key: "distChannel", value: salesOrderData?.distChannel },
      { key: "division", value: salesOrderData?.division },
    ];

    if (billToVisible) {
      requiredFields.push(
        { key: "billToId", value: selectedBillToCustomer?.sapCustomerId },
        { key: "billToName", value: getCustomerName(selectedBillToCustomer) },
      );
    }

    if (payerToVisible) {
      requiredFields.push(
        { key: "payerToId", value: selectedPayerToCustomer?.sapCustomerId },
        { key: "payerToName", value: getCustomerName(selectedPayerToCustomer) },
      );
    }

    const isValid = requiredFields.every(({ key, value }) => {
      if (!value || String(value).trim() === "") {
        console.log(`Validation failed for field: ${key}`);
        return false;
      }
      return true;
    });

    return isValid;
  };

  useEffect(() => {
    if (checkFieldsFilled()) {
      setValidate(true);
    } else {
      setValidate(false);
    }
  }, [
    salesOrderData,
    editMode,
    selectedShipTo,
    selectedSoldTo,
    selectedBillTo,
    selectedPayerTo,
    billToVisible,
    payerToVisible,
  ]);

  const isCSR = checkIsCSR(userRole);
  const isPendingApproval = status === "pendingForApproval";
  // const isRestricted = isCSR && isPendingApproval;
  const isRejected = status === "rejected";
  const isRestricted = (isCSR && isPendingApproval) || (!isCSR && isRejected);

  // Force Read-Only Mode for fields if restricted
  const effectiveEditMode = isRestricted ? false : editMode;

  const shipToOptions =
    apiShipToOptions.length > 0
      ? apiShipToOptions
      : shipToInputValue && isShipToSearching
        ? []
        : shipToDropdown;
  const soldToOptions =
    apiSoldToOptions.length > 0
      ? apiSoldToOptions
      : soldToInputValue && isSoldToSearching
        ? []
        : soldToDropdown;
  const isBothShipToSoldToPresent =
    sequencedShipToSoldToStates["SHIP_TO"]?.orderSeq &&
    sequencedShipToSoldToStates["SOLD_TO"]?.orderSeq;
  const isSoldToPrior = isBothShipToSoldToPresent
    ? sequencedShipToSoldToStates["SHIP_TO"]?.orderSeq >
      sequencedShipToSoldToStates["SOLD_TO"]?.orderSeq
    : false;
  const isShipToPrior = isBothShipToSoldToPresent
    ? sequencedShipToSoldToStates["SHIP_TO"]?.orderSeq <
      sequencedShipToSoldToStates["SOLD_TO"]?.orderSeq
    : true;

  const sectionComponents = {
    SHIP_TO: (
      <ShipToFields
        editMode={editMode}
        selectedShipTo={selectedShipTo}
        shipToInputValue={shipToInputValue}
        setShipToInputValue={setShipToInputValue}
        shipToDropdown={shipToDropdown}
        apiShipToOptions={apiShipToOptions}
        setApiShipToOptions={setApiShipToOptions}
        isShipToSearching={isShipToSearching}
        setIsShipToSearching={setIsShipToSearching}
        debouncedShipToSearch={debouncedShipToSearch}
        shipToChangeHandler={overrideShipToChangeHandler}
        shipToOptions={shipToOptions}
        t={t}
        headerLabelSx={headerLabelSx}
        gridResponsiveConfig={gridResponsiveConfig}
        salesOrderData={salesOrderData}
        salesOrderDetails={salesOrderDetails}
        status={status}
        isShipToPrior={isShipToPrior}
      />
    ),
    SOLD_TO: (
      <SoldToFields
        editMode={editMode}
        selectedSoldTo={selectedSoldTo}
        soldToInputValue={soldToInputValue}
        setSoldToInputValue={setSoldToInputValue}
        soldToDropdown={soldToDropdown}
        apiSoldToOptions={apiSoldToOptions}
        setApiSoldToOptions={setApiSoldToOptions}
        isSoldToSearching={isSoldToSearching}
        setIsSoldToSearching={setIsSoldToSearching}
        debouncedSoldToSearch={debouncedSoldToSearch}
        soldToChangeHandler={overrideSoldToChangeHandler}
        soldToOptions={soldToOptions}
        t={t}
        headerLabelSx={headerLabelSx}
        gridResponsiveConfig={gridResponsiveConfig}
        salesOrderData={salesOrderData}
        salesOrderDetails={salesOrderDetails}
        status={status}
        isSoldToPrior={isSoldToPrior}
      />
    ),
  };

  return (
    <>
      <HeaderCard>
        <CardContent sx={{ p: 3 }}>
          <OrderHeaderSection
            title="Order Header Information"
            exceptionTypeArray={exceptionTypeArray}
            editMode={editMode}
            isSaving={isSaving}
            isRestricted={isRestricted}
            status={status}
            onEditToggle={handleEditToggle}
            onCancel={handleCancel}
            onSave={handleSave}
            onCustomerSearchClick={handleCustomerSearchClick}
            t={t}
          />
          <Grid container spacing={2}>
            {isSoldToPrior
              ? sectionComponents["SOLD_TO"]
              : sectionComponents["SHIP_TO"]}

            <Grid item {...gridResponsiveConfig}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("poNumber")}
                <span style={{ color: "red" }}>*</span>
              </Typography>
              {editMode ? (
                <CustomTextField
                  error={fieldErrors.poNumber}
                  helperText={
                    fieldErrors.poNumber
                      ? `PO length should not exceed ${PoNumberMaxLength} characters`
                      : ""
                  }
                  name="poNumber"
                  value={salesOrderData?.poNumber}
                  placeholder={t("poNumberPlaceholder")}
                  onChange={handleTextChange}
                />
              ) : (
                <AppTypography value={salesOrderData?.poNumber} />
              )}
            </Grid>

            {!isSoldToPrior
              ? sectionComponents["SOLD_TO"]
              : sectionComponents["SHIP_TO"]}

            {/* bill to id */}

            {billToVisible && (
              <>
                <BillToField
                  editMode={editMode}
                  selectedBillTo={selectedBillTo}
                  billToInputValue={billToInputValue}
                  setBillToInputValue={setBillToInputValue}
                  billToDropdown={billToDropdown}
                  apiBillToOptions={apiBillToOptions}
                  setApiBillToOptions={setApiBillToOptions}
                  isBillToSearching={isBillToSearching}
                  setIsBillToSearching={setIsBillToSearching}
                  billToChangeHandler={overrideBillToChangeHandler}
                  theme={theme}
                  t={t}
                  gridItemWidth={gridItemWidth}
                  buildLabel={buildLabel}
                  formatAddress={formatAddress}
                  getAppTypographySx={getAppTypographySx}
                  outlinedInputBaseSx={outlinedInputBaseSx}
                  headerLabelSx={headerLabelSx}
                  salesOrderData={salesOrderData}
                  selectedSoldTo={selectedSoldTo}
                />
              </>
            )}

            {payerToVisible && (
              <>
                <PayerToField
                  editMode={editMode}
                  selectedPayerTo={selectedPayerTo}
                  payerToInputValue={payerToInputValue}
                  setPayerToInputValue={setPayerToInputValue}
                  payerToDropdown={payerToDropdown}
                  apiPayerToOptions={apiPayerToOptions}
                  setApiPayerToOptions={setApiPayerToOptions}
                  isPayerToSearching={isPayerToSearching}
                  setIsPayerToSearching={setIsPayerToSearching}
                  payerToChangeHandler={overridePayerToChangeHandler}
                  theme={theme}
                  t={t}
                  gridItemWidth={gridItemWidth}
                  buildLabel={buildLabel}
                  formatAddress={formatAddress}
                  getAppTypographySx={getAppTypographySx}
                  outlinedInputBaseSx={outlinedInputBaseSx}
                  headerLabelSx={headerLabelSx}
                  salesOrderData={salesOrderData}
                  selectedSoldTo={selectedSoldTo}
                />
              </>
            )}
            <Grid item {...gridResponsiveConfig}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Order Type")}
              </Typography>
              {editMode ? (
                <CustomTextField
                  disabled={true}
                  name="poType"
                  value={salesOrderData?.poOrderType ?? salesOrderData?.poType}
                  placeholder={t("Enter Order Type")}
                  onChange={handleTextChange}
                />
              ) : (
                <AppTypography
                  value={salesOrderData?.poOrderType ?? salesOrderData?.poType}
                />
              )}
            </Grid>
            <Grid item {...gridResponsiveConfig}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("salesOrgLabel")}
              </Typography>
              {editMode ? (
                <CustomTextField
                  disabled={true}
                  name="salesOrg"
                  value={salesOrderData?.salesOrg}
                  placeholder={t("Enter Sales Org")}
                  onChange={handleTextChange}
                />
              ) : (
                <AppTypography value={salesOrderData?.salesOrg} />
              )}
            </Grid>
            <Grid item {...gridResponsiveConfig}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("distributionChannelLabel")}
              </Typography>
              {editMode ? (
                <CustomTextField
                  disabled={true}
                  name="distChannel"
                  value={salesOrderData?.distChannel ?? ""}
                  placeholder={t("distChannelPlaceholder")}
                  onChange={handleTextChange}
                />
              ) : (
                <AppTypography
                  value={
                    (salesOrderData?.distChannel ?? "") +
                    (fnGetDistributionChannelName(
                      salesOrderData?.distChannel,
                      distributionChannelList,
                    )
                      ? " - "
                      : "") +
                    (fnGetDistributionChannelName(
                      salesOrderData?.distChannel,
                      distributionChannelList,
                    ) || "")
                  }
                />
              )}
            </Grid>
            <Grid item {...gridResponsiveConfig}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Division")}
              </Typography>
              {editMode ? (
                <CustomTextField
                  disabled={true}
                  name="division"
                  value={salesOrderData?.division}
                  placeholder={t("Enter Division")}
                  onChange={handleTextChange}
                />
              ) : (
                <AppTypography value={salesOrderData?.division} />
              )}
            </Grid>

            <Grid item {...gridResponsiveConfig}>
              <Typography
                variant="subtitle2"
                className="headerInfo-labels"
                sx={headerLabelSx}
              >
                {t("Delivery Block")}
              </Typography>
              {editMode ? (
                <CustomTextField
                  disabled={true}
                  name="deliveryBlock"
                  value={salesOrderData?.deliveryBlock}
                  placeholder={t("Delivery Block")}
                  onChange={handleTextChange}
                />
              ) : (
                <AppTypography value={salesOrderData?.deliveryBlock} />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </HeaderCard>
      <CustomMessageToast
        open={toastOpen}
        setOpen={setToastOpen}
        messageType={toastMessageType}
        messageDescription={toastMessageDescription}
        anchorPosition={{ vertical: "top", horizontal: "center" }}
      />

      <CustomerSearchPopover
        anchorEl={customerSearchAnchorEl}
        onClose={handleCustomerSearchClose}
        salesOrderData={salesOrderData}
        showToast={showToast}
      />
    </>
  );
};

export default BasicDetails;

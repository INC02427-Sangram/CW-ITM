import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import {
  setFilterOptions,
  setSalesOrgObject,
  setListPage,
} from "../../redux/reducers/appReducer";
import { HeaderControlButton as HeaderButton } from "../../UIComponents/Button";
import { useTranslation } from "react-i18next";
import { setCurrentPayload } from "../../redux/reducers/appReducer";
import adminConsoleAdminConfiguration from "../Admin Console/config";
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import fnServiceRequest from "../../utility/fnServiceRequest";
import fnGetDistributionChannelList from "../../utility/fnGetDistributionChannelList";
import BusyIndicator from "../../utility/BusyIndicator";
import fnGetSalesOrgListSet from "../../utility/fnGetSalesOrgListSet";
import { getDateRange } from "../../utility/utilityFunctions";
import moment from "moment";
import { ButtonTypes } from "../../UIComponents/UITypes";
import CustomSelect from "../../UIComponents/CustomSelect";
import MultiSelect from "../../UIComponents/MultiSelect";
import { CustomTextField } from "../../UIComponents/CustomTextField";
import CustomAutocomplete from "../../UIComponents/CustomAutocomplete";
import CustomDatePicker from "../../UIComponents/CustomDatePicker";
import { customDateTimeFormat } from "../../utility/customDateTimeFormat";
const ListViewFilters = ({ metaData, filteredDate, setFilteredDate, setSelectedStatusTab }) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const oCurrentPayload = useSelector(
    (state) => state.appReducer.oCurrentPayload
  );

  const dispatch = useDispatch();
  const theme = useTheme();
  const filterOptions = useSelector((state) => state.appReducer.filterOptions);
  const appSettings = useSelector((state) => state.appReducer.appSettings);
  const countries = useSelector((state) => state.appReducer.orgCache.countries);
  const salesOrgListSet = useSelector((state) => state.appReducer.salesOrgListSet);
  const distributionChannelList = useSelector((state) => state.appReducer.distributionChannelList);
  const [open, setOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({
    vertical: "bottom",
    horizontal: "center",
  });
  const [errorFlagForInvalidDate, setErrorFlagForInvalidDate] = useState({
    visiblity: false,
    errorMessage: null,
  });
  const [customerOdataSearch, setCustomerOdataSearch] = useState([]);
  const [customerAutocompleteValue, setCustomerAutocompleteValue] =
    useState("");
  const [senderEmailOdataSearch, setSenderEmailOdataSearch] = useState([]);
  const [senderEmailAutocompleteValue, setSenderEmailAutocompleteValue] = useState("");
  const oDataDestinations = import.meta.env[
    "VITE_APP_ViatrisOData_Destinations"
  ];
  // const oDataBaseUrl = import.meta.env["VITE_APP_ViatrisOData_BaseUrl"];
  const [checkInteger, setChecknteger] = useState(false);

  function isObjEmpty(obj) {
    return Object.values(obj).length === 0 && obj.constructor === Object;
  }
  // console.log(filterOptions);

  const [countryValue, setCountryValue] = useState("");
  const [salesOrgValue, setSalesOrgValue] = useState([]);
  const [distChannelValue, setDistChannelValue] = useState([]);
  const [busyIndicatorFlag, setBusyindicatorFlag] = useState(false);
  const fnHandleChange = (oEvent, newValue) => {
    const filterOptionClone = { ...filterOptions };
    const { name: filterName, value, checked } = oEvent.target;
    if (oEvent.target.name === "salesOrg") {
      const val = oEvent.target.value;

      filterOptionClone.salesOrg = [val];
      setSalesOrgValue(val);

      setDistChannelValue("");
      filterOptionClone.distChannel = "";

      dispatch(setSalesOrgObject(val));
      fnGetDistributionChannelList(dispatch, val);
    } else if (filterName === "exceptionType") {
      filterOptionClone[filterName] = value;
    } else if (filterName === "documentProcessStatus") {
      filterOptionClone[filterName] = value;
    } else if (oEvent.target.name == "poNumber") {
      filterOptionClone[oEvent.target.name] = oEvent?.target?.value;
    } else if (oEvent.target.name == "orderHeaderId") {
      filterOptionClone[oEvent.target.name] = oEvent?.target?.value;
    } else if (oEvent.target.name == "sapOrderId") {
      filterOptionClone[oEvent.target.name] = oEvent?.target?.value;
    } else if (oEvent.target.name == "senderEmail") {
      filterOptionClone[oEvent.target.name] = oEvent?.target?.value;
    } else if (oEvent.target.name === "orderType") {
      filterOptionClone[oEvent.target.name] = oEvent?.target?.value;
    } else if (oEvent.target.name === "distChannel") {
      filterOptionClone[oEvent.target.name] = oEvent?.target?.value;
      setDistChannelValue(oEvent?.target?.value);
    } else if (oEvent.target.name === "country") {
      const val = oEvent.target.value;

      filterOptionClone.country = val;
      setCountryValue(val);

      // reset dependent fields
      setSalesOrgValue([]);
      setDistChannelValue("");

      filterOptionClone.salesOrg = [];
      filterOptionClone.distChannel = "";

      dispatch(setSalesOrgObject({}));
    } else if (filterName === "isRushOrder") {
      // Handle the rushOrder checkbox as true/false
      filterOptionClone.isRushOrder = checked;
    }
    else if (filterName === "hasNote") {
      // Handle the rushOrder checkbox as true/false
      filterOptionClone.hasNote = checked;
    }
    else if (filterName === "soaSuccess") {
      // Handle the rushOrder checkbox as true/false
      filterOptionClone.soaSuccess = checked;
    } else if (filterName === "scanCopy") {
      // Handle the rushOrder checkbox as true/false
      filterOptionClone.scanCopy = checked;
    } else {
      // Handle customer selection
      const selectedText = oEvent?.target?.innerText || newValue || "";

      // Check if the input was numeric (ID search)
      if (checkInteger) {
        // If ID was searched, extract value from parentheses
        const match = selectedText.match(/\(([^)]+)\)/);
        filterOptionClone["customerId"] = match ? match[1] : selectedText.replace(/\s*\([^)]*\)\s*/, "");
        setCustomerAutocompleteValue(selectedText);
      } else {
        // If name was searched, use the name (text before parentheses)
        const customerName = selectedText.replace(/\s*\([^)]*\)\s*/, "");
        filterOptionClone["customerId"] = customerName;
        setCustomerAutocompleteValue(customerName);
      }
    }

    dispatch(setFilterOptions(filterOptionClone));
  };

  const fnApplyFilters = () => {
    // 1. Create a clean copy of filter options
    const filterOptionCopy = { ...filterOptions };
    filterOptionCopy.country = countryValue;

    for (const key in filterOptionCopy) {
      if (typeof filterOptionCopy[key] === "string") {
        console.log("this filter is string", filterOptionCopy[key]);
        filterOptionCopy[key] = filterOptionCopy[key].trim();
      } else if (Array.isArray(filterOptionCopy[key])) {
        // Handle arrays - trim string elements if they exist
        filterOptionCopy[key] = filterOptionCopy[key].map((item) =>
          (typeof item === "string" ? item.trim() : item)
        ).filter((item) => item !== "" && item != null); // Remove empty strings and null values
      }
    }

    // 3. Explicitly set dates from filteredDate state (The Single Source of Truth)
    // Format must be MMDDYYYY for the backend
    if (filteredDate && filteredDate.createdDateFrom) {
      filterOptionCopy.createdDateFrom = moment(filteredDate.createdDateFrom, "MM-DD-YYYY").format("MMDDYYYY");
    }
    if (filteredDate && filteredDate.createdDateTo) {
      filterOptionCopy.createdDateTo = moment(filteredDate.createdDateTo, "MM-DD-YYYY").format("MMDDYYYY");
    }

    // 4. Default empty arrays if undefined
    if (!filterOptionCopy.salesOrg) filterOptionCopy.salesOrg = [];
    // Ensure status and exceptionType are arrays (not undefined)
    if (!Array.isArray(filterOptionCopy.documentProcessStatus))
      filterOptionCopy.documentProcessStatus = [];
    if (!Array.isArray(filterOptionCopy.exceptionType))
      filterOptionCopy.exceptionType = [];

    // 5. Update Redux
    // NOTE: We do NOT set a local busy indicator. The parent (SalesOrder) will see the payload change and trigger the global loader.
    dispatch(
      setCurrentPayload({
        ...oCurrentPayload,
        filterData: filterOptionCopy,
        pageNumber: 1,
      })
    );
    dispatch(setFilterOptions(filterOptionCopy));
    dispatch(setListPage(0));
  };
  const fnClearFilters = () => {
    dispatch(setSalesOrgObject({}));
    // Reset Redux Filter Options
    dispatch(setFilterOptions({}));
    setCountryValue("");

    // Reset UI Dates (filteredDate) via the parent prop
    if (appSettings?.range) {
      const { startDate, endDate } = getDateRange(appSettings.range);
      setFilteredDate({
        createdDateFrom: moment(startDate).format("MM-DD-YYYY"),
        createdDateTo: moment(endDate).format("MM-DD-YYYY")
      });

      // Also update payload immediately with defaults
      const formattedStart = moment(startDate).format("MMDDYYYY");
      const formattedEnd = moment(endDate).format("MMDDYYYY");

      dispatch(setCurrentPayload({
        filterData: {
          createdDateFrom: formattedStart,
          createdDateTo: formattedEnd,
          customerId: "",
          exceptionType: [],
          poNumber: "",
          salesGroup: "",
          salesOffice: "",
          isRushOrder: "",
          hasNote: "",
          soaSuccess: "",
          scanCopy: "",
          country: "",
          salesOrg: [],
          documentProcessStatus: [],
          orderHeaderId: "",
          sapOrderId: "",
          orderType: "",
          distChannel: "",
          senderEmail: "",
        },
        pageNumber: 1,
        pageSize: 50,
      }));
    } else {
      // Fallback if no appSettings
      dispatch(setCurrentPayload({ ...oCurrentPayload, filterData: {}, pageNumber: 1 }));
    }

    dispatch(setSelectedStatusTab(0)); // Reset to "All" tab (index 0)

    setSalesOrgValue([]);
    setDistChannelValue([]);
    setCustomerAutocompleteValue("");
    setCustomerOdataSearch([]);
    setSenderEmailAutocompleteValue("");
    setSenderEmailOdataSearch([]);
  };

  const fnHandleChangeDate = (newValue, field) => {
    if (!newValue) return;

    // Use dayjs directly. No .d or UTC string conversion to avoid timezone shifts.
    const newDateObj = dayjs(newValue);

    if (!newDateObj.isValid()) return;

    if (field === "createdDateTo" && filteredDate["createdDateFrom"]) {
      const fromDate = dayjs(filteredDate["createdDateFrom"], "MM-DD-YYYY");
      if (newDateObj.isBefore(fromDate)) {
        setErrorFlagForInvalidDate({
          visiblity: true,
          errorMessage: t("dateBefore"),
        });
        return;
      }
    } else if (field === "createdDateFrom" && filteredDate["createdDateTo"]) {
      const toDate = dayjs(filteredDate["createdDateTo"], "MM-DD-YYYY");
      if (newDateObj.isAfter(toDate)) {
        setErrorFlagForInvalidDate({
          visiblity: true,
          errorMessage: t("dateAfter"),
        });
        return;
      }
    }

    // Update the state with standard display format
    const formattedDate = newDateObj.format("MM-DD-YYYY");

    setFilteredDate((prev) => ({
      ...prev,
      [field]: formattedDate,
    }));

    setErrorFlagForInvalidDate({ visiblity: false, errorMessage: null });
  };

  const throttle = (func, delay) => {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func(...args);
      }
    };
  };
  const handleCustomerSearch = useCallback((event) => {
    const inputValue =
      typeof event?.target?.value === "string"
        ? event.target.value.toUpperCase()
        : "";

    if (inputValue?.length > 2) {
      if (!isNaN(inputValue)) {
        // If it can be converted to a number, it's a number
        setChecknteger(true);
        getIntegerOdataCustomerList(inputValue);
      } else {
        // If not, treat it as a string
        setChecknteger(false);
        getTextOdataCustomerList(inputValue);
      }
    }
  }, []);
  const throttledCustomerSearch = throttle(handleCustomerSearch, 30);

  // Throttled input change handler
  const handleInputChange = (event) => {
    throttledCustomerSearch(event);
  };
  const getTextOdataCustomerList = (customerName) => {
    const sUrl = `/JavaServices_Oauth/api/salesOrder/searchCustomer?customerData=${encodeURIComponent(customerName)}`;
    fnServiceRequest(
      sUrl,
      "GET",
      (response) => fnSuccessHandlerForShipName(response),
      (error) => fnErrorHandlerForShipName(error)
    );
  };

  const fnSuccessHandlerForShipName = (response) => {
    if (response && response.data && Array.isArray(response.data)) {
      const filteredResponse = response.data.filter(item => item !== null && item !== '');
      setCustomerOdataSearch(filteredResponse);
    } else {
      console.error("Unexpected response format:", response);
      setCustomerOdataSearch([]);
    }
  };

  const fnErrorHandlerForShipName = (error) => {
    console.error("Error fetching customer list:", error);
    setCustomerOdataSearch([]);
  };

  const getIntegerOdataCustomerList = (customerId) => {
    // const sUrl = `/RustoleumJavaServices_Oauth/api/v1/getCustomerNameSearchList?customerNumber=${customerId}&top=${50}&skip=${0}`;
    const sUrl = `/JavaServices_Oauth/api/salesOrder/searchCustomer?customerData=${customerId}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => fnSuccessHandlerForShipId(response),
      (error) => fnErrorHandlerFoeShipId(error)
    );
  };
  const fnSuccessHandlerForShipId = (response) => {
    if (response && response.data && Array.isArray(response.data)) {
      const filteredResponse = response.data.filter(item => item !== null && item !== '');
      setCustomerOdataSearch(filteredResponse);
    } else {
      console.error("Unexpected response format:", response);
      setCustomerOdataSearch([]);
    }
  };

  const fnErrorHandlerFoeShipId = (error) => {
    setCustomerOdataSearch([]);
  };

  // ADD THIS BLOCK FOR SENDER EMAIL SEARCH ---
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const getSenderEmailList = (emailData) => {
    const sUrl = `/JavaServices_Oauth/api/salesOrder/searchSenderEmail?emailData=${encodeURIComponent(emailData)}`;
    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        if (response && response.data && Array.isArray(response.data)) {
          const filteredResponse = response.data.filter(item => item !== null && item !== '');
          setSenderEmailOdataSearch(filteredResponse);
        } else {
          setSenderEmailOdataSearch([]);
        }
      },
      (error) => {
        console.error("Error fetching sender emails:", error);
        setSenderEmailOdataSearch([]);
      }
    );
  };

  const handleEmailSearch = useCallback((inputValue) => {
    if (inputValue && inputValue.length > 2) {
      getSenderEmailList(inputValue);
    } else {
      setSenderEmailOdataSearch([]);
    }
  }, []);

  const debouncedEmailSearch = useCallback(debounce(handleEmailSearch, 1500), [handleEmailSearch]);

  useEffect(() => {
    if (countryValue) {
      fnGetSalesOrgListSet(dispatch, language, countryValue);
    }
    else {
      setSalesOrgValue([]);
      setDistChannelValue("");
    }
  }, [countryValue, language]);
  // Sync local state with filter options on component mount or filter changes
  useEffect(() => {
    if (filterOptions.customerId) setCustomerAutocompleteValue(filterOptions.customerId);
    if (filterOptions.salesOrg && filterOptions.salesOrg.length > 0) setSalesOrgValue(filterOptions.salesOrg[0]);
    if (filterOptions.distChannel) setDistChannelValue(filterOptions.distChannel);
    if (filterOptions.senderEmail) setSenderEmailAutocompleteValue(filterOptions.senderEmail);
    if (filterOptions.country !== undefined) setCountryValue(filterOptions.country);
  }, [filterOptions]);


  const gridResponsiveConfig = {
    xl: 2,
    lg: 3,
    md: 3,
    sm: 6,
    xs: 12,
    sx: {
      display: "flex",
      flexDirection: "column",
    },
  }

  return (
    <>
      {busyIndicatorFlag && <BusyIndicator />}
      {errorFlagForInvalidDate.visiblity && (
        <CustomMessageToast
          open={true}
          setOpen={setOpen}
          messageType={"error"}
          messageDescription={errorFlagForInvalidDate.errorMessage}
          anchorPosition={anchorPosition}
          setErrorFlagForInvalidDate={setErrorFlagForInvalidDate}
        />
      )}

      <Grid container spacing={1} style={{
        padding: "10px 5px"
      }}>
        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">Customer ID/Name</span>
          <CustomAutocomplete
            name="customerId"
            options={customerOdataSearch || []}
            value={customerAutocompleteValue}
            placeholder="Enter Customer ID or Name"
            noOptionsText="Type in to avail options"
            onChange={(event, newValue) => {
              fnHandleChange(event, newValue);
            }}
            onInputChange={(event) => {
              handleInputChange(event);
            }}
          />
        </Grid>

        <Grid
          item
          {...gridResponsiveConfig}
        >
          <span className="filter-labels">
            {
              adminConsoleAdminConfiguration(t)?.listViewScreenFilters
                .exceptionTypeFilter
            }
          </span>
          <MultiSelect
            options={adminConsoleAdminConfiguration(t)?.exceptionTypeDropdown || []}
            value={filterOptions.exceptionType || []}
            name="exceptionType"
            placeholder={t("selectedException")}
            onChange={(event) => fnHandleChange(event)}
          />
        </Grid>

        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">
            {adminConsoleAdminConfiguration(t)?.listViewScreenFilters.statusFilter}
          </span>
          <MultiSelect
            options={adminConsoleAdminConfiguration(t)?.processStatusDropdown || []}
            value={filterOptions.documentProcessStatus || []}
            name="documentProcessStatus"
            placeholder={t("selectStatus") || "Select Status"}
            onChange={(event) => fnHandleChange(event)}
          />
        </Grid>

        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">
            {" "}
            {
              adminConsoleAdminConfiguration(t)?.listViewScreenFilters
                .createdFrom
            }
          </span>
          <CustomDatePicker
            format={appSettings?.dateFormat || "MM/DD/YYYY"}
            value={
              filteredDate?.createdDateFrom
                ? dayjs(filteredDate.createdDateFrom)
                : null
            }
            name="createdFrom"
            onChange={(event) => fnHandleChangeDate(event, "createdDateFrom")}
            disableFuture={true}
          />
        </Grid>
        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">
            {" "}
            {
              adminConsoleAdminConfiguration(t)?.listViewScreenFilters
                .createdTo
            }
          </span>
          <CustomDatePicker
            format={appSettings?.dateFormat || "MM/DD/YYYY"}
            value={
              filteredDate?.createdDateTo
                ? dayjs(filteredDate.createdDateTo)
                : null
            }
            onChange={(event) => fnHandleChangeDate(event, "createdDateTo")}
            disableFuture={true}
          />
        </Grid>

        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">
            {" "}
            {adminConsoleAdminConfiguration(t)?.listViewScreenFilters.poNumber}
          </span>
          <CustomTextField
            name="poNumber"
            value={filterOptions.poNumber ?? ""}
            placeholder={t("poNumberPlaceholder")}
            onChange={(event) => fnHandleChange(event)}
            className={"po-number-textField"}
          />
        </Grid>
        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">
            {" "}
            {
              adminConsoleAdminConfiguration(t)?.listViewScreenFilters
                .sapOrderId
            }
          </span>
          <CustomTextField
            name="sapOrderId"
            value={filterOptions.sapOrderId ?? ""}
            placeholder={t("Enter SAP Order ID")}
            onChange={(event) => fnHandleChange(event)}
            className={"po-number-textField"}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                fnApplyFilters();
              }
            }}
          />
        </Grid>
        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">
            {" "}
            {adminConsoleAdminConfiguration(t)?.listViewScreenFilters.requestId}
          </span>
          <CustomTextField
            name="orderHeaderId"
            value={filterOptions.orderHeaderId ?? ""}
            placeholder={t("Enter Request ID")}
            onChange={(event) => fnHandleChange(event)}
            className={"po-number-textField"}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                fnApplyFilters();
              }
            }}
          />
        </Grid>

        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">
            {adminConsoleAdminConfiguration(t)?.listViewScreenFilters?.senderEmail || "Sender Email"}
          </span>
          <CustomAutocomplete
            name="senderEmail"
            options={senderEmailOdataSearch || []}
            value={senderEmailAutocompleteValue}
            placeholder={t("Enter Sender Email") || "Enter Sender Email"}
            noOptionsText="Type to search emails"
            onChange={(event, newValue) => {
              const val = newValue || "";
              setSenderEmailAutocompleteValue(val);
              fnHandleChange({ target: { name: "senderEmail", value: val } });
            }}
            onInputChange={(event, newInputValue, reason) => {
              setSenderEmailAutocompleteValue(newInputValue);
              if (reason === 'input') {
                fnHandleChange({ target: { name: "senderEmail", value: newInputValue } });
                debouncedEmailSearch(newInputValue);
              } else if (reason === 'clear') {
                fnHandleChange({ target: { name: "senderEmail", value: "" } });
                setSenderEmailOdataSearch([]);
              }
            }}
          />
        </Grid>

        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">
            {" "}
            {adminConsoleAdminConfiguration(t)?.listViewScreenFilters.orderType}
          </span>
          <CustomSelect
            options={adminConsoleAdminConfiguration(t)?.orderTypeDropdown || []}
            value={filterOptions.orderType || ""}
            name="orderType"
            placeholder={t("Select Order Type")}
            onChange={(event) => fnHandleChange(event)}
          />
        </Grid>

        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">Country</span>
          <CustomSelect
            options={countries.map(item => ({
              key: item.countryCode,
              value: item.countryName
            }))}
            value={countryValue}
            name="country"
            placeholder="Select Country"
            onChange={(event) => fnHandleChange(event)}
          />
        </Grid>

        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">
            {adminConsoleAdminConfiguration(t)?.listViewScreenFilters.salesOrg}
          </span>
          <CustomSelect
            options={salesOrgListSet.map(item => ({ key: item.SalesOrg, value: item.SalesOrg }))}
            value={salesOrgValue}
            name="salesOrg"
            placeholder="Select Sales Org"
            disabled={!countryValue || countryValue.length === 0}
            onChange={(event) => fnHandleChange(event)}
          />
        </Grid>

        <Grid item {...gridResponsiveConfig}>
          <span className="filter-labels">
            {
              adminConsoleAdminConfiguration(t)?.listViewScreenFilters
                .distributionChannel
            }
          </span>
          <CustomSelect
            options={distributionChannelList.map(item => ({ key: item.distributionChannel, value: item.distributionChannel }))}
            value={distChannelValue}
            name="distChannel"
            placeholder="Select Distribution Channel"
            disabled={!salesOrgValue || salesOrgValue.length === 0}
            onChange={(event) => fnHandleChange(event)}
          />
        </Grid>
        <Grid item {...gridResponsiveConfig}></Grid>
        <Grid item {...gridResponsiveConfig}></Grid>
        <Grid item {...gridResponsiveConfig}></Grid>
        <Grid item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginLeft: "auto",
            flexWrap: "wrap",
          }}
          gap={1}>
          <HeaderButton
            action={ButtonTypes.CLEAR}
            // className="btn btn-clear"
            title="Clear"
            onClick={() => fnClearFilters()}
          >
            {
              adminConsoleAdminConfiguration(t)?.listViewScreenFilters
                .clearFilter
            }
          </HeaderButton>
          <HeaderButton
            action={ButtonTypes.SAVE}
            title="Apply Filters"
            onClick={() => fnApplyFilters()}
          // style={{ backgroundColor: "#EAE9FF",color: "#3026B9" }}
          >
            {
              adminConsoleAdminConfiguration(t)?.listViewScreenFilters
                .applyFilter
            }{" "}
          </HeaderButton>
        </Grid>
      </Grid>
    </>
  );
};

export default ListViewFilters;


import { useEffect, useState } from "react";
import ListViewHeader from "./ListViewHeader";
import ListViewSubHeader from "./ListViewSubHeader";
import ListViewTable from "./ListViewTable";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useFetchSalesOrders } from "../../hooks/useFetchSalesOrders";
import {
  setExceptionScreenFlag,
  setviewDocumentServiceResponse,
  setHeaderInfo,
  setSalesOrderDetails,
  setMultipleCustomerOption,
  setSmartOrderList,
  setTotalRecords,
  setLineItemList,
  setListPage,
  setCurrentPayload,
  setMessagePopoverVisibility,
  setMessageToastForInvalidLineItem,
} from "../../redux/reducers/appReducer";
import TablePagination from "@mui/material/TablePagination";
import BusyIndicator from "../../utility/BusyIndicator";
import SalesOrderSkeleton from "../../UIComponents/Skeletons/SalesOrderSkeleton";
import ExceptionMatchView from "../Sales Order/Exception Match/ExceptionMatchView";
import "./Style.css";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { getDateRange } from "../../utility/utilityFunctions";

const SalesOrder = ({ metaData }) => {
  const theme = useTheme();
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const dispatch = useDispatch();
  let oPayload = useSelector((state) => state.appReducer.oCurrentPayload);
  const totalRecords = useSelector((state) => state.appReducer.totalRecords);
  const listPage = useSelector((state) => state.appReducer.listPage);
  const currentSalesOrg = useSelector(
    (state) => state.appReducer.currentSalesOrg
  );
  const appSettings = useSelector((state) => state.appReducer.appSettings);

  const datesReady =
    !!oPayload?.filterData?.createdDateFrom &&
    !!oPayload?.filterData?.createdDateTo;

  // Add filteredDate state to manage date filters
  const [filteredDate, setFilteredDate] = useState({
    createdDateFrom: "",
    createdDateTo: "",
  });

  // Use the custom hook for fetching sales orders with polling
  const { isPending: busyIndicatorFlag } = useFetchSalesOrders(
    oPayload,
    datesReady, // Only enable when dates are ready
  );

  useEffect(() => {
    dispatch(setLineItemList([]));
    dispatch(
      setMessageToastForInvalidLineItem({ visiblity: false, message: null })
    );
    dispatch(setMessagePopoverVisibility(false));
    dispatch(setExceptionScreenFlag(false));
    dispatch(setviewDocumentServiceResponse({}));
    dispatch(setHeaderInfo({}));
    dispatch(setSalesOrderDetails({}));
    dispatch(setMultipleCustomerOption(0));
  }, [oPayload, currentSalesOrg]);


  useEffect(() => {
    if (appSettings?.range) {
      const { startDate, endDate } = getDateRange(appSettings.range);

      const newFilteredDate = {
        createdDateFrom: moment(startDate).format("MM-DD-YYYY"),
        createdDateTo: moment(endDate).format("MM-DD-YYYY"),
      };

      console.log('SalesOrder - Setting filteredDate from appSettings:', {
        appSettingsRange: appSettings.range,
        newFilteredDate
      });

      setFilteredDate(newFilteredDate);
    }
  }, [appSettings?.range]);

  // Also sync with Redux filterOptions when they change
  const filterOptions = useSelector((state) => state.appReducer.filterOptions);


  // Make sure you select filterOptions from Redux

  useEffect(() => {
    // 1. PRIORITY: Check if Redux already has valid dates (User applied filters previously)
    if (filterOptions?.createdDateFrom && filterOptions?.createdDateTo) {
      const start = moment(filterOptions.createdDateFrom, "MMDDYYYY");
      const end = moment(filterOptions.createdDateTo, "MMDDYYYY");

      if (start.isValid() && end.isValid()) {
        console.log("SalesOrder: Restoring date filters from Redux");
        setFilteredDate({
          createdDateFrom: start.format("MM-DD-YYYY"),
          createdDateTo: end.format("MM-DD-YYYY"),
        });
        return; // STOP HERE. Do not use AppSettings defaults.
      }
    }

    // 2. FALLBACK: Use AppSettings (Only on first load or if filters are empty)
    if (appSettings?.range) {
      console.log("SalesOrder: Setting default dates from AppSettings");
      const { startDate, endDate } = getDateRange(appSettings.range);

      setFilteredDate({
        createdDateFrom: moment(startDate).format("MM-DD-YYYY"),
        createdDateTo: moment(endDate).format("MM-DD-YYYY"),
      });
    }
  }, [appSettings?.range, filterOptions?.createdDateFrom, filterOptions?.createdDateTo]);

  useEffect(() => {
    return () => {
      dispatch(setExceptionScreenFlag(false));
    };
  }, []);

  const handlePageChange = (oEvent, newPage) => {
    const payload = { ...oPayload, pageNumber: newPage + 1 };
    dispatch(setCurrentPayload(payload));
    dispatch(setListPage(newPage));
  };

  return (
    <div className="sales-order-container">
      {busyIndicatorFlag ? (
        <SalesOrderSkeleton status={oPayload?.filterData?.documentProcessStatus} />
      ) : (
        <>
          <Typography
            sx={{
              fontSize: "20px",
              letterSpacing: "0.00938em",
              fontWeight: "700",
              textAlign: "left",
              padding: "20px ",
              fontFamily: "'Roboto', sans-serif",
              margin: "0rem",
            }}
          >
            {t("Workbench")}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px", // Smaller font size for subheading
              fontWeight: "400", // Lighter font weight
              color: theme.palette.text.secondary, // Slightly gray color for subtle effect
              textAlign: "left",
              paddingLeft: "20px",
              fontFamily: "'Roboto', sans-serif",
              marginTop: "-25px", // Adjust spacing
            }}
          >
            {t("This View Displays list of Sales Order")}
          </Typography>
          <ListViewTable totalRecords={totalRecords} metaData={metaData} filteredDate={filteredDate} setFilteredDate={setFilteredDate} />

        </>
      )}
    </div>
  );
};

export default SalesOrder;
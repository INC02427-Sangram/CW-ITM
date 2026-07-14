import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import adminConsoleAdminConfiguration from "../config";
import { useTranslation } from "react-i18next";
import ManualReviewTable from "./ManualReviewTable";
import fnServiceRequest from "../../../utility/fnServiceRequest";
import { useDispatch } from "react-redux";
 
const ManualReview = ({ tabValue, isInValidInput, setIsInvalidInput }) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const dispatch = useDispatch();
  const [manualReviewData, setManualReviewData] = useState([]);
 const [filteredManualReviewData, setFilteredManualReviewData] = useState(
     manualReviewData?.filter(
       (row) => row?.isSchedulerOn === true && row?.salesOrg !== null
     )
   );
 
  const [busyIndicatorFlag, setBusyIndicatorFlag] = useState(false);
  const [manualReviewTableRows, setManualReviewTableRows] = useState([
    {
      salesOrg: null,
      distChannelCode: "All",
      manualReviewStatus: false,
      emailSchedulerStatus: false,
      configStatus: false,
    },
  ]);
 const fnGetAllActiveEmail = (
     setBusyIndicatorFlag,
     dispatch,
     t,
     setManualReviewData,
     setFilteredManualReviewData
   ) => {
     setBusyIndicatorFlag(true);
 
     const handleSuccess = (res) => {
       if (!res?.data || !Array.isArray(res.data)) {
         console.error("Unexpected response format:", res);
         dispatch({
           type: "SHOW_TOAST",
           payload: {
             severity: "error",
             msg: t("Unexpected data format received from the server"),
           },
         });
         setBusyIndicatorFlag(false);
         return;
       }
 
       const formattedData = res.data.map((item, idx) => ({
         reviewId: idx,
         emailId: item.emailId ?? "",
         frequency: item.frequency ?? "",
         country: item.countryName ?? "",
         salesOrg: item.salesOrg ?? "",
         manualReviewStatus: Boolean(item.manualReviewStatus),
         emailSchedulerStatus: Boolean(item.emailSchedulerStatus),
         configStatus: Boolean(item.configStatus),
       }));
 
       setManualReviewData(formattedData);
       setFilteredManualReviewData(formattedData);
       setBusyIndicatorFlag(false);
     };
 
     const handleError = (errorMessage) => {
       console.error("API error:", errorMessage);
       dispatch({
         type: "SHOW_TOAST",
         payload: {
           severity: "error",
           msg: t("Failed to load email settings"),
         },
       });
       setBusyIndicatorFlag(false);
     };
 
     fnServiceRequest(
       "/JavaServices_Oauth1/api/v1/manualReview/getAllActiveEmail",
       "GET",
       handleSuccess,
       handleError
     );
   };
    useEffect(() => {
       fnGetAllActiveEmail(
         setBusyIndicatorFlag,
         dispatch,
         t,
         setManualReviewData,
         setFilteredManualReviewData
       );
     }, []);
  return (
    <>
      <div className="adminConsoleContainer">
        <ManualReviewTable
          manualReviewData={manualReviewData}
          setManualReviewData={setManualReviewData}
          setBusyIndicatorFlag={setBusyIndicatorFlag}
          busyIndicatorFlag={busyIndicatorFlag}
          fnGetAllActiveEmail={fnGetAllActiveEmail}
          filteredManualReviewData={filteredManualReviewData}
          setFilteredManualReviewData={setFilteredManualReviewData}
        />
      </div>
    </>
  );
};
 
export default ManualReview;
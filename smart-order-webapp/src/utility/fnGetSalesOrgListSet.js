import fnGetDistributionChannelList from "./fnGetDistributionChannelList";
import { setSalesOrgListSet } from "../redux/reducers/appReducer";
import fnServiceRequest from "./fnServiceRequest";
import store from "../redux/store";

const fnGetSalesOrgListSet = (dispatch, userLanguage, country) => {
  // Try to derive from dataLevelAccess first to avoid API call
  const dataLevelAccess = store.getState().appReducer.dataLevelAccess;
  if (dataLevelAccess && dataLevelAccess.length > 0) {
    const salesOrgsSet = new Set();
    dataLevelAccess.forEach((countryData) => {
      // If country filter is provided, only include sales orgs for that country
      if (country && countryData.countryName !== country && countryData.countryCode !== country) {
        return;
      }
      if (Array.isArray(countryData.salesOrgs)) {
        countryData.salesOrgs.forEach((org) => {
          if (org.salesOrg) salesOrgsSet.add(org.salesOrg);
        });
      }
    });
    const newArray = Array.from(salesOrgsSet).map((item) => ({ SalesOrg: item }));
    dispatch(setSalesOrgListSet(newArray));
    return;
  }

  // Fallback to API call if dataLevelAccess is not available
  const sUrl = `/JavaServices_Oauth/api/odata/getSalesOrgList${
    country ? `?country=${encodeURIComponent(country)}` : ""}`;
  fnServiceRequest(
    sUrl,
    "GET",
    (response) => fnSuccessHandler(dispatch,response),
    (error) => fnErrorHandler(error)
  );
};
const fnSuccessHandler = (dispatch, response) => {
  // Check if response has data property and handle accordingly
  const data = response?.data || response;
  if (Array.isArray(data)) {
    const newArray = data.map((item) => ({ SalesOrg: item }));
    // console.log(newArray);
    dispatch(setSalesOrgListSet(newArray));
  } else {
    console.error("Unexpected response format:", response);
    dispatch(setSalesOrgListSet([]));
  }
};
 
const fnErrorHandler = (error) => {
  console.error("Error fetching sales organization list:", error);
  // You can dispatch an action to set error state if needed
};
 
export default fnGetSalesOrgListSet;
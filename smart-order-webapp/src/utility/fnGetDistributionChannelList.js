import fnServiceRequest from "./fnServiceRequest";
import { setDistributionChannelList } from "../redux/reducers/appReducer";
import store from "../redux/store";

const fnGetDistributionChannelList = (dispatch, salesOrg, setDistChannelList) => {
  // Try to derive from dataLevelAccess first to avoid API call
  const dataLevelAccess = store.getState().appReducer.dataLevelAccess;
  if (dataLevelAccess && dataLevelAccess.length > 0 && salesOrg) {
    const distChannels = new Set();
    dataLevelAccess.forEach((country) => {
      if (Array.isArray(country.salesOrgs)) {
        country.salesOrgs.forEach((org) => {
          if (org.salesOrg === salesOrg && Array.isArray(org.distributionChannels)) {
            org.distributionChannels.forEach((dc) => {
              if (dc.distributionChannel) distChannels.add(dc.distributionChannel);
            });
          }
        });
      }
    });
    if (distChannels.size > 0) {
      const list = Array.from(distChannels).map((code) => ({ distributionChannel: code }));
      dispatch(setDistributionChannelList(list));
      if (typeof setDistChannelList === "function") setDistChannelList(list);
      return;
    }
  }

  // Fallback to API call if dataLevelAccess doesn't have the data
  const sUrl = `/JavaServices_Oauth/api/odata/getDistChannelList?salesOrg=${encodeURIComponent(
    salesOrg ?? ""
  )}`;

  // Handlers FIRST (safer even if fnServiceRequest can short-circuit)
  const fnSuccessHandler = (resp) => {
    // resp may be { data: [...] } or just [...]
    const arr = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
    // normalize to objects your UI expects
    const list = arr.map((code) => ({ distributionChannel: code }));

    // keep BOTH redux & local state in the SAME shape
    dispatch(setDistributionChannelList(list));
    if (typeof setDistChannelList === "function") setDistChannelList(list);
  };

  const fnErrorHandler = (error) => {
    // optional: surface a toast / log
    console.error("getDistChannelList failed:", error);
    dispatch(setDistributionChannelList([]));
    if (typeof setDistChannelList === "function") setDistChannelList([]);
  };

  // Request
  fnServiceRequest(
    sUrl,
    "GET",
    (response) => fnSuccessHandler(response),
    (error) => fnErrorHandler(error)
  );
};

export default fnGetDistributionChannelList;

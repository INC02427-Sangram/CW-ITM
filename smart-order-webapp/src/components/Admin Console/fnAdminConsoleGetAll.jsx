import fnServiceRequest from "../../utility/fnServiceRequest";
import store from "../../redux/store";
import {
  setBusyIndicatorForAdminConsole,
  setOrgCountries,
  setOrgSalesOrgs,
  setOrgDistChannels,
  setOrgDivisions,
} from "../../redux/reducers/appReducer";


const callApi = ({
  url,
  onSuccess = () => {},
  onError = () => {},
  dispatch,
  setBusy,
}) => {
  if (dispatch) dispatch(setBusyIndicatorForAdminConsole(true));
  if (setBusy) setBusy(true);

  fnServiceRequest(
    url,
    "GET",
    (response) => {
      onSuccess(response?.data || []);
      if (dispatch) dispatch(setBusyIndicatorForAdminConsole(false));
      if (setBusy) setBusy(false);
    },
    (error) => {
      console.error("API error:", error);
      onError(error);
      if (dispatch) dispatch(setBusyIndicatorForAdminConsole(false));
      if (setBusy) setBusy(false);
    }
  );
};

/** Helper to read orgCache from Redux store */
const getOrgCache = () => store.getState().appReducer.orgCache;


export const getCountryCodes = ({
  onSuccess,
  onError,
  dispatch,
  setBusy,
}) => {
  const cached = getOrgCache().countries;
  if (cached && cached.length > 0) {
    onSuccess(cached);
    return;
  }

  // Fallback: try to derive from dataLevelAccess if available
  const dataLevelAccess = store.getState().appReducer.dataLevelAccess;
  if (dataLevelAccess && dataLevelAccess.length > 0) {
    const countries = dataLevelAccess.map((country) => ({
      countryId: country.country_id,
      countryCode: country.countryCode,
      countryName: country.countryName,
    }));
    store.dispatch(setOrgCountries(countries));
    onSuccess(countries);
    return;
  }

  callApi({
    url: `/JavaServices_Oauth1/api/v1/OrganisationDetails/getCountryCodes`,
    onSuccess: (data) => {
      store.dispatch(setOrgCountries(data));
      onSuccess(data);
    },
    onError,
    dispatch,
    setBusy,
  });
};


export const getSalesOrgs = ({
  countryId,
  onSuccess,
  onError,
  dispatch,
  setBusy,
}) => {
  const key = String(countryId);
  const cached = getOrgCache().salesOrgs[key];
  if (cached) {
    onSuccess(cached);
    return;
  }

  // Fallback: derive from dataLevelAccess if available
  const dataLevelAccess = store.getState().appReducer.dataLevelAccess;
  if (dataLevelAccess && dataLevelAccess.length > 0) {
    const countryData = dataLevelAccess.find(
      (c) => String(c.country_id) === key
    );
    if (countryData && Array.isArray(countryData.salesOrgs)) {
      const salesOrgList = countryData.salesOrgs
        .map((o) => o.salesOrg)
        .filter(Boolean);
      store.dispatch(setOrgSalesOrgs({ key, data: salesOrgList }));
      onSuccess(salesOrgList);
      return;
    }
  }

  callApi({
    url: `/JavaServices_Oauth1/api/v1/OrganisationDetails/getSalesOrg?countryId=${countryId}`,
    onSuccess: (data) => {
      store.dispatch(setOrgSalesOrgs({ key, data }));
      onSuccess(data);
    },
    onError,
    dispatch,
    setBusy,
  });
};


export const getDistributionChannels = ({
  countryId,
  salesOrg,
  onSuccess,
  onError,
  dispatch,
  setBusy,
}) => {
  const key = `${countryId}_${salesOrg}`;
  const cached = getOrgCache().distributionChannels[key];
  if (cached) {
    onSuccess(cached);
    return;
  }

  // Fallback: derive from dataLevelAccess if available
  const dataLevelAccess = store.getState().appReducer.dataLevelAccess;
  if (dataLevelAccess && dataLevelAccess.length > 0) {
    const countryData = dataLevelAccess.find(
      (c) => String(c.country_id) === String(countryId)
    );
    const orgData = countryData?.salesOrgs?.find((o) => o.salesOrg === salesOrg);
    if (orgData && Array.isArray(orgData.distributionChannels)) {
      const dcList = orgData.distributionChannels
        .map((dc) => dc.distributionChannel)
        .filter(Boolean);
      store.dispatch(setOrgDistChannels({ key, data: dcList }));
      onSuccess(dcList);
      return;
    }
  }

  callApi({
    url: `/JavaServices_Oauth1/api/v1/OrganisationDetails/getDistributionChannel?countryId=${countryId}&salesOrg=${salesOrg}`,
    onSuccess: (data) => {
      store.dispatch(setOrgDistChannels({ key, data }));
      onSuccess(data);
    },
    onError,
    dispatch,
    setBusy,
  });
};


export const getDivisions = ({
  countryId,
  salesOrg,
  distChannel,
  onSuccess,
  onError,
  dispatch,
  setBusy,
}) => {
  const key = `${countryId}_${salesOrg}_${distChannel}`;
  const cached = getOrgCache().divisions[key];
  if (cached) {
    onSuccess(cached);
    return;
  }

  // Fallback: derive from dataLevelAccess if available
  const dataLevelAccess = store.getState().appReducer.dataLevelAccess;
  if (dataLevelAccess && dataLevelAccess.length > 0) {
    const countryData = dataLevelAccess.find(
      (c) => String(c.country_id) === String(countryId)
    );
    const orgData = countryData?.salesOrgs?.find((o) => o.salesOrg === salesOrg);
    const dcData = orgData?.distributionChannels?.find(
      (dc) => dc.distributionChannel === distChannel
    );
    if (dcData && Array.isArray(dcData.divisions)) {
      store.dispatch(setOrgDivisions({ key, data: dcData.divisions }));
      onSuccess(dcData.divisions);
      return;
    }
  }

  callApi({
    url: `/JavaServices_Oauth1/api/v1/OrganisationDetails/getDivision?countryId=${countryId}&salesOrg=${salesOrg}&distChannel=${distChannel}`,
    onSuccess: (data) => {
      store.dispatch(setOrgDivisions({ key, data }));
      onSuccess(data);
    },
    onError,
    dispatch,
    setBusy,
  });
};

export default {
  getCountryCodes,
  getSalesOrgs,
  getDistributionChannels,
  getDivisions,
};
 
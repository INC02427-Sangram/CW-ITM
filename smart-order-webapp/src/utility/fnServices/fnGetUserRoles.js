import { setUserDetails, setUserRoles, setModuleAccess, setDataLevelAccess, setSalesOrgListSet, setOrgCountries, setOrgSalesOrgs, setOrgDistChannels, setOrgDivisions } from "../../redux/reducers/appReducer";
import fnServiceRequest from "../fnServiceRequest";

/**
 * Fetches user roles and module access from the API and dispatches them to Redux store
 */
const fnGetUserRoles = (dispatch, onSuccess, onError) => {
  const url = `/JavaServices_Oauth/api/caf-iwa/user-modules-features`;

  fnServiceRequest(
    url,
    "GET",
    (response) => fnSuccessHandler(dispatch, response, onSuccess),
    (error) => fnErrorHandler(error, onError)
  );
};

/**
 * Success handler for user roles API response
 */
const fnSuccessHandler = (dispatch, response, onSuccess) => {
  if (!response) {
    if (onError) onError();
    return;
  }

  const roles = Array.isArray(response.roles) ? response.roles : [];
  const access = response.moduleAccess || {};
  const dataLevelAccess = Array.isArray(response.dataLevelAccess) ? response.dataLevelAccess : [];

  // Store the full user object in Redux for consistent access
  dispatch(setUserDetails({
    emailId: response?.emailId || response?.email || "",
    email: response?.email || response?.emailId || "",
    firstName: response?.firstName || "",
    lastName: response?.lastName || "",
    token: response?.token || "",
    roles: roles
  }));

  dispatch(setUserRoles(roles));
  dispatch(setModuleAccess(access));
  dispatch(setDataLevelAccess(dataLevelAccess));

  // Derive salesOrgListSet from dataLevelAccess to avoid separate API call
  const salesOrgsSet = new Set();
  dataLevelAccess.forEach((country) => {
    if (Array.isArray(country.salesOrgs)) {
      country.salesOrgs.forEach((org) => {
        if (org.salesOrg) salesOrgsSet.add(org.salesOrg);
      });
    }
  });
  const salesOrgListSet = Array.from(salesOrgsSet).map((item) => ({ SalesOrg: item }));
  dispatch(setSalesOrgListSet(salesOrgListSet));

  // Derive country codes from dataLevelAccess to pre-populate orgCache
  const countries = dataLevelAccess.map((country) => ({
    countryId: country.country_id,
    countryCode: country.countryCode,
    countryName: country.countryName,
  }));
  dispatch(setOrgCountries(countries));

  // Pre-populate orgCache for salesOrgs, distributionChannels, and divisions
  // so that subsequent API calls for those are served from cache (no extra round-trips)
  dataLevelAccess.forEach((countryData) => {
    const countryKey = String(countryData.country_id);

    if (Array.isArray(countryData.salesOrgs)) {
      const salesOrgList = countryData.salesOrgs
        .map((o) => o.salesOrg)
        .filter(Boolean);
      dispatch(setOrgSalesOrgs({ key: countryKey, data: salesOrgList }));

      countryData.salesOrgs.forEach((orgData) => {
        if (!orgData.salesOrg) return;
        const dcKey = `${countryKey}_${orgData.salesOrg}`;
        const dcList = (orgData.distributionChannels || [])
          .map((dc) => dc.distributionChannel)
          .filter(Boolean);
        dispatch(setOrgDistChannels({ key: dcKey, data: dcList }));

        (orgData.distributionChannels || []).forEach((dcData) => {
          if (!dcData.distributionChannel) return;
          const divKey = `${countryKey}_${orgData.salesOrg}_${dcData.distributionChannel}`;
          dispatch(setOrgDivisions({ key: divKey, data: dcData.divisions || [] }));
        });
      });
    }
  });

  if (onSuccess) onSuccess();
};

/**
 * Error handler for user roles API request
 */
const fnErrorHandler = (error, onError) => {
  console.error("Error fetching user roles:", error);
  if (onError) onError();
};

export default fnGetUserRoles;

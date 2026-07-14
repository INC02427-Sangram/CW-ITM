// featureConfig.services.js

import { setMessageToastForAdminConsole } from "../../../redux/reducers/appReducer";
import fnServiceRequest from "../../../utility/fnServiceRequest";

/**
 * Fetches all features (country-agnostic master list).
 * Normalises mandatory features to always have isEnabled: true.
 */
export const fetchAllFeatures = ({ onSuccess, onError, setLoading }) => {
  setLoading(true);
  fnServiceRequest(
    `/JavaServices_Oauth1/api/feature-config/getAllFeatures`,
    "GET",
    (response) => {
      setLoading(false);
      const features = Array.isArray(response?.data) ? response.data : [];
      const normalised = features.map((f) =>
        f.isMandatory ? { ...f, isEnabled: true } : f,
      );
      onSuccess(normalised);
    },
    (error) => {
      setLoading(false);
      console.error("Error fetching all features", error);
      onError?.(error);
    },
  );
};

/**
 * Fetches enabled features for a specific country + salesOrg combination.
 * Returns items sorted by orderSeq, grouped by categoryName.
 */
export const fetchConfigForCountryAndSalesOrg = ({
  country,
  salesOrg,
  onSuccess,
  onError,
  setLoading,
}) => {
  
  if (!country || !salesOrg) return;
  setLoading(true);
  const url = `/JavaServices_Oauth1/api/feature-config/getByCountryAndSalesOrg?countryCode=${country}&salesOrgCode=${salesOrg}`;
  fnServiceRequest(
    url,
    "GET",
    (response) => {
      setLoading(false);
      const apiConfig = Array.isArray(response?.data) ? response.data : [];
      const sortedOrgStates = apiConfig
        .filter(({ isEnabled }) => isEnabled)
        .sort((a, b) => (a.orderSeq ?? Infinity) - (b.orderSeq ?? Infinity))
      const newOrgState = sortedOrgStates
        .reduce((acc, { categoryName, featureName }) => {
          if (!acc[categoryName]) acc[categoryName] = [];
          if (!acc[categoryName].includes(featureName))
            acc[categoryName].push(featureName);
          return acc;
        }, {});

      const sequencedShipToSoldToStates = apiConfig
        .filter(({ categoryCode }) => categoryCode === "CUSTOMER")
        .reduce((acc, { featureCode, orderSeq, isEnabled, isMandatory }) => {
          acc[featureCode] = { orderSeq, isEnabled, isMandatory };
          return acc;
        }, {});
      onSuccess({ newOrgState, sequencedShipToSoldToStates });
    },
    (error) => {
      setLoading(false);
      console.error("Error fetching config for", country, salesOrg, error);
      onError?.(error);
    },
  );
};

/**
 * Posts the feature config payload for all selected sales orgs.
 */
export const saveFeatureConfig = ({
  payload,
  onSuccess,
  onError,
  setLoading,
  dispatch,
}) => {
  setLoading(true);
  fnServiceRequest(
    `/JavaServices_Oauth1/api/feature-config/save`,
    "POST",
    (response) => {
      setLoading(false);
      onSuccess?.(response);
      dispatch(
        setMessageToastForAdminConsole({
          visiblity: true,
          message: "Feature configuration saved successfully",
          type: "success",
        })
      );
    },
    (error) => {
      setLoading(false);
      console.error("Error saving", error);
      dispatch(
        setMessageToastForAdminConsole({
          visiblity: true,
          message: "Error saving feature configuration",
          type: "error",
        })
      );
      onError?.(error);
    },
    payload,
  );
};
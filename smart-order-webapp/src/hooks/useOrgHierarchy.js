import { useState, useEffect } from "react";
import {
  getCountryCodes,
  getSalesOrgs,
  getDistributionChannels,
  getDivisions,
} from "../components/Admin Console/fnAdminConsoleGetAll";

/**
 * Custom hook to manage the cascading org hierarchy:
 *   Country → Sales Org → Distribution Channel → Division
 *
 * @param {Object} options
 * @param {number}   options.depth          - How many levels to support (1=country, 2=+salesOrg, 3=+distChannel, 4=+division)
 * @param {"id"|"name"} options.countrySelectBy - Whether the country Select value is countryId or countryName (default: "id")
 * @param {Function} options.onCountriesLoaded - Optional callback once countries are fetched
 * @param {Function} options.onError       - Optional error callback
 * @param {Object}   options.reduxHelpers  - Optional { dispatch, setBusy } forwarded to fnAdminConsoleGetAll
 */
const useOrgHierarchy = ({
  depth = 2,
  countrySelectBy = "id",
  onCountriesLoaded,
  onError,
  reduxHelpers = {},
} = {}) => {
  // State
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [salesOrg, setSalesOrg] = useState("");
  const [distributionChannel, setDistributionChannel] = useState("");
  const [division, setDivision] = useState("");

  // Options lists
  const [salesOrgOptions, setSalesOrgOptions] = useState([]);
  const [distributionOptions, setDistributionOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);

  const [loading, setLoading] = useState(false);

  // Helper: resolve country object from the selected value
  const getCountryObj = (selectedValue) => {
    if (!selectedValue) return null;
    if (countrySelectBy === "name") {
      return countries.find((c) => c.countryName === selectedValue);
    }
    return countries.find((c) => c.countryId === selectedValue);
  };

  /**
   * Returns the countryName for the currently selected country value.
   */
  const getSelectedCountryName = () => {
    const obj = getCountryObj(country);
    return obj?.countryName || "";
  };

  /**
   * Returns the full country object for the currently selected country value.
   */
  const getSelectedCountryObj = () => getCountryObj(country);

  // Fetch countries on mount
  useEffect(() => {
    setLoading(true);
    getCountryCodes({
      onSuccess: (data) => {
        setCountries(data);
        setLoading(false);
        onCountriesLoaded?.(data);
      },
      onError: (err) => {
        console.error("Error fetching countries:", err);
        setLoading(false);
        onError?.(err);
      },
      ...reduxHelpers,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handleCountryChange = (event) => {
    const value = event.target.value;
    setCountry(value);

    // Reset dependents
    setSalesOrg("");
    setSalesOrgOptions([]);
    if (depth >= 3) {
      setDistributionChannel("");
      setDistributionOptions([]);
    }
    if (depth >= 4) {
      setDivision("");
      setDivisionOptions([]);
    }

    const obj = getCountryObj(value) || (
      // If countries haven't settled yet, try finding from the event directly
      countrySelectBy === "name"
        ? countries.find((c) => c.countryName === value)
        : countries.find((c) => c.countryId === value)
    );

    if (obj?.countryId && depth >= 2) {
      setLoading(true);
      getSalesOrgs({
        countryId: obj.countryId,
        onSuccess: (data) => {
          setSalesOrgOptions(data);
          setLoading(false);
        },
        onError: (err) => {
          console.error("Error fetching sales orgs:", err);
          setSalesOrgOptions([]);
          setLoading(false);
        },
        ...reduxHelpers,
      });
    }
  };

  const handleSalesOrgChange = (event) => {
    const value = event.target.value;
    setSalesOrg(value);

    // Reset dependents
    if (depth >= 3) {
      setDistributionChannel("");
      setDistributionOptions([]);
    }
    if (depth >= 4) {
      setDivision("");
      setDivisionOptions([]);
    }

    if (depth >= 3 && value) {
      const obj = getCountryObj(country);
      if (obj?.countryId) {
        setLoading(true);
        getDistributionChannels({
          countryId: obj.countryId,
          salesOrg: value,
          onSuccess: (data) => {
            setDistributionOptions(data);
            setLoading(false);
          },
          onError: (err) => {
            console.error("Error fetching distribution channels:", err);
            setDistributionOptions([]);
            setLoading(false);
          },
          ...reduxHelpers,
        });
      }
    }
  };

  const handleDistributionChannelChange = (event) => {
    const value = event.target.value;
    setDistributionChannel(value);

    if (depth >= 4) {
      setDivision("");
      setDivisionOptions([]);

      if (value) {
        const obj = getCountryObj(country);
        if (obj?.countryId && salesOrg) {
          setLoading(true);
          getDivisions({
            countryId: obj.countryId,
            salesOrg,
            distChannel: value,
            onSuccess: (data) => {
              setDivisionOptions(data);
              setLoading(false);
            },
            onError: (err) => {
              console.error("Error fetching divisions:", err);
              setDivisionOptions([]);
              setLoading(false);
            },
            ...reduxHelpers,
          });
        }
      }
    }
  };

  const handleDivisionChange = (event) => {
    setDivision(event.target.value);
  };

  // Reset all selections and options
  const resetAll = () => {
    setCountry("");
    setSalesOrg("");
    setSalesOrgOptions([]);
    if (depth >= 3) {
      setDistributionChannel("");
      setDistributionOptions([]);
    }
    if (depth >= 4) {
      setDivision("");
      setDivisionOptions([]);
    }
  };

  return {
    // State values
    countries,
    country,
    salesOrg,
    distributionChannel,
    division,

    // Option lists
    salesOrgOptions,
    distributionOptions,
    divisionOptions,

    // Loading
    loading,

    // Handlers
    handleCountryChange,
    handleSalesOrgChange,
    handleDistributionChannelChange,
    handleDivisionChange,

    // Utilities
    resetAll,
    getSelectedCountryName,
    getSelectedCountryObj,
  };
};

export default useOrgHierarchy;

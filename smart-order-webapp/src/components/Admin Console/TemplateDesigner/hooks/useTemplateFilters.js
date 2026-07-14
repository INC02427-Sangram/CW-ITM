import { useState, useCallback } from "react";

/**
 * Hook for managing template list filters
 */
export const useTemplateFilters = () => {
  const [notificationTypeFilter, setNotificationTypeFilter] = useState("All");
  const [filterCountryName, setFilterCountryName] = useState("All");
  const [filterCountryCode, setFilterCountryCode] = useState("All");
  const [filterSalesOrg, setFilterSalesOrg] = useState("All");

  // Build filter query string
  const buildFilterQS = useCallback(() => {
    const parts = [];
    const isAll = (v) => v === "All" || v === "" || v == null;

    if (isAll(filterCountryCode)) {
      parts.push("country=All");
    } else {
      parts.push(`country=${encodeURIComponent(filterCountryCode)}`);
    }

    if (isAll(filterSalesOrg)) {
      parts.push("salesOrg=All");
    } else {
      parts.push(`salesOrg=${encodeURIComponent(filterSalesOrg)}`);
    }

    return `?${parts.join("&")}`;
  }, [filterCountryCode, filterSalesOrg]);

  const handleFilterCountryChange = useCallback(
    (selectedName, countries, fetchSalesOrgList) => {
      const selectedCountry = countries.find(
        (c) => c.countryName === selectedName
      );

      const countryCode =
        selectedCountry?.countryCode ||
        selectedCountry?.code ||
        selectedCountry?.countryId ||
        "All";

      setFilterCountryName(selectedName || "All");
      setFilterCountryCode(countryCode || "All");
      setFilterSalesOrg("All");

      if (selectedCountry?.countryId) {
        fetchSalesOrgList(selectedCountry.countryId);
      }
    },
    []
  );

  const handleFilterSalesOrgChange = useCallback((selectedOrg) => {
    setFilterSalesOrg(selectedOrg || "All");
  }, []);

  return {
    notificationTypeFilter,
    filterCountryName,
    filterCountryCode,
    filterSalesOrg,
    setNotificationTypeFilter,
    setFilterCountryName,
    setFilterCountryCode,
    setFilterSalesOrg,
    buildFilterQS,
    handleFilterCountryChange,
    handleFilterSalesOrgChange,
  };
};
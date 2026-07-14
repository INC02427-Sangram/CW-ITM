// featureConfig.utils.js

export const makeDragId = (category, item) => `${category}||${item}`;

export const parseDragId = (id) => {
  const [category, ...itemParts] = id.split("||");
  return { category, item: itemParts.join("||") };
};

/**
 * Builds groupedFeatures from allFeatures API data.
 * Mandatory items are always included.
 */
export const buildGroupedFeatures = (allFeatures) => {
  const grouped = allFeatures
    .filter((f) => f.isActive)
    .reduce((acc, { categoryDesc, featureDesc }) => {
      if (!acc[categoryDesc]) acc[categoryDesc] = [];
      if (!acc[categoryDesc].includes(featureDesc))
        acc[categoryDesc].push(featureDesc);
      return acc;
    }, {});

  allFeatures
    .filter((f) => f.isMandatory)
    .forEach(({ categoryDesc, featureDesc }) => {
      if (!grouped[categoryDesc]) grouped[categoryDesc] = [];
      if (!grouped[categoryDesc].includes(featureDesc))
        grouped[categoryDesc].push(featureDesc);
    });

  return Object.fromEntries(
    Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => [key, [...grouped[key]].sort((a, b) => a.localeCompare(b))]),
  );
};

/**
 * Returns a Set of mandatory featureDesc strings for a given category.
 */
export const getMandatoryItems = (allFeatures, category) =>
  new Set(
    allFeatures
      .filter((f) => f.categoryDesc === category && f.isMandatory && f.isActive)
      .map((f) => f.featureDesc),
  );

/**
 * Injects mandatory features into state/snapshot for a given country+salesOrg.
 * Returns the same prev object (no re-render) if nothing changed.
 */
export const injectMandatoryFeatures = (
  prev,
  mandatoryFeatures,
  selectedCountry,
  activeSalesOrg,
) => {
  const countryState = prev[selectedCountry] || {};
  const orgState = countryState[activeSalesOrg] || {};
  let changed = false;
  const updatedOrgState = { ...orgState };

  mandatoryFeatures.forEach(({ categoryDesc, featureDesc }) => {
    const current = updatedOrgState[categoryDesc] || [];
    if (!current.includes(featureDesc)) {
      updatedOrgState[categoryDesc] = [...current, featureDesc];
      changed = true;
    }
  });

  if (!changed) return prev;

  return {
    ...prev,
    [selectedCountry]: {
      ...countryState,
      [activeSalesOrg]: updatedOrgState,
    },
  };
};

/**
 * Builds the save payload for all selected sales orgs
 * using the shared config from activeSalesOrg.
 */
export const buildSavePayload = ({
  allFeatures,
  state,
  selectedCountry,
  activeSalesOrg,
  selectedSalesOrgs,
  countryOrgData,
}) => {
  const countryEntry = (countryOrgData || []).find(
    (c) => c.countryCode === selectedCountry,
  );
  const countryCode = countryEntry?.countryCode ?? null;
  const currentOrgState = state?.[selectedCountry]?.[activeSalesOrg] || {};

  return selectedSalesOrgs.flatMap((orgCode) => {
    const salesOrgEntry = (countryEntry?.salesOrgs || []).find(
      (s) => s.salesOrg === orgCode,
    );
    const salesOrgCode = salesOrgEntry?.salesOrg ?? null;

    return allFeatures
      .filter((f) => f.isActive)
      .map(({ featureId, featureDesc, categoryDesc }) => {
        const selectedItems = currentOrgState[categoryDesc] || [];
        const orderSeq = selectedItems.indexOf(featureDesc);
        return {
          countryCode,
          salesOrgCode,
          featureId,
          isEnabled: orderSeq !== -1,
          orderSeq: orderSeq !== -1 ? orderSeq + 1 : null,
        };
      });
  });
};

/**
 * Checks whether current state differs from savedSnapshot
 * for the active country + salesOrg combination.
 */
export const computeHasChanges = ({
  state,
  savedSnapshot,
  selectedCountry,
  activeSalesOrg,
  groupedFeatures,
}) => {
  if (!selectedCountry || !activeSalesOrg) return false;
  return Object.keys(groupedFeatures).some((category) => {
    const prev =
      savedSnapshot?.[selectedCountry]?.[activeSalesOrg]?.[category] || [];
    const curr =
      state?.[selectedCountry]?.[activeSalesOrg]?.[category] || [];
    if (prev.length !== curr.length) return true;
    return curr.some((item, idx) => item !== prev[idx]);
  });
};
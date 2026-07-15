const getMarketFromSalesOrgNumber = (salesOrgNumber, salesOrgListSet) => {
  return salesOrgListSet
    .filter((item, index) => item.SalesOrg == salesOrgNumber)
    ?.at(0)?.Description;
};
export default getMarketFromSalesOrgNumber;

const getsalesOrgFromMarket = {
  Greece: "3838",
  UK: "7540",
};
const getMarketFromSalesOrg = {
  7540: "UK",
  3838: "Greece",
};
const getLangauge = {
  Greece: "G",
  UK: "E",
};
const country = ["Greece", "UK"];

const salesOrgArray = [
  {
    name: "UK",
    value: "7540",
  },
  {
    name: "Greece",
    value: "3838",
  },
];
const getDistributionChannelName = (channelNumber, distributionChannelList,salesorg) => {
  
  return distributionChannelList?.filter(
    (item, index) => (item.distChannelCode == channelNumber && item.salesOrg==salesorg)
  )?.at(0)?.distChannel;
};

export {
  country,
  getLangauge,
  salesOrgArray,
  getMarketFromSalesOrg,
  getDistributionChannelName,
};

export default getsalesOrgFromMarket;

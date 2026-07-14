const fnGetDistributionChannelName=(channelNumber,distributionChannelList)=>{
    return distributionChannelList?.filter((item, index) => item.Disch == channelNumber)
    ?.at(0)?.Description;

}
export default fnGetDistributionChannelName
import fnServiceRequest from "../../../utility/fnServiceRequest";

const ORDER_BLOCK_BASE_URL = "/JavaServices_Oauth1/api/v1/orderBlock";

export const getOrderBlocks = (onSuccess, onError) => {
  const handleSuccess = (response) => {
    const blocks = Array.isArray(response?.data)
      ? response.data.map((item) => {
          return {
            id: item.delivBlockId,
            country: item.countryName,
            countryCode: item.countryCode,
            orderBlock: item.deliveryBlockCode,
            priority: item.deliveryBlockPriority?.toString() ?? "",
            orderBlockDesc: item.deliveryBlockDesc ?? "",
          };
        })
      : [];
    onSuccess(blocks);
  };

  fnServiceRequest(
    `${ORDER_BLOCK_BASE_URL}/getAllOrderBlock`,
    "GET",
    handleSuccess,
    onError,
  );
};

export const addOrderBlock = (payload, onSuccess, onError) => {
  fnServiceRequest(
    `${ORDER_BLOCK_BASE_URL}/addOrderBlock`,
    "POST",
    onSuccess,
    onError,
    payload
  );
};

export const updateOrderBlock = (payload, onSuccess, onError) => {
  fnServiceRequest(
    `${ORDER_BLOCK_BASE_URL}/updateOrderBlock`,
    "POST",
    onSuccess,
    onError,
    payload
  );
};

export const deleteOrderBlock = (
  orderBlock,
  onSuccess,
  onError,
  country
) => {
  fnServiceRequest(
    `${ORDER_BLOCK_BASE_URL}/deleteOrderBlock?country=${country}&orderBlock=${orderBlock}`,
    "POST",
    onSuccess,
    onError
  );
};

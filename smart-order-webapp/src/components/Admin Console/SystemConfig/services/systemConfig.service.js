import fetchWrapper from "../../../../utility/fetchWrapper";
import fnServiceRequest from "../../../../utility/fnServiceRequest";

export const getLanguageTemplate = (onSuccess, onError) =>
  fnServiceRequest(
    "/JavaServices_Oauth/api/salesOrder/getExcel",
    "GET",
    onSuccess,
    onError
  );

export const uploadLanguageTemplate = (base64) =>
  fetchWrapper("/JavaServices_Oauth/api/salesOrder/importExcel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ base64 }),
  });

export const getErpSystems = (onSuccess, onError) =>
  fnServiceRequest(
    "/JavaServices_Oauth1/api/admin/ErpConfig/getAll",
    "GET",
    onSuccess,
    onError
  );

export const activateErpSystem = (erpSystemId, onSuccess, onError) =>
  fnServiceRequest(
    `/JavaServices_Oauth1/api/admin/ErpConfig/${erpSystemId}/activate`,
    "POST",
    onSuccess,
    onError
  );

export const resetCache = (onSuccess, onError) =>
  fnServiceRequest(
    "/JavaServices_Oauth1/api/cacheControl/resetCache",
    "GET",
    onSuccess,
    onError
  );

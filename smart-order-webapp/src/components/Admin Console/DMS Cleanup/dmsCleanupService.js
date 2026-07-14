import fnServiceRequest from "../../../utility/fnServiceRequest";

const DMS_CLEANUP_BASE_URL = "/JavaServices_Oauth1/api/dmsCleanUp";

export const getDmsSchedules = (onSuccess, onError) =>
  fnServiceRequest(
    `${DMS_CLEANUP_BASE_URL}/getAllDMSCleanUpSchedule`,
    "GET",
    onSuccess,
    onError
  );

export const addDmsSchedule = (payload, onSuccess, onError) =>
  fnServiceRequest(
    `${DMS_CLEANUP_BASE_URL}/addCleanUpSchedule`,
    "POST",
    onSuccess,
    onError,
    payload
  );

export const updateDmsSchedule = (payload, onSuccess, onError) =>
  fnServiceRequest(
    `${DMS_CLEANUP_BASE_URL}/modifyCleanUpScheduler`,
    "POST",
    onSuccess,
    onError,
    payload
  );

export const deleteDmsSchedule = (country, onSuccess, onError) =>
  fnServiceRequest(
    `${DMS_CLEANUP_BASE_URL}/deleteCleanUpSchedule?country=${encodeURIComponent(
      country
    )}`,
    "GET",
    onSuccess,
    onError
  );

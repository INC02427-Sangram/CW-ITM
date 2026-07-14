import fnServiceRequest from "../../../utility/fnServiceRequest";

const RECEIVER_EMAIL_BASE_URL = "/JavaServices_Oauth1/api/v1/receiverEmail";

export const getReceiverEmails = () =>
  new Promise((resolve, reject) => {
    fnServiceRequest(
      `${RECEIVER_EMAIL_BASE_URL}/getAllActiveEmail`,
      "GET",
      (response) => resolve(response?.data || []),
      reject
    );
  });

export const addReceiverEmail = (payload, onSuccess, onError) =>
  fnServiceRequest(
    `${RECEIVER_EMAIL_BASE_URL}/addEmail`,
    "POST",
    onSuccess,
    onError,
    payload
  );

export const deleteReceiverEmail = (emailId, onSuccess, onError) =>
  fnServiceRequest(
    `${RECEIVER_EMAIL_BASE_URL}/deleteEmail?emailId=${encodeURIComponent(
      emailId
    )}`,
    "GET",
    onSuccess,
    onError
  );

import fnServiceRequest from "../utility/fnServiceRequest";
import fetchWrapper from "../utility/fetchWrapper";
import { MSG_ORDER_HEADER_ID_REQUIRED, MSG_DATE_IS_REQUIRED } from "../dataStore/strings";

/**
 * Order Service Layer
 */

/**
 * Submit order to SAP
 */
export const submitOrderToSAP = (orderHeaderId, onSuccess, onError) => {
    if (!orderHeaderId) {
        onError(MSG_ORDER_HEADER_ID_REQUIRED);
        return;
    }

    const url = `/JavaServices_Oauth/api/salesOrder/createSalesOrderV1?headerId=${orderHeaderId}`;

    fnServiceRequest(url, "POST", onSuccess, onError, {});
};

/**
 * Cancel an order
 */
export const cancelOrder = (orderHeaderId, onSuccess, onError) => {
    if (!orderHeaderId) {
        onError(MSG_ORDER_HEADER_ID_REQUIRED);
        return;
    }

    const url = `/JavaServices_Oauth/api/salesOrder/cancelOrder?headerId=${orderHeaderId}`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
    };

    return fetchWrapper(url, requestOptions)
        .then((res) => res.text())
        .then((data) => {
            onSuccess(data);
        })
        .catch((error) => {
            onError(error);
        });
};

/**
 * Run simulation for an order
 */
export const runSimulation = (orderHeaderId, onSuccess, onError) => {
    if (!orderHeaderId) {
        onError(MSG_ORDER_HEADER_ID_REQUIRED);
        return;
    }

    const url = `/JavaServices_Oauth/api/salesOrder/simualtion?orderId=${orderHeaderId}`;

    fnServiceRequest(url, "POST", onSuccess, onError);
};

/**
 * Schedule order submission for later
 */
export const scheduleOrderSubmission = (
    orderHeaderId,
    dateString,
    onSuccess,
    onError
) => {
    if (!orderHeaderId) {
        onError(MSG_ORDER_HEADER_ID_REQUIRED);
        return;
    }

    if (!dateString) {
        onError("Date is required");
        return;
    }

    const url = `/JavaServices_Oauth/api/salesOrder/submitLater?orderId=${orderHeaderId}&date=${dateString}`;

    fnServiceRequest(url, "POST", onSuccess, onError);
};

/**
 * Send order for approval
 */
export const sendForApproval = (orderHeaderId, onSuccess, onError, payload = null) => {
    if (!orderHeaderId) {
        onError(MSG_ORDER_HEADER_ID_REQUIRED);
        return;
    }

    const url = `/JavaServices_Oauth/api/salesOrder/sendForApproval?headerId=${orderHeaderId}`;

    fnServiceRequest(url, "POST", onSuccess, onError, payload);
};

/**
 * Reject order approval
 */
export const rejectOrderApproval = (orderHeaderId, onSuccess, onError) => {
    if (!orderHeaderId) {
        onError("Order Header ID is required");
        return;
    }

    const url = `/JavaServices_Oauth/api/salesOrder/rejectPO?headerId=${orderHeaderId}`;

    fnServiceRequest(url, "POST", onSuccess, onError);
};

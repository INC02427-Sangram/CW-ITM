import React from 'react'
import fnServiceRequest from "./fnServiceRequest";

function fnDeleteConcurrentUser(orderHeaderId,userDetails) {
    const sUploadUrl = `/JavaServices_Oauth/api/lock/unlock?orderId=${orderHeaderId}&email=${userDetails?.email}`;

    fnServiceRequest(
      sUploadUrl,
      "DELETE",
      (response) => fnSuccessHandlerdeleteUserInfo(response),
      (error) => fnSuccessHandlerdeleteUserInfo(error)
    );
    function fnSuccessHandlerdeleteUserInfo(response) {}
    function fnSuccessHandlerdeleteUserInfo(error) {}
  
}

export default fnDeleteConcurrentUser;
import React from "react";
import fnServiceRequest from "./fnServiceRequest";
import { setConcurrentUserData } from "../redux/reducers/appReducer";


const fnGetConcurrentUser = (orderId, dispatch) => {

  const sUploadUrl = `/JavaServices_Oauth/api/user/getUserInfo?orderId=${orderId}`;

  fnServiceRequest(
    sUploadUrl,
    "GET",
    (response) => fnSuccessHandlerForGetUserInfo(response, dispatch),
    (error) => fnErrorHandlerForGetUserInfo(error)
  );
  const fnSuccessHandlerForGetUserInfo = (response, dispatch) => {
    dispatch(setConcurrentUserData(response));
  };
  
  const fnErrorHandlerForGetUserInfo = (error) => {};
};

export default fnGetConcurrentUser;

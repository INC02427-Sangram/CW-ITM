import { setUserList } from "../../redux/reducers/appReducer";
import fnServiceRequest from "../fnServiceRequest";

/**
 * Fetches the user list from the API and dispatches it to Redux store
 * @param {Function} dispatch - Redux dispatch function
 */
const fnGetUserList = (dispatch) => {
  const url = `/JavaServices_Oauth/api/caf-iwa/user-roles`;

  fnServiceRequest(
    url,
    "GET",
    (response) => fnSuccessHandler(dispatch, response),
    (error) => fnErrorHandler(error)
  );
};

/**
 * Success handler for user list API response
 */
const fnSuccessHandler = (dispatch, response) => {
  if (Array.isArray(response)) {
    dispatch(setUserList(response));
  } else {
    console.warn("Expected an array of users but got this as response:", response);
    dispatch(setUserList([]));
  }
};

/**
 * Error handler for user list API request
 */
const fnErrorHandler = (error) => {
  console.error("API Error fetching user list:", error);
};

export default fnGetUserList;

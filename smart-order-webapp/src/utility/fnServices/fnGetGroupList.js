import { setGroupList } from "../../redux/reducers/appReducer";
import fnServiceRequest from "../fnServiceRequest";

/**
 * Fetches the group list from the API and dispatches it to Redux store
 */
const fnGetGroupList = (dispatch) => {
  const url = `/JavaServices_Oauth/api/caf-iwa/group-details`;

  fnServiceRequest(
    url,
    "GET",
    (response) => fnSuccessHandler(dispatch, response),
    (error) => fnErrorHandler(error)
  );
};

/**
 * Success handler for group list API response
 */
const fnSuccessHandler = (dispatch, response) => {
  if (Array.isArray(response)) {
    dispatch(setGroupList(response));
  } else {
    console.warn("Expected an array for group list, but got this as response:", response);
    dispatch(setGroupList([]));
  }
};

/**
 * Error handler for group list API request
 */
const fnErrorHandler = (error) => {
  console.error("API Error fetching group list:", error);
};

export default fnGetGroupList;

import fnServiceRequest from "./fnServiceRequest";
import { setAvailableLanguages, setTranslations } from "../redux/reducers/appReducer";
const fnGetAllTranslations = (dispatch) => {  const sUrl = "/JavaServices_Oauth/api/salesOrder/getAllTranslations";
  fnServiceRequest(    sUrl,
    "GET",    (response) => fnSuccessHandler(dispatch, response),
    (error) => fnErrorHandler(error)  );
};
const fnSuccessHandler = (dispatch, response) => {  // Extract available languages from first translation entry
  if (response.data && Object.keys(response.data).length > 0) {    const firstEntry = Object.values(response.data)[0];
    const languages = Object.keys(firstEntry).map(key => {      const [code, name] = key.split('_');
      return {        value: code.toLowerCase(),
        text: name,        language: code
      };    });
        dispatch(setAvailableLanguages(languages));
    dispatch(setTranslations(response.data));  }
};
const fnErrorHandler = (error) => {  console.error("Error fetching translations:", error);
};

export default fnGetAllTranslations;



















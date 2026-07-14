import fetchWrapper from "./fetchWrapper";
const fnServiceRequest = async (url, method, rSuccess, rError, oPayload = null) => {
  let testOptions;
  switch (method) {
    case "POST":
      testOptions = {
        method: "POST",
        body: JSON.stringify(oPayload),
        headers: {},
      };
      break;
    case "UPDATE":
      testOptions = {
        method: "UPDATE",
        body: JSON.stringify(oPayload),
        headers: {},
      };
      break;
    case "PUT":
      testOptions = {
        method: "PUT",
        body: JSON.stringify(oPayload),
        headers: {},
      };
      break;
    case "DELETE":
      testOptions = {
        method: "DELETE",
        body: JSON.stringify(oPayload),
        headers: {},
      };
      break;
    case "GET":
      testOptions = {
        headers: {},
      };
      break;
    default:
      break;
  }
 
    fetchWrapper(url, testOptions)
    .then((res) => {
      // Handle 409 conflict specifically for lock API
      if (res.status === 409) {
        return res.json().then((response) => {
          throw { status: 409, data: response };
        });
      }
      
      // Check if the response is not successful (status not in the range 200-299)
      if (!res.ok) {
        // If the status is 401, handle the unauthorized access case
        if (res.status === 401) {
          throw new Error("Unauthorized access. Status code: 401");
        }

        // You can handle other status codes similarly if needed
        // For example: if (res.status === 403) { ... }
        throw new Error(`Service error. Status code: ${res.status}`);
      }

      if (res.status === 204) {
        rSuccess([]);
        return;
      }
      return res.json();
    })
    .then((response) => {
      rSuccess(response);
    })
    .catch((error) => {
      if (error.status === 409) {
        rError(error); // Pass the full error object with status and data
      } else {
        rError(error.message || error); // Pass the error message to rError
      }
    });
};
 
export default fnServiceRequest;
 
 
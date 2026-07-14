import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import fnGetUserRoles from "../utility/fnServices/fnGetUserRoles";
import fnGetUserList from "../utility/fnServices/fnGetUserList";
import fnGetGroupList from "../utility/fnServices/fnGetGroupList";

/**
 * Custom hook to manage user authentication and authorization
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    // Fetch user roles and handle authorization
    fnGetUserRoles(
      dispatch,
      () => setIsAuthorized(true),  // onSuccess
      () => setIsAuthorized(false)  // onError
    );

    // Fetch user list and group list
    fnGetUserList(dispatch);
    fnGetGroupList(dispatch);
  }, [dispatch]);

  return { isAuthorized };
};

export default useAuth;

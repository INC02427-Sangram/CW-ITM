import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import fnGetAllTranslations from "../utility/fnGetAllTranslations";

/**
 * Custom hook to handle app initialization tasks
 */
const useAppInitialization = () => {
  const dispatch = useDispatch();

  // Fetch translations on app load
  useEffect(() => {
    fnGetAllTranslations(dispatch);
  }, [dispatch]);

};

export default useAppInitialization;

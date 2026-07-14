import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/reducers/appReducer";
import { useDispatch } from "react-redux";

/**
 * Custom hook to manage session idle timeout functionality
 */
const useSessionTimeout = (idleTimeout = 2 * 60 * 60 * 1000) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isIdleWarningVisible, setIsIdleWarningVisible] = useState(false);
  const idleTimerRef = useRef(null);


  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    navigate("/");
    window.location.href = "/do/logout";
  }, [dispatch, navigate]);


  const resetIdleTimer = useCallback(() => {
    setIsIdleWarningVisible(false);

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      setIsIdleWarningVisible(true);
    }, idleTimeout);
  }, [idleTimeout]);


  const handleContinueSession = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  useEffect(() => {
    if (!isIdleWarningVisible) {
      const events = ["mousemove", "keydown", "click", "scroll"];

      events.forEach((event) => window.addEventListener(event, resetIdleTimer));
      resetIdleTimer();

      return () => {
        events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current);
        }
      };
    }
  }, [resetIdleTimer, isIdleWarningVisible]);

  return {
    isIdleWarningVisible,
    handleLogout,
    handleContinueSession,
  };
};

export default useSessionTimeout;

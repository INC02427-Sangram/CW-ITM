import { useSelector } from "react-redux";
import { checkIsCSR } from "../dataStore/userRoles";

export const useUserAccess = () => {
  // Safely grab data from Redux
  const userRoles = useSelector((state) => state.appReducer.userRoles) || [];
  const moduleAccess = useSelector((state) => state.appReducer.moduleAccess) || {};

  // Define your specific role checks centrally
  const isCustomerSalesRep = checkIsCSR(userRoles);
  const isITAdmin = userRoles.includes("IT_Admin");
  const isBusinessAdmin = userRoles.includes("Business_Admin");

  // Create combined flags so you don't have to repeat this logic in components
  const isAdmin = isITAdmin || isBusinessAdmin;

  // Create a dynamic helper function just in case you need to check a new role later
  const hasRole = (roleName) => userRoles.includes(roleName);

  return {
    userRoles,
    moduleAccess,
    isCustomerSalesRep,
    isITAdmin,
    isBusinessAdmin,
    isAdmin, 
    hasRole,
  };
};
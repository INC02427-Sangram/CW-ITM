import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  fetchNotificationTypes,
  fetchEmailNotifications,
  addEmailNotification,
  deleteEmailNotification,
} from "./emailManagementService";
import { validateEmail, isEmailDuplicate } from "./emailManagementValidation";
import { ALERT_MESSAGES, SEARCH_DEBOUNCE_TIME, ALERT_DISPLAY_TIME } from "./emailManagementConfig";
import {
  getCountryCodes,
  getSalesOrgs,
} from "../fnAdminConsoleGetAll";

/**
 * Custom Hook for Email Management State
 */
export const useEmailManagement = () => {
  // Email management state
  const [emailId, setEmailId] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [notificationTypes, setNotificationTypes] = useState([]);

  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState("general");
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Organization details state
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedSalesOrg, setSelectedSalesOrg] = useState("");


  // Organization data
  const [countries, setCountries] = useState([]);
  const [salesOrganizations, setSalesOrganizations] = useState([]);


  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [duplicateEmailAlertOpen, setDuplicateEmailAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceRef = useRef(null);

  // Fetch email notifications on mount
  useEffect(() => {
    loadEmailNotifications();
  }, []);

  // Load organization data
  useEffect(() => {
    getCountryCodes({
      onSuccess: (data) => setCountries(data),
      onError: (error) => console.error("Error fetching countries:", error),
    });
  }, []);

  useEffect(() => {
    if (selectedCountry?.countryId) {
      setSelectedSalesOrg("");
      setSalesOrganizations([]);
      getSalesOrgs({
        countryId: selectedCountry.countryId,
        onSuccess: (data) => setSalesOrganizations(data),
        onError: (error) => console.error("Error fetching sales organizations:", error),
      });
    }
  }, [selectedCountry]);
  
  // Search debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim().toLowerCase());
    }, SEARCH_DEBOUNCE_TIME);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  // Filtered email list
  const filteredEmailList = useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (!term) return emailList || [];

    return (emailList || []).filter((row) => {
      const haystack = [
        row.emailId,
        row.countryName,
        row.salesOrg,
        row.recipientType,
        Array.isArray(row.notificationTypes)
          ? row.notificationTypes
              .map((n) => n.label ?? n.notificationTypeCode ?? "")
              .join(" ")
          : row.notificationTypes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [debouncedSearchTerm, emailList]);

  const loadNotificationTypes = useCallback((countryCode, salesOrg) => {
    fetchNotificationTypes(
      (data) => {
        setNotificationTypes(data);
      },
      (error) => {
        console.error("Error fetching notification types:", error);
      },
      countryCode,
      salesOrg
    );
  }, []); // fetchNotificationTypes is stable; add any captured state here

  useEffect(() => {
    if (selectedCountry?.countryCode && selectedSalesOrg) {
      loadNotificationTypes(selectedCountry.countryCode, selectedSalesOrg);
    }
  }, [selectedCountry, selectedSalesOrg, loadNotificationTypes]);

  // Load email notifications
  const loadEmailNotifications = () => {
    fetchEmailNotifications(
      (data) => setEmailList(data),
      (error) => setEmailList([])
    );
  };

  // Handle email input change
  const handleEmailInputChange = (event) => {
    const value = event.target.value;
    setEmailId(value);
    const validation = validateEmail(value);
    setIsEmailValid(validation.isValid);
    setEmailError(validation.error);
  };

  // Handle notification type change
  const handleNotificationTypeChange = (typeId) => {
    setSelectedNotifications((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    const validation = validateEmail(emailId);
    if (!validation.isValid) return;

    if (selectedNotifications.length === 0) {
      setShowSuccessAlert(false);
      return;
    }

    if (!selectedCountry || !selectedSalesOrg) {
      return;
    }

    if (isEmailDuplicate(emailId, emailList, selectedCountry?.countryCode, selectedSalesOrg)) {
      setAlertMessage(ALERT_MESSAGES.EMAIL_EXISTS);
      setAlertType("warning");
      setDuplicateEmailAlertOpen(true);
      return;
    }

    setIsSubmitting(true);

    const emailData = {
      emailId,
      recipientType: selectedGroup,
      salesOrg: selectedSalesOrg,
      countryCode: selectedCountry?.countryCode,
      orderType: "",
      notificationTypes: selectedNotifications.map((code) => ({
        notificationTypeCode: code,
      })),
    };

    addEmailNotification(
      emailData,
      () => {
        loadEmailNotifications();
        resetForm();
        showAlert(ALERT_MESSAGES.EMAIL_ADDED_SUCCESS, "success");
      },
      (error) => {
        setIsSubmitting(false);
      }
    );
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (emailToDelete !== null) {
      const emailToDeleteData = emailList[emailToDelete];
      const email = emailToDeleteData?.emailId;
      const countryCode = emailToDeleteData?.countryCode;
      const salesOrg = emailToDeleteData?.salesOrg;

      if (!email) {
        console.error("No email ID found to delete.");
        return;
      }

      deleteEmailNotification(
        email,
        countryCode,
        salesOrg,
        () => {
          loadEmailNotifications();
          setDeleteDialogOpen(false);
          setEmailToDelete(null);
          showAlert(ALERT_MESSAGES.EMAIL_DELETED_SUCCESS, "success");
        },
        (error) => {
          console.error("Error deleting email:", error);
        }
      );
    }
  };

  // Handle delete action
  const handleDeleteAction = (compositeId) => {
    // Parse composite ID: emailId_countryCode_salesOrg
    const parts = compositeId.split('_');
    if (parts.length >= 3) {
      const emailId = parts.slice(0, -2).join('_'); // Handle emails with underscores
      const countryCode = parts[parts.length - 2];
      const salesOrg = parts[parts.length - 1];
      
      const emailIndex = emailList.findIndex(
        (email) => email.emailId === emailId && 
                   email.countryCode === countryCode && 
                   email.salesOrg === salesOrg
      );
      
      if (emailIndex !== -1) {
        setEmailToDelete(emailIndex);
        setDeleteDialogOpen(true);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setEmailId("");
    setSelectedNotifications([]);
    setSelectedCountry({});
    setSelectedSalesOrg("");
    setActiveStep(0);
    setIsSubmitting(false);
  };

  // Show alert
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), ALERT_DISPLAY_TIME);
  };

  // Handle group change
  const handleGroupChange = (newGroup) => {
    setSelectedGroup(newGroup);
    setSelectedNotifications([]);
  };

  return {
    // Email state
    emailId,
    emailList,
    isEmailValid,
    emailError,
    filteredEmailList,
    notificationTypes,

    // Form state
    activeStep,
    setActiveStep,
    selectedGroup,
    setSelectedGroup: handleGroupChange,
    selectedNotifications,
    handleNotificationTypeChange,

    // Organization state
    selectedCountry,
    setSelectedCountry,
    selectedSalesOrg,
    setSelectedSalesOrg,
    countries,
    salesOrganizations,

    // UI state
    isSubmitting,
    showSuccessAlert,
    setShowSuccessAlert,
    duplicateEmailAlertOpen,
    setDuplicateEmailAlertOpen,
    alertMessage,
    alertType,
    deleteDialogOpen,
    setDeleteDialogOpen,
    emailToDelete,

    // Search state
    searchTerm,
    setSearchTerm,

    // Actions
    handleEmailInputChange,
    handleSubmit,
    handleDeleteConfirm,
    handleDeleteAction,
    loadEmailNotifications,
    loadNotificationTypes,
  };
};

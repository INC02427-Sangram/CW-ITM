import { useState, useCallback } from "react";
import { DEFAULT_TEMPLATE_FORM } from "../constants/templateConstants";

/**
 * Hook for managing template form state
 */
export const useTemplateForm = (fetchPlaceholderKeys) => {
  const [templateForm, setTemplateForm] = useState(DEFAULT_TEMPLATE_FORM);
  const [isEditing, setIsEditing] = useState(false);

  // Handle form field changes
  const handleFormChange = useCallback((field, value, extra = null) => {
    setTemplateForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "richTextContent" ? { body: value } : {}),
      ...(field === "notificationType"
        ? { notificationTypeObj: extra || null }
        : {}),
    }));

    if (field === "notificationType") {
      fetchPlaceholderKeys(value);
    }
  }, [fetchPlaceholderKeys]);

  // Handle country change
  const handleCountryChange = useCallback((
    selectedName,
    countries,
    fetchSalesOrgList,
    fetchFormNotificationTypes,
    isEditingMode
  ) => {
    const selectedCountry = countries.find((c) => c.countryName === selectedName);
    const countryCode =
      selectedCountry?.countryCode ||
      selectedCountry?.countryId ||
      selectedCountry?.code ||
      "";

    setTemplateForm((prev) => ({
      ...prev,
      country: selectedName,
      countryCode,
      salesOrg: "",
      notificationType: "",
      notificationTypeObj: null,
    }));

    if (selectedCountry?.countryId) {
      fetchSalesOrgList(selectedCountry.countryId);
    }
    
    // Fetch available notification types for the new country
    if (!isEditingMode) {
      fetchFormNotificationTypes(countryCode, "");
    }
  }, []);

  const handleSalesOrgChange = useCallback((
    selectedOrg,
    countryCode,
    fetchFormNotificationTypes,
    isEditingMode
  ) => {
    setTemplateForm((prev) => ({
      ...prev,
      salesOrg: selectedOrg,
      notificationType: "",
      notificationTypeObj: null,
    }));

    if (!isEditingMode) {
      fetchFormNotificationTypes(countryCode, selectedOrg);
    }
  }, []);

  const resetForm = useCallback(() => {
    setTemplateForm(DEFAULT_TEMPLATE_FORM);
    setIsEditing(false);
  }, []);

  const loadTemplateForEdit = useCallback((detailedTemplate) => {
    const bodyContent =
      detailedTemplate.body ||
      detailedTemplate.templateContent ||
      detailedTemplate.emailBody ||
      detailedTemplate.content ||
      "";

    const notificationObj = detailedTemplate.notificationTypeObj
      ? {
        notificationTypeCode: detailedTemplate.notificationTypeObj.notificationTypeCode,
        label: detailedTemplate.notificationTypeObj.label,
        description: detailedTemplate.notificationTypeObj.description,
      }
      : null;

    setTemplateForm({
      subjectName: detailedTemplate.subjectName || "",
      body: bodyContent,
      richTextContent: bodyContent,
      country: detailedTemplate.countryName || detailedTemplate.country || "",
      countryCode: detailedTemplate.countryCode || detailedTemplate.country || "",
      salesOrg: detailedTemplate.salesOrg || "",
      notificationType:
        detailedTemplate.notificationType ||
        detailedTemplate.notificationTypeObj?.notificationTypeCode ||
        "",
      notificationTypeObj: notificationObj,
      templateStatus: detailedTemplate.templateStatus ?? "true",
    });
    setIsEditing(true);
  }, []);

  return {
    templateForm,
    isEditing,
    setIsEditing,
    handleFormChange,
    handleCountryChange,
    handleSalesOrgChange,
    resetForm,
    loadTemplateForEdit,
  };
};

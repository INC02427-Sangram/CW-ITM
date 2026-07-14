import { useState, useCallback } from "react";
import { templateApi } from "../services/templateApiService";

/**
 * Hook for managing template data and CRUD operations
 */
export const useTemplateData = (showToast, buildFilterQS) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDesignerLoading, setIsDesignerLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [notificationTypeOptions, setNotificationTypeOptions] = useState([]);
  const [formNotificationTypes, setFormNotificationTypes] = useState([]);
  const [placeholderKeys, setPlaceholderKeys] = useState([]);

  // Fetch all templates
  const fetchTemplates = useCallback(() => {
    setLoading(true);
    const filterQS = buildFilterQS();
    
    templateApi.getAll(
      filterQS,
      (templateData) => {
        setTemplates(templateData);
        setFilteredTemplates(templateData);
        setLoading(false);
      },
      (error) => {
        showToast("Failed to fetch templates", "error");
        setTemplates([]);
        setFilteredTemplates([]);
        setLoading(false);
      }
    );
  }, [buildFilterQS, showToast]);

  // Fetch template details
  const fetchTemplateDetails = useCallback((templateId, onSuccess) => {
    setIsDesignerLoading(true);
    
    templateApi.getById(
      templateId,
      (response) => {
        onSuccess(response);
        setIsDesignerLoading(false);
      },
      (error) => {
        showToast("Failed to fetch template details", "error");
        setIsDesignerLoading(false);
      }
    );
  }, [showToast]);

  // Create template
  const createTemplate = useCallback((templateData, onSuccess) => {
    templateApi.create(
      templateData,
      (response) => {
        showToast("Template created successfully", "success");
        onSuccess();
      },
      (error) => {
        showToast("Failed to create template", "error");
      }
    );
  }, [showToast]);

  // Update template
  const updateTemplate = useCallback((templateId, templateData, onSuccess) => {
    templateApi.update(
      templateId,
      templateData,
      (response) => {
        showToast("Template updated successfully", "success");
        onSuccess();
      },
      (error) => {
        showToast("Failed to update template", "error");
      }
    );
  }, [showToast]);

  // Delete template
  const deleteTemplate = useCallback((templateId, onSuccess) => {
    templateApi.delete(
      templateId,
      (response) => {
        showToast("Template deleted successfully!", "success");
        onSuccess();
      },
      (error) => {
        showToast("Failed to delete template", "error");
      }
    );
  }, [showToast]);

  // Fetch notification types for filter
  const fetchNotificationTypes = useCallback(() => {
    const filterQS = buildFilterQS();
    
    templateApi.getNotificationTypes(
      filterQS,
      (notificationData) => {
        setNotificationTypeOptions(notificationData);
      },
      (error) => {
        setNotificationTypeOptions([]);
      }
    );
  }, [buildFilterQS]);

  // Fetch notification types for form
  const fetchFormNotificationTypes = useCallback((country, salesOrg) => {
    templateApi.getFormNotificationTypes(
      country,
      salesOrg,
      (notificationData) => {
        setFormNotificationTypes(notificationData);
      },
      (error) => {
        setFormNotificationTypes([]);
        showToast("Failed to fetch notification types for form", "error");
      }
    );
  }, [showToast]);

  // Fetch placeholder keys
  const fetchPlaceholderKeys = useCallback((notificationType) => {
    templateApi.getPlaceholderKeys(
      notificationType,
      (keys) => {
        setPlaceholderKeys(keys);
      },
      (error) => {
        setPlaceholderKeys([]);
        showToast("Failed to fetch placeholder keys for the selected notification type", "error");
      }
    );
  }, [showToast]);

  return {
    templates,
    filteredTemplates,
    loading,
    isDesignerLoading,
    selectedTemplate,
    notificationTypeOptions,
    formNotificationTypes,
    placeholderKeys,
    setTemplates,
    setFilteredTemplates,
    setSelectedTemplate,
    setPlaceholderKeys,
    setFormNotificationTypes,
    fetchTemplates,
    fetchTemplateDetails,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    fetchNotificationTypes,
    fetchFormNotificationTypes,
    fetchPlaceholderKeys,
  };
};

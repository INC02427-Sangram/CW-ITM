import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import CustomMessageToast from "../../../utility/Custom Components/CustomMessageToast";
import CustomDeletePopover from "../../../utility/Custom Components/CustomDeletePopover";
import { getCountryCodes, getSalesOrgs } from "../fnAdminConsoleGetAll";

// Hooks
import { useTemplateData } from "./hooks/useTemplateData";
import { useTemplateForm } from "./hooks/useTemplateForm";
import { useTemplateFilters } from "./hooks/useTemplateFilters";
import { useTemplateConfig } from "./hooks/useTemplateConfig";

// Components
import TemplateListView from "./components/TemplateListView";
import TemplateDesignerView from "./components/TemplateDesignerView";
import PreviewDialog from "./components/PreviewDialog";

const TemplateDesigner = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // View state
  const [view, setView] = useState("list");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessageType, setToastMessageType] = useState("success");
  const [toastMessageDescription, setToastMessageDescription] = useState("");
  const anchorPosition = { vertical: "bottom", horizontal: "center" };

  // Countries and Sales Orgs state
  const [countries, setCountries] = useState([]);
  const [salesOrgOptions, setSalesOrgOptions] = useState([]);

  const showToast = (message, type) => {
    setToastMessageDescription(message);
    setToastMessageType(type);
    setToastOpen(true);
  };

  const filters = useTemplateFilters();

  const {
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
  } = useTemplateData(showToast, filters.buildFilterQS);

  const formHook = useTemplateForm(fetchPlaceholderKeys);
  const { templateConfig, handleTemplateChange } = useTemplateConfig();

  const fetchCountries = () => {
    getCountryCodes({
      onSuccess: (data) => {
        setCountries(data);
      },
      onError: (err) => console.error("Error fetching countries:", err),
      dispatch,
      setBusy: () => {},
    });
  };

  const fetchSalesOrgList = (countryId) => {

    getSalesOrgs({
      countryId,
      onSuccess: (data) => {
        setSalesOrgOptions(data);
      },
      onError: (err) => console.error("Error fetching sales org list:", err),
      dispatch,
      setBusy: () => {},
    });
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {

    fetchTemplates();
    fetchNotificationTypes();
    filters.setNotificationTypeFilter("All");
  }, [filters.filterCountryName, filters.filterSalesOrg]);

  useEffect(() => {
    let tempTemplates = [...templates];

    if (filters.notificationTypeFilter !== "All") {
      tempTemplates = tempTemplates.filter(
        (template) => template.notificationName === filters.notificationTypeFilter
      );
    }

    setFilteredTemplates(tempTemplates);
  }, [templates, filters.notificationTypeFilter, setFilteredTemplates]);

  const getNotificationTypes = () => {
    const uniqueTypes = [
      ...new Map(
        notificationTypeOptions.map((item) => [item.label, item])
      ).values(),
    ];


    return ["All", ...uniqueTypes.map((item) => item.label)];
  };

  const handleCreateNew = () => {
    formHook.resetForm();
    setSalesOrgOptions([]);
    setFormNotificationTypes([]);
    setPlaceholderKeys([]);
    setView("designer");
    fetchFormNotificationTypes("", "");
  };

  const handleEdit = (templateFromList) => {

    fetchTemplateDetails(templateFromList.id, (detailedTemplate) => {

      setSelectedTemplate(detailedTemplate);
      formHook.loadTemplateForEdit(detailedTemplate);
      setView("designer");

      if (detailedTemplate.country) {
        const selectedCountry = countries.find(
          (c) => c.countryName === detailedTemplate.country
        );

        if (selectedCountry?.countryId) {
          fetchSalesOrgList(selectedCountry.countryId);
        }
      }

    const countryCode = detailedTemplate.countryCode || detailedTemplate.country || "";
    const salesOrg = detailedTemplate.salesOrg || "";
    fetchFormNotificationTypes(countryCode, salesOrg);


      const initialNotificationType =
        detailedTemplate.notificationType ||
        detailedTemplate.notificationTypeObj?.notificationTypeCode ||
        "";


      fetchPlaceholderKeys(initialNotificationType);
    });
  };

  const handleSave = () => {
    const selectedNotification =
  formHook.templateForm.notificationTypeObj ||
  formNotificationTypes.find(
    (item) =>
      item.value === formHook.templateForm.notificationType ||
      item.id === formHook.templateForm.notificationType ||
      item.label === formHook.templateForm.notificationType
  ) ||
  (selectedTemplate?.notificationTypeObj
    ? {
        value: selectedTemplate.notificationTypeObj.notificationTypeCode,
        id: selectedTemplate.notificationTypeObj.notificationTypeCode,
        label: selectedTemplate.notificationTypeObj.label,
        description: selectedTemplate.notificationTypeObj.description,
      }
    : null);

    const payload = {
      subjectName: formHook.templateForm.subjectName,
      body: formHook.templateForm.body,
      country: formHook.templateForm.countryCode,
      salesOrg: formHook.templateForm.salesOrg,
      templateStatus: formHook.templateForm.templateStatus ?? "true",
      notificationType: selectedNotification
        ? {
            notificationTypeCode:
              selectedNotification.notificationTypeCode ||
              selectedNotification.value ||
              selectedNotification.id,
            label: selectedNotification.label || "",
            description: selectedNotification.description || "",
          }
        : null,
    };

    const onSuccess = () => {
      fetchTemplates();
      setView("list");
      formHook.resetForm();
      setSalesOrgOptions([]);
      setFormNotificationTypes([]);
      setPlaceholderKeys([]);
      setSelectedTemplate(null);
    };

    if (formHook.isEditing) {
      updateTemplate(selectedTemplate.id, payload, onSuccess);
    } else {
      createTemplate(payload, onSuccess);
    }
  };

  const handleDelete = (template) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {

    if (templateToDelete) {
      deleteTemplate(templateToDelete.id, () => {
        fetchTemplates();
        setDeleteDialogOpen(false);
        setTemplateToDelete(null);
      });
    }
  };

  const handleCountryChange = (event) => {
    const selectedName = event.target.value;

    setSalesOrgOptions([]);
    setFormNotificationTypes([]);
    setPlaceholderKeys([]);

    formHook.handleCountryChange(
      selectedName,
      countries,
      fetchSalesOrgList,
      fetchFormNotificationTypes,
      formHook.isEditing
    );
  };

  const handleSalesOrgChange = (event) => {
    const selectedOrg = event.target.value;


    setFormNotificationTypes([]);
    setPlaceholderKeys([]);

    formHook.handleSalesOrgChange(
      selectedOrg,
      formHook.templateForm.countryCode,
      fetchFormNotificationTypes,
      formHook.isEditing
    );
  };

  const handleFilterCountryChange = (event) => {
  const selectedName = event.target.value;


  setSalesOrgOptions([]);

  filters.handleFilterCountryChange(
    selectedName,
    countries,
    fetchSalesOrgList
  );
};

  const handleFilterSalesOrgChange = (event) => {
    filters.handleFilterSalesOrgChange(event.target.value);
  };

  const handlePreviewClick = () => {
    setSelectedTemplate(null);
    setPreviewOpen(true);
  };

  return (
    <>
      {view === "list" ? (
        <TemplateListView
          loading={loading}
          filteredTemplates={filteredTemplates}
          templates={templates}
          notificationTypeFilter={filters.notificationTypeFilter}
          setNotificationTypeFilter={filters.setNotificationTypeFilter}
          filterCountryName={filters.filterCountryName}
          handleFilterCountryChange={handleFilterCountryChange}
          filterSalesOrg={filters.filterSalesOrg}
          handleFilterSalesOrgChange={handleFilterSalesOrgChange}
          countries={countries}
          salesOrgOptions={salesOrgOptions}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getNotificationTypes={getNotificationTypes}
        />
      ) : (
        <TemplateDesignerView
          isDesignerLoading={isDesignerLoading}
          isEditing={formHook.isEditing}
          templateId={selectedTemplate?.id}
          onBackToList={() => setView("list")}
          templateForm={formHook.templateForm}
          handleFormChange={formHook.handleFormChange}
          countries={countries}
          handleCountryChange={handleCountryChange}
          salesOrgOptions={salesOrgOptions}
          handleSalesOrgChange={handleSalesOrgChange}
          formNotificationTypes={formNotificationTypes}
          placeholderKeys={placeholderKeys}
          templateConfig={templateConfig}
          handleTemplateChange={handleTemplateChange}
          onSave={handleSave}
          onPreviewClick={handlePreviewClick}
        />
      )}

      <PreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        selectedTemplate={
          selectedTemplate || {
            subjectName: formHook.templateForm.subjectName,
            body: formHook.templateForm.body,
            salesOrg: formHook.templateForm.salesOrg,
          }
        }
        templateConfig={templateConfig}
      />

      <CustomDeletePopover
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this template?"
        confirmText="Delete"
        cancelText="Cancel"
        itemName={templateToDelete?.subjectName}
        itemDescription={
          templateToDelete
            ? `Subject: ${templateToDelete.subjectName || "-"} , 
Notification Type: ${templateToDelete.notificationName || "-"}`
            : "This action cannot be undone."
        }
        showItemDetails={true}
      />

      <CustomMessageToast
        open={toastOpen}
        setOpen={setToastOpen}
        messageType={toastMessageType}
        messageDescription={toastMessageDescription}
        anchorPosition={anchorPosition}
      />
    </>
  );
};

export default TemplateDesigner;
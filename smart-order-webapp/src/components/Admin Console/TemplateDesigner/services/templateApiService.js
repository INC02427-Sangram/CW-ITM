import fnServiceRequest from "../../../../utility/fnServiceRequest";

/**
 * Template API Service
 */

const isAll = (v) => v === "All" || v === "" || v == null;

const normalizeTemplate = (item = {}) => ({
  id: item.emailNotifTemplateId ?? item.id ?? null,
  emailNotifTemplateId: item.emailNotifTemplateId ?? item.id ?? null,
  subjectName: item.subjectName ?? "",
  body: item.body ?? "",
  country: item.country ?? "",
  salesOrg: item.salesOrg ?? "",
  templateStatus: item.templateStatus ?? "",
  notificationType:
    item.notificationType?.notificationTypeCode ??
    item.notificationType ??
    "",
  notificationName:
    item.notificationType?.label ??
    item.notificationName ??
    "",
  notificationDescription:
    item.notificationType?.description ??
    item.notificationDescription ??
    "",
  notificationTypeObj:
    typeof item.notificationType === "object" ? item.notificationType : null,
});

const normalizeNotificationType = (item = {}) => ({
  id: item.id ?? item.notificationTypeCode ?? "",
  value: item.id ?? item.notificationTypeCode ?? "",
  label: item.label ?? item.notificationName ?? "",
  description: item.description ?? "",
  allowedGroups: item.allowedGroups ?? [],
});

const buildNotificationTypePayload = (notificationType) => {
  if (!notificationType) return null;

  if (typeof notificationType === "object") {
    return {
      notificationTypeCode:
        notificationType.notificationTypeCode ??
        notificationType.value ??
        notificationType.id ??
        "",
      label: notificationType.label ?? "",
      description: notificationType.description ?? "",
    };
  }

  return {
    notificationTypeCode: notificationType,
    label: "",
    description: "",
  };
};

export const templateApi = {
  /**
   * Fetch all templates with filters
   */
  getAll: (filterQS, onSuccess, onError) => {
    const apiUrl = `/JavaServices_Oauth1/api/sales-order/email-templates/getAll${filterQS}`;
    fnServiceRequest(
      apiUrl,
      "GET",
      (response) => {
        const rawData = Array.isArray(response) ? response : (response.data || []);
        const templateData = rawData.map(normalizeTemplate);
        onSuccess(templateData);
      },
      (error) => {
        console.error("Error fetching templates:", error);
        onError(error);
      }
    );
  },

  /**
   * Fetch template details by ID
   */
  getById: (templateId, onSuccess, onError) => {
    fnServiceRequest(
      `/JavaServices_Oauth1/api/sales-order/email-templates/${templateId}`,
      "GET",
      (response) => {
        const normalized = normalizeTemplate(response?.data || response || {});
        onSuccess(normalized);
      },
      (error) => {
        console.error("Error fetching template details:", error);
        onError(error);
      }
    );
  },

  /**
   * Create new template
   */
  create: (templateData, onSuccess, onError) => {
  fnServiceRequest(
    "/JavaServices_Oauth1/api/sales-order/email-templates/create",
    "POST",
    onSuccess,
    (error) => {
      console.error("Error creating template:", error);
      onError(error);
    },
    templateData
  );
},

  /**
   * Update existing template
   */
  update: (templateId, templateData, onSuccess, onError) => {
  fnServiceRequest(
    `/JavaServices_Oauth1/api/sales-order/email-templates/${templateId}/update`,
    "PUT",
    onSuccess,
    (error) => {
      console.error("Error updating template:", error);
      onError(error);
    },
    {
      emailNotifTemplateId: templateId,
      ...templateData,
    }
  );
},

  /**
   * Delete template
   */
  delete: (templateId, onSuccess, onError) => {
    fnServiceRequest(
      `/JavaServices_Oauth1/api/sales-order/email-templates/delete/${templateId}`,
      "DELETE",
      onSuccess,
      (error) => {
        console.error("Error deleting template:", error);
        onError(error);
      }
    );
  },

  /**
   * Fetch notification types for list filter
   */
  getNotificationTypes: (filterQS, onSuccess, onError) => {
    const apiUrl = `/JavaServices_Oauth1/api/emailNotification/getNotificationType${filterQS}`;
    fnServiceRequest(
      apiUrl,
      "GET",
      (response) => {
        const notificationData = (response.data || []).map(normalizeNotificationType);
        onSuccess(notificationData);
      },
      (error) => {
        console.error("Error fetching notification types:", error);
        onError(error);
      }
    );
  },

  /**
   * Fetch notification types for form based on country and sales org
   */
  getFormNotificationTypes: (country, salesOrg, onSuccess, onError) => {
    const countryParam = isAll(country) ? "All" : encodeURIComponent(country);
    const salesOrgParam = isAll(salesOrg) ? "All" : encodeURIComponent(salesOrg);

    const apiUrl = `/JavaServices_Oauth1/api/sales-order/email-templates/getAvailabeNotificationTypes?country=${countryParam}&salesOrg=${salesOrgParam}`;

    fnServiceRequest(
      apiUrl,
      "GET",
      (response) => {
        const notificationData = (response.data || []).map(normalizeNotificationType);
        onSuccess(notificationData);
      },
      (error) => {
        console.error("Error fetching notification types for form:", error);
        onError(error);
      }
    );
  },

  /**
   * Fetch placeholder keys for notification type
   */
  getPlaceholderKeys: (notificationType, onSuccess, onError) => {
    if (!notificationType) {
      onSuccess([]);
      return;
    }

    const typeCode =
      typeof notificationType === "object"
        ? notificationType.notificationTypeCode || notificationType.value || notificationType.id
        : notificationType;

    const encodedType = encodeURIComponent(typeCode);
    const apiUrl = `/JavaServices_Oauth1/api/sales-order/email-templates/getKeys?notificationType=${encodedType}`;

    fnServiceRequest(
      apiUrl,
      "GET",
      (response) => {
        onSuccess(response.data || []);
      },
      (error) => {
        console.error("Error fetching placeholder keys:", error);
        onError(error);
      }
    );
  },
};

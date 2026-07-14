import appEnv from "../../config/appEnv";

const configData = {
  applicationProperties: {
    taskClassification: "PROCESS",
    APPLICATION_NAME: appEnv.APP_ID,
    CRUD_API_ENV: "itm",
    useGMT: false,
    useEmailForUserPref: false,
    processInboxFilter: ["ADMIN_TASKS", "ADMIN_COMPLETED_TASKS"],
    taskDisplay: {
      taskIdentifier: false,
      taskDescription: true,
      systemChip: true,
      processChip: true,
    },
    taskDeatilsHeader: {
      status: {
        enable: true,
        systemHidden: [{ ECC: "COMPLETED" }],
      },
      dueDate: {
        enable: true,
      },
      createdDate: {
        enable: true,
      },
      processName: {
        enable: true,
      },
      owner: {
        enable: true,
      },
    },
    taskSettings: {
      SYSTEM: {
        DocuSignComponent: [
          "DocuSign",
          "DocuSign_QA",
          "DocuSign_MOBILE",
          "DocuSign_WORKACCESS",
        ],
      },
    },
    substitutionSettings: {
      substitutionDeleteIconForSystem: ["SCP", "ECC"],
      substitutionEnableDisableIconForSystem: [],
    },
    default: {
      allowInAppNotification: false,
      forwardOptions: null,
      primaryActions: "ALL",
      secondaryActions: "ALL",
      tertiaryActions: "ALL",
      allowAttachments: "ALL",
      allowAttachmentsInCreateTask: true,
      isSessionExpiryEnabled: false,
      sessionExpiresIn: 600,
      adminTasksPerPage: 50,
      enableAIBasedCommentGeneration: false,
      enableTaskSwitchInDetail: false,
      isCrudServiceReplaced: false,
      isCustomForwardUserList: false,
      customForwardUserListURL: "/ITMJavaServices/v1/users/fetchUsersForSystemId?systemId={$systemId}",
      customAPIForActions: false,
      enableDetailPageTasksNavigation: true,
      dateTimeFormat: null,
      useRelativedateTime: true,
      actionDisabledForProcess: ["manualjournals"],
      multiSelectDisabledProcesses: [
        "manualjournals",
        "inventory",
        "TS20000166",
      ],
      filterServiceDateKeys: [
        "createdOn",
        "compDeadline",
        "criticalDeadline",
        "updatedOn",
        "completedAt",
        "updatedOnForProcess",
        "completedAtForProcess",
        "createdOnForProcess",
        "Start Date",
        "End Date",
      ],
      filterServiceNameKeys: [
        "createdBy",
        "updatedBy",
        "owners",
      ],
      taskActionsRedirect: true,
    },
    iwaProperties: {
      iwaAppId: "IWA",
      userVersionNo: 1,
      includeRoleDetails: true,
      applicationId: "IWM",
      IWA_API_ENV: appEnv.PLATFORM_ENV,
    },
    attachmentsConfigs: {
      maximumFileNameLength: 255,
      maximumDescriptionLength: 255,
      maxAttachmentSizeInMB: 25,
      allowAttachmentDesc: true,
      defaultAttachmentDecription: "Document",
      allowedMIMETypes: [
        "text/csv",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "application/vnd.oasis.opendocument.presentation",
        "application/vnd.oasis.opendocument.text",
        "image/png",
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/rtf",
        "text/plain",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/xml",
        "text/xml",
        "application/atom+xml",
        "application/xml",
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
      ],
    },
    workspaceHeaderConfigs: {
      searchEnabled: true,
      searchPlaceholder: "Search",
      exportEnabled: true,
      exportButtonText: "Export",
      defaultSortSelectEnabled: true,
      defaultTaskSorterKey: "updatedOn-desc",
      defaultTasksSorterData: {
        DEFAULT: [
          {
            key: "updatedOn-desc",
            label: "Newest First",
          },
          {
            key: "updatedOn-asc",
            label: "Oldest First",
          },
          {
            key: "compDeadline-asc",
            label: "Delayed First",
          },
          {
            key: "compDeadline-desc",
            label: "Delayed Last",
          },
        ],
        DRAFT: [
          {
            key: "createdOn-desc",
            label: "Newest First",
          },
          {
            key: "createdOn-asc",
            label: "Oldest First",
          },
        ],
      },
    },
    workspaceConfigs: {
      searchEnabled: true,
      searchPlaceholder: "Search",
      exportEnabled: true,
      exportButtonText: "Export",
      defaultSortSelectEnabled: true,
      defaultTaskSorterKey: "updatedOn-desc",
      showSystemIcons: true,
      refreshButtonEnabled: true,
      refreshButtonLabel: "Refresh",
      refreshDisabledTime: 60000,
      isDisableSaveButton: false,
    },
    workspaceColumns: [
      {
        width: "8%",
        label: "",
        accessorKey: "selection_pinning",
        isSortable: false,
        sortingParams: [],
        shouldRedirect: false,
        enabled: {
          CREATED_TASKS: true,
          MY_TASKS: true,
          SUBSTITUTED_TO_OTHERS: true,
          MY_COMPLETED_TASKS: false,
          ADMIN_TASKS: true,
          ADMIN_COMPLETED_TASKS: false,
          MY_OUTBOX: false,
          DRAFT: false,
        },
        systemHiddenColumn: [{ ECC: "MY_TASKS" }],
      },
      {
        width: "25%",
        charLimit: 30,
        label: "Task Name",
        accessorKey: "taskName",
        isSortable: false,
        sortingParams: ["referenceId", "taskDesc"],
        shouldRedirect: false,
        enabled: {
          CREATED_TASKS: false,
          MY_TASKS: true,
          SUBSTITUTED_TO_OTHERS: true,
          MY_COMPLETED_TASKS: true,
          ADMIN_TASKS: true,
          ADMIN_COMPLETED_TASKS: true,
          MY_OUTBOX: true,
          DRAFT: false,
        },
      },
      {
        width: "25%",
        charLimit: 25,
        label: "Created By",
        accessorKey: "createdBy",
        isSortable: false,
        sortingParams: ["referenceId", "taskDesc"],
        shouldRedirect: false,
        enabled: {
          CREATED_TASKS: false,
          MY_TASKS: true,
          SUBSTITUTED_TO_OTHERS: true,
          MY_COMPLETED_TASKS: true,
          ADMIN_TASKS: true,
          ADMIN_COMPLETED_TASKS: true,
          MY_OUTBOX: true,
          DRAFT: false,
        },
      },
      {
        width: "15%",
        label: "Process ID",
        accessorKey: "itmProcessId",
        isSortable: false,
        sortingParams: ["itmProcessId"],
        shouldRedirect: false,
        enabled: {
          CREATED_TASKS: true,
          MY_TASKS: false,
          SUBSTITUTED_TO_OTHERS: false,
          MY_COMPLETED_TASKS: false,
          ADMIN_TASKS: false,
          ADMIN_COMPLETED_TASKS: false,
          MY_OUTBOX: false,
          DRAFT: false,
        },
      },
      {
        width: "15%",
        charLimit: 15,
        label: "System & Process",
        accessorKey: "system_process",
        isSortable: true,
        sortingParams: ["processDisplayName"],
        shouldRedirect: false,
        showIcons: true,
        enabled: {
          CREATED_TASKS: true,
          MY_TASKS: true,
          SUBSTITUTED_TO_OTHERS: true,
          MY_COMPLETED_TASKS: true,
          ADMIN_TASKS: true,
          ADMIN_COMPLETED_TASKS: true,
          MY_OUTBOX: true,
          DRAFT: false,
        },
      },
      {
        width: "15%",
        charLimit: 40,
        label: "Process Description",
        accessorKey: "processDesc",
        isSortable: true,
        sortingParams: ["processDesc"],
        shouldRedirect: false,
        showIcons: true,
        enabled: {
          CREATED_TASKS: true,
          MY_TASKS: false,
          SUBSTITUTED_TO_OTHERS: false,
          MY_COMPLETED_TASKS: false,
          ADMIN_TASKS: false,
          ADMIN_COMPLETED_TASKS: false,
          MY_OUTBOX: false,
          DRAFT: false,
        },
      },
      {
        width: "15%",
        label: "System & Process",
        accessorKey: "processDesc",
        isSortable: true,
        sortingParams: ["processDesc"],
        shouldRedirect: false,
        showIcons: true,
        enabled: {
          CREATED_TASKS: false,
          MY_TASKS: false,
          SUBSTITUTED_TO_OTHERS: false,
          MY_COMPLETED_TASKS: false,
          ADMIN_TASKS: false,
          ADMIN_COMPLETED_TASKS: false,
          MY_OUTBOX: false,
          DRAFT: true,
        },
      },
      {
        width: "15%",
        charLimit: 22,
        label: "Created On",
        accessorKey: "createdOn",
        isSortable: true,
        sortingParams: ["createdOn"],
        shouldRedirect: false,
        showIcons: false,
        enabled: {
          CREATED_TASKS: true,
          MY_TASKS: true,
          SUBSTITUTED_TO_OTHERS: false,
          MY_COMPLETED_TASKS: false,
          ADMIN_TASKS: false,
          ADMIN_COMPLETED_TASKS: false,
          MY_OUTBOX: false,
          DRAFT: true,
        },
      },
      {
        width: "20%",
        label: "Assigned To",
        accessorKey: "owners",
        isSortable: true,
        sortingParams: ["owners"],
        shouldRedirect: false,
        enabled: {
          CREATED_TASKS: false,
          MY_TASKS: true,
          SUBSTITUTED_TO_OTHERS: false,
          MY_COMPLETED_TASKS: true,
          ADMIN_TASKS: true,
          ADMIN_COMPLETED_TASKS: true,
          MY_OUTBOX: false,
          DRAFT: false,
        },
      },
      {
        width: "16%",
        charLimit: 22,
        label: "Due Date",
        accessorKey: "dueDate",
        isSortable: true,
        sortingParams: ["compDeadline"],
        shouldRedirect: false,
        enabled: {
          CREATED_TASKS: false,
          MY_TASKS: true,
          SUBSTITUTED_TO_OTHERS: true,
          MY_COMPLETED_TASKS: true,
          ADMIN_TASKS: true,
          ADMIN_COMPLETED_TASKS: true,
          MY_OUTBOX: true,
          DRAFT: false,
        },
      },
      {
        width: "10%",
        label: "Status",
        accessorKey: "status",
        isSortable: true,
        sortingParams: ["itmStatus", "technicalStatus"],
        shouldRedirect: false,
        enabled: {
          CREATED_TASKS: true,
          MY_TASKS: true,
          SUBSTITUTED_TO_OTHERS: true,
          MY_COMPLETED_TASKS: true,
          ADMIN_TASKS: true,
          ADMIN_COMPLETED_TASKS: true,
          MY_OUTBOX: true,
          DRAFT: false,
        },
        systemHiddenColumn: [{ ECC: "MY_TASKS" }, { Flowable: "MY_OUTBOX" }],
      },
      {
        width: "6%",
        label: "Actions",
        accessorKey: "actions",
        isSortable: false,
        sortingParams: [],
        shouldRedirect: false,
        enabled: {
          CREATED_TASKS: false,
          MY_TASKS: true,
          SUBSTITUTED_TO_OTHERS: true,
          MY_COMPLETED_TASKS: false,
          ADMIN_TASKS: true,
          ADMIN_COMPLETED_TASKS: false,
          MY_OUTBOX: false,
          DRAFT: false,
        },
      },
      {
        accessorKey: "attribute_key_1",
        charLimit: 25,
      },
    ],
    workspaceFilterTableConfig: {
      isPopperActionButton: false,
      filterButtonOrientation: "right",
      showAddFilterButton: true,
    },
    exportColumns: {
      ADMIN_TASKS: [
        { header: "SYSTEM NAME", key: "systemName" },
        { header: "PROCESS DISPLAY NAME", key: "processDisplayName" },
        { header: "ID", key: "referenceId" },
        { header: "TASK DESC", key: "taskDesc" },
        { header: "STATUS", key: "itmStatus" },
        { header: "CREATED BY", key: "createdByName" },
        { header: "ASSIGNED TO", key: "assignedTo" },
        { header: "SLA STAUS", key: "taskSla" },
        { header: "ATTACHMENT COUNT", key: "attachmentCount" },
      ],
      ADMIN_COMPLETED_TASKS: [
        { header: "SYSTEM NAME", key: "systemName" },
        { header: "PROCESS DISPLAY NAME", key: "processDisplayName" },
        { header: "ID", key: "referenceId" },
        { header: "TASK DESC", key: "taskDesc" },
        { header: "STATUS", key: "itmStatus" },
        { header: "CREATED BY", key: "createdByName" },
        { header: "ASSIGNED TO", key: "assignedTo" },
        { header: "SLA STAUS", key: "taskSla" },
        { header: "ATTACHMENT COUNT", key: "attachmentCount" },
      ],
      DRAFT: [
        { header: "REFERENCE ID", key: "referenceId" },
        { header: "PROCESS DISPLAY NAME", key: "processDesc" },
        { header: "CREATED ON", key: "createdOn" },
      ],
      CREATED_TASKS: [
        { header: "PROCESS ID", key: "itmProcessId" },
        { header: "SYSTEM & PROCESS", key: "processDisplayName" },
        { header: "PROCESS DESCRIPTION", key: "processDesc" },
        { header: "CREATED ON", key: "createdOn" },
        { header: "STATUS", key: "itmStatus" },
      ],
      DEFAULT: [
        { header: "SYSTEM NAME", key: "systemName" },
        { header: "PROCESS DISPLAY NAME", key: "processDisplayName" },
        { header: "ID", key: "referenceId" },
        { header: "TASK DESC", key: "taskDesc" },
        { header: "STATUS", key: "itmStatus" },
        { header: "CREATED BY", key: "createdByName" },
        { header: "SLA STAUS", key: "taskSla" },
        { header: "ATTACHMENT COUNT", key: "attachmentCount" },
      ],
    },
  },
  taskPermissions: {
    attachments: {
      ADMIN_TASKS: {
        upload: false,
        enabled: true,
      },
      ADMIN_COMPLETED_TASKS: {
        upload: false,
        enabled: true,
      },
      CREATED_TASKS: {
        upload: true,
        enabled: true,
      },
      MY_TASKS: {
        upload: true,
        enabled: true,
      },
      MY_OUTBOX: {
        upload: true,
        enabled: true,
      },
      DRAFT: {
        upload: true,
        enabled: true,
      },
      SUBSTITUTED_TO_OTHERS: {
        upload: false,
        enabled: true,
      },
      MY_FILTERS: {
        upload: true,
        enabled: true,
      },
      MY_COMPLETED_TASKS: {
        upload: false,
        enabled: true,
      },
      DEFAULT: {
        upload: true,
        enabled: true,
      },
    },
    collaboration: {
      ADMIN_TASKS: {
        postComment: false,
        enabled: true,
      },
      ADMIN_COMPLETED_TASKS: {
        postComment: false,
        enabled: true,
      },
      CREATED_TASKS: {
        postComment: true,
        enabled: true,
      },
      MY_TASKS: {
        postComment: true,
        enabled: true,
      },
      MY_OUTBOX: {
        postComment: true,
        enabled: true,
      },
      DRAFT: {
        postComment: true,
        enabled: true,
      },
      SUBSTITUTED_TO_OTHERS: {
        postComment: true,
        enabled: true,
      },
      MY_FILTERS: {
        postComment: true,
        enabled: true,
      },
      MY_COMPLETED_TASKS: {
        postComment: true,
        enabled: true,
      },
    },
    acitivityLogs: {
      ADMIN_TASKS: {
        enabled: true,
      },
      ADMIN_COMPLETED_TASKS: {
        enabled: true,
      },
      CREATED_TASKS: {
        enabled: true,
      },
      MY_TASKS: {
        enabled: true,
      },
      MY_OUTBOX: {
        enabled: true,
      },
      DRAFT: {
        enabled: true,
      },
      SUBSTITUTED_TO_OTHERS: {
        enabled: true,
      },
      MY_FILTERS: {
        enabled: true,
      },
      MY_COMPLETED_TASKS: {
        enabled: true,
      },
    },
    workflow: {
      ADMIN_TASKS: {
        enabled: true,
      },
      ADMIN_COMPLETED_TASKS: {
        enabled: true,
      },
      CREATED_TASKS: {
        enabled: true,
      },
      MY_TASKS: {
        enabled: true,
      },
      MY_OUTBOX: {
        enabled: true,
      },
      DRAFT: {
        enabled: true,
      },
      SUBSTITUTED_TO_OTHERS: {
        enabled: true,
      },
      MY_FILTERS: {
        enabled: true,
      },
      MY_COMPLETED_TASKS: {
        enabled: true,
      },
    },
    taskForms: {
      ADMIN_TASKS: {
        enabled: true,
      },
      ADMIN_COMPLETED_TASKS: {
        enabled: true,
      },
      CREATED_TASKS: {
        enabled: true,
      },
      MY_TASKS: {
        enabled: true,
      },
      MY_OUTBOX: {
        enabled: true,
      },
      DRAFT: {
        enabled: true,
      },
      SUBSTITUTED_TO_OTHERS: {
        enabled: true,
      },
      MY_FILTERS: {
        enabled: true,
      },
      MY_COMPLETED_TASKS: {
        enabled: true,
      },
    },
    primaryActions: {
      ADMIN_TASKS: {
        enabled: false,
      },
      ADMIN_COMPLETED_TASKS: {
        enabled: false,
      },
      CREATED_TASKS: {
        enabled: true,
      },
      MY_TASKS: {
        enabled: true,
      },
      MY_OUTBOX: {
        enabled: true,
      },
      DRAFT: {
        enabled: true,
      },
      SUBSTITUTED_TO_OTHERS: {
        enabled: true,
      },
      MY_FILTERS: {
        enabled: true,
      },
      MY_COMPLETED_TASKS: {
        enabled: false,
      },
    },
    secondaryActions: {
      ADMIN_TASKS: {
        enabled: true,
      },
      ADMIN_COMPLETED_TASKS: {
        enabled: false,
      },
      CREATED_TASKS: {
        enabled: true,
      },
      MY_TASKS: {
        enabled: true,
      },
      MY_OUTBOX: {
        enabled: true,
      },
      DRAFT: {
        enabled: true,
      },
      SUBSTITUTED_TO_OTHERS: {
        enabled: true,
      },
      MY_FILTERS: {
        enabled: true,
      },
      MY_COMPLETED_TASKS: {
        enabled: false,
      },
    },
    tertiaryActions: {
      ADMIN_TASKS: {
        enabled: true,
      },
      ADMIN_COMPLETED_TASKS: {
        enabled: false,
      },
      CREATED_TASKS: {
        enabled: true,
      },
      MY_TASKS: {
        enabled: true,
      },
      MY_OUTBOX: {
        enabled: true,
      },
      DRAFT: {
        enabled: true,
      },
      SUBSTITUTED_TO_OTHERS: {
        enabled: true,
      },
      MY_FILTERS: {
        enabled: true,
      },
      MY_COMPLETED_TASKS: {
        enabled: false,
      },
    },
    multiSelect: {
      MY_TASKS: {
        enabled: true,
        permittedActions: {
          APPROVE: true,
          REJECT: true,
          FORWARD: true,
          CLAIM: true,
          RELEASE: true,
        },
      },
      MY_OUTBOX: {
        enabled: false,
        permittedActions: {
          APPROVE: true,
          REJECT: true,
          FORWARD: true,
          CLAIM: true,
          RELEASE: true,
        },
      },
      DRAFT: {
        enabled: false,
        permittedActions: {
          APPROVE: true,
          REJECT: true,
          FORWARD: true,
          CLAIM: true,
          RELEASE: true,
        },
      },
      ADMIN_TASKS: {
        enabled: true,
        permittedActions: {
          APPROVE: false,
          REJECT: false,
          FORWARD: true,
          CLAIM: true,
          RELEASE: false,
        },
      },
      MY_FILTERS: {
        enabled: false,
        permittedActions: {
          APPROVE: true,
          REJECT: true,
          FORWARD: true,
          CLAIM: true,
          RELEASE: true,
        },
      },
      CREATED_TASKS: {
        enabled: false,
        permittedActions: {
          APPROVE: false,
          REJECT: false,
          FORWARD: false,
          CLAIM: false,
          RELEASE: false,
        },
      },
      SUBSTITUTED_TO_OTHERS: {
        enabled: false,
        permittedActions: {
          APPROVE: true,
          REJECT: true,
          FORWARD: true,
          CLAIM: true,
          RELEASE: true,
        },
      },
    },
    pin: {
      ADMIN_TASKS: {
        enabled: true,
      },
      ADMIN_COMPLETED_TASKS: {
        enabled: false,
      },
      CREATED_TASKS: {
        enabled: true,
      },
      MY_TASKS: {
        enabled: true,
      },
      MY_OUTBOX: {
        enabled: true,
      },
      DRAFT: {
        enabled: true,
      },
      SUBSTITUTED_TO_OTHERS: {
        enabled: true,
      },
      MY_FILTERS: {
        enabled: true,
      },
      MY_COMPLETED_TASKS: {
        enabled: false,
      },
    },
    SLABand: {
      ADMIN_TASKS: {
        enabled: true,
      },
      ADMIN_COMPLETED_TASKS: {
        enabled: false,
      },
      CREATED_TASKS: {
        enabled: true,
      },
      MY_TASKS: {
        enabled: true,
      },
      MY_OUTBOX: {
        enabled: true,
      },
      DRAFT: {
        enabled: true,
      },
      SUBSTITUTED_TO_OTHERS: {
        enabled: true,
      },
      MY_FILTERS: {
        enabled: true,
      },
      MY_COMPLETED_TASKS: {
        enabled: false,
      },
    },
  },
  actionPermission: {
    APPROVE: {
      dialog: true,
      mandatory: true,
    },
    REJECT: {
      dialog: true,
      mandatory: true,
    },
    CLAIM: {
      dialog: false,
      mandatory: true,
    },
    RELEASE: {
      dialog: true,
      mandatory: true,
    },
  },
  btpServerSideEventUrlMap: {
    notificationUrl:
      "https://cherryworkproducts-messaging-dev.cfapps.eu10-004.hana.ondemand.com",
    cachingUrl:
      "https://cherryworkproducts-itm-java-dev.cfapps.eu10.hana.ondemand.com",
    collaborationUrl:
      "https://cherryworkproducts-itm-java-dev.cfapps.eu10.hana.ondemand.com",
  },
};

export default configData;
 
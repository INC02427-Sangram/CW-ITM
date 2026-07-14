const adminConsoleAdminConfiguration = (t) => {
  const AdminConsoleFieldNames = [
    // { tabLabel: t("schedulerSetting") },
    {
      tabLabel: "Reciever Email Address",
    },
    {
      tabLabel: t("manualReview"),
      checkFieldsForManualReview: [
        {
          fieldName: t("manualReview"),
          fieldBinding: "manualReview",
        },
        {
          fieldName: t("salesOrg"),
          fieldBinding: "salesOrg",
        },
      ],
    },
   
    
    {
      tabLabel: "Email Configuration",
    },
  
    {
      tabLabel: "Text Rules",
    },
    {
      tabLabel: "Modelling",
    },
    {
      tabLabel: "System Configuration",
    },
  ];
  const ManualReviewHeader = {
    labelName: t("market"),
    selectedOptions: ["UK", "Greece"],
    buttonLabel: t("addNewMarket"),
  };
  const ActiveMaterialListHeader = {
    labelName: t("market"),
    selectedOptions: ["UK", "Greece"],
    buttonText: [t("downloadTemplate"), t("uploadFile")],
    buttonLabel: t("addNewMarket"),
  };
  const emailSchedulerHeader = {
    labelName: t("market"),
    labelNameForDC: t("distributionChannel"),
    selectedOptions: ["UK", "Greece"],
    selectedOptionsForDC: [
      "WholeSalers",
      "Hospital",
      "Pharmacy",
      "Non-Pharmacy Retail",
    ],
    buttonLabel: t("addNewMarket"),
  };
  const listViewScreenFilters = {
    customerFilter: t("customerId/name"),
    statusFilter: t("Status"),
    exceptionTypeFilter: t("exceptionType"),
    createdFrom: t("Created From"),
    createdTo: t("Created To"),
    poNumber: t("PO Number"),
    requestId: t("Request ID"),
    sapOrderId: t("SAP Order ID"),
    applyFilter: t("applyFilter"),
    clearFilter: t("clearFilter"),
    listHeading: t("SalesOrderList"),
    uploadPo: t("Upload PO"),
    orderType: t("Order Type"),
    salesOrg: t("salesOrganization"),
    salesOffice: t("salesOffice"),
    salesGroup: t("salesGroup"),
    distributionChannel: t("distributionChannel"),
  };
  const manuallyMatchScreen = {
    invalidMaterialTitle: t("invalidMaterialTitle"),
    sapMaterialTitle: t("sapMaterialTitle"),
    matchedMaterialTitle: t("matchedMaterialTitle"),
    match: t("match"),
    unmatch: t("unmatch"),
  };
  const exceptionTypeDropdown = [
    {
      key: "Duplicate PO",
      value: t("duplicatePo"),
    },
    {
      key: "Customer Unavailable",
      value: t("customerUnavailable"),
    },
    {
      key: "Invalid Material",
      value: t("invalidMaterial"),
    },
    {
      key: "Invalid Quantity",
      value: t("Invalid Quantity"),
    },
    {
      key: "Multiple Ship To",
      value: t("Multiple Ship To"),
    },
    {
      key: "Multiple Bill To",
      value: t("Multiple Bill To"),
    },
    {
      key: "Multiple Payer To",
      value: t("Multiple Payer To"),
    },
    {
      key: "Multiple Sold To",
      value: t("Multiple Sold To"),
    },
    {
      key: "Uom Not Found",
      value: t("UOM Not Found"),
    },
  ];
  const orderTypeDropdown = [
    {
      key: "OR",
      value: t("OR"),
    },
    {
      key: "JB",
      value: t("JB"),
    },
    {
      key: "COR",
      value: t("COR"),
    },
    {
      key: "COM",
      value: t("COM"),
    },
    {
      key: "DOM",
      value: t("DOM"),
    },
    {
      key: "AA",
      value: t("AA"),
    },
    {
      key: "COF",
      value: t("COF"),
    },
    
  ];
  const processStatusDropdown = [
    {
      key: "Created",
      value: t("Created"),
    },
    {
      key: "Created With Block",
      value: t("Created With Block"),
    },
    {
      key: "To Be Reviewed",
      value: t("To Be Reviewed"),
    },

    {
      key: "Cancelled",
      value: t("Cancelled"),
    },
    {
      key: "Queued",
      value: t("Queued"),
    },
    { 
      key: "Pending For Approval",
      value: t("Pending For Approval"),
    },
    {
      key: "Rejected",
      value: t("Rejected"),
    }

  ];

  return {
    AdminConsoleFieldNames: AdminConsoleFieldNames,
    ManualReviewHeader: ManualReviewHeader,
    ActiveMaterialListHeader: ActiveMaterialListHeader,
    emailSchedulerHeader: emailSchedulerHeader,
    listViewScreenFilters: listViewScreenFilters,
    manuallyMatchScreen: manuallyMatchScreen,
    exceptionTypeDropdown: exceptionTypeDropdown,
    orderTypeDropdown: orderTypeDropdown,
    processStatusDropdown: processStatusDropdown,
  };
};

export default adminConsoleAdminConfiguration;

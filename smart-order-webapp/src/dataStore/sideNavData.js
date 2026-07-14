const sideNavContents = (t, userRoles, moduleAccess = {}) => {
  console.log(userRoles);
  // Map translated labels to backend keys
  let dummyModuleAccess = {
    ...moduleAccess,
    "Back to Back Trading": true,
    "Purchase Trading": true,
    "Sales Trading": true,
    "Outbound Delivery": true,
    Invoices: true,
  };
  const accessByLabel = {
    [t("dashboard")]: dummyModuleAccess["Dashboard"] === true,
    [t("backToBackTrading")]:
      dummyModuleAccess["Back to Back Trading"] === true,
    [t("purchaseTrading")]: dummyModuleAccess["Purchase Trading"] === true,
    [t("salesTrading")]: dummyModuleAccess["Sales Trading"] === true,
    [t("outboundDelivery")]: dummyModuleAccess["Outbound Delivery"] === true,
    [t("invoices")]: dummyModuleAccess["Invoices"] === true,
    [t("adminConsole")]:
      dummyModuleAccess["Config Cockpit"] === true ||
      dummyModuleAccess["User Management"] === true ||
      dummyModuleAccess["System Config"] === true ||
      dummyModuleAccess["Business Rules"] === true ||
      dummyModuleAccess["Notification Config"] === true ||
      dummyModuleAccess["Manual Review Config"] === true ||
      dummyModuleAccess["Order Block Config"] === true ||
      dummyModuleAccess["Receiver Email Config"] === true ||
      dummyModuleAccess["Feature Config"] === true ||
      dummyModuleAccess["Workspace"] === true ||
      dummyModuleAccess["Workflow Builder"] === true ||
      dummyModuleAccess["DMS Clean Up"] === true ||
      dummyModuleAccess["Sync Up"] === true ||
      dummyModuleAccess["Active Material Config"] === true ||
      dummyModuleAccess["Customer Data Config"] === true,
  };

  return [
    {
      label: t("dashboard"),
      visiblity: accessByLabel[t("dashboard")] === true,
    },
    {
      label: t("backToBackTrading"),
      visiblity: accessByLabel[t("backToBackTrading")] === true,
    },
    {
      label: t("purchaseTrading"),
      visiblity: accessByLabel[t("purchaseTrading")] === true,
    },
    {
      label: t("salesTrading"),
      visiblity: accessByLabel[t("salesTrading")] === true,
    },
    {
      label: t("outboundDelivery"),
      visiblity: accessByLabel[t("outboundDelivery")] === true,
    },
    {
      label: t("invoices"),
      visiblity: accessByLabel[t("invoices")] === true,
    },
    {
      label: t("adminConsole"),
      visiblity: accessByLabel[t("adminConsole")] === true,
    },
  ];
};

const sideNavModuleNames = [
  "Dashboard",
  "Back to Back Trading",
  "Purchase Trading",
  "Sales Trading",
  "Outbound Delivery",
  "Invoices",
  "Config Cockpit",
];

export default sideNavContents;
export { sideNavModuleNames };

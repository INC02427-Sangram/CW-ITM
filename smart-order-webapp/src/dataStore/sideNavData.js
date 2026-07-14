const sideNavContents = (t, userRoles, moduleAccess = {}) => {
  console.log(userRoles);
  // Map translated labels to backend keys
  const accessByLabel = {
    [t("dashboard")]: moduleAccess["Dashboard"] === true,
    [t("salesOrder")]: moduleAccess["Sales Order"] === true,
    [t("documentManagement")]: moduleAccess["Document Management"] === true,
    [t("adminConsole")]:
      moduleAccess["Config Cockpit"] === true ||
      moduleAccess["User Management"] === true ||
      moduleAccess["System Config"] === true ||
      moduleAccess["Business Rules"] === true ||
      moduleAccess["Notification Config"] === true ||
      moduleAccess["Manual Review Config"] === true ||
      moduleAccess["Order Block Config"] === true ||
      moduleAccess["Receiver Email Config"] === true||
      moduleAccess["Feature Config"] === true||
      moduleAccess["Workspace"] === true||
      moduleAccess["Workflow Builder"] === true||
      moduleAccess["DMS Clean Up"] === true ||       
      moduleAccess["Sync Up"] === true ||            
      moduleAccess["Active Material Config"] === true||
      moduleAccess["Customer Data Config"] === true, 
  };

  return [
    {
      label: t("dashboard"),
      visiblity: accessByLabel[t("dashboard")] === true,
    },
    {
      label: t("salesOrder"),
      visiblity: accessByLabel[t("salesOrder")] === true,
    },
    {
      label: t("documentManagement"),
      visiblity: accessByLabel[t("documentManagement")] === true,
    },
    {
      label: t("adminConsole"),
      visiblity: accessByLabel[t("adminConsole")] === true,
    },
  ];
};

const sideNavModuleNames = [
  "Dashboard",
  "Sales Order",
  "Document Management",
  "Config Cockpit",
];

export default sideNavContents;
export { sideNavModuleNames };

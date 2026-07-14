// ColumnWidthConfig.js

// 🔹 Column groups
const LARGE_COLUMNS = [
  "customer",
  "senderEmail",
  "sapMatDescription",
  "poMatDescription",
];

const MEDIUM_COLUMNS = [
  "createdOn",
  "reqDeliveryDate",
  "exceptionType",
];

const SMALL_COLUMNS = [
  "sapItemNumber",
  "poQuantity",
  "sapUom",
  "poTotalAmount",
  "poUnitPrice",
  "poType",
  "status",
];

// 🔹 Helpers
const getMinWidth = (col) => {
  if (["successFlag"].includes(col.type)) return 80;
  else if (["sNo", "icons", "checkBox"].includes(col.type)) return 60;
  else if (["action"].includes(col.type)) return 120;
  else if (["exceptionTypeButton"].includes(col.type)) return 150;
  else if (["exceptionType"].includes(col.type)) return 180;
  else if (["poNumber", "id"].includes(col.type)) return 100;
  else if (["customer", "email", "sapMatDescription", "poMatDescription"].includes(col.type)) return 120;
  else if (col.type === "custom") {
    if (["timezone"].includes(col.fieldBinding)) return 200;
  }
  else if ([
    "createdDate",
    "requestDeliveryDate",
  ].includes(col.fieldBinding)) return 100;
  else if ([
    "exceptionType",
  ].includes(col.fieldBinding)) return 120;
  else if ([
    "poType",
  ].includes(col.fieldBinding)) return 80;
  else if ([
    "poMaterialNumber",
  ].includes(col.fieldBinding)) return 100;
  else if ([
    "sapMaterialNumber",
  ].includes(col.fieldBinding)) return 100;
  else if ([
    "sapItemNumber",
    "poQuantity",
    "sapUom",
    "poTotalAmount",
    "poUnitPrice",
    "status",
    "poUom",
    "netValue",
    "sapUnitPrice",
    "sapQuantity",
    "sapTotalAmount",
  ].includes(col.fieldBinding)) return 80;
  return 150; // fallback
};

const getFlex = (col) => {
  if ([
    "customer",
    "senderEmail",
  ].includes(col.fieldBinding) || col.type === "customer") return 2.5;
  else if (["sapMatDescription"].includes(col.type)) return 2;
  else if (["icons"].includes(col.type)) return 1;
  else if ([
    "poMatDescription",
  ].includes(col.fieldBinding)) return 2;
  else if (["exceptionType"].includes(col.type)) return 2;
  else if ([
    "createdOn",
    "reqDeliveryDate",
    "exceptionType",
  ].includes(col.fieldBinding)) return 1.5;
  else if ([
    "sapItemNumber",
    "poQuantity",
    "sapUom",
    "sapQuantity",
    "poTotalAmount",
    "poType",
    "status",
  ].includes(col.fieldBinding)) return 1;
  else if ([
    "sapMaterialNumber",
  ].includes(col.fieldBinding)) return 1.5;
  else if ([
    "poUnitPrice",
    "poTotalAmount",
    "sapTotalAmount",
  ].includes(col.fieldBinding)) return 1;
  else if (["custom"].includes(col.type)) {
    if (["timezone"].includes(col.fieldBinding)) return 2;
  }
  else if (["adminActions"].includes(col.type)) return 1;
  return 1; // default
};

// 🔥 Main function
export const applyColumnWidthConfig = (colDef, col, t, deletedMode) => {

  // ✅ Responsive setup (MAIN FIX)
  colDef.minWidth = getMinWidth(col);
  colDef.flex = getFlex(col);

  // Optional alignment tweaks
  if (col.type === "status") {
    colDef.align = "left";
    colDef.headerAlign = "left";
  }

  // Deleted mode handling
  if (deletedMode) {
    if (col.type === "edit") {
      colDef.headerName = t("Restore");
    } else if (col.type === "action") {
      colDef.headerName = t("Remarks");
    }
  }

  return colDef;
};
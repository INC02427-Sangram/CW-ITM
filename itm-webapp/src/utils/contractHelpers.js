import { toISODate } from "./dateUtils";

const extractMaterialFromData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.flatMap((row) =>
    Array.isArray(row?.material) ? row.material : [],
  );
};

const buildFormBuilderFromContractData = (contractData) => {
  if (!contractData) return {};

  const [incoCode = "", ...incoLocParts] = String(
    contractData.incoterms || "",
  ).split(" - ");
  const incoLoc = incoLocParts.join(" - ").trim();
  console.log(contractData, ",,,,,,,,,,,,,,");
  return {
    ITM_CTC_PERSON: contractData.personResponsible || "",
    ITM_CTC_DOC_DATE: toISODate(contractData.documentDate) || "",
    ITM_CTC_VAL_FROM: toISODate(contractData.validityPeriod?.split(" to ")[0]) || "",
    ITM_CTC_VAL_TO: toISODate(contractData.validityPeriod?.split(" to ")[1]) || "",
    ITM_CTC_CUST: contractData.customer || "",
    ITM_CTC_SALES_ORG: contractData.salesOrg || "",
    ITM_CTC_DIST_CH: contractData.distChannel || "",
    ITM_CTC_DIVISION: contractData.division || "",
    ITM_CTC_COUNTER_PARTY_REF_NO:
      contractData.counterpartyRefNo || "",
    ITM_CTC_SUPPLIER: contractData.supplier || "",
    ITM_CTC_PURCH_ORG: contractData.purchaseOrg || "",
    ITM_CTC_PURCH_GRP: contractData.purchaseGroup || "",
    ITM_CTC_REF_NO: contractData.counterpartyRefNo || "",
    ITM_CTC_PURCH_CUR: contractData.purchaseValueCurrency || "",
    ITM_CTC_PURCH_INCO: incoCode.trim() || "",
    ITM_CTC_PURCH_INCO_LOC: incoLoc || "",
    ITM_CTC_TERMS_OF_PAY: contractData.paymentTerms || "",
    ITM_CTC_SALES_CUR: contractData.salesValueCurrency || "",
    ITM_CTC_SALES_INCO: incoCode.trim() || "",
    ITM_CTC_SALES_INCO_LOC: incoLoc || "",
    ITM_CTC_TERMS_OF_PAY_SELL: contractData.paymentTerms || "",
    ITM_CTC_TAX_CODE: contractData.taxCode || "",
    ITM_CTC_EXC_RATE_TYPE: contractData.exchangeRateType || "",
    ITM_CTC_EXC_RATE_DATE: toISODate(contractData.exchangeRateDate) || "",
    ITM_CTC_FIXED_EXC_RATE: contractData.fixedExchangeRate || "",
    ITM_CTC_NOTES: contractData.notes || "",
  };
};
export { extractMaterialFromData, buildFormBuilderFromContractData };

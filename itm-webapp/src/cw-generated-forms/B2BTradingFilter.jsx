/**
 * B2BTradingFilter - Generated Form Component
 *
 * Variant field definitions are embedded at code generation time.
 * Lookups (dropdowns) are still fetched at runtime — requestOptions with Authorization header required.
 *
 * SETUP:
 *   npm install @cw/rds react react-dom
 *
 *   .npmrc:
 *     @cw:registry=https://pkgs.dev.azure.com/InctureProducts/_packaging/Workbox/npm/registry/
 *     always-auth=true
 *     //pkgs.dev.azure.com/.../:_authToken=${NPM_TOKEN}
 *
 *   Import RDS theme in your app entry:
 *     import '@cw/rds/dist/index.css';
 *
 *   IMPORTANT: This component uses CSS variables from RDS theme.
 *   Ensure the above CSS is imported to enable proper theming.
 *   Variables used: --primary-main, --primary-light, --grey-300, --text-primary, etc.
 *
 *   Vite proxy (vite.config.js):
 *     server: { proxy: { '/IDMServices': { target: 'https://<your-idm-host>', changeOrigin: true,
 *       rewrite: (p) => p.replace(/^\/IDMServices/, '/idm') } } }
 *
 * USAGE:
 *   <B2BTradingFilter
 *     requestOptions={{ headers: { Authorization: 'Bearer TOKEN' } }}
 *     onSubmit={(data) => console.log(data)}
 *     view="both"  // 'form' | 'list' | 'both' (default: 'both')
 *   />
 *
 *   // Pre-fill fields:
 *   <B2BTradingFilter
 *     initialData={{ FIELD_NAME: 'value' }}
 *     requestOptions={{ headers: { Authorization: 'Bearer TOKEN' } }}
 *   />
 */
import { useState, useEffect, useMemo, useCallback, useRef, memo, forwardRef, useImperativeHandle } from 'react';
import { Grid, Box } from '@cw/rds/layout';
import { TextField, Switch, Autocomplete, FormControlLabel, Button } from '@cw/rds/inputs';
import DatePicker from '@cw/rds/DatePicker';
import { TableContainer, IconButton, Typography } from '@cw/rds/data-display';
import { Pencil, Trash } from '@cw/rds/icons';
import dayjs from 'dayjs';

// ─── Configuration ──────────────────────────────────────────────────────────────
const NUMERIC_TYPES = new Set(['INTEGER', 'DECIMAL', 'BIGINT', 'FLOAT', 'DOUBLE']);
// Fields with length above this threshold render as a multiline textarea
const TEXTAREA_THRESHOLD = 255;
// Handles API variations: 'DATE', 'date', 'Date', 'DATETIME', 'TIMESTAMP', 'DatePicker', etc.
const isDateType = (dataType, controlName) =>
  dataType?.toUpperCase() === 'DATE' ||
  dataType?.toUpperCase() === 'DATETIME' ||
  dataType?.toUpperCase() === 'TIMESTAMP' ||
  !!controlName?.toLowerCase().includes('date');
// Detect ISO date strings so FormField can render DatePicker even if metadata check misses
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}|$)/;

// Sanitize field names for CSS class names (kebab-case, no spaces or special chars)
const sanitizeFieldName = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

// Field definitions embedded at code generation time — no runtime variant API calls needed
const EMBEDDED_VARIANT_DATA = [
  {
    "variantId": "8fd20ff1bbaa4bd8bd19dae21531a501",
    "variantName": "B2B Trading Filter",
    "definitionId": "IWM",
    "data": [
      {
        "variantFieldId": "8b8915834eac4be2aa037f2c3907274b",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "b95179f3-3d76-412a-b2ca-738cf3bed3d2",
        "columnName": "ITM_CTC_CONTRACT_TYPE",
        "label": "Contract Type",
        "description": "Contract Type",
        "maxLength": "50",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_CONTRACT_TYPE",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": true,
          "isVisible": true,
          "isKey": null,
          "sequence": 1,
          "isHeader": null,
          "isLookup": true,
          "isSearchParam": null,
          "lookupType": "VL",
          "lookupId": "13b83e89351346d4895a7892da4e47a7",
          "businessType": "C",
          "isDefaulted": false,
          "defaultValue": null,
          "defaultValueText": null,
          "isDependent": false,
          "operator": null,
          "variableKeySeq": null,
          "isOperatorColumn": null,
          "isVariableKey": null,
          "isGlobalFilterApplied": null,
          "isGlobalFilterEditable": false,
          "isGlobalSortEditable": false,
          "isRuleBasedParam": null,
          "isPricingField": null,
          "isPinned": null,
          "isEditableOnSearch": null,
          "isEditableOnUpdate": null,
          "isEditableOnExport": null,
          "isVisibleOnExport": null,
          "isVisibleOnCustomVariantCreation": null,
          "isMandatoryOnCustomVariantCreation": null,
          "defaultOperator": null,
          "isGlobalSortApplied": null,
          "isAutoFill": false,
          "isLink": null,
          "groupBy": null,
          "groupBySequence": null,
          "is_restricted_mandatory": null,
          "isApproval": null,
          "isAutoSequence": null,
          "columnSign": null,
          "valueType": null,
          "roundingDefinition": null,
          "isSource": null,
          "destinationField": null,
          "colourCode": null,
          "isExclusive": null,
          "exclusiveWith": null,
          "colInfo": null,
          "conditionalRequiredFields": null,
          "isfilterable": null
        },
        "sortDto": null,
        "filterDto": null,
        "shortDescription": null,
        "longDescription": null,
        "odataFieldDescription": null,
        "maxSequenceValue": null,
        "aliasName": "ITM_CTC_CONTRACT_TYPE",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "be6bc5f2262442d9946932d5cbe4b6cd",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "286542fb-b812-4295-ae1e-75a95ae4450a",
        "columnName": "ITM_CTC_CUST",
        "label": "Customer(Sold-To-Party)",
        "description": "Customer(Sold-To-Party)",
        "maxLength": "50",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_CUST",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": false,
          "isVisible": true,
          "isKey": null,
          "sequence": 2,
          "isHeader": null,
          "isLookup": false,
          "isSearchParam": null,
          "lookupType": "",
          "lookupId": "",
          "businessType": "C",
          "isDefaulted": false,
          "defaultValue": null,
          "defaultValueText": null,
          "isDependent": false,
          "operator": null,
          "variableKeySeq": null,
          "isOperatorColumn": null,
          "isVariableKey": null,
          "isGlobalFilterApplied": null,
          "isGlobalFilterEditable": false,
          "isGlobalSortEditable": false,
          "isRuleBasedParam": null,
          "isPricingField": null,
          "isPinned": null,
          "isEditableOnSearch": null,
          "isEditableOnUpdate": null,
          "isEditableOnExport": null,
          "isVisibleOnExport": null,
          "isVisibleOnCustomVariantCreation": null,
          "isMandatoryOnCustomVariantCreation": null,
          "defaultOperator": null,
          "isGlobalSortApplied": null,
          "isAutoFill": false,
          "isLink": null,
          "groupBy": null,
          "groupBySequence": null,
          "is_restricted_mandatory": null,
          "isApproval": null,
          "isAutoSequence": null,
          "columnSign": null,
          "valueType": null,
          "roundingDefinition": null,
          "isSource": null,
          "destinationField": null,
          "colourCode": null,
          "isExclusive": null,
          "exclusiveWith": null,
          "colInfo": null,
          "conditionalRequiredFields": null,
          "isfilterable": null
        },
        "sortDto": null,
        "filterDto": null,
        "shortDescription": null,
        "longDescription": null,
        "odataFieldDescription": null,
        "maxSequenceValue": null,
        "aliasName": "ITM_CTC_CUST",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "e7fa2ef7032045f6b44ea5e914cf7cc9",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "cc1f4575-6d0c-414e-9472-6510e5fdb22f",
        "columnName": "ITM_CTC_SUPPLIER",
        "label": "Supplier Name",
        "description": "Supplier Name",
        "maxLength": "50",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_SUPPLIER",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": false,
          "isVisible": true,
          "isKey": null,
          "sequence": 3,
          "isHeader": null,
          "isLookup": false,
          "isSearchParam": null,
          "lookupType": "",
          "lookupId": "",
          "businessType": "C",
          "isDefaulted": false,
          "defaultValue": null,
          "defaultValueText": null,
          "isDependent": false,
          "operator": null,
          "variableKeySeq": null,
          "isOperatorColumn": null,
          "isVariableKey": null,
          "isGlobalFilterApplied": null,
          "isGlobalFilterEditable": false,
          "isGlobalSortEditable": false,
          "isRuleBasedParam": null,
          "isPricingField": null,
          "isPinned": null,
          "isEditableOnSearch": null,
          "isEditableOnUpdate": null,
          "isEditableOnExport": null,
          "isVisibleOnExport": null,
          "isVisibleOnCustomVariantCreation": null,
          "isMandatoryOnCustomVariantCreation": null,
          "defaultOperator": null,
          "isGlobalSortApplied": null,
          "isAutoFill": false,
          "isLink": null,
          "groupBy": null,
          "groupBySequence": null,
          "is_restricted_mandatory": null,
          "isApproval": null,
          "isAutoSequence": null,
          "columnSign": null,
          "valueType": null,
          "roundingDefinition": null,
          "isSource": null,
          "destinationField": null,
          "colourCode": null,
          "isExclusive": null,
          "exclusiveWith": null,
          "colInfo": null,
          "conditionalRequiredFields": null,
          "isfilterable": null
        },
        "sortDto": null,
        "filterDto": null,
        "shortDescription": null,
        "longDescription": null,
        "odataFieldDescription": null,
        "maxSequenceValue": null,
        "aliasName": "ITM_CTC_SUPPLIER",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "d23b025a183543b3bdf65384f3db61cc",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "cafb1128-e457-498d-8753-31d70301c952",
        "columnName": "ITM_CTC_ID",
        "label": "Trade Contract ID",
        "description": "Trade Contract ID",
        "maxLength": "15",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_ID",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": false,
          "isVisible": true,
          "isKey": null,
          "sequence": 4,
          "isHeader": null,
          "isLookup": false,
          "isSearchParam": null,
          "lookupType": "",
          "lookupId": "",
          "businessType": "C",
          "isDefaulted": false,
          "defaultValue": null,
          "defaultValueText": null,
          "isDependent": false,
          "operator": null,
          "variableKeySeq": null,
          "isOperatorColumn": null,
          "isVariableKey": null,
          "isGlobalFilterApplied": null,
          "isGlobalFilterEditable": false,
          "isGlobalSortEditable": false,
          "isRuleBasedParam": null,
          "isPricingField": null,
          "isPinned": null,
          "isEditableOnSearch": null,
          "isEditableOnUpdate": null,
          "isEditableOnExport": null,
          "isVisibleOnExport": null,
          "isVisibleOnCustomVariantCreation": null,
          "isMandatoryOnCustomVariantCreation": null,
          "defaultOperator": null,
          "isGlobalSortApplied": null,
          "isAutoFill": false,
          "isLink": null,
          "groupBy": null,
          "groupBySequence": null,
          "is_restricted_mandatory": null,
          "isApproval": null,
          "isAutoSequence": null,
          "columnSign": null,
          "valueType": null,
          "roundingDefinition": null,
          "isSource": null,
          "destinationField": null,
          "colourCode": null,
          "isExclusive": null,
          "exclusiveWith": null,
          "colInfo": null,
          "conditionalRequiredFields": null,
          "isfilterable": null
        },
        "sortDto": null,
        "filterDto": null,
        "shortDescription": null,
        "longDescription": null,
        "odataFieldDescription": null,
        "maxSequenceValue": null,
        "aliasName": "ITM_CTC_ID",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "8108b9414a684b548d78bf2f944001a0",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "dd30a684-4cac-4205-b813-938d9933d2e9",
        "columnName": "ITM_CTC_REF_NO",
        "label": "Reference No.",
        "description": "Internal Reference No.",
        "maxLength": "15",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_REF_NO",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": false,
          "isVisible": true,
          "isKey": null,
          "sequence": 5,
          "isHeader": null,
          "isLookup": false,
          "isSearchParam": null,
          "lookupType": "",
          "lookupId": "",
          "businessType": "C",
          "isDefaulted": false,
          "defaultValue": null,
          "defaultValueText": null,
          "isDependent": false,
          "operator": null,
          "variableKeySeq": null,
          "isOperatorColumn": null,
          "isVariableKey": null,
          "isGlobalFilterApplied": null,
          "isGlobalFilterEditable": false,
          "isGlobalSortEditable": false,
          "isRuleBasedParam": null,
          "isPricingField": null,
          "isPinned": null,
          "isEditableOnSearch": null,
          "isEditableOnUpdate": null,
          "isEditableOnExport": null,
          "isVisibleOnExport": null,
          "isVisibleOnCustomVariantCreation": null,
          "isMandatoryOnCustomVariantCreation": null,
          "defaultOperator": null,
          "isGlobalSortApplied": null,
          "isAutoFill": false,
          "isLink": null,
          "groupBy": null,
          "groupBySequence": null,
          "is_restricted_mandatory": null,
          "isApproval": null,
          "isAutoSequence": null,
          "columnSign": null,
          "valueType": null,
          "roundingDefinition": null,
          "isSource": null,
          "destinationField": null,
          "colourCode": null,
          "isExclusive": null,
          "exclusiveWith": null,
          "colInfo": null,
          "conditionalRequiredFields": null,
          "isfilterable": null
        },
        "sortDto": null,
        "filterDto": null,
        "shortDescription": null,
        "longDescription": null,
        "odataFieldDescription": null,
        "maxSequenceValue": null,
        "aliasName": "ITM_CTC_REF_NO",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "1724659f32b84931bea6bb4b42f74788",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "81c75845-ec6d-4173-81d1-a3824ff05e0b",
        "columnName": "ITM_CTC_VAL_FROM",
        "label": "Validity From",
        "description": "Validity From",
        "maxLength": "15",
        "dataType": "DATE",
        "technicalDataType": "DATE",
        "controlName": "Date",
        "fieldName": "ITM_CTC_VAL_FROM",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": false,
          "isVisible": true,
          "isKey": null,
          "sequence": 6,
          "isHeader": null,
          "isLookup": false,
          "isSearchParam": null,
          "lookupType": "",
          "lookupId": "",
          "businessType": "C",
          "isDefaulted": false,
          "defaultValue": null,
          "defaultValueText": null,
          "isDependent": false,
          "operator": null,
          "variableKeySeq": null,
          "isOperatorColumn": null,
          "isVariableKey": null,
          "isGlobalFilterApplied": null,
          "isGlobalFilterEditable": false,
          "isGlobalSortEditable": false,
          "isRuleBasedParam": null,
          "isPricingField": null,
          "isPinned": null,
          "isEditableOnSearch": null,
          "isEditableOnUpdate": null,
          "isEditableOnExport": null,
          "isVisibleOnExport": null,
          "isVisibleOnCustomVariantCreation": null,
          "isMandatoryOnCustomVariantCreation": null,
          "defaultOperator": null,
          "isGlobalSortApplied": null,
          "isAutoFill": false,
          "isLink": null,
          "groupBy": null,
          "groupBySequence": null,
          "is_restricted_mandatory": null,
          "isApproval": null,
          "isAutoSequence": null,
          "columnSign": null,
          "valueType": null,
          "roundingDefinition": null,
          "isSource": null,
          "destinationField": null,
          "colourCode": null,
          "isExclusive": null,
          "exclusiveWith": null,
          "colInfo": null,
          "conditionalRequiredFields": null,
          "isfilterable": null
        },
        "sortDto": null,
        "filterDto": null,
        "shortDescription": null,
        "longDescription": null,
        "odataFieldDescription": null,
        "maxSequenceValue": null,
        "aliasName": "ITM_CTC_VAL_FROM",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "906d17ded98346b59d201f7cf27314d8",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "b34551dc-5d3f-405f-bd24-92e06f802446",
        "columnName": "ITM_CTC_VAL_TO",
        "label": "Validity To",
        "description": "Validity To",
        "maxLength": "15",
        "dataType": "DATE",
        "technicalDataType": "DATE",
        "controlName": "Date",
        "fieldName": "ITM_CTC_VAL_TO",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": false,
          "isVisible": true,
          "isKey": null,
          "sequence": 7,
          "isHeader": null,
          "isLookup": false,
          "isSearchParam": null,
          "lookupType": "",
          "lookupId": "",
          "businessType": "C",
          "isDefaulted": false,
          "defaultValue": null,
          "defaultValueText": null,
          "isDependent": false,
          "operator": null,
          "variableKeySeq": null,
          "isOperatorColumn": null,
          "isVariableKey": null,
          "isGlobalFilterApplied": null,
          "isGlobalFilterEditable": false,
          "isGlobalSortEditable": false,
          "isRuleBasedParam": null,
          "isPricingField": null,
          "isPinned": null,
          "isEditableOnSearch": null,
          "isEditableOnUpdate": null,
          "isEditableOnExport": null,
          "isVisibleOnExport": null,
          "isVisibleOnCustomVariantCreation": null,
          "isMandatoryOnCustomVariantCreation": null,
          "defaultOperator": null,
          "isGlobalSortApplied": null,
          "isAutoFill": false,
          "isLink": null,
          "groupBy": null,
          "groupBySequence": null,
          "is_restricted_mandatory": null,
          "isApproval": null,
          "isAutoSequence": null,
          "columnSign": null,
          "valueType": null,
          "roundingDefinition": null,
          "isSource": null,
          "destinationField": null,
          "colourCode": null,
          "isExclusive": null,
          "exclusiveWith": null,
          "colInfo": null,
          "conditionalRequiredFields": null,
          "isfilterable": null
        },
        "sortDto": null,
        "filterDto": null,
        "shortDescription": null,
        "longDescription": null,
        "odataFieldDescription": null,
        "maxSequenceValue": null,
        "aliasName": "ITM_CTC_VAL_TO",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "bc77e899623647a190a8809f88ec92d6",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "fb585ebc-9365-4aa8-b109-b38271bbc1af",
        "columnName": "ITM_TRADING_STATUS",
        "label": "Trading Contract Status",
        "description": "Trading Contract Status",
        "maxLength": "20",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_TRADING_STATUS",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": false,
          "isVisible": true,
          "isKey": null,
          "sequence": 8,
          "isHeader": null,
          "isLookup": true,
          "isSearchParam": null,
          "lookupType": "",
          "lookupId": "",
          "businessType": "C",
          "isDefaulted": false,
          "defaultValue": null,
          "defaultValueText": null,
          "isDependent": false,
          "operator": null,
          "variableKeySeq": null,
          "isOperatorColumn": null,
          "isVariableKey": null,
          "isGlobalFilterApplied": null,
          "isGlobalFilterEditable": false,
          "isGlobalSortEditable": false,
          "isRuleBasedParam": null,
          "isPricingField": null,
          "isPinned": null,
          "isEditableOnSearch": null,
          "isEditableOnUpdate": null,
          "isEditableOnExport": null,
          "isVisibleOnExport": null,
          "isVisibleOnCustomVariantCreation": null,
          "isMandatoryOnCustomVariantCreation": null,
          "defaultOperator": null,
          "isGlobalSortApplied": null,
          "isAutoFill": false,
          "isLink": null,
          "groupBy": null,
          "groupBySequence": null,
          "is_restricted_mandatory": null,
          "isApproval": null,
          "isAutoSequence": null,
          "columnSign": null,
          "valueType": null,
          "roundingDefinition": null,
          "isSource": null,
          "destinationField": null,
          "colourCode": null,
          "isExclusive": null,
          "exclusiveWith": null,
          "colInfo": null,
          "conditionalRequiredFields": null,
          "isfilterable": null
        },
        "sortDto": null,
        "filterDto": null,
        "shortDescription": null,
        "longDescription": null,
        "odataFieldDescription": null,
        "maxSequenceValue": null,
        "aliasName": "ITM_TRADING_STATUS",
        "lookupRepresentation": null
      }
    ]
  }
];

// ─── Styles ─────────────────────────────────────────────────────────────────────
const headerSx = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 };
const footerSx = { display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' };
const headingStyle = { margin: 0 };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { 
  textAlign: 'left', 
  padding: '0.75rem 1rem', 
  borderBottom: '2px solid var(--grey-300)', 
  backgroundColor: 'var(--primary-light)',
  fontWeight: 600,
  position: 'sticky',
  top: 0,
  zIndex: 10
};
const thActionStyle = { ...thStyle, textAlign: 'center' };
const tdStyle = { padding: '0.625rem 1rem', borderBottom: '1px solid var(--grey-300)' };
const tdActionStyle = { ...tdStyle, textAlign: 'center' };
const actionButtonsSx = { display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center' };
// ─── ListView Component ──────────────────────────────────────────────────────────
export const ListView = ({ data = [], columns = [], onEdit, onDelete, onRowClick, formatValue, selectable = false, onSelectionChange }) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  
  // Normalize data: handle both array and submit data format { fields: {...} }
  const normalizedData = useMemo(() => {
    if (!data) return [];
    if (data.fields && typeof data.fields === 'object' && !Array.isArray(data.fields)) return [data];
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);
  
  // Auto-generate columns from first data entry if not provided
  const effectiveColumns = useMemo(() => {
    if (columns && columns.length > 0) return columns;
    if (normalizedData.length === 0) return [];
    const firstEntry = normalizedData[0];
    // Detect submit data format (has fields property with field objects)
    if (firstEntry.fields && typeof firstEntry.fields === 'object') {
      const autoColumns = [];
      Object.keys(firstEntry.fields).forEach((fieldName) => {
        const field = firstEntry.fields[fieldName];
        autoColumns.push({ fieldName: fieldName, label: field.label || fieldName, key: fieldName });
      });
      return autoColumns;
    }
    // For regular array data, auto-generate columns from object keys
    const autoColumns = [];
    Object.keys(firstEntry).forEach((key) => {
      if (['variantFieldId', 'columnId', 'columnName', 'variantId', 'variantName', 'definitionId', 'fields', '_id', 'id'].includes(key)) return;
      autoColumns.push({ fieldName: key, label: firstEntry[key]?.label || key, key: key });
    });
    return autoColumns;
  }, [columns, normalizedData]);
  
  const hasActions = onEdit || onDelete;
  const hasCheckbox = selectable;
  const columnCount = (hasCheckbox ? 1 : 0) + effectiveColumns.length + (hasActions ? 1 : 0);
  
  const handleSelectAll = useCallback((e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(normalizedData.map((_, idx) => idx)));
      if (onSelectionChange) onSelectionChange(normalizedData.map((_, idx) => idx));
    } else {
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    }
  }, [normalizedData, onSelectionChange]);
  
  const handleSelectRow = useCallback((index, checked) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (checked) next.add(index); else next.delete(index);
      if (onSelectionChange) onSelectionChange(Array.from(next));
      return next;
    });
  }, [onSelectionChange]);

  return (
    <TableContainer sx={{ mt: 0,borderRadius: 2 }} className="dynamic-form-table-container">
      <table id="dynamic-form-list-view" className="dynamic-form-table" style={tableStyle}>
        <thead className="dynamic-form-table-header">
          <tr>
            {hasCheckbox && (
              <th style={{ ...thStyle, width: '50px', textAlign: 'center' }} data-column-name="checkbox">
                <input type="checkbox" checked={normalizedData.length > 0 && selectedRows.size === normalizedData.length} onChange={handleSelectAll} style={{ cursor: 'pointer' }} />
              </th>
            )}
            {effectiveColumns.map((col) => {
              const fieldName = col.fieldName || col.key;
              const sanitizedName = sanitizeFieldName(fieldName);
              return <th key={fieldName} style={thStyle} data-column-name={sanitizedName}>{col.label || col.name}</th>;
            })}
            {hasActions && <th style={thActionStyle} data-column-name="actions">Actions</th>}
          </tr>
        </thead>
        <tbody className="dynamic-form-table-body">
          {(!normalizedData || normalizedData.length === 0) ? (
            <tr><td colSpan={columnCount} style={{ ...tdStyle, textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No records yet</td></tr>
          ) : (
            normalizedData.map((entry, index) => {
              const entryId = entry._id || entry.id || entry.variantId || index;
              const isSelected = selectedRows.has(index);
              return (
                <tr key={entryId} onClick={() => onRowClick && onRowClick(entry, index)} style={{ cursor: onRowClick ? 'pointer' : 'default', backgroundColor: isSelected ? 'var(--primary-light, #e3f2fd)' : 'transparent' }} data-row-index={index} data-entry-id={entryId} data-selected={isSelected}>
                  {hasCheckbox && (
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <input type="checkbox" checked={isSelected} onChange={(e) => { e.stopPropagation(); handleSelectRow(index, e.target.checked); }} onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer' }} />
                    </td>
                  )}
                  {effectiveColumns.map((col) => {
                    const fieldName = col.fieldName || col.key;
                    const sanitizedName = sanitizeFieldName(fieldName);
                    let value, displayValue;
                    if (entry.fields && typeof entry.fields === 'object') {
                      value = entry.fields[fieldName];
                      displayValue = (value && typeof value === 'object' && !Array.isArray(value)) ? (value.value ?? value.key ?? value) : value;
                    } else {
                      value = entry[fieldName];
                      displayValue = (value && typeof value === 'object' && !Array.isArray(value)) ? (value.value ?? value.key ?? value) : value;
                    }
                    if (formatValue) displayValue = formatValue(col, displayValue);
                    const dataValueString = typeof displayValue === 'object' && displayValue !== null && displayValue.$$typeof ? (value?.value ?? value?.key ?? value ?? '') : (displayValue !== null && displayValue !== undefined ? String(displayValue) : '');
                    return <td key={fieldName} style={tdStyle} data-field-name={sanitizedName} data-value={dataValueString}>{displayValue !== null && displayValue !== undefined ? displayValue : ''}</td>;
                  })}
                  {(onEdit || onDelete) && (
                    <td style={tdActionStyle}>
                      <Box sx={actionButtonsSx}>
                        {onEdit && <IconButton onClick={(e) => { e.stopPropagation(); onEdit(index); }} size='small' title='Edit'><Pencil /></IconButton>}
                        {onDelete && <IconButton onClick={(e) => { e.stopPropagation(); onDelete(index); }} size='small' title='Delete' color='error'><Trash /></IconButton>}
                      </Box>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </TableContainer>
  );
};
// ─── API Helpers ────────────────────────────────────────────────────────────────
const apiFetch = async (url, headers) => {
  const res = await fetch(url, { method: 'GET', headers });
  return res.json();
};

const fetchLookupMeta = (lookupId, headers, baseUrl = '') =>
  apiFetch(`${baseUrl}/IDMServices/v1/lapi?lookupId=${encodeURIComponent(lookupId)}`, headers);

const fetchLookupData = (lookupId, constraintParams, headers, baseUrl = '') => {
  const qs = new URLSearchParams({ lookupId });
  if (constraintParams) {
    Object.entries(constraintParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    });
  }
  return apiFetch(`${baseUrl}/IDMServices/v1/lapi/data?${qs}`, headers);
};

// ─── Lookup Hook ────────────────────────────────────────────────────────────────
const useLookups = (fields, headers, baseUrl, readOnly = false) => {
  const [lookupOptions, setLookupOptions] = useState({});
  const lookupMetaRef = useRef({});
  const initialised = useRef(new Set());

  const fieldsByColumn = useMemo(() => {
    const m = {};
    fields.forEach((f) => { m[f.columnName] = f; });
    return m;
  }, [fields]);

  // Initial load: fetch meta + unconstrained data for every lookup field
  useEffect(() => {
    if (readOnly || !headers || fields.length === 0) return;
    fields.forEach(async (field) => {
      const { propertyDto, fieldName } = field;
      if (!propertyDto?.isLookup || !propertyDto?.lookupId) return;
      if (initialised.current.has(fieldName)) return;
      initialised.current.add(fieldName);
      try {
        const metaRes = await fetchLookupMeta(propertyDto.lookupId, headers, baseUrl);
        const meta = metaRes?.data;
        if (!meta) return;
        lookupMetaRef.current = { ...lookupMetaRef.current, [fieldName]: meta };
        const constraints = meta.staticValueHelpMetadata?.constraints;
        if (!constraints || constraints.length === 0) {
          const dataRes = await fetchLookupData(propertyDto.lookupId, null, headers, baseUrl);
          setLookupOptions((prev) => ({ ...prev, [fieldName]: dataRes?.data?.values || [] }));
        }
      } catch (err) {
        console.error(`[Lookup] meta error for ${fieldName}:`, err);
      }
    });
  }, [fields, headers, baseUrl]);

  const onDropdownChange = useCallback(async (changedFieldName, selectedValue) => {
    const meta = lookupMetaRef.current[changedFieldName];
    if (!meta) return;
    const dependentFieldNames = meta.staticValueHelpMetadata?.dependentFields || [];
    if (dependentFieldNames.length === 0) return;
    const constraintValue = selectedValue?.key ?? selectedValue?.value ?? selectedValue;
    for (const depColumnName of dependentFieldNames) {
      const depField = fieldsByColumn[depColumnName];
      if (!depField?.propertyDto?.isLookup || !depField.propertyDto?.lookupId) continue;
      try {
        let depMeta = lookupMetaRef.current[depField.fieldName];
        if (!depMeta) {
          const metaRes = await fetchLookupMeta(depField.propertyDto.lookupId, headers, baseUrl);
          depMeta = metaRes?.data;
          if (depMeta) lookupMetaRef.current = { ...lookupMetaRef.current, [depField.fieldName]: depMeta };
        }
        const constraints = depMeta?.staticValueHelpMetadata?.constraints;
        const constraintParams = {};
        (constraints || []).forEach((c) => { constraintParams[c.mappedName] = constraintValue; });
        const dataRes = await fetchLookupData(depField.propertyDto.lookupId, constraints?.length ? constraintParams : null, headers, baseUrl);
        setLookupOptions((prev) => ({ ...prev, [depField.fieldName]: dataRes?.data?.values || [] }));
      } catch (err) {
        console.error(`[Lookup] dependent error for ${depField.fieldName}:`, err);
      }
    }
  }, [fieldsByColumn, headers, baseUrl]);

  return { lookupOptions, onDropdownChange, lookupMetaRef };
};

// ─── Form Field ───────────────────────────────────────────────────────────
const EMPTY_ARR = [];
const FormField = memo(({ field, value, onChange, options, error, readOnly }) => {
  const { controlName, dataType, label, fieldName, maxLength, propertyDto } = field;
  const { isMandatory, isEditable, isVisible, isLookup, isMultiSelect } = propertyDto || {};
  const sanitizedFieldName = sanitizeFieldName(fieldName);
  if (!isVisible) return null;

  if (dataType === 'BOOLEAN') {
    return (
      <FormControlLabel
        control={<Switch checked={!!value} onChange={(e) => onChange(fieldName, e.target.checked)} disabled={!isEditable || readOnly} inputProps={{ id: `field-${sanitizedFieldName}`, className: `dynamic-form-field field-${sanitizedFieldName}`, 'data-value': value ? 'true' : 'false' }} />}
        label={label}
        componentsProps={{ typography: { id: `label-${sanitizedFieldName}`, className: `dynamic-form-label label-${sanitizedFieldName}`, 'data-value': label } }}
      />
    );
  }

  if (isLookup) {
    const selectedObj = (() => {
      if (value && typeof value === 'object') return value;
      if (typeof value === 'string' && value) {
        const found = options.find((o) => o.value === value || o.key === value);
        if (found) return found;
        if (readOnly) return { key: value, value: value };
      }
      return null;
    })();
    return (
      <Autocomplete
        options={options}
        getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt?.value ?? '')}
        isOptionEqualToValue={(opt, val) => {
          if (!opt || !val) return false;
          return typeof val === 'string' ? (opt.value === val || opt.key === val) : opt.key === val.key;
        }}
        value={selectedObj}
        onChange={(_, newVal) => onChange(fieldName, newVal)}
        disabled={!isEditable || readOnly}
        multiple={!!isMultiSelect}
        renderInput={(params) => {
          const selectedKey = selectedObj?.key || '';
          return (
            <TextField {...params} label={label} required={!!isMandatory} error={!!error} helperText={error} size='medium' fullWidth name={fieldName} InputLabelProps={{ sx: { textAlign: 'left' }, id: `label-${sanitizedFieldName}`, className: `dynamic-form-label label-${sanitizedFieldName}`, 'data-value': label }} inputProps={{ ...params.inputProps, id: `field-${sanitizedFieldName}`, className: `dynamic-form-field field-${sanitizedFieldName}`, 'data-value': selectedKey }} />
          );
        }}
      />
    );
  }

  // isDateType: case-insensitive check; dayjs.isDayjs catches already-converted values;
  // ISO_DATE_RE catches raw ISO strings when metadata is missing/unexpected
  const looksLikeDate = isDateType(dataType, controlName) || dayjs.isDayjs(value) || (typeof value === 'string' && ISO_DATE_RE.test(value));
  if (looksLikeDate) {
    const dateValue = dayjs.isDayjs(value) ? value : (value ? dayjs(value) : null);
    return (
      <DatePicker
        key={fieldName} label={label} required={!!isMandatory} error={!!error} helperText={error || ''}
        value={dateValue} onChange={(v) => onChange(fieldName, v)} disabled={!isEditable || readOnly}
        slotProps={{ textField: { size: 'medium', fullWidth: true, name: fieldName, InputLabelProps: { sx: { textAlign: 'left' }, id: `label-${sanitizedFieldName}`, className: `dynamic-form-label label-${sanitizedFieldName}`, 'data-value': label }, inputProps: { id: `field-${sanitizedFieldName}`, className: `dynamic-form-field field-${sanitizedFieldName}`, 'data-value': dateValue ? dateValue.format('YYYY-MM-DD') : '' } } }}
      />
    );
  }

  const currentValue = value ?? '';
  return (
    <TextField
      label={label} value={currentValue}
      onChange={(e) => { const v = e.target.value; if (NUMERIC_TYPES.has(dataType) && maxLength && v.length > Number(maxLength)) return; onChange(fieldName, v); }}
      required={!!isMandatory} disabled={!isEditable || readOnly} type={NUMERIC_TYPES.has(dataType) ? 'number' : 'text'}
      inputProps={{ id: `field-${sanitizedFieldName}`, className: `dynamic-form-field field-${sanitizedFieldName}`, maxLength: maxLength ? Number(maxLength) : undefined, 'data-value': currentValue }}
      InputLabelProps={{ sx: { textAlign: 'left' }, id: `label-${sanitizedFieldName}`, className: `dynamic-form-label label-${sanitizedFieldName}`, 'data-value': label }}
      multiline={!NUMERIC_TYPES.has(dataType) && !!maxLength && Number(maxLength) > TEXTAREA_THRESHOLD}
      rows={!NUMERIC_TYPES.has(dataType) && !!maxLength && Number(maxLength) > TEXTAREA_THRESHOLD ? 4 : undefined}
      error={!!error} helperText={error} size='medium' fullWidth name={fieldName}
    />
  );
});

// ─── Main Component ──────────────────────────────────────────────────────────────
const B2BTradingFilter = forwardRef(({ variantData: externalVariantData, initialData, requestOptions, onSubmit, onReset, columns = 2, title, showHeader = true, showFooter = true, readOnly = false }, ref) => {
  const headers = requestOptions?.headers;
  const baseUrl = requestOptions?.baseUrl || '';
  // Normalize initialData: handle both raw fields object and submit data format
  const normalizedInitialData = useMemo(() => {
    if (!initialData) return null;
    // If initialData has a 'fields' property (submit format), extract fields
    if (initialData.fields && typeof initialData.fields === 'object' && !Array.isArray(initialData.fields)) {
      return initialData.fields;
    }
    // Otherwise use initialData as-is
    return initialData;
  }, [initialData]);
  // Variant data is embedded — initialize immediately, no runtime fetch needed
  const [variantData, setVariantData] = useState(() =>
    externalVariantData ?? (EMBEDDED_VARIANT_DATA.length === 1 ? EMBEDDED_VARIANT_DATA[0] : EMBEDDED_VARIANT_DATA)
  );

  // Support externalVariantData prop override at runtime
  useEffect(() => {
    if (externalVariantData) setVariantData(externalVariantData);
  }, [externalVariantData]);

  const fields = useMemo(() => {
    if (!variantData) return [];
    let raw = [];
    if (Array.isArray(variantData)) {
      variantData.forEach((variant, vi) => (variant?.data || []).forEach((f) => raw.push({ ...f, _vi: vi })));
    } else {
      raw = variantData?.data || [];
    }
    return [...raw]
      .filter((f) => f.propertyDto?.isVisible !== false)
      .sort((a, b) => ((a._vi ?? 0) - (b._vi ?? 0)) || ((a.propertyDto?.sequence ?? 0) - (b.propertyDto?.sequence ?? 0)));
  }, [variantData]);

  const fieldsByName = useMemo(() => {
    const m = {};
    fields.forEach((f) => { m[f.fieldName] = f; });
    return m;
  }, [fields]);

  const { lookupOptions, onDropdownChange, lookupMetaRef } = useLookups(fields, headers, baseUrl, readOnly);
  const onDropdownChangeRef = useRef(onDropdownChange);
  useEffect(() => { onDropdownChangeRef.current = onDropdownChange; }, [onDropdownChange]);

  // Pre-populate from initialData so DatePicker receives the correct value on the very first render
  const [formValues, setFormValues] = useState(() => {
    if (!normalizedInitialData) return {};
    const init = {};
    Object.entries(normalizedInitialData).forEach(([k, v]) => {
      if (typeof v === 'string' && v && ISO_DATE_RE.test(v)) v = dayjs(v);
      init[k] = v;
    });
    return init;
  });
  const [validationErrors, setValidationErrors] = useState({});
  const processedInitialDataRef = useRef(false);
  const isAutoFillingRef = useRef(false);

  // Initialise form values once fields are loaded
  useEffect(() => {
    if (fields.length === 0) return;
    setFormValues(() => {
      const init = {};
      fields.forEach((f) => {
        if (normalizedInitialData && f.fieldName in normalizedInitialData) {
          let v = normalizedInitialData[f.fieldName];
          // Handle submit data format with metadata (extract key or value)
          if (v && typeof v === 'object' && !dayjs.isDayjs(v)) {
            // For lookup fields, keep the { key, value } object
            if (f.propertyDto?.isLookup && 'key' in v && 'value' in v) {
              v = { key: v.key, value: v.value };
            } else {
              // For non-lookup fields, extract the value
              v = v.value ?? v.key ?? v;
            }
          }
          if (typeof v === 'string' && v && (isDateType(f.dataType, f.controlName) || ISO_DATE_RE.test(v))) v = dayjs(v);
          init[f.fieldName] = v;
        } else {
          const def = f.propertyDto?.defaultValue;
          init[f.fieldName] = f.dataType === 'BOOLEAN' ? (def === 'true' || def === true) : (def ?? '');
        }
      });
      return init;
    });
  }, [fields, normalizedInitialData]);

  // Sync initialData changes into form
  useEffect(() => {
    if (!normalizedInitialData) return;
    setFormValues((prev) => {
      const updated = { ...prev };
      Object.keys(normalizedInitialData).forEach((fn) => {
        const field = fieldsByName[fn];
        if (!field) return;
        let v = normalizedInitialData[fn];
        // Handle submit data format with metadata (extract key or value)
        if (v && typeof v === 'object' && !dayjs.isDayjs(v)) {
          // For lookup fields, keep the { key, value } object
          if (field.propertyDto?.isLookup && 'key' in v && 'value' in v) {
            v = { key: v.key, value: v.value };
          } else {
            // For non-lookup fields, extract the value
            v = v.value ?? v.key ?? v;
          }
        }
        if (typeof v === 'string' && v && (isDateType(field.dataType, field.controlName) || ISO_DATE_RE.test(v))) v = dayjs(v);
        updated[fn] = v;
      });
      return updated;
    });
    processedInitialDataRef.current = false;
  }, [normalizedInitialData, fieldsByName]);

  // Auto-fill dependent lookups when initialData is provided
  useEffect(() => {
    if (readOnly || !normalizedInitialData || !headers || processedInitialDataRef.current || fields.length === 0) return;
    const lookupFields = fields.filter((f) => f.propertyDto?.isLookup && normalizedInitialData[f.fieldName]);
    if (lookupFields.length === 0) { processedInitialDataRef.current = true; return; }

    const fill = async () => {
      isAutoFillingRef.current = true;
      try {
        // Poll until metadata is ready (max 10s)
        await new Promise((resolve) => {
          const t0 = Date.now();
          const check = () => {
            if (lookupFields.every((f) => lookupMetaRef.current[f.fieldName])) return resolve(true);
            if (Date.now() - t0 > 10000) return resolve(false);
            setTimeout(check, 50);
          };
          check();
        });
        if (processedInitialDataRef.current) return;
        const roots = lookupFields.filter((f) => !f.propertyDto?.isDependent);
        const deps  = lookupFields.filter((f) =>  f.propertyDto?.isDependent);
        for (const f of roots) if (normalizedInitialData[f.fieldName]) await onDropdownChangeRef.current(f.fieldName, normalizedInitialData[f.fieldName]);
        for (const f of deps)  if (normalizedInitialData[f.fieldName]) await onDropdownChangeRef.current(f.fieldName, normalizedInitialData[f.fieldName]);
        processedInitialDataRef.current = true;
      } finally {
        isAutoFillingRef.current = false;
      }
    };
    fill();
  }, [initialData, headers, fields]);

  const validateForm = useCallback(() => {
    const errors = {};
    fields.forEach(({ fieldName, label, dataType, propertyDto }) => {
      const { isMandatory, isVisible } = propertyDto || {};
      if (!isVisible || !isMandatory || dataType === 'BOOLEAN') return;
      const v = formValues[fieldName];
      if (v === null || v === undefined || v === '' || (typeof v === 'string' && !v.trim())) {
        errors[fieldName] = `${label} is required`;
      } else if (NUMERIC_TYPES.has(dataType)) {
        // For lookup fields, extract key or value property before validation
        const valueToCheck = (typeof v === 'object' && v !== null && !dayjs.isDayjs(v))
          ? (v.key ?? v.value)
          : v;
        if (isNaN(Number(valueToCheck))) {
          errors[fieldName] = `${label} must be a valid number`;
        }
      }
    });
    return errors;
  }, [fields, formValues]);

  const handleReset = useCallback(() => {
    const init = {};
    fields.forEach((f) => {
      const def = f.propertyDto?.defaultValue;
      init[f.fieldName] = f.dataType === 'BOOLEAN' ? (def === 'true' || def === true) : (def ?? '');
    });
    setFormValues(init);
    setValidationErrors({});
    onReset?.();
  }, [fields, onReset]);

  const handleChange = useCallback((fieldName, value) => {
    const field = fieldsByName[fieldName];
    let raw;
    // For lookup fields, preserve the entire { key, value } object
    if (field?.propertyDto?.isLookup && value !== null && value !== undefined && typeof value === 'object' && !dayjs.isDayjs(value) && 'key' in value && 'value' in value) {
      raw = { key: value.key, value: value.value };
    }
    // For non-lookup fields or other cases, extract value or use as-is
    else if (value !== null && value !== undefined && typeof value === 'object' && !dayjs.isDayjs(value) && 'value' in value) {
      raw = value.value;
    }
    else {
      raw = value ?? '';
    }
    setFormValues((prev) => ({ ...prev, [fieldName]: raw }));
    if (validationErrors[fieldName]) setValidationErrors((prev) => { const n = { ...prev }; delete n[fieldName]; return n; });
    if (field?.propertyDto?.isLookup && raw && !isAutoFillingRef.current) onDropdownChange(fieldName, raw);
  }, [fieldsByName, onDropdownChange, validationErrors]);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const el = document.querySelector(`[name='${Object.keys(errors)[0]}']`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    setValidationErrors({});
    
    // Build metadata-enriched payload
    const enrichedData = {
      variantId: variantData?.variantId || '',
      variantName: variantData?.variantName || '',
      definitionId: variantData?.definitionId || '',
      fields: {}
    };
    
    fields.forEach((field) => {
      const fieldValue = formValues[field.fieldName];
      const isLookupField = field.propertyDto?.isLookup;
      
      // For lookup fields, extract both key and value if available
      if (isLookupField && fieldValue && typeof fieldValue === 'object' && 'key' in fieldValue) {
        enrichedData.fields[field.fieldName] = {
          variantFieldId: field.variantFieldId || '',
          columnId: field.columnId || '',
          columnName: field.columnName || '',
          fieldName: field.fieldName || '',
          label: field.label || '',
          key: fieldValue.key ?? '',
          value: fieldValue.value ?? ''
        };
      } else {
        // For non-lookup fields or when value is not an object
        enrichedData.fields[field.fieldName] = {
          variantFieldId: field.variantFieldId || '',
          columnId: field.columnId || '',
          columnName: field.columnName || '',
          fieldName: field.fieldName || '',
          label: field.label || '',
          key: fieldValue ?? '',
          value: fieldValue ?? ''
        };
      }
    });
    
    // Call custom onSubmit if provided with enriched data
    if (onSubmit) onSubmit(enrichedData);

    return true;
  }, [formValues, validateForm, handleReset, onSubmit, fields, variantData]);

  useImperativeHandle(ref, () => ({
    validate: () => { const e = validateForm(); if (Object.keys(e).length) { setValidationErrors(e); return false; } return true; },
    submit: () => {
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        const el = document.querySelector(`[name='${Object.keys(errors)[0]}']`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      setValidationErrors({});
      
      // Build enriched data with metadata (same as handleSubmit)
      const enrichedData = {
        variantId: variantData?.variantId || '',
        variantName: variantData?.variantName || '',
        definitionId: variantData?.definitionId || '',
        fields: {}
      };
      
      fields.forEach((field) => {
        const fieldValue = formValues[field.fieldName];
        const isLookupField = field.propertyDto?.isLookup;
        
        // For lookup fields, extract both key and value if available
        if (isLookupField && fieldValue && typeof fieldValue === 'object' && 'key' in fieldValue) {
          enrichedData.fields[field.fieldName] = {
            variantFieldId: field.variantFieldId || '',
            columnId: field.columnId || '',
            columnName: field.columnName || '',
            fieldName: field.fieldName || '',
            label: field.label || '',
            key: fieldValue.key ?? '',
            value: fieldValue.value ?? ''
          };
        } else {
          // For non-lookup fields, key and value are the same
          enrichedData.fields[field.fieldName] = {
            variantFieldId: field.variantFieldId || '',
            columnId: field.columnId || '',
            columnName: field.columnName || '',
            fieldName: field.fieldName || '',
            label: field.label || '',
            key: fieldValue ?? '',
            value: fieldValue ?? ''
          };
        }
      });
      
      if (onSubmit) onSubmit(enrichedData);
      return true;
    },
    reset: handleReset,
    getValues: () => formValues,
    setValues: (vals) => setFormValues((prev) => ({ ...prev, ...vals })),
  }), [formValues, validateForm, handleReset, onSubmit, fields, variantData]);

  const gridSize = useMemo(() => {
    const n = columns || 2;
    const s = Math.floor(12 / n);
    return n <= 4 ? { xs: 12, sm: s } : n <= 6 ? { xs: 12, sm: 6, md: s } : { xs: 12, sm: 4, md: s };
  }, [columns]);

  if (!variantData || fields.length === 0) return null;

  return (
    <Box>
      {/* Header */}
      {showHeader && (
        <Box sx={headerSx}>
          <h2 style={headingStyle}>{title || 'Dynamic Form'}</h2>

        </Box>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item {...gridSize} key={field.variantFieldId || field.fieldName}>
              <FormField
                field={field}
                value={formValues[field.fieldName] ?? ''}
                onChange={handleChange}
                options={lookupOptions[field.fieldName] || EMPTY_ARR}
                error={validationErrors[field.fieldName]}
                readOnly={readOnly}
              />
            </Grid>
          ))}
        </Grid>
        {showFooter && !readOnly && (
          <Box sx={footerSx}>
            <Button variant='outlined' onClick={handleReset} type='button'>Reset</Button>
            <Button variant='contained' type='submit'>Submit</Button>
          </Box>
        )}
      </form>
    </Box>
  );
});

B2BTradingFilter.displayName = 'B2BTradingFilter';
export default B2BTradingFilter;
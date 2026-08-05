/**
 * CTCB2BCustomerSupplier — Generated Form Component
 *
 * Full props, usage, initialData formats, and submit payload shape:
 *   see GENERATED_FORM_PROPS.md in the CW Dynamic Form Code Generator extension.
 *
 * Setup:
 *   npm install @cw/rds react react-dom dayjs
 *   import '@cw/rds/dist/index.css';
 */
import { useState, useEffect, useMemo, useCallback, useRef, memo, forwardRef, useImperativeHandle } from 'react';
import { Grid, Box } from '@cw/rds/layout';
import { TextField, Switch, Autocomplete, FormControlLabel, Button, Checkbox } from '@cw/rds/inputs';
import DatePicker from '@cw/rds/DatePicker';
import TimePicker from '@cw/rds/TimePicker';
import DateTimePicker from '@cw/rds/DateTimePicker';
import { TableContainer, IconButton, Chip } from '@cw/rds/data-display';
import { Pencil, Trash } from '@cw/rds/icons';
import dayjs from 'dayjs';

// ─── Configuration ──────────────────────────────────────────────────────────────
const NUMERIC_TYPES = new Set(['INTEGER', 'DECIMAL', 'BIGINT', 'FLOAT', 'DOUBLE']);
const DECIMAL_TYPES = new Set(['DECIMAL', 'FLOAT', 'DOUBLE']);
const TEXTAREA_THRESHOLD = 255;
const SKIP_METADATA_FIELDS = new Set(['variantFieldId', 'columnId', 'columnName', 'variantId', 'variantName', 'definitionId', 'fields', '_id', 'id']);
// Lookup runtime knobs — server-side search + pagination
const LOOKUP_PAGE_SIZE = 20;
const LOOKUP_SEARCH_DEBOUNCE_MS = 300;
const LOOKUP_SCROLL_THRESHOLD_PX = 8;

// ─── Date/Time ──────────────────────────────────────────────────────────────────
const DATE_TYPES = new Set(['DATE']);
const DATETIME_TYPES = new Set(['DATETIME', 'TIMESTAMP']);
const TIME_TYPES = new Set(['TIME']);
const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
const DEFAULT_DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
const DEFAULT_TIME_FORMAT = 'HH:mm';
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const EPOCH_RE = /^\d{10,}$/;

// One of: 'date' | 'datetime' | 'time' | null
const getPickerKind = (dataType, controlName) => {
  const t = String(dataType || '').toUpperCase();
  const c = String(controlName || '').toLowerCase();
  if (TIME_TYPES.has(t) || (c.includes('time') && !c.includes('date'))) return 'time';
  if (DATETIME_TYPES.has(t) || c.includes('datetime')) return 'datetime';
  if (DATE_TYPES.has(t) || c.includes('date')) return 'date';
  return null;
};

// Parse any date-ish input into a dayjs. Returns null when invalid/empty.
const toDayjs = (value, kind) => {
  if (value === null || value === undefined || value === '') return null;
  if (dayjs.isDayjs(value)) return value.isValid() ? value : null;
  if (value instanceof Date) { const d = dayjs(value); return d.isValid() ? d : null; }
  // Unwrap enriched-submit wrappers: { key, value } (from previous onSubmit payload)
  if (typeof value === 'object' && !Array.isArray(value) && ('key' in value || 'value' in value)) {
    return toDayjs(value.value ?? value.key, kind);
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const ms = value < 1e12 ? value * 1000 : value;
    const d = dayjs(ms);
    return d.isValid() ? d : null;
  }
  if (typeof value === 'string') {
    if (kind === 'time' && TIME_RE.test(value)) {
      const d = dayjs('1970-01-01T' + (value.length === 5 ? value + ':00' : value));
      return d.isValid() ? d : null;
    }
    if (EPOCH_RE.test(value)) {
      const n = Number(value);
      const ms = n < 1e12 ? n * 1000 : n;
      const d = dayjs(ms);
      return d.isValid() ? d : null;
    }
    const d = dayjs(value);
    return d.isValid() ? d : null;
  }
  return null;
};

// Serialize a dayjs value for the submit payload.
// date/datetime → epoch ms (number); time → 'HH:mm:ss'.
const serializeDateValue = (value, kind) => {
  const d = dayjs.isDayjs(value) ? value : toDayjs(value, kind);
  if (!d || !d.isValid()) return '';
  return kind === 'time' ? d.format('HH:mm:ss') : d.valueOf();
};

// Single-value shortcuts only. Range-oriented shortcuts (Last Week, Last Month …)
// belong to a future dateRange picker kind, not to the calendar/datetime pickers.
const DATE_SHORTCUTS = [
  { label: 'Today',               getValue: () => dayjs() },
  { label: 'Yesterday',           getValue: () => dayjs().subtract(1, 'day') },
  { label: 'Tomorrow',            getValue: () => dayjs().add(1, 'day') },
  { label: 'Start of Month',      getValue: () => dayjs().startOf('month') },
  { label: 'Start of Last Month', getValue: () => dayjs().subtract(1, 'month').startOf('month') },
  { label: 'Reset',               getValue: () => null },
];
const DATETIME_SHORTCUTS = [
  { label: 'Now',            getValue: () => dayjs() },
  { label: 'Today 09:00',    getValue: () => dayjs().startOf('day').hour(9) },
  { label: 'Tomorrow 09:00', getValue: () => dayjs().add(1, 'day').startOf('day').hour(9) },
  { label: 'Start of Month', getValue: () => dayjs().startOf('month') },
  { label: 'Reset',          getValue: () => null },
];
const TIME_SHORTCUTS = [
  { label: 'Now',   getValue: () => dayjs() },
  { label: 'Reset', getValue: () => null },
];
const SHORTCUTS_BY_KIND = { date: DATE_SHORTCUTS, datetime: DATETIME_SHORTCUTS, time: TIME_SHORTCUTS };
const isValueEmpty = (value) => {
  if (value === null || value === undefined || value === '') return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (dayjs.isDayjs(value) && !value.isValid()) return true;
  if (value && typeof value === 'object' && !Array.isArray(value) && !dayjs.isDayjs(value)) {
    if ('key' in value || 'value' in value) {
      const keyEmpty = value.key === null || value.key === undefined || value.key === '';
      const valEmpty = value.value === null || value.value === undefined || value.value === '';
      return keyEmpty && valEmpty;
    }
  }
  return false;
};
// Preserves all extras on the option (e.g. displayName, description) while
// normalising the canonical key/value fields.
const toLookupOption = (item) => {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const key = item.key ?? item.value ?? '';
    const value = item.value ?? item.key ?? '';
    return { ...item, key, value };
  }
  if (item === null || item === undefined || item === '') return null;
  return { key: item, value: item };
};
// Supported multi-select shapes:
//   [{ key, value, ...extras }]        — array of full options
//   ['a', 'b']                          — array of strings
//   { key: [...], value: [...] }        — enriched wrapper with array values (round-trip)
//   { value: [{...}, {...}] }           — enriched wrapper with array of options
//   { key: 'a,b', value: 'A,B' }        — legacy comma-string wrapper
//   'a,b'                               — comma-string
// Supported single-select shapes:
//   { key, value, ...extras }, 'a', number
const normalizeLookupInitialValue = (raw, isMultiSelect) => {
  if (isValueEmpty(raw)) return isMultiSelect ? [] : '';
  if (isMultiSelect) {
    if (Array.isArray(raw)) {
      return raw.map(toLookupOption).filter((item) => item && !isValueEmpty(item));
    }
    if (raw && typeof raw === 'object' && !dayjs.isDayjs(raw)) {
      if (Array.isArray(raw.value)) {
        return raw.value.map(toLookupOption).filter((item) => item && !isValueEmpty(item));
      }
      if (Array.isArray(raw.key)) {
        return raw.key.map(toLookupOption).filter((item) => item && !isValueEmpty(item));
      }
      const keys = String(raw.key ?? '').split(',').map((s) => s.trim()).filter(Boolean);
      const values = String(raw.value ?? '').split(',').map((s) => s.trim()).filter(Boolean);
      if (keys.length > 1 || values.length > 1) {
        const len = Math.max(keys.length, values.length);
        return Array.from({ length: len }, (_, i) => ({
          key: keys[i] ?? values[i] ?? '',
          value: values[i] ?? keys[i] ?? '',
        }));
      }
      const single = toLookupOption(raw);
      return single && !isValueEmpty(single) ? [single] : [];
    }
    if (typeof raw === 'string') {
      return raw.split(',').map((s) => s.trim()).filter(Boolean).map((s) => ({ key: s, value: s }));
    }
    return [];
  }
  if (Array.isArray(raw)) return toLookupOption(raw[0]) || '';
  if (raw && typeof raw === 'object' && !dayjs.isDayjs(raw) && ('key' in raw || 'value' in raw)) {
    return { ...raw, key: raw.key ?? '', value: raw.value ?? '' };
  }
  return raw;
};
const sanitizeNumericInput = (raw, dataType, maxLen) => {
  let v = String(raw ?? '');
  if (DECIMAL_TYPES.has(dataType)) {
    v = v.replace(/[^0-9.]/g, '');
    const parts = v.split('.');
    if (parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
    const digits = v.replace(/\./g, '');
    if (maxLen && digits.length > maxLen) return null;
  } else {
    v = v.replace(/\D/g, '');
    if (maxLen && v.length > maxLen) return null;
  }
  return v;
};
const sanitizeFieldName = (name) => String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const EMBEDDED_VARIANT_DATA = [
  {
    "variantId": "a312256cf1984944a29a3465c9d16d0c",
    "variantName": "CTC B2B CustomerSupplier",
    "definitionId": "IWM",
    "data": [
      {
        "variantFieldId": "9adf8a35db87421f89fa4076dafc9df2",
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
          "isMandatory": true,
          "isVisible": true,
          "isKey": null,
          "sequence": 1,
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
          "isGlobalFilterEditable": true,
          "isGlobalSortEditable": true,
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
        "variantFieldId": "6cd1ebde9806446083e6ff4f064e97ae",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "0a7aee43-7bf0-4e0a-af02-b60fafa0b390",
        "columnName": "ITM_CTC_SALES_ORG",
        "label": "Sales Organisation",
        "description": "Sales Organisation",
        "maxLength": "50",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_SALES_ORG",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": true,
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
          "isGlobalFilterEditable": true,
          "isGlobalSortEditable": true,
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
        "aliasName": "ITM_CTC_SALES_ORG",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "a8dff3bff1c2492d8d533dafad0562d6",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "7508f6ea-3c56-4e16-90f7-304d87f17844",
        "columnName": "ITM_CTC_DIST_CH",
        "label": "Distribution Channel",
        "description": "Distribution Channel",
        "maxLength": "30",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_DIST_CH",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": true,
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
          "isGlobalFilterEditable": true,
          "isGlobalSortEditable": true,
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
        "aliasName": "ITM_CTC_DIST_CH",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "4f8f02c5e0624f94a88198d3121afb71",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "543123d6-3dc4-4f0a-8308-d0aa70fb09db",
        "columnName": "ITM_CTC_DIVISION",
        "label": "Division",
        "description": "Division",
        "maxLength": "5",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_DIVISION",
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
        "aliasName": "ITM_CTC_DIVISION",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "774ab4fd643849e298537b47477cc62a",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "d3d36878-930c-4c3c-bc50-6cbaf8614873",
        "columnName": "ITM_CTC_COUNTER_PARTY_REF_NO",
        "label": "Counterparty Reference No.",
        "description": "Counterparty Reference No.",
        "maxLength": "15",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_COUNTER_PARTY_REF_NO",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": true,
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
          "isGlobalFilterEditable": true,
          "isGlobalSortEditable": true,
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
        "aliasName": "ITM_CTC_COUNTER_PARTY_REF_NO",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "8c1ea347f0534d289dde877e54f67123",
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
          "isMandatory": true,
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
          "isGlobalFilterEditable": true,
          "isGlobalSortEditable": true,
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
        "variantFieldId": "9b30ffa48469431082d81a0c7164f211",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "3e596bb2-b2d3-4462-bc68-fc4840ab9c23",
        "columnName": "ITM_CTC_PURCH_ORG",
        "label": "Purchasing Organisation",
        "description": "Purchasing Organisation",
        "maxLength": "50",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_PURCH_ORG",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": true,
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
          "isGlobalFilterEditable": true,
          "isGlobalSortEditable": true,
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
        "aliasName": "ITM_CTC_PURCH_ORG",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "095b5e21a2cd46debb983cafdca642bf",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "7e62e3e9-4fc9-4ece-83a9-b214343683a1",
        "columnName": "ITM_CTC_PURCH_GRP",
        "label": "Purchasing Group",
        "description": "Purchasing Group",
        "maxLength": "50",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_PURCH_GRP",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": true,
          "isVisible": true,
          "isKey": null,
          "sequence": 8,
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
          "isGlobalFilterEditable": true,
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
        "aliasName": "ITM_CTC_PURCH_GRP",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "b7507446121845f0865148655049f06d",
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
          "isMandatory": true,
          "isVisible": true,
          "isKey": null,
          "sequence": 9,
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
          "isGlobalFilterEditable": true,
          "isGlobalSortEditable": true,
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
  const [hoveredRow, setHoveredRow] = useState(null);
  
  const normalizedData = useMemo(() => {
    if (!data) return [];
    if (data.fields && typeof data.fields === 'object' && !Array.isArray(data.fields)) return [data];
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);
  
  const effectiveColumns = useMemo(() => {
    if (columns && columns.length > 0) return columns;
    if (normalizedData.length === 0) return [];
    const firstEntry = normalizedData[0];
    if (firstEntry.fields && typeof firstEntry.fields === 'object') {
      return Object.keys(firstEntry.fields).map((fieldName) => ({
        fieldName,
        key: fieldName,
        label: firstEntry.fields[fieldName]?.label || fieldName,
      }));
    }
    return Object.keys(firstEntry)
      .filter((key) => !SKIP_METADATA_FIELDS.has(key))
      .map((key) => ({ fieldName: key, key, label: firstEntry[key]?.label || key }));
  }, [columns, normalizedData]);
  
  const hasActions = onEdit || onDelete;
  const hasCheckbox = selectable;
  const columnCount = (hasCheckbox ? 1 : 0) + effectiveColumns.length + (hasActions ? 1 : 0);
  
  const handleSelectAll = useCallback((checked) => {
    const nextSelection = checked ? normalizedData.map((_, idx) => idx) : [];
    setSelectedRows(new Set(nextSelection));
    if (onSelectionChange) onSelectionChange(nextSelection);
  }, [normalizedData, onSelectionChange]);
  
  const handleSelectRow = useCallback((index, checked) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(index);
      } else {
        next.delete(index);
      }
      const nextSelection = Array.from(next);
      if (onSelectionChange) onSelectionChange(nextSelection);
      return next;
    });
  }, [onSelectionChange]);

  const isAllSelected = normalizedData.length > 0 && selectedRows.size === normalizedData.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < normalizedData.length;

  return (
    <TableContainer sx={{ mt: 3 }} className="dynamic-form-table-container">
      <table id="dynamic-form-list-view" className="dynamic-form-table" style={tableStyle}>
        <thead className="dynamic-form-table-header">
          <tr>
            {hasCheckbox && (
              <th style={{ ...thStyle, width: '50px', textAlign: 'center' }} data-column-name="checkbox">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(_, checked) => handleSelectAll(checked)}
                  inputProps={{ 'aria-label': 'Select all rows' }}
                />
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
                <tr key={entryId} onClick={() => onRowClick && onRowClick(entry, index)} onMouseEnter={() => setHoveredRow(index)} onMouseLeave={() => setHoveredRow(null)} style={{ cursor: onRowClick ? 'pointer' : 'default', backgroundColor: isSelected || hoveredRow === index ? 'var(--grey-100, #f5f5f5)' : 'transparent' }} data-row-index={index} data-entry-id={entryId} data-selected={isSelected}>
                  {hasCheckbox && (
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <Checkbox
                        checked={isSelected}
                        onChange={(_, checked) => {
                          handleSelectRow(index, checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        inputProps={{ 'aria-label': 'Select row ' + (index + 1) }}
                      />
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
  const res = await fetch(url, { method: 'GET', headers: headers || {} });
  return res.json();
};
const getLookupMetadata = (meta) => {
  const lookupType = String(meta?.lookupType || '').toUpperCase();
  if (lookupType === 'VL') return meta?.staticValueHelpMetadata || null;
  if (lookupType === 'API') return meta?.apiMetadata || null;
  if (lookupType === 'DB') return meta?.dbMetadata || null;
  return null;
};

const getLookupConstraints = (meta) => {
  const lookupMetadata = getLookupMetadata(meta);
  return lookupMetadata?.constraints || [];
};

const getLookupDependentFields = (meta) => {
  const lookupMetadata = getLookupMetadata(meta);
  return lookupMetadata?.dependentFields || [];
};

// Server-side search knobs — falls back to top-level meta if not nested under the type-specific metadata block.
const getLookupSearchConfig = (meta) => {
  const lookupMetadata = getLookupMetadata(meta);
  const isSearchable = !!(lookupMetadata?.isSearchable ?? meta?.isSearchable);
  const searchMappedName = lookupMetadata?.searchMappedName || meta?.searchMappedName || '';
  return { isSearchable, searchMappedName };
};

// Server-side pagination knobs — topMappedName carries the page number, skipMappedName carries the page size.
const getLookupPaginationConfig = (meta) => {
  const lookupMetadata = getLookupMetadata(meta);
  const isPagination = !!(lookupMetadata?.isPagination ?? meta?.isPagination);
  const topMappedName = lookupMetadata?.topMappedName || meta?.topMappedName || '';
  const skipMappedName = lookupMetadata?.skipMappedName || meta?.skipMappedName || '';
  return { isPagination, topMappedName, skipMappedName };
};

const getDisplayFieldName = (data) => {
  const metadata = data?.metadata || [];
  const displayMeta = metadata.find((item) => item?.isDisplayName);
  return displayMeta?.mappedName || 'value';
};

// Monotonic per-option identity — makes the Autocomplete row identity stable even when
// two LAPI rows are structurally identical (e.g. 20x { provider: 'DocuSign' }), which
// is what MUI compares via isOptionEqualToValue to decide which checkbox is on.
let _lookupOptionUid = 0;
const nextLookupUid = () => ++_lookupOptionUid;

const normalizeLookupOptions = (lookupData) => {
  const rawValues = lookupData?.data?.values || [];
  const displayFieldName = getDisplayFieldName(lookupData?.data);

  return rawValues.map((item) => {
    const uid = nextLookupUid();
    if (typeof item === 'string') {
      return { key: item, value: item, _uid: uid };
    }

    const displayValue = item?.[displayFieldName];
    const normalizedValue = displayValue !== undefined && displayValue !== null && displayValue !== ''
      ? displayValue
      : item?.value ?? item?.key ?? '';

    return {
      ...item,
      key: item?.key ?? normalizedValue,
      value: normalizedValue,
      _uid: uid,
    };
  });
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
// Fetch gates on mount: if the meta declares constraints OR isSearchable OR isPagination,
// skip the initial /lapi/data call. Otherwise fetch once (legacy behavior).
//   - constraints  → data is fetched when the parent selection resolves (onDropdownChange)
//   - isSearchable → data is fetched when the user types (debounced onSearchInput)
//   - isPagination → data is fetched on dropdown open (page 1) and on scroll-to-bottom (append)
const useLookups = (fields, headers, baseUrl, readOnly = false) => {
  const [lookupOptions, setLookupOptions] = useState({});
  const [lookupLoading, setLookupLoading] = useState({});
  const [lookupFlags, setLookupFlags] = useState({});
  const lookupMetaRef = useRef({});
  const initialised = useRef(new Set());
  // Per-field mutable runtime state (refs so mutation doesn't trigger renders)
  const searchTextRef = useRef({});
  const pageRef = useRef({});
  const hasMoreRef = useRef({});
  const constraintsRef = useRef({});
  const requestIdRef = useRef({});
  const loadingRef = useRef({});
  const debounceTimersRef = useRef({});

  const fieldsByColumn = useMemo(() => {
    const m = {};
    fields.forEach((f) => { m[f.columnName] = f; });
    return m;
  }, [fields]);
  const fieldsByName = useMemo(() => {
    const m = {};
    fields.forEach((f) => { m[f.fieldName] = f; });
    return m;
  }, [fields]);

  const rememberFlags = useCallback((fieldName, meta) => {
    const { isSearchable } = getLookupSearchConfig(meta);
    const { isPagination } = getLookupPaginationConfig(meta);
    setLookupFlags((prev) => {
      const cur = prev[fieldName];
      if (cur && cur.serverSideSearch === isSearchable && cur.serverSidePagination === isPagination) return prev;
      return { ...prev, [fieldName]: { serverSideSearch: isSearchable, serverSidePagination: isPagination } };
    });
  }, []);

  // Core fetch primitive — assembles constraint + search + pagination params from the per-field refs.
  const runFetch = useCallback(async (fieldName, opts = {}) => {
    const { append = false } = opts;
    const meta = lookupMetaRef.current[fieldName];
    const field = fieldsByName[fieldName];
    if (!meta || !field?.propertyDto?.lookupId) return;

    const search = getLookupSearchConfig(meta);
    const pagination = getLookupPaginationConfig(meta);

    const params = { ...(constraintsRef.current[fieldName] || {}) };
    if (search.isSearchable && search.searchMappedName) {
      const t = searchTextRef.current[fieldName] || '';
      if (t) params[search.searchMappedName] = t;
    }
    if (pagination.isPagination) {
      const page = pageRef.current[fieldName] || 1;
      if (pagination.topMappedName) params[pagination.topMappedName] = page;
      if (pagination.skipMappedName) params[pagination.skipMappedName] = LOOKUP_PAGE_SIZE;
    }

    const rid = (requestIdRef.current[fieldName] = (requestIdRef.current[fieldName] || 0) + 1);
    loadingRef.current[fieldName] = true;
    setLookupLoading((prev) => (prev[fieldName] ? prev : { ...prev, [fieldName]: true }));

    try {
      const dataRes = await fetchLookupData(
        field.propertyDto.lookupId,
        Object.keys(params).length ? params : null,
        headers,
        baseUrl,
      );
      if (rid !== requestIdRef.current[fieldName]) return; // stale — a newer request has taken over
      const newOptions = normalizeLookupOptions(dataRes);
      hasMoreRef.current[fieldName] = pagination.isPagination
        ? newOptions.length >= LOOKUP_PAGE_SIZE
        : false;
      setLookupOptions((prev) => ({
        ...prev,
        [fieldName]: append ? [...(prev[fieldName] || []), ...newOptions] : newOptions,
      }));
    } catch (err) {
      console.error(`[Lookup] fetch error for ${fieldName}:`, err);
    } finally {
      if (rid === requestIdRef.current[fieldName]) {
        loadingRef.current[fieldName] = false;
        setLookupLoading((prev) => ({ ...prev, [fieldName]: false }));
      }
    }
  }, [fieldsByName, headers, baseUrl]);

  useEffect(() => {
    if (readOnly || fields.length === 0) return;
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
        rememberFlags(fieldName, meta);
        const constraints = getLookupConstraints(meta);
        const { isSearchable } = getLookupSearchConfig(meta);
        const { isPagination } = getLookupPaginationConfig(meta);

        // Skip the initial data fetch when any gate is enabled — data will be fetched on user action.
        if (constraints.length > 0 || isSearchable || isPagination) return;

        pageRef.current[fieldName] = 1;
        await runFetch(fieldName);
      } catch (err) {
        console.error(`[Lookup] meta error for ${fieldName}:`, err);
      }
    });
  }, [fields, headers, baseUrl, readOnly, runFetch, rememberFlags]);

  useEffect(() => () => {
    Object.values(debounceTimersRef.current).forEach((t) => t && clearTimeout(t));
  }, []);

  const onDropdownChange = useCallback(async (changedFieldName, selectedValue) => {
    const meta = lookupMetaRef.current[changedFieldName];
    if (!meta) return;
    const dependentFieldNames = getLookupDependentFields(meta);
    if (dependentFieldNames.length === 0) return;

    // Reduce parent selection to a scalar constraint (supports multi-select arrays + enriched wrappers).
    const toScalar = (item) => (item && typeof item === 'object' ? (item.key ?? item.value) : item);
    const joinArr = (arr) => arr.map(toScalar).filter((v) => v !== undefined && v !== null && v !== '').join(',');
    let constraintValue;
    if (Array.isArray(selectedValue)) {
      constraintValue = joinArr(selectedValue);
    } else if (selectedValue && typeof selectedValue === 'object' && (Array.isArray(selectedValue.value) || Array.isArray(selectedValue.key))) {
      constraintValue = joinArr(Array.isArray(selectedValue.value) ? selectedValue.value : selectedValue.key);
    } else {
      constraintValue = selectedValue?.key ?? selectedValue?.value ?? selectedValue;
    }
    if (constraintValue === undefined || constraintValue === null || constraintValue === '') return;

    for (const depColumnName of dependentFieldNames) {
      const depField = fieldsByColumn[depColumnName];
      if (!depField?.propertyDto?.isLookup || !depField.propertyDto?.lookupId) continue;
      try {
        let depMeta = lookupMetaRef.current[depField.fieldName];
        if (!depMeta) {
          const metaRes = await fetchLookupMeta(depField.propertyDto.lookupId, headers, baseUrl);
          depMeta = metaRes?.data;
          if (depMeta) {
            lookupMetaRef.current = { ...lookupMetaRef.current, [depField.fieldName]: depMeta };
            rememberFlags(depField.fieldName, depMeta);
          }
        }
        if (!depMeta) continue;
        const constraints = getLookupConstraints(depMeta);
        const { isSearchable } = getLookupSearchConfig(depMeta);
        const { isPagination } = getLookupPaginationConfig(depMeta);

        // Build + cache constraint params — reused by later search / scroll fetches on this field.
        let constraintParams = null;
        if (constraints.length > 0) {
          constraintParams = {};
          constraints.forEach((c) => { if (c?.mappedName) constraintParams[c.mappedName] = constraintValue; });
          if (Object.keys(constraintParams).length === 0) continue;
        }
        constraintsRef.current[depField.fieldName] = constraintParams || {};

        // Parent changed → reset per-field state so we don't carry stale search/page context.
        pageRef.current[depField.fieldName] = 1;
        searchTextRef.current[depField.fieldName] = '';
        hasMoreRef.current[depField.fieldName] = true;
        requestIdRef.current[depField.fieldName] = (requestIdRef.current[depField.fieldName] || 0) + 1;
        setLookupOptions((prev) => ({ ...prev, [depField.fieldName]: [] }));

        // Same skip rule as mount: gates present → wait for the user (type / open).
        if (isSearchable || isPagination) continue;
        await runFetch(depField.fieldName);
      } catch (err) {
        console.error(`[Lookup] dependent error for ${depField.fieldName}:`, err);
      }
    }
  }, [fieldsByColumn, headers, baseUrl, runFetch, rememberFlags]);

  // Dropdown opened — for pagination-only lookups, fetch page 1 the first time.
  const onLookupOpen = useCallback((fieldName) => {
    const meta = lookupMetaRef.current[fieldName];
    if (!meta) return;
    const { isSearchable } = getLookupSearchConfig(meta);
    const { isPagination } = getLookupPaginationConfig(meta);
    if (isPagination && !isSearchable) {
      const cur = lookupOptions[fieldName];
      if (!cur || cur.length === 0) {
        pageRef.current[fieldName] = 1;
        hasMoreRef.current[fieldName] = true;
        runFetch(fieldName);
      }
    }
  }, [lookupOptions, runFetch]);

  // User typed — debounced 300ms. Empty string clears options without a network hit.
  const onLookupSearchInput = useCallback((fieldName, text) => {
    const meta = lookupMetaRef.current[fieldName];
    if (!meta) return;
    const { isSearchable } = getLookupSearchConfig(meta);
    if (!isSearchable) return;

    if (debounceTimersRef.current[fieldName]) {
      clearTimeout(debounceTimersRef.current[fieldName]);
    }
    debounceTimersRef.current[fieldName] = setTimeout(() => {
      const trimmed = String(text || '').trim();
      searchTextRef.current[fieldName] = trimmed;
      pageRef.current[fieldName] = 1;
      hasMoreRef.current[fieldName] = true;
      if (!trimmed) {
        requestIdRef.current[fieldName] = (requestIdRef.current[fieldName] || 0) + 1;
        loadingRef.current[fieldName] = false;
        setLookupLoading((prev) => ({ ...prev, [fieldName]: false }));
        setLookupOptions((prev) => ({ ...prev, [fieldName]: [] }));
        return;
      }
      runFetch(fieldName);
    }, LOOKUP_SEARCH_DEBOUNCE_MS);
  }, [runFetch]);

  // Scrolled to the bottom — append the next page.
  const onLookupLoadMore = useCallback((fieldName) => {
    const meta = lookupMetaRef.current[fieldName];
    if (!meta) return;
    const { isPagination } = getLookupPaginationConfig(meta);
    if (!isPagination) return;
    if (loadingRef.current[fieldName]) return;
    if (!hasMoreRef.current[fieldName]) return;
    pageRef.current[fieldName] = (pageRef.current[fieldName] || 1) + 1;
    runFetch(fieldName, { append: true });
  }, [runFetch]);

  return {
    lookupOptions,
    setLookupOptions,
    onDropdownChange,
    lookupMetaRef,
    lookupLoading,
    lookupFlags,
    onLookupOpen,
    onLookupSearchInput,
    onLookupLoadMore,
  };
};

// ─── Form Field ───────────────────────────────────────────────────────────
const EMPTY_ARR = [];
// Placeholder text per field type — shown inside the input once the label has floated up.
const getFieldPlaceholder = (field, pickerKind, dateFormat, isSearchable) => {
  const label = field?.label || field?.fieldName || '';
  if (pickerKind === 'time') return dateFormat?.time || DEFAULT_TIME_FORMAT;
  if (pickerKind === 'datetime') return dateFormat?.dateTime || DEFAULT_DATETIME_FORMAT;
  if (pickerKind === 'date') return dateFormat?.date || DEFAULT_DATE_FORMAT;
  if (!label) return '';
  if (field?.propertyDto?.isLookup) return isSearchable ? `Search ${label}` : `Select ${label}`;
  return `Enter ${label}`;
};
const FormField = memo(({
  field, value, onChange, options, error, readOnly, dateFormat,
  loading = false, serverSideSearch = false, serverSidePagination = false,
  onLookupOpen, onLookupSearchInput, onLookupLoadMore,
}) => {
  const { controlName, dataType, label, fieldName, maxLength, propertyDto } = field;
  const { isMandatory, isEditable, isVisible, isLookup, isMultiSelect } = propertyDto || {};
  const sanitizedFieldName = sanitizeFieldName(fieldName);
  // Controlled input value for server-side search — prevents MUI from wiping the query on selection / blur.
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
    if (isEmpty && searchInput) setSearchInput('');
  }, [value]);
  if (!isVisible) return null;

  if (dataType === 'BOOLEAN') {
    return (
      <FormControlLabel
        sx={{ alignItems: 'center' }}
        control={<Switch checked={!!value} onChange={(e) => onChange(fieldName, e.target.checked)} disabled={!isEditable || readOnly} inputProps={{ id: `field-${sanitizedFieldName}`, className: `dynamic-form-field field-${sanitizedFieldName}`, 'data-value': value ? 'true' : 'false' }} />}
        label={label}
        componentsProps={{ typography: { id: `label-${sanitizedFieldName}`, className: `dynamic-form-label label-${sanitizedFieldName}`, 'data-value': label } }}
      />
    );
  }

  if (isLookup) {
    const toOption = (v) => {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        // If the value already carries a _uid, it IS a normalized option — resolve strictly by _uid so
        // structurally-identical LAPI rows (same key & value) don't collapse to the first match.
        if (v._uid !== undefined) {
          const byUid = options.find((o) => o._uid === v._uid);
          return byUid || v;
        }
        const found = options.find((o) => o.key === v.key || o.value === v.value);
        if (found) return found;
        const key = v.key ?? v.value ?? '';
        const value = v.value ?? v.key ?? '';
        return { ...v, key, value };
      }
      if (typeof v === 'string' && v) {
        const found = options.find((o) => o.value === v || o.key === v);
        return found || { key: v, value: v };
      }
      return null;
    };
    const selectedForMulti = (Array.isArray(value) ? value : (value ? [value] : []))
      .map(toOption)
      .filter(Boolean);
    const selectedObj = Array.isArray(value) ? null : toOption(value);
    // Preserve previously selected multi-select values that aren't in the freshly-fetched options
    // (e.g. after a new search / next page) so the user can still see & un-check them.
    const displayOptions = (() => {
      if (!isMultiSelect || !Array.isArray(selectedForMulti) || selectedForMulti.length === 0) return options;
      const seen = new Set();
      options.forEach((o) => { if (o && o._uid !== undefined) seen.add(o._uid); });
      const missing = [];
      selectedForMulti.forEach((s) => {
        if (s && typeof s === 'object' && s._uid !== undefined && !seen.has(s._uid)) {
          seen.add(s._uid);
          missing.push(s);
        }
      });
      return missing.length > 0 ? [...missing, ...options] : options;
    })();
    const multiSelectSx = isMultiSelect ? {
      width: '100%',
      '& .MuiOutlinedInput-root': { flexWrap: 'nowrap', overflow: 'hidden', alignItems: 'center' },
      '& .MuiAutocomplete-tag': { maxWidth: 110 },
    } : undefined;
    const listboxScroll = serverSidePagination ? (event) => {
      const node = event.currentTarget;
      if (!node) return;
      if (node.scrollHeight - node.scrollTop - node.clientHeight <= LOOKUP_SCROLL_THRESHOLD_PX) {
        onLookupLoadMore && onLookupLoadMore(fieldName);
      }
    } : undefined;
    return (
      <Autocomplete
        options={displayOptions}
        getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt?.value ?? '')}
        isOptionEqualToValue={(opt, val) => {
          if (!opt || !val) return false;
          if (opt === val) return true;
          if (opt._uid !== undefined && val._uid !== undefined) return opt._uid === val._uid;
          if (typeof val === 'string') return opt.value === val || opt.key === val;
          return opt.key === val.key;
        }}
        value={isMultiSelect ? selectedForMulti : selectedObj}
        onChange={(_, newVal) => {
          onChange(fieldName, newVal);
          if (serverSideSearch && !isMultiSelect) setSearchInput('');
        }}
        onOpen={onLookupOpen ? () => onLookupOpen(fieldName) : undefined}
        inputValue={searchInput}
        onInputChange={(_, newInput, reason) => {
          if (reason === 'input') {
            setSearchInput(newInput);
            if (serverSideSearch) onLookupSearchInput && onLookupSearchInput(fieldName, newInput);
          } else if (reason === 'clear') {
            setSearchInput('');
            if (serverSideSearch) onLookupSearchInput && onLookupSearchInput(fieldName, '');
          } else if (reason === 'reset') {
            // Single-select: mirror the resolved selection label.
            // Multi-select + server search: keep the typed query so the user can keep searching.
            // Multi-select + client search: clear (default MUI behaviour).
            if (!isMultiSelect) setSearchInput(newInput || '');
            else if (!serverSideSearch) setSearchInput(newInput || '');
          }
        }}
        clearOnBlur={!(serverSideSearch && isMultiSelect)}
        filterOptions={serverSideSearch ? (x) => x : undefined}
        loading={loading}
        noOptionsText={serverSideSearch ? 'Type to search...' : 'No options'}
        ListboxProps={listboxScroll ? { onScroll: listboxScroll } : undefined}
        disabled={!isEditable || readOnly}
        multiple={!!isMultiSelect}
        disableCloseOnSelect={!!isMultiSelect}
        sx={multiSelectSx}
        renderTags={isMultiSelect ? (tagValue, getTagProps) => {
          const limit = 2;
          const visible = tagValue.slice(0, limit);
          const hiddenCount = tagValue.length - limit;
          return (
            <>
              {visible.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    size='small'
                    label={typeof option === 'string' ? option : (option?.value ?? '')}
                    {...tagProps}
                  />
                );
              })}
              {hiddenCount > 0 && <Chip size='small' label={`+${hiddenCount}`} />}
            </>
          );
        } : undefined}
        renderOption={isMultiSelect ? (props, option, { selected }) => {
          const { key: optKey, ...rest } = props;
          return (
            <li key={optKey ?? option?.key ?? option?.value} {...rest}>
              <Checkbox checked={selected} style={{ marginRight: 8 }} />
              {typeof option === 'string' ? option : option?.value ?? ''}
            </li>
          );
        } : undefined}
        renderInput={(params) => {
          const selectedKey = isMultiSelect
            ? selectedForMulti.map((o) => o?.key ?? o?.value ?? '').filter(Boolean).join(',')
            : (selectedObj?.key || '');
          return (
            <TextField
              {...params}
              label={label}
              placeholder={getFieldPlaceholder(field, null, dateFormat, serverSideSearch)}
              required={!!isMandatory}
              error={!!error}
              helperText={error}
              size='medium'
              fullWidth
              name={fieldName}
              sx={error ? {
                '& .MuiOutlinedInput-root': {
                  flexWrap: isMultiSelect ? 'nowrap' : undefined,
                  overflow: isMultiSelect ? 'hidden' : undefined,
                  '& fieldset': { borderColor: '#d32f2f !important' },
                  '&:hover fieldset': { borderColor: '#d32f2f !important' },
                  '&.Mui-focused fieldset': { borderColor: '#d32f2f !important' },
                },
                '& .MuiInputLabel-root': { color: '#d32f2f' },
                '& .MuiFormHelperText-root': { color: '#d32f2f' },
              } : (isMultiSelect ? {
                '& .MuiOutlinedInput-root': { flexWrap: 'nowrap', overflow: 'hidden' },
              } : undefined)}
              className={error ? 'dynamic-form-field-error' : undefined}
              InputLabelProps={{ sx: { textAlign: 'left' }, id: `label-${sanitizedFieldName}`, className: `dynamic-form-label label-${sanitizedFieldName}`, 'data-value': label }}
              inputProps={{ ...params.inputProps, id: `field-${sanitizedFieldName}`, className: `dynamic-form-field field-${sanitizedFieldName}`, 'data-value': selectedKey }}
            />
          );
        }}
      />
    );
  }

  const pickerKind = getPickerKind(dataType, controlName);
  if (pickerKind) {
    const dateValue = toDayjs(value, pickerKind);
    const Picker = pickerKind === 'time' ? TimePicker : pickerKind === 'datetime' ? DateTimePicker : DatePicker;
    const format = pickerKind === 'time'
      ? (dateFormat?.time || DEFAULT_TIME_FORMAT)
      : pickerKind === 'datetime'
        ? (dateFormat?.dateTime || DEFAULT_DATETIME_FORMAT)
        : (dateFormat?.date || DEFAULT_DATE_FORMAT);
    const dataAttrValue = dateValue
      ? (pickerKind === 'time' ? dateValue.format('HH:mm:ss') : dateValue.valueOf())
      : '';
    return (
      <Picker
        key={fieldName} label={label} required={!!isMandatory} error={!!error} helperText={error || ''}
        value={dateValue} onChange={(v) => onChange(fieldName, v)} disabled={!isEditable || readOnly}
        format={format}
        slotProps={{
          textField: {
            size: 'medium', fullWidth: true, name: fieldName,
            placeholder: getFieldPlaceholder(field, pickerKind, dateFormat, false),
            InputLabelProps: { sx: { textAlign: 'left' }, id: `label-${sanitizedFieldName}`, className: `dynamic-form-label label-${sanitizedFieldName}`, 'data-value': label },
            inputProps: { id: `field-${sanitizedFieldName}`, className: `dynamic-form-field field-${sanitizedFieldName}`, 'data-value': dataAttrValue },
          },
          shortcuts: { items: SHORTCUTS_BY_KIND[pickerKind] },
        }}
      />
    );
  }

  const isNumeric = NUMERIC_TYPES.has(dataType);
  const maxLen = maxLength ? Number(maxLength) : undefined;
  const currentValue = value ?? '';
  return (
    <TextField
      label={label} value={currentValue}
      placeholder={getFieldPlaceholder(field, null, dateFormat, false)}
      onChange={(e) => {
        if (isNumeric) {
          const next = sanitizeNumericInput(e.target.value, dataType, maxLen);
          if (next === null) return;
          onChange(fieldName, next);
          return;
        }
        onChange(fieldName, e.target.value);
      }}
      onKeyDown={isNumeric ? (e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); } : undefined}
      required={!!isMandatory} disabled={!isEditable || readOnly} type='text'
      inputMode={isNumeric ? 'numeric' : undefined}
      inputProps={{ id: `field-${sanitizedFieldName}`, className: `dynamic-form-field field-${sanitizedFieldName}`, maxLength: isNumeric ? undefined : maxLen, inputMode: isNumeric ? 'numeric' : undefined, pattern: isNumeric ? (DECIMAL_TYPES.has(dataType) ? '[0-9.]*' : '[0-9]*') : undefined, 'data-value': currentValue }}
      InputLabelProps={{ sx: { textAlign: 'left' }, id: `label-${sanitizedFieldName}`, className: `dynamic-form-label label-${sanitizedFieldName}`, 'data-value': label }}
      multiline={!isNumeric && !!maxLength && Number(maxLength) > TEXTAREA_THRESHOLD}
      rows={!isNumeric && !!maxLength && Number(maxLength) > TEXTAREA_THRESHOLD ? 4 : undefined}
      error={!!error} helperText={error} size='medium' fullWidth name={fieldName}
    />
  );
});

// ─── Main Component ──────────────────────────────────────────────────────────────
const CTCB2BCustomerSupplier = forwardRef(({ variantData: externalVariantData, initialData, requestOptions, dateFormat, onSubmit, onReset, columns = 2, title, showHeader = true, showFooter = true, readOnly = false }, ref) => {
  const headers = requestOptions?.headers;
  const baseUrl = requestOptions?.baseUrl || '';

  const normalizedInitialData = useMemo(() => {
    if (!initialData) return null;
    if (initialData.fields && typeof initialData.fields === 'object' && !Array.isArray(initialData.fields)) {
      return initialData.fields;
    }
    return initialData;
  }, [initialData]);

  const [variantData, setVariantData] = useState(() =>
    externalVariantData ?? (EMBEDDED_VARIANT_DATA.length === 1 ? EMBEDDED_VARIANT_DATA[0] : EMBEDDED_VARIANT_DATA)
  );

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

  const {
    lookupOptions, setLookupOptions, onDropdownChange, lookupMetaRef,
    lookupLoading, lookupFlags, onLookupOpen, onLookupSearchInput, onLookupLoadMore,
  } = useLookups(fields, headers, baseUrl, readOnly);
  const onDropdownChangeRef = useRef(onDropdownChange);
  useEffect(() => { onDropdownChangeRef.current = onDropdownChange; }, [onDropdownChange]);

  const [formValues, setFormValues] = useState(() => normalizedInitialData ? { ...normalizedInitialData } : {});
  const [validationErrors, setValidationErrors] = useState({});
  const processedInitialDataRef = useRef(false);
  const isAutoFillingRef = useRef(false);

  const normalizeValueForField = useCallback((field, raw) => {
    if (field.propertyDto?.isLookup) {
      return normalizeLookupInitialValue(raw, !!field.propertyDto?.isMultiSelect);
    }
    const kind = getPickerKind(field.dataType, field.controlName);
    if (kind) return toDayjs(raw, kind);
    if (raw && typeof raw === 'object' && !dayjs.isDayjs(raw) && !Array.isArray(raw)) {
      return raw.value ?? raw.key ?? raw;
    }
    return raw;
  }, []);

  useEffect(() => {
    if (fields.length === 0) return;
    setFormValues(() => {
      const init = {};
      fields.forEach((f) => {
        if (normalizedInitialData && f.fieldName in normalizedInitialData) {
          init[f.fieldName] = normalizeValueForField(f, normalizedInitialData[f.fieldName]);
        } else {
          const def = f.propertyDto?.defaultValue;
          if (f.dataType === 'BOOLEAN') {
            init[f.fieldName] = def === 'true' || def === true;
          } else if (f.propertyDto?.isLookup && f.propertyDto?.isMultiSelect) {
            init[f.fieldName] = [];
          } else {
            init[f.fieldName] = def ?? '';
          }
        }
      });
      return init;
    });
  }, [fields, normalizedInitialData, normalizeValueForField]);

  useEffect(() => {
    if (!normalizedInitialData) return;
    setFormValues((prev) => {
      const updated = { ...prev };
      Object.keys(normalizedInitialData).forEach((fn) => {
        const field = fieldsByName[fn];
        if (!field) return;
        updated[fn] = normalizeValueForField(field, normalizedInitialData[fn]);
      });
      return updated;
    });
    processedInitialDataRef.current = false;
  }, [normalizedInitialData, fieldsByName, normalizeValueForField]);

  useEffect(() => {
    if (readOnly || !normalizedInitialData || processedInitialDataRef.current || fields.length === 0) return;
    const lookupFields = fields.filter((f) => f.propertyDto?.isLookup && !isValueEmpty(normalizedInitialData[f.fieldName]));
    if (lookupFields.length === 0) { processedInitialDataRef.current = true; return; }

    const fill = async () => {
      isAutoFillingRef.current = true;
      try {
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
        for (const f of roots) if (!isValueEmpty(normalizedInitialData[f.fieldName])) await onDropdownChangeRef.current(f.fieldName, normalizedInitialData[f.fieldName]);
        for (const f of deps)  if (!isValueEmpty(normalizedInitialData[f.fieldName])) await onDropdownChangeRef.current(f.fieldName, normalizedInitialData[f.fieldName]);
        processedInitialDataRef.current = true;
      } finally {
        isAutoFillingRef.current = false;
      }
    };
    fill();
  }, [normalizedInitialData, headers, fields]);

  const buildEnrichedData = useCallback(() => {
    const enrichedData = {
      variantId: variantData?.variantId || '',
      variantName: variantData?.variantName || '',
      definitionId: variantData?.definitionId || '',
      fields: {}
    };
    fields.forEach((field) => {
      const fieldValue = formValues[field.fieldName];
      const isLookupField = field.propertyDto?.isLookup;
      const base = {
        variantFieldId: field.variantFieldId || '',
        columnId: field.columnId || '',
        columnName: field.columnName || '',
        fieldName: field.fieldName || '',
        label: field.label || '',
      };
      const pickerKind = getPickerKind(field.dataType, field.controlName);
      if (isLookupField && field.propertyDto?.isMultiSelect && Array.isArray(fieldValue)) {
        const items = fieldValue
          .map((item) => {
            if (item && typeof item === 'object') {
              const k = item.key ?? item.value ?? '';
              const v = item.value ?? item.key ?? '';
              if (k === '' && v === '') return null;
              return { ...item, key: k, value: v };
            }
            if (item === null || item === undefined || item === '') return null;
            return { key: item, value: item };
          })
          .filter(Boolean);
        enrichedData.fields[field.fieldName] = {
          ...base,
          key: items.map((item) => item.key),
          value: items,
        };
      } else if (isLookupField && fieldValue && typeof fieldValue === 'object' && 'key' in fieldValue) {
        enrichedData.fields[field.fieldName] = { ...base, key: fieldValue.key ?? '', value: fieldValue.value ?? '' };
      } else if (pickerKind) {
        const serialized = serializeDateValue(fieldValue, pickerKind);
        enrichedData.fields[field.fieldName] = { ...base, key: serialized, value: serialized };
      } else {
        enrichedData.fields[field.fieldName] = { ...base, key: fieldValue ?? '', value: fieldValue ?? '' };
      }
    });
    return enrichedData;
  }, [formValues, fields, variantData]);

  const validateForm = useCallback(() => {
    const errors = {};
    fields.forEach(({ fieldName, label, dataType, propertyDto, maxLength }) => {
      const { isMandatory, isVisible } = propertyDto || {};
      if (isVisible === false || dataType === 'BOOLEAN') return;
      const v = formValues[fieldName];
      const empty = isValueEmpty(v);
      if (isMandatory && empty) {
        errors[fieldName] = `${label} is required`;
        return;
      }
      if (empty) return;
      if (NUMERIC_TYPES.has(dataType)) {
        const valueToCheck = (typeof v === 'object' && v !== null && !Array.isArray(v) && !dayjs.isDayjs(v))
          ? (v.key ?? v.value)
          : v;
        const str = String(valueToCheck ?? '');
        if (str === '' || isNaN(Number(str))) {
          errors[fieldName] = `${label} must be a valid number`;
          return;
        }
        const maxLen = maxLength ? Number(maxLength) : undefined;
        if (maxLen) {
          const digitCount = DECIMAL_TYPES.has(dataType) ? str.replace(/\./g, '').length : str.length;
          if (digitCount !== maxLen) {
            errors[fieldName] = `${label} must be exactly ${maxLen} digits`;
          }
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
    if (field?.propertyDto?.isLookup && field?.propertyDto?.isMultiSelect && Array.isArray(value)) {
      raw = value.map((item) => {
        if (item && typeof item === 'object') {
          const k = item.key ?? item.value ?? '';
          const v = item.value ?? item.key ?? '';
          return { ...item, key: k, value: v };
        }
        return { key: item, value: item };
      });
    } else if (field?.propertyDto?.isLookup && value && typeof value === 'object' && !dayjs.isDayjs(value) && 'key' in value && 'value' in value) {
      raw = { ...value, key: value.key, value: value.value };
    } else if (value && typeof value === 'object' && !dayjs.isDayjs(value) && 'value' in value) {
      raw = value.value;
    } else {
      raw = value ?? '';
    }

    const getDependentChain = (currentFieldName, visited = new Set()) => {
      const currentMeta = lookupMetaRef.current[currentFieldName];
      if (!currentMeta || visited.has(currentFieldName)) return [];
      visited.add(currentFieldName);

      const directDependents = getLookupDependentFields(currentMeta);
      if (directDependents.length === 0) return [];

      const nested = [];
      directDependents.forEach((depFieldName) => {
        nested.push(depFieldName);
        nested.push(...getDependentChain(depFieldName, visited));
      });
      return nested;
    };

    const dependentFieldNames = field?.propertyDto?.isLookup
      ? getDependentChain(fieldName)
      : [];

    setFormValues((prev) => {
      const next = { ...prev, [fieldName]: raw };
      if (dependentFieldNames.length > 0) {
        dependentFieldNames.forEach((depFieldName) => {
          next[depFieldName] = '';
        });
      }
      return next;
    });

    if (dependentFieldNames.length > 0) {
      setLookupOptions((prev) => {
        const next = { ...prev };
        dependentFieldNames.forEach((depFieldName) => {
          delete next[depFieldName];
        });
        return next;
      });
    }

    if (validationErrors[fieldName]) setValidationErrors((prev) => { const n = { ...prev }; delete n[fieldName]; return n; });
    if (dependentFieldNames.length > 0) {
      setValidationErrors((prev) => {
        const n = { ...prev };
        dependentFieldNames.forEach((depFieldName) => {
          delete n[depFieldName];
        });
        return n;
      });
    }
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
    if (onSubmit) onSubmit(buildEnrichedData());
    return true;
  }, [validateForm, buildEnrichedData, onSubmit]);

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
      if (onSubmit) onSubmit(buildEnrichedData());
      return true;
    },
    reset: handleReset,
    getValues: () => formValues,
    setValues: (vals) => setFormValues((prev) => ({ ...prev, ...vals })),
  }), [formValues, validateForm, buildEnrichedData, handleReset, onSubmit]);

  const gridSize = useMemo(() => {
    const n = columns || 2;
    const s = Math.floor(12 / n);
    return n <= 4 ? { xs: 12, sm: s } : n <= 6 ? { xs: 12, sm: 6, md: s } : { xs: 12, sm: 4, md: s };
  }, [columns]);

  if (!variantData || fields.length === 0) return null;

  return (
    <Box>
      {showHeader && (
        <Box sx={headerSx}>
          <h2 style={headingStyle}>{title || 'Dynamic Form'}</h2>
        </Box>
      )}
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
                dateFormat={dateFormat}
                loading={!!lookupLoading[field.fieldName]}
                serverSideSearch={!!lookupFlags[field.fieldName]?.serverSideSearch}
                serverSidePagination={!!lookupFlags[field.fieldName]?.serverSidePagination}
                onLookupOpen={onLookupOpen}
                onLookupSearchInput={onLookupSearchInput}
                onLookupLoadMore={onLookupLoadMore}
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

CTCB2BCustomerSupplier.displayName = 'CTCB2BCustomerSupplier';
export default CTCB2BCustomerSupplier;
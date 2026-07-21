/**
 * CreateB2BTradingContract4 - Generated Form Component
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
 *   <CreateB2BTradingContract4
 *     requestOptions={{ headers: { Authorization: 'Bearer TOKEN' } }}
 *     onSubmit={(data) => console.log(data)}
 *     view="both"  // 'form' | 'list' | 'both' (default: 'both')
 *   />
 *
 *   // Pre-fill fields:
 *   <CreateB2BTradingContract4
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
const COLUMNS_OPTIONS = [2, 3];
// Field definitions embedded at code generation time — no runtime variant API calls needed
const EMBEDDED_VARIANT_DATA = [
  {
    "variantId": "d70e07bd856a43da910f13efa6488f7c",
    "variantName": "Create B2B Trading Contract 4",
    "definitionId": "IWM",
    "data": [
      {
        "variantFieldId": "d3044e3aab6740d489bb1e87f39bf941",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "9eb9bfa6-eb0f-4ad1-b50f-c61e3b84147d",
        "columnName": "ITM_CTC_EXC_RATE_TYPE",
        "label": "Exchange Rate Type",
        "description": "Exchange Rate Type",
        "maxLength": "15",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_EXC_RATE_TYPE",
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
        "aliasName": "ITM_CTC_EXC_RATE_TYPE",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "98670735e2404bf9977d04fe09ea9399",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "e54fff26-14ed-44cf-9fb9-91278049d65d",
        "columnName": "ITM_CTC_EXC_RATE_DATE",
        "label": "Exchange rate Date",
        "description": "Exchange rate Date",
        "maxLength": "15",
        "dataType": "DATE",
        "technicalDataType": "DATE",
        "controlName": "Date",
        "fieldName": "ITM_CTC_EXC_RATE_DATE",
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
        "aliasName": "ITM_CTC_EXC_RATE_DATE",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "e527404b467f4139b52c07f622d01a25",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "69bae349-6f6e-4962-9ff9-cc175cddc764",
        "columnName": "ITM_CTC_FIXED_EXC_RATE",
        "label": "Fixed Exchange Rate",
        "description": "Fixed Exchange Rate",
        "maxLength": "5",
        "dataType": "BOOLEAN",
        "technicalDataType": "BOOLEAN",
        "controlName": "Input",
        "fieldName": "ITM_CTC_FIXED_EXC_RATE",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": true,
          "isVisible": true,
          "isKey": null,
          "sequence": 3,
          "isHeader": null,
          "isLookup": true,
          "isSearchParam": null,
          "lookupType": "VL",
          "lookupId": "1c63818a340746daa6907f24de8a6fc9",
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
        "aliasName": "ITM_CTC_FIXED_EXC_RATE",
        "lookupRepresentation": null
      },
      {
        "variantFieldId": "c8ecde09a78f49a88d78b928a64dd975",
        "tableId": null,
        "schemaId": null,
        "isKey": null,
        "columnId": "3805878a-0fae-4016-b905-3c0c22a913ce",
        "columnName": "ITM_CTC_NOTES",
        "label": "Description/Notes",
        "description": "Description/Notes",
        "maxLength": "200",
        "dataType": "NVARCHAR",
        "technicalDataType": "NVARCHAR",
        "controlName": "Input",
        "fieldName": "ITM_CTC_NOTES",
        "propertyDto": {
          "isMultiSelect": null,
          "isEditable": true,
          "isMandatory": true,
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
        "aliasName": "ITM_CTC_NOTES",
        "lookupRepresentation": null
      }
    ]
  }
];

// ─── Styles ─────────────────────────────────────────────────────────────────────
const containerSx = { p: 3, maxWidth: '75rem', margin: '0 auto' };
const headerSx = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 };
const layoutToggleSx = { display: 'flex', gap: 1, alignItems: 'center' };
const footerSx = { display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' };
const headingStyle = { margin: 0 };
const layoutLabelStyle = { fontSize: '0.875rem' };
const btnBase = { 
  padding: '0.25rem 0.75rem', 
  border: '1px solid var(--grey-300)', 
  borderRadius: '0.25rem', 
  cursor: 'pointer',
  fontSize: '0.875rem'
};
const btnActive = { ...btnBase, background: 'var(--primary-main)', color: 'var(--contrast-text)' };
const btnInactive = { ...btnBase, background: 'var(--background-default)', color: 'var(--text-primary)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { 
  textAlign: 'left', 
  padding: '0.75rem 1rem', 
  borderBottom: '2px solid var(--grey-300)', 
  backgroundColor: 'var(--primary-light)',
  fontWeight: 600
};
const thActionStyle = { ...thStyle, textAlign: 'center' };
const tdStyle = { padding: '0.625rem 1rem', borderBottom: '1px solid var(--grey-300)' };
const tdActionStyle = { ...tdStyle, textAlign: 'center' };
const actionButtonsSx = { display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center' };
// ─── ListView Component ──────────────────────────────────────────────────────────
export const ListView = ({ data = [], columns = [], onEdit, onDelete, formatValue }) => {
  const hasActions = onEdit || onDelete;
  const columnCount = 1 + columns.length + (hasActions ? 1 : 0);

  return (
    <TableContainer sx={{ mt: 3 }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            {columns.map((col) => (
              <th key={col.fieldName || col.key} style={thStyle}>
                {col.label || col.name}
              </th>
            ))}
            {hasActions && <th style={thActionStyle}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {(!data || data.length === 0) ? (
            <tr>
              <td colSpan={columnCount} style={{ ...tdStyle, textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No records yet
              </td>
            </tr>
          ) : (
            data.map((entry, index) => (
            <tr key={entry._id || entry.id || index}>
              <td style={tdStyle}>{index + 1}</td>
              {columns.map((col) => {
                const fieldName = col.fieldName || col.key;
                const value = entry[fieldName];
                const displayValue = formatValue ? formatValue(col, value) : value;
                return (
                  <td key={fieldName} style={tdStyle}>
                    {displayValue !== null && displayValue !== undefined ? String(displayValue) : ''}
                  </td>
                );
              })}
              {(onEdit || onDelete) && (
                <td style={tdActionStyle}>
                  <Box sx={actionButtonsSx}>
                    {onEdit && (
                      <IconButton onClick={() => onEdit(index)} size='small' title='Edit'>
                        <Pencil />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton onClick={() => onDelete(index)} size='small' title='Delete' color='error'>
                        <Trash />
                      </IconButton>
                    )}
                  </Box>
                </td>
              )}
            </tr>
            ))
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
  if (!isVisible) return null;

  if (dataType === 'BOOLEAN') {
    return (
      <FormControlLabel
        control={<Switch checked={!!value} onChange={(e) => onChange(fieldName, e.target.checked)} disabled={!isEditable || readOnly} />}
        label={label}
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
        renderInput={(params) => (
          <TextField {...params} label={label} required={!!isMandatory} error={!!error} helperText={error} size='medium' fullWidth name={fieldName} />
        )}
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
        slotProps={{ textField: { size: 'medium', fullWidth: true, name: fieldName } }}
      />
    );
  }

  return (
    <TextField
      label={label} value={value ?? ''}
      onChange={(e) => { const v = e.target.value; if (NUMERIC_TYPES.has(dataType) && maxLength && v.length > Number(maxLength)) return; onChange(fieldName, v); }}
      required={!!isMandatory} disabled={!isEditable || readOnly} type={NUMERIC_TYPES.has(dataType) ? 'number' : 'text'}
      inputProps={{ maxLength: maxLength ? Number(maxLength) : undefined }}
      multiline={!NUMERIC_TYPES.has(dataType) && !!maxLength && Number(maxLength) > TEXTAREA_THRESHOLD}
      rows={!NUMERIC_TYPES.has(dataType) && !!maxLength && Number(maxLength) > TEXTAREA_THRESHOLD ? 4 : undefined}
      error={!!error} helperText={error} size='medium' fullWidth name={fieldName}
    />
  );
});

// ─── Main Component ──────────────────────────────────────────────────────────────
const CreateB2BTradingContract4 = forwardRef(({ variantData: externalVariantData, initialData, requestOptions, onSubmit, onReset, columns = 2, title, showHeader = true, showFooter = true, readOnly = false, view = 'both' }, ref) => {
  const headers = requestOptions?.headers;
  const baseUrl = requestOptions?.baseUrl || '';

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

  const { lookupOptions, onDropdownChange, lookupMetaRef } = useLookups(fields, headers, baseUrl, readOnly || view === 'list');
  const onDropdownChangeRef = useRef(onDropdownChange);
  useEffect(() => { onDropdownChangeRef.current = onDropdownChange; }, [onDropdownChange]);

  // Pre-populate from initialData so DatePicker receives the correct value on the very first render
  const [formValues, setFormValues] = useState(() => {
    if (!initialData) return {};
    const init = {};
    Object.entries(initialData).forEach(([k, v]) => {
      if (typeof v === 'string' && v && ISO_DATE_RE.test(v)) v = dayjs(v);
      init[k] = v;
    });
    return init;
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [viewMode, setViewMode] = useState(view === 'both' ? 'form' : view); // 'form' or 'list'
  const [submittedEntries, setSubmittedEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const processedInitialDataRef = useRef(false);
  const isAutoFillingRef = useRef(false);

  // Initialise form values once fields are loaded
  useEffect(() => {
    if (fields.length === 0) return;
    setFormValues(() => {
      const init = {};
      fields.forEach((f) => {
        if (initialData && f.fieldName in initialData) {
          let v = initialData[f.fieldName];
          if (typeof v === 'string' && v && (isDateType(f.dataType, f.controlName) || ISO_DATE_RE.test(v))) v = dayjs(v);
          init[f.fieldName] = v;
        } else {
          const def = f.propertyDto?.defaultValue;
          init[f.fieldName] = f.dataType === 'BOOLEAN' ? (def === 'true' || def === true) : (def ?? '');
        }
      });
      return init;
    });
  }, [fields, initialData]);

  // Sync initialData changes into form
  useEffect(() => {
    if (!initialData) return;
    setFormValues((prev) => {
      const updated = { ...prev };
      Object.keys(initialData).forEach((fn) => {
        const field = fieldsByName[fn];
        if (!field) return;
        let v = initialData[fn];
        if (typeof v === 'string' && v && (isDateType(field.dataType, field.controlName) || ISO_DATE_RE.test(v))) v = dayjs(v);
        updated[fn] = v;
      });
      return updated;
    });
    processedInitialDataRef.current = false;
  }, [initialData, fieldsByName]);

  // Auto-fill dependent lookups when initialData is provided
  useEffect(() => {
    if (readOnly || !initialData || !headers || processedInitialDataRef.current || fields.length === 0) return;
    const lookupFields = fields.filter((f) => f.propertyDto?.isLookup && initialData[f.fieldName]);
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
        for (const f of roots) if (initialData[f.fieldName]) await onDropdownChangeRef.current(f.fieldName, initialData[f.fieldName]);
        for (const f of deps)  if (initialData[f.fieldName]) await onDropdownChangeRef.current(f.fieldName, initialData[f.fieldName]);
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
      } else if (NUMERIC_TYPES.has(dataType) && isNaN(Number(v))) {
        errors[fieldName] = `${label} must be a valid number`;
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
    // Guard: only extract .value from plain option objects (e.g. Autocomplete), NOT from dayjs instances
    const raw = (value !== null && value !== undefined && typeof value === 'object' && !dayjs.isDayjs(value) && 'value' in value)
      ? value.value
      : (value ?? '');
    setFormValues((prev) => ({ ...prev, [fieldName]: raw }));
    if (validationErrors[fieldName]) setValidationErrors((prev) => { const n = { ...prev }; delete n[fieldName]; return n; });
    const field = fieldsByName[fieldName];
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
    
    // Add to submitted entries list
    const entry = { ...formValues, _id: Date.now() };
    if (editingIndex !== null) {
      setSubmittedEntries((prev) => {
        const updated = [...prev];
        updated[editingIndex] = entry;
        return updated;
      });
      setEditingIndex(null);
    } else {
      setSubmittedEntries((prev) => [...prev, entry]);
    }
    
    // Reset form
    handleReset();
    
    // Switch to list view
    if(view === 'both') setViewMode('list');
    
    // Call custom onSubmit if provided
    if (onSubmit) onSubmit(formValues);
    
    return true;
  }, [formValues, validateForm, editingIndex, handleReset, onSubmit]);

  useImperativeHandle(ref, () => ({
    validate: () => { const e = validateForm(); if (Object.keys(e).length) { setValidationErrors(e); return false; } return true; },
    submit: () => handleSubmit(null),
    reset: handleReset,
    getValues: () => formValues,
    setValues: (vals) => setFormValues((prev) => ({ ...prev, ...vals })),
  }), [formValues, validateForm, handleReset, handleSubmit]);

  // Handle edit from list view - process lookups like initialData
  const handleEdit = useCallback(async (index) => {
    // Copy entry and restore date strings as dayjs objects for DatePicker
    const entry = { ...submittedEntries[index] };
    fields.forEach((f) => {
      if (isDateType(f.dataType, f.controlName) && typeof entry[f.fieldName] === 'string' && entry[f.fieldName]) {
        entry[f.fieldName] = dayjs(entry[f.fieldName]);
      }
    });
    setFormValues(entry);
    setEditingIndex(index);
    setViewMode('form');
    
    // Process dependent lookups if not in readOnly mode and headers available
    if (!readOnly && headers && fields.length > 0) {
      const lookupFields = fields.filter((f) => f.propertyDto?.isLookup && entry[f.fieldName]);
      if (lookupFields.length > 0) {
        isAutoFillingRef.current = true;
        try {
          // Wait for lookup metadata to be ready
          await new Promise((resolve) => {
            const t0 = Date.now();
            const check = () => {
              if (lookupFields.every((f) => lookupMetaRef.current[f.fieldName])) return resolve(true);
              if (Date.now() - t0 > 10000) return resolve(false);
              setTimeout(check, 50);
            };
            check();
          });
          
          // Process lookups in order: root lookups first, then dependent ones
          const roots = lookupFields.filter((f) => !f.propertyDto?.isDependent);
          const deps = lookupFields.filter((f) => f.propertyDto?.isDependent);
          for (const f of roots) if (entry[f.fieldName]) await onDropdownChangeRef.current(f.fieldName, entry[f.fieldName]);
          for (const f of deps) if (entry[f.fieldName]) await onDropdownChangeRef.current(f.fieldName, entry[f.fieldName]);
        } finally {
          isAutoFillingRef.current = false;
        }
      }
    }
  }, [submittedEntries, readOnly, headers, fields]);

  // Handle delete from list view
  const handleDelete = useCallback((index) => {
    setSubmittedEntries((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Format value for display in list
  const formatDisplayValue = useCallback((field, value) => {
    if (value === null || value === undefined || value === '') return '-';
    const { dataType, controlName, propertyDto } = field;
    if (dataType === 'BOOLEAN') return value ? 'Yes' : 'No';
    if (propertyDto?.isLookup) {
      const options = lookupOptions[field.fieldName] || [];
      const obj = typeof value === 'string' && value
        ? options.find((o) => o.value === value || o.key === value)
        : value;
      return obj?.value ?? obj?.key ?? value;
    }
    if ((isDateType(dataType, controlName) || dayjs.isDayjs(value)) && value) {
      return value?.format ? value.format('DD MMM YYYY') : String(value);
    }
    return String(value);
  }, [lookupOptions]);

  const gridSize = useMemo(() => {
    const n = columns || 2;
    const s = Math.floor(12 / n);
    return n <= 4 ? { xs: 12, sm: s } : n <= 6 ? { xs: 12, sm: 6, md: s } : { xs: 12, sm: 4, md: s };
  }, [columns]);

  if (!variantData || fields.length === 0) return null;

  return (
    <Box sx={containerSx}>
      {/* Header */}
      {showHeader && (
        <Box sx={headerSx}>
          <h2 style={headingStyle}>{title || 'Dynamic Form'}</h2>
          <Box sx={layoutToggleSx}>
            {!readOnly && view === 'both' && (
              <>
                <span style={layoutLabelStyle}>View:</span>
                <button type='button' onClick={() => setViewMode('form')} style={viewMode === 'form' ? btnActive : btnInactive}>Form</button>
                <button type='button' onClick={() => setViewMode('list')} style={viewMode === 'list' ? btnActive : btnInactive}>List ({submittedEntries.length})</button>
              </>
            )}
          </Box>
        </Box>
      )}

      {/* Form View */}
      {(view === 'form' || view === 'both') && viewMode === 'form' && (
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
              <Button variant='outlined' onClick={() => { handleReset(); setEditingIndex(null); }} type='button'>{editingIndex !== null ? 'Cancel' : 'Reset'}</Button>
              <Button variant='contained' type='submit'>{editingIndex !== null ? 'Update' : 'Submit'}</Button>
            </Box>
          )}
        </form>
      )}

      {/* List View */}
      {(view === 'list' || view === 'both') && viewMode === 'list' && (
        <Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h6'>Total Entries: {submittedEntries.length}</Typography>
            {view === 'both' && (
              <Button variant='contained' onClick={() => setViewMode('form')}>Add New Entry</Button>
            )}
          </Box>
          <ListView 
            data={submittedEntries}
            columns={fields.filter(f => f.propertyDto?.isVisible !== false)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            formatValue={formatDisplayValue}
          />
        </Box>
      )}
    </Box>
  );
});

CreateB2BTradingContract4.displayName = 'CreateB2BTradingContract4';
export default CreateB2BTradingContract4;
import React from "react";
import { Box, MenuItem, Tooltip } from "@mui/material";
import { useState } from "react";
import moment from "moment-timezone";
import EditableCell from "../EditableCell";
import { CustomTextField } from "../../UIComponents/CustomTextField";
import CustomAutocomplete from "../../UIComponents/CustomAutocomplete";
import CustomSelect from "../../UIComponents/CustomSelect";
import { useCursorPosition } from "../../hooks/useCursorPosition";
import { MAX_QUANTITY, MAX_UNIT_PRICE } from "../../dataStore/constants";

/**
 * Editable Quantity Cell Component
 */
export const EditableQuantityCell = ({ value, onChange, onKeyDown }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");
  return (
    <EditableCell>
      <Tooltip
        title={tooltipMessage}
        open={showTooltip}
        arrow
        placement="top"
      >
        <Box>
          <CustomTextField
            value={value ?? ""}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            onChange={(e) => {
              const newVal = e.target.value;
              // Allow empty string or digits only (no decimals)
              if (newVal !== "" && !/^\d+$/.test(newVal)) return;
              const numVal = newVal === "" ? 0 : parseInt(newVal, 10);
              if (numVal > MAX_QUANTITY) {
                setTooltipMessage(`Quantity cannot exceed ${MAX_QUANTITY.toLocaleString()}`);
                setShowTooltip(true);
                return;
              }
              if (newVal !== "" && numVal === 0) {
                setTooltipMessage("Quantity must be greater than 0");
                setShowTooltip(true);
              } else {
                setShowTooltip(false);
              }
              onChange(newVal);
            }}
            onKeyDown={onKeyDown}
            onBlur={() => setShowTooltip(false)}
            error={showTooltip}
          />
        </Box>
      </Tooltip>
    </EditableCell>
  );
};

/**
 * Editable Unit of Measure Cell Component
 */
export const EditableUomCell = ({ value, onChange, onKeyDown }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <EditableCell>
      <Tooltip
        title="UOM must be 1–3 characters"
        open={showTooltip}
        arrow
        placement="top"
      >
        <Box>
          <CustomTextField
            value={value ?? ""}
            inputProps={{ maxLength: 3 }}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^[A-Za-z]{0,3}$/.test(val)) {
                setShowTooltip(val.length === 3);
                onChange(val.toUpperCase());
              }
            }}
            onKeyDown={onKeyDown}
            onBlur={() => setShowTooltip(false)}
          />
        </Box>
      </Tooltip>
    </EditableCell>
  );
};

/**
 * Editable Unit Price Cell Component
 */
export const EditableUnitPriceCell = ({ value, onChange }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");
  return (
    <EditableCell>
      <Tooltip
        title={tooltipMessage}
        open={showTooltip}
        arrow
        placement="top"
      >
        <Box>
          <CustomTextField
            value={value ?? ""}
            inputProps={{ inputMode: "decimal" }}
            onChange={(e) => {
              const v = e.target.value;
              // Block non-numeric/non-decimal characters entirely
              if (v !== "" && !/^\d*\.?\d*$/.test(v)) return;
              // Show tooltip and block if more than 3 decimal places are entered
              if (/\.\d{4,}$/.test(v)) {
                setTooltipMessage("Only 3 decimal places are allowed");
                setShowTooltip(true);
                return;
              }
              const numVal = v === "" ? 0 : parseFloat(v);
              if (!isNaN(numVal) && numVal > MAX_UNIT_PRICE) {
                setTooltipMessage(`Unit Price cannot exceed ${MAX_UNIT_PRICE.toLocaleString()}`);
                setShowTooltip(true);
                return;
              }
              if (v !== "" && numVal === 0 && !v.endsWith(".")) {
                setTooltipMessage("Unit Price must be greater than 0");
                setShowTooltip(true);
              } else {
                setShowTooltip(false);
              }
              onChange(v);
            }}
            onBlur={() => setShowTooltip(false)}
            error={showTooltip}
          />
        </Box>
      </Tooltip>
    </EditableCell>
  );
};

/**
 * Material Description Autocomplete Cell Component
 */
export const MaterialDescriptionAutocomplete = ({ 
  value, 
  options, 
  onChange, 
  onInputChange,
  onKeyDown 
}) => {
  return (
    <EditableCell>
      <CustomAutocomplete
        freeSolo
        options={options.map((opt) => opt.materialDescription)}
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        placeholder="Enter SAP Material Description"
        // Handle key events via input props
        inputProps={{
          onKeyDown: onKeyDown
        }}
      />
    </EditableCell>
  );
};

/**
 * Material Number Autocomplete Cell Component
 */
export const MaterialNumberAutocomplete = ({ 
  value, 
  options, 
  onChange, 
  onInputChange,
  onKeyDown 
}) => {
  return (
    <EditableCell>
      <CustomAutocomplete
        freeSolo
        options={options.map((opt) => (opt.materialId || "").replace(/^0+/, ""))}
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        placeholder="Enter SAP Material ID"
        inputProps={{
          inputMode: "numeric",
          onKeyDown: onKeyDown
        }}
      />
    </EditableCell>
  );
};

/**
 * Editable Hour Field Component
 */
export const EditableHourField = ({ value, onChange }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Tooltip
      title="Please enter a valid hour between 0 and 23"
      open={showTooltip}
      arrow
      placement="top"
    >
      <span>
      <CustomTextField
        value={value}
        placeholder="Hour(0-23)"
        inputProps={{ min: 0, max: 23, step: 1 }}
        onChange={(e) => {
        e.stopPropagation();
        const val = e.target.value;
      
        if (val === "" || /^\d{1,2}$/.test(val)) {
          const num = Number(val);
      
          if (val === "" || (num >= 0 && num <= 23)) {
            onChange(val === "" ? "" : String(num));
            setShowTooltip(false);
          } else {
            setShowTooltip(true);
          }
        } else {
          setShowTooltip(true);
        }
      }}
        onBlur={() => setShowTooltip(false)}
        error={showTooltip}
        sx={{ width: 90 }}
      />
      </span>
    </Tooltip>
  );
};

/**
 * Editable Minute Select Component
 */
export const EditableMinuteSelect = ({ value, onChange }) => {
  const minuteOptions = ["00", "15", "30", "45"];
  const currentValue = value === 0 || value === "0" ? "00" : String(value);

  return (
    <CustomSelect
      value={currentValue}
      onChange={(e) => onChange(e.target.value)}
      options={minuteOptions.map((m) => ({ key: m, value: m }))}
    />
  );
};

/**
 * Editable Day Select Component
 */
export const EditableDaySelect = ({ value, onChange }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <CustomSelect
      value={value}
      placeholder="Select Day"
      onChange={(e) => {
        e.stopPropagation();
        onChange(e.target.value);
      }}
      options={days.map((d) => ({ key: d, value: d }))}
      sx={{ minWidth: 140 }}
    />
  );
};

/**
 * Editable Timezone Select Component
 */
export const EditableTimezoneSelect = ({ value, timezones, onChange }) => {
  const timezoneOptions = timezones.map((tz) => {
    const offset = moment().tz(tz).format("Z");
    return {
      key: tz,
      value: `${tz} (UTC${offset})`
    };
  });

  return (
    <CustomSelect
      value={value}
      placeholder="Select Time Zone"
      onChange={(e) => {
        e.stopPropagation();
        onChange(e.target.value);
      }}
      disabled={timezones.length === 0}
      options={timezoneOptions}
    />
  );
};

/**
 * Admin Editable Text Field Component
 */
export const AdminEditableTextField = ({ 
  value, 
  onChange, 
  error, 
  helperText, 
  maxLength,
  multiline = false,
  fieldBinding 
}) => {
  const { inputRef, handleChange } = useCursorPosition(value);

  const getTooltipMessage = () => {
    const len = (value || "").length;
    if (maxLength && len >= maxLength) {
      return `Maximum ${maxLength} characters allowed`;
    }

    if (fieldBinding === "priority") {
      return "Valid numbers allowed: 1-99 only";
    }
    if (fieldBinding === "orderBlockDesc") {
      return `Description: 3-${maxLength || 255} characters required`;
    }
    if (fieldBinding === "orderBlock") {
      return "Valid numbers allowed: 1-99 only";
    }
    return "";
  };

  const errorMessage = helperText || error;
  const tooltipMessage = errorMessage || getTooltipMessage();

  const handleInputChange = (e) => {
    e.stopPropagation();
    handleChange(onChange)(e);
  };

  return (
    <EditableCell>
      <Tooltip
        title={tooltipMessage}
        placement="top-start"
        arrow
        open={errorMessage ? true : undefined}
      >
        <Box>
          <CustomTextField
            inputRef={inputRef}
            value={value}
            onChange={handleInputChange}
            error={Boolean(errorMessage)}
            inputProps={{ maxLength }}
            maxRows={multiline ? 2 : 1}
          />
        </Box>
      </Tooltip>
    </EditableCell>
  );
};

/**
 * Admin Editable Number Field Component
 */
export const AdminEditableNumberField = ({
  value,
  onChange,
  onBlur,
  fieldBinding,
  minValue = 0,
  step = 1,
}) => {
  const { inputRef, cursorPosRef, handleChange } = useCursorPosition(value);
  const isFrequencyField = fieldBinding === "frequency";
  const isDataRetentionPeriodField = fieldBinding === "dataRetentionPeriod";
  const tooltipMessage = isFrequencyField
    ? "Valid numbers allowed: 1-999 only"
    : isDataRetentionPeriodField
    ? "Valid numbers allowed: 1-12 only"
    : "";

  const handleInputChange = (e) => {
    e.stopPropagation();

    const input = e.target;
    cursorPosRef.current = input.selectionStart;
    const val = e.target.value;

    // Frequency validation
    if (isFrequencyField) {
      // Allow clearing
      if (val === "") {
        onChange(val);
        return;
      }

      // Allow only numbers
      if (!/^\d+$/.test(val)) {
        return;
      }

      // Max 3 digits
      if (val.length > 3) {
        return;
      }

      const numericValue = parseInt(val, 10);

      // Allow only 1-999
      if (numericValue >= 1 && numericValue <= 999) {
        onChange(val);
      }
    }
    if (isDataRetentionPeriodField) {
      if (val === "") {
        onChange(val);
        return;
      }

      if (!/^\d+$/.test(val)) {
        return;
      }

      if (val.length > 2) {
        return;
      }

      const numericValue = parseInt(val, 10);

      if (numericValue >= 1 && numericValue <= 12) {
        onChange(val);
      }

      return;
    } else {
      onChange(val);
    }
  };

  return (
    <Tooltip
      title={tooltipMessage}
      placement="top-start"
      arrow
    >
      <Box>
        <CustomTextField
          inputRef={inputRef}
          value={value || ""}
          placeholder={
            isFrequencyField
              ? "1-999 Only"
              : isDataRetentionPeriodField
                ? "1-12 Only"
                : ""
          }
          onChange={handleInputChange}
          onBlur={onBlur}
          inputProps={{
            min: minValue,
            max: isFrequencyField
              ? 999
              : isDataRetentionPeriodField
                ? 12
                : undefined,
            maxLength: isFrequencyField ? 3 : undefined,
            step: step,
            inputMode: isFrequencyField ? "numeric" : undefined,
            pattern: isFrequencyField ? "[0-9]*" : undefined,
            required: isFrequencyField || isDataRetentionPeriodField,
          }}
          sx={{ width: 120 }}
        />
      </Box>
    </Tooltip>
  );
};

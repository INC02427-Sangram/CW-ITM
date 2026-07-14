import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CustomDatePicker = ({
  value,
  onChange,
  name,
  format = "MM-DD-YYYY",
  disableFuture = false,
  disablePast = false,
  placeholder,
  height = "40px",
  ...props
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        format={format}
        value={value}
        name={name}
        onChange={onChange}
        disableFuture={disableFuture}
        disablePast={disablePast}
        slotProps={{
          textField: {
            placeholder: placeholder,
            size: "small",
            sx: {
              height: `${height} !important`,
              width: "100%",
              "& .MuiInputBase-root": {
                height: `${height} !important`,
                fontSize: "0.875rem",
              },
              "& .MuiInputBase-input": {
                height: `${height} !important`,
                padding: "0 14px",
                fontSize: "0.875rem",
                boxSizing: "border-box",
              },
              "& .MuiOutlinedInput-root": {
                height: `${height} !important`,
                padding: "0 10px 0 5px",
              },
            },
          },
          popper: {
            sx: {
              "& .MuiPaper-root": {
                marginTop: "8px",
                boxShadow:" rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
              },
            },
          },
        }}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;

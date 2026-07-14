import React from "react";
import { Autocomplete, TextField, ListItemText, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { menuItemDropdownSx } from "./styles/menuItemDropdownSx";
export const autocompleteSlotProps = {
    inputRoot: {
        sx: {
            width: "100% !important",
            display: "flex",
            flexWrap: "wrap !important",
            "& .MuiInputBase-root": {
                width: "100% !important",
                margin: 0,
            },
            "& .MuiAutocomplete-input": {
                width: "100% !important",
            },
        },
    },
    popper: {
        placement: "bottom-start",
        modifiers: [
            {
                name: "sameWidth",
                enabled: true,
                phase: "beforeWrite",
                requires: ["computeStyles"],
                fn: ({ state }) => {
                    state.styles.popper.minWidth = `${state.rects.reference.width}px`;
                },
            },
        ],
        sx: {
            width: "fit-content !important",
            zIndex: (theme) => theme.zIndex.modal + 1,
        },
    },
    paper: {
        sx: {
            width: "100%",
            marginTop: "8px",
            boxShadow: " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            padding: "0px 5px"
        },
    },
    listbox: {
        sx: {
            padding: 0,
            "& .MuiAutocomplete-option": {
                padding: 0,
            },
        },
    },
};

const CustomAutocomplete = ({
    options = [],
    value,
    onChange,
    onInputChange,
    name,
    placeholder = "Type to search",
    freeSolo = false,
    loading = false,
    noOptionsText = "No options",
    disabled = false,
    getOptionLabel = (option) => option,
    renderOption,
    height = "40px",
    className,
    readOnly = false,
    ...props
}) => {
    const theme = useTheme();

    const filterAutoCompleteSX = {
        "& input": {
            height: "1rem",
            fontSize: "0.875rem",
        },
        "& .MuiOutlinedInput-root": {
            padding: "0 10px !important",
            height: `${height} !important`,
        },
        "& .MuiAutocomplete-inputFocused":{
            padding:"7.5px 30px 7.5px 5px !important"
        }
       
    };

    const outlinedInputBaseSx = {
        height: `${height} !important`,
        "& .MuiInputBase-input": {
            fontSize: "0.875rem",
        },
    };

    const defaultRenderOption = (props, option) => {
        const { key, ...otherProps } = props;
        return (
            <MenuItem
                {...otherProps}
                key={key}
                sx={menuItemDropdownSx(theme)}
            >
                <ListItemText
                    primary={getOptionLabel(option)}
                    primaryTypographyProps={{ fontSize: "0.875rem" }}
                />
            </MenuItem>
        );
    };

    return (
        <Autocomplete
            name={name}
            options={options}
            value={value || ""}
            onChange={onChange}
            onInputChange={onInputChange}
            freeSolo={freeSolo}
            loading={loading}
            disabled={disabled}
            noOptionsText={noOptionsText}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption || defaultRenderOption}
            slotProps={autocompleteSlotProps}
            renderInput={(params) => (
                <TextField
                    {...params}
                    name={name}
                    placeholder={placeholder}
                    size="small"
                    sx={outlinedInputBaseSx}
                    inputProps={{
                        ...params.inputProps,
                        readOnly: readOnly,   // ✅ THIS IS THE KEY
                    }}
                />
            )}
            sx={filterAutoCompleteSX}
            className={className}
            {...props}
        />
    );
};

export default CustomAutocomplete;

import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from "react";
import { Grid, Autocomplete, TextField, Typography } from "@mui/material";
import fnServiceRequest from "../../utility/fnServiceRequest";
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        console.log("Debounced function called");
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
import { useSelector, useDispatch } from "react-redux";
import { CustomerAutocompleteField } from "../../UIComponents/CustomerAutocompleteField";
import AppTypography from "../../UIComponents/AppTypography";
const DEBOUNCE_DELAY = 1000;
export const PayerToField = ({
    editMode,
    selectedPayerTo,
    payerToInputValue,
    setPayerToInputValue,
    payerToDropdown,
    apiPayerToOptions,
    setApiPayerToOptions,
    isPayerToSearching,
    setIsPayerToSearching,
    payerToChangeHandler,
    theme,
    t,
    gridItemWidth,
    buildLabel,
    formatAddress,
    outlinedInputBaseSx,
    headerLabelSx,
    salesOrderData,
    selectedSoldTo
}) => {
    const GRID_WIDTH = 3;
    const gridResponsiveConfig =
        gridItemWidth > GRID_WIDTH
            ? {
                xl: 6,
                lg: 6,
                md: 6,
                sm: 6,
                xs: 12,
            }
            : {
                xl: 2,
                lg: 2,
                md: 3,
                sm: 6,
                xs: 12,
            };
    const selectedSoldToRef = useRef(selectedSoldTo);
    const status = useSelector((state) => state.appReducer.status);
    useEffect(() => {
        selectedSoldToRef.current = selectedSoldTo;
    }, [selectedSoldTo]);
    const fnSearchCustomer = (customerId, setApiPayerToOptions) => {
        if (!customerId) return;

        const { division, salesOrg, distChannel, language } = salesOrderData; // Ensure salesOrderData is accessible here
        const soldtoid = selectedSoldToRef.current?.sapCustomerId;
        const sUrl = `/JavaServices_Oauth/api/odata/getPartnerSearch?customerNum=${soldtoid}&customerNum2=${customerId}&salesOrg=${salesOrg}&division=${division}&distChan=${distChannel}&language=${language}&partnerFunctionFlag=${"P"}`;

        fnServiceRequest(
            sUrl,
            "GET",
            (response) => {
                const results = response?.data.customerList ?? [];
                const list = results.map((r) => ({
                    ...r,
                    sapCustomerName: r.name1?.trim() ?? "",
                    sapCustomerId: r.customerNum ?? "",
                }));
                setApiPayerToOptions(list);
            },
            (error) => console.error("Payer To search failed", error)
        );
    };
    const debouncedPayerToSearch = useRef(
        debounce((id) => fnSearchCustomer(id, setApiPayerToOptions), DEBOUNCE_DELAY)
    ).current;

    const payerToOptions = apiPayerToOptions.length > 0 ? apiPayerToOptions : ((payerToInputValue && isPayerToSearching) ? [] : payerToDropdown);


    return (
        <>
            <Grid item {...gridResponsiveConfig}>
                <Typography variant="subtitle2" className="headerInfo-labels" sx={headerLabelSx}>
                    {t("Payer To ID")}
                </Typography>

                {editMode ? (
                    <CustomerAutocompleteField
                        id="payerToId"
                        value={selectedPayerTo || null}
                        inputValue={payerToInputValue}
                        onInputChange={(e, v, reason) => {
                            if (reason === "reset") return;
                            setPayerToInputValue(v);
                            const cleaned = v.trim();
                            if (cleaned.length >= 1) {
                                setIsPayerToSearching(true);
                                debouncedPayerToSearch(cleaned, salesOrderData, selectedSoldTo);
                            } else {
                                setIsPayerToSearching(false);
                                setApiPayerToOptions([]);
                            }
                        }}
                        onChange={(e, newVal) => {
                            payerToChangeHandler(e, newVal);
                            setIsPayerToSearching(false);
                            setApiPayerToOptions([]);
                            if (!newVal) {
                                setPayerToInputValue("");
                                return;
                            }
                            setPayerToInputValue(newVal ? `${newVal.sapCustomerId} - ${newVal.sapCustomerName1 ?? newVal.sapCustomerName}` : "");
                        }}
                        options={payerToOptions}
                        filterOptions={(x) => x}
                        isOptionEqualToValue={(option, value) => option?.sapCustomerId === value?.sapCustomerId}
                        getOptionLabel={(option) => {
                            if (!option || !option.sapCustomerId) return "";
                            return `${option.sapCustomerId} - ${option.sapCustomerName1 ?? option.sapCustomerName ?? ""}`;
                        }}
                        placeholder={"Enter Payer To Id"}
                    />
                ) : Array.isArray(payerToDropdown) && payerToDropdown.length <= 1 ? (
                    <AppTypography variant="body2" className="unedited-mode">
                        {selectedPayerTo?.sapCustomerId || "-"}
                    </AppTypography>
                ) : (
                    <CustomerAutocompleteField
                        limitTags={1}
                        id="payerToId"
                        value={selectedPayerTo || null}
                        ChipProps={{ size: "small" }}
                        onChange={payerToChangeHandler}
                        disabled={!["toBeReviewed", "pendingForApproval"].includes(status)}
                        autoSelect={false}
                        options={payerToDropdown}
                        getOptionLabel={(option) => `${option.sapCustomerId ?? ""} - ${option.sapCustomerName1 ?? option.sapCustomerName ?? ""}`}
                    />
                )}
            </Grid>

            <Grid item {...gridResponsiveConfig}>
                <Typography variant="subtitle2" className="headerInfo-labels" sx={headerLabelSx}>
                    {t("Payer To Name")}
                </Typography>

                {editMode ? (
                    <CustomerAutocompleteField
                        readOnly={true}
                        limitTags={1}
                        id="payerToName"
                        value={selectedPayerTo}
                        ChipProps={{ size: "small" }}
                        autoSelect={false}
                        options={payerToDropdown}
                        getOptionLabel={(option) => option.sapCustomerName1 ?? option.sapCustomerName ?? ""}
                        placeholder={"Enter Payer To Name"}
                    />
                ) : (
                    <AppTypography variant="body2" className="unedited-mode">
                        {selectedPayerTo?.sapCustomerName1 ?? selectedPayerTo?.sapCustomerName ?? "-"}
                    </AppTypography>
                )}
            </Grid>
        </>
    );
};


export default PayerToField;

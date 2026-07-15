import React from 'react'
import { Grid, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { AppTypography } from "../../UIComponents/AppTypography";
import { CustomerAutocompleteField } from "../../UIComponents/CustomerAutocompleteField";
import { CustomTextField } from "../../UIComponents/CustomTextField";
import { toBool, buildLabel, formatAddress, getDefaultCustomer } from "./utils/customerUtils";
const SoldToFields = ({
    editMode,
    selectedSoldTo,
    soldToInputValue,
    setSoldToInputValue,
    soldToDropdown,
    apiSoldToOptions,
    setApiSoldToOptions,
    isSoldToSearching,
    setIsSoldToSearching,
    debouncedSoldToSearch,
    soldToChangeHandler,
    soldToOptions,
    t,
    headerLabelSx,
    gridResponsiveConfig,
    salesOrderData,
    salesOrderDetails,
    status,
    isSoldToPrior,
}) => {
    return (
        <>

            <Grid item {...gridResponsiveConfig}>
                <Typography
                    variant="subtitle2"
                    className="headerInfo-labels"
                    sx={headerLabelSx}
                >
                    {t("soldToId")}
                </Typography>
                {editMode ? (
                    <CustomerAutocompleteField
                        id="soldToId"
                        value={selectedSoldTo || null}
                        inputValue={soldToInputValue}
                        onInputChange={(e, v, reason) => {
                            if (reason === "reset") {
                                return;
                            }

                            setSoldToInputValue(v);
                            const cleaned = v.trim();

                            if (cleaned.length >= 1) {
                                setIsSoldToSearching(true);
                                debouncedSoldToSearch(cleaned, salesOrderData);
                            } else {
                                setIsSoldToSearching(false);
                                setApiSoldToOptions([]);
                            }
                        }}
                        onChange={(e, newVal) => {
                            console.log("Sibasi",isSoldToPrior)
                            soldToChangeHandler(e, newVal,isSoldToPrior);
                            setIsSoldToSearching(false);
                            setApiSoldToOptions([]);
                            console.log("Selected Sold To:", newVal);
                            if (!newVal) {
                                setSoldToInputValue("");
                                return;
                            } else {
                                setSoldToInputValue(
                                    `${newVal.sapCustomerId} - ${newVal.sapCustomerName1 ?? newVal.sapCustomerName}`
                                );
                            }
                        }}
                        options={soldToOptions}
                        filterOptions={(x) => x}
                        isOptionEqualToValue={(option, selectedValue) =>
                            option?.sapCustomerId === selectedValue?.sapCustomerId
                        }
                        getOptionLabel={(option) => {
                            if (!option || !option.sapCustomerId) return "";
                            return `${option.sapCustomerId} - ${option.sapCustomerName1 ?? option.sapCustomerName ?? ""}`;
                        }}
                        placeholder={t("soldToIdPLaceholder")}
                        loading={isSoldToSearching}
                    />
                ) : (salesOrderDetails?.soldTo ?? salesOrderDetails?.soldToList ?? []).length <= 1 ? (
                    <AppTypography value={selectedSoldTo?.sapCustomerId} />
                ) : (
                    <CustomerAutocompleteField
                        id="soldToId-readonly"
                        value={selectedSoldTo || null}
                        disabled={!["toBeReviewed", "pendingForApproval"].includes(status)}
                        onChange={(event, newValue, reason) => {
                            soldToChangeHandler(event, newValue, isSoldToPrior);
                        }}
                        options={soldToDropdown}
                        getOptionLabel={(option) => {
                            if (!option || !option.sapCustomerId) return "";
                            return `${option.sapCustomerId} - ${option.sapCustomerName1 ?? option.sapCustomerName ?? ""}`;
                        }}
                        placeholder={t("soldToIdPLaceholder")}
                    />
                )}
            </Grid>

            <Grid item {...gridResponsiveConfig}>
                <Typography
                    variant="subtitle2"
                    className="headerInfo-labels"
                    sx={headerLabelSx}
                >
                    {t("soldToName")}
                </Typography>
                {editMode ? (
                    <CustomerAutocompleteField
                        readOnly={true}
                        id="soldToName"
                        value={selectedSoldTo}
                        onChange={(event, newValue, reason) => {
                            soldToChangeHandler(event, newValue,isSoldToPrior);
                        }}
                        options={soldToDropdown}
                        getOptionLabel={(option) => option.sapCustomerName1 ?? option.sapCustomerName ?? ""}
                        placeholder={t("soldToNamePlaceholder")}
                    />
                ) : (
                    <AppTypography value={selectedSoldTo?.sapCustomerName1 ?? selectedSoldTo?.sapCustomerName} />
                )}
            </Grid>

            <Grid item {...gridResponsiveConfig}>
                <Typography
                    variant="subtitle2"
                    className="headerInfo-labels"
                    sx={headerLabelSx}
                >
                    {t("Sold To Location")}
                </Typography>
                {editMode ? (
                    <CustomTextField
                        name="soldToLocation"
                        value={formatAddress(selectedSoldTo)}
                        placeholder={t("Enter Sold to Location")}
                        InputProps={{ readOnly: true }}
                    />
                ) : (
                    <AppTypography value={formatAddress(selectedSoldTo)} />
                )}
            </Grid>
        </>
    )
}

export default SoldToFields

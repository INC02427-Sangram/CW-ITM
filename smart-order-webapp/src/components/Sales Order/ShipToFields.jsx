import React from 'react'
import { Grid, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { AppTypography } from "../../UIComponents/AppTypography";
import { CustomerAutocompleteField } from "../../UIComponents/CustomerAutocompleteField";
import { CustomTextField } from "../../UIComponents/CustomTextField";
import { toBool, buildLabel, formatAddress, getDefaultCustomer } from "./utils/customerUtils";

const ShipToFields = ({
    editMode,
    selectedShipTo,
    shipToInputValue,
    setShipToInputValue,
    shipToDropdown,
    apiShipToOptions,
    setApiShipToOptions,
    isShipToSearching,
    setIsShipToSearching,
    debouncedShipToSearch,
    shipToChangeHandler,
    shipToOptions,
    t,
    headerLabelSx,
    gridResponsiveConfig,
    salesOrderData,
    salesOrderDetails,
    status,
    isShipToPrior,
}) => {
    return (
        <>
            <Grid item {...gridResponsiveConfig}>
                <Typography
                    variant="subtitle2"
                    className="headerInfo-labels"
                    sx={headerLabelSx}
                >
                    {t("customerID")}
                </Typography>
                {editMode ? (
                    <CustomerAutocompleteField
                        id="shipToId"
                        value={selectedShipTo || null}
                        inputValue={shipToInputValue}
                        onInputChange={(e, v, reason) => {
                            if (reason === "reset") {
                                return;
                            }
                            setShipToInputValue(v);
                            const cleaned = v.trim();
                            if (cleaned.length >= 1) {
                                setIsShipToSearching(true);
                                debouncedShipToSearch(cleaned, salesOrderData);
                            } else {
                                setIsShipToSearching(false);
                                setApiShipToOptions([]);
                            }
                        }}
                        onChange={(e, newVal) => {
                            shipToChangeHandler(e, newVal, isShipToPrior);
                            setIsShipToSearching(false);
                            setApiShipToOptions([]);
                            if (!newVal) {
                                setShipToInputValue("");
                                return;
                            }
                            setShipToInputValue(
                                `${newVal.sapCustomerId} - ${newVal.sapCustomerName1 ?? newVal.sapCustomerName}`
                            );
                        }}
                        options={shipToOptions}
                        isOptionEqualToValue={(o, v) => o?.sapCustomerId === v?.sapCustomerId}
                        getOptionLabel={(option) => {
                            if (!option || !option.sapCustomerId) return "";
                            return `${option.sapCustomerId} - ${option.sapCustomerName1 ?? option.sapCustomerName ?? ""}`;
                        }}
                        placeholder={t("customerIDplaceholder")}
                        loading={isShipToSearching}
                        freeSolo={false}
                    />
                ) : (salesOrderDetails?.shipTo ?? salesOrderDetails?.shipToList ?? []).length <= 1 ? (
                    <AppTypography value={selectedShipTo?.sapCustomerId} />
                ) : (
                    <CustomerAutocompleteField
                        editMode={false}
                        id="shipToName"
                        value={selectedShipTo || null}
                        disabled={!["toBeReviewed", "pendingForApproval"].includes(status)}
                        onChange={(event, newValue, reason) => {
                            shipToChangeHandler(event, newValue, isShipToPrior);
                        }}
                        options={shipToDropdown}
                        isOptionEqualToValue={(option, value) =>
                            option?.sapCustomerId === value?.sapCustomerId
                        }
                        getOptionLabel={(option) => {
                            if (!option || !option.sapCustomerId) return "";
                            return `${option.sapCustomerId} - ${option.sapCustomerName1 ?? option.sapCustomerName ?? ""}`;
                        }}
                        placeholder={t("customerIDplaceholder")}
                    />
                )}
            </Grid>

            <Grid item {...gridResponsiveConfig}>
                <Typography
                    variant="subtitle2"
                    className="headerInfo-labels"
                    sx={headerLabelSx}
                >
                    {t("customerName")}
                </Typography>
                {editMode ? (
                    <CustomerAutocompleteField
                        readOnly={true}
                        id="shipToName"
                        value={selectedShipTo}
                        options={shipToDropdown}
                        isOptionEqualToValue={(option, value) =>
                            option?.sapCustomerId === value?.sapCustomerId
                        }
                        onChange={(event, newValue, reason) => {
                            shipToChangeHandler(event, newValue, isShipToPrior);
                        }}
                        getOptionLabel={(option) => option.sapCustomerName1 ?? option.sapCustomerName ?? ""}
                        placeholder={t("customerNamePlaceholder")}
                    />
                ) : (
                    <AppTypography value={selectedShipTo?.sapCustomerName1 ?? selectedShipTo?.sapCustomerName} />
                )}
            </Grid>

            <Grid item {...gridResponsiveConfig}>
                <Typography
                    variant="subtitle2"
                    className="headerInfo-labels"
                    sx={headerLabelSx}
                >
                    {t("shippingLocation")}
                </Typography>
                {editMode ? (
                    <CustomTextField
                        name="shipToLocation"
                        value={formatAddress(selectedShipTo)}
                        placeholder={t("shippingLocationPlaceholder")}
                        InputProps={{ readOnly: true }}
                    />
                ) : (
                    <AppTypography value={formatAddress(selectedShipTo)} />
                )}
            </Grid>
        </>
    )
}

export default ShipToFields

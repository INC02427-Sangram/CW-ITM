import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Grid, Autocomplete, TextField, Typography } from "@mui/material";
import fnServiceRequest from "../../utility/fnServiceRequest";
import { CustomerAutocompleteField } from "../../UIComponents/CustomerAutocompleteField";
import AppTypography from "../../UIComponents/AppTypography";
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    console.log("Debounced function called");
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
import { useSelector, useDispatch } from "react-redux";

const DEBOUNCE_DELAY = 1000;

export const BillToField = ({
  editMode,
  selectedBillTo,
  billToInputValue,
  setBillToInputValue,
  billToDropdown,
  apiBillToOptions,
  setApiBillToOptions,
  isBillToSearching,
  setIsBillToSearching,
  billToChangeHandler,
  theme,
  t,
  gridItemWidth,
  buildLabel,
  formatAddress,
  getAppTypographySx,
  outlinedInputBaseSx,
  headerLabelSx,
  salesOrderData,
  selectedSoldTo
}) => {
  const status = useSelector((state) => state.appReducer.status);
  const selectedSoldToRef = useRef(selectedSoldTo);

  useEffect(() => {
    selectedSoldToRef.current = selectedSoldTo;
  }, [selectedSoldTo]);

  const fnSearchCustomer = (customerId, setApiBillToOptions) => {
    if (!customerId) return;

    const { division, salesOrg, distChannel, language } = salesOrderData; // Ensure salesOrderData is accessible here
    const soldtoid = selectedSoldToRef.current?.sapCustomerId;
    const sUrl = `/JavaServices_Oauth/api/odata/getPartnerSearch?customerNum=${soldtoid}&customerNum2=${customerId}&salesOrg=${salesOrg}&division=${division}&distChan=${distChannel}&language=${language}&partnerFunctionFlag=${"B"}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        const results = response?.data.customerList ?? [];
        const list = results.map((r) => ({
          ...r,
          sapCustomerName: r.name1?.trim() ?? "",
          sapCustomerId: r.customerNum ?? "",
          sapCustomerAddress: [r.street, r.postCode, r.city]
            .filter(Boolean)
            .join(", "),
        }));
        setApiBillToOptions(list);
      },
      (error) => console.error("Bill To search failed", error)
    );
  };
  const debouncedBillToSearch = useRef(
    debounce((id) => fnSearchCustomer(id, setApiBillToOptions), DEBOUNCE_DELAY)
  ).current;
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
  const billToOptions = apiBillToOptions.length > 0 ? apiBillToOptions : ((billToInputValue && isBillToSearching) ? [] : billToDropdown);
  return (
    <>
      <Grid item {...gridResponsiveConfig}>
        <Typography variant="subtitle2" className="headerInfo-labels" sx={headerLabelSx}>
          {t("Bill To ID")}
        </Typography>

        {editMode ? (
          <CustomerAutocompleteField
            id="billToId"
            value={selectedBillTo || null}
            inputValue={billToInputValue}
            onInputChange={(e, v, reason) => {
              if (reason === "reset") return;
              setBillToInputValue(v);
              const cleaned = v.trim();
              if (cleaned.length >= 1) {
                setIsBillToSearching(true);
                debouncedBillToSearch(cleaned, salesOrderData, selectedSoldTo);
              } else {
                setIsBillToSearching(false);
                setApiBillToOptions([]);
              }
            }}
            onChange={(e, newVal) => {
              billToChangeHandler(e, newVal);
              setIsBillToSearching(false);
              setApiBillToOptions([]);
              setBillToInputValue(`${newVal.sapCustomerId} - ${newVal.sapCustomerName1 ?? newVal.sapCustomerName}`);
            }}
            options={billToOptions}
            filterOptions={(x) => x}
            isOptionEqualToValue={(option, selectedValue) => option?.sapCustomerId === selectedValue?.sapCustomerId}
            placeholder={"Enter Bill To Id"}
            getOptionLabel={(option) => {
              if (!option || !option.sapCustomerId) return "";
              return `${option.sapCustomerId} - ${option.sapCustomerName1 ?? option.sapCustomerName ?? ""}`;
            }}
          />
        ) : Array.isArray(billToDropdown) && billToDropdown.length <= 1 ? (
          <AppTypography variant="body2" className="unedited-mode">
            {selectedBillTo?.sapCustomerId || "-"}
          </AppTypography>
        ) : (
          <CustomerAutocompleteField
            limitTags={1}
            readOnly={true}
            id="billToId"
            value={selectedBillTo || null}
            disabled={!["toBeReviewed", "pendingForApproval"].includes(status)}
            ChipProps={{ size: "small" }}
            onChange={billToChangeHandler}
            autoSelect={false}
            options={billToOptions}
            getOptionLabel={(option) => `${option.sapCustomerId ?? ""} - ${option.sapCustomerName1 ?? option.sapCustomerName ?? ""}`}
          />
        )}
      </Grid>

      <Grid item {...gridResponsiveConfig}>
        <Typography variant="subtitle2" className="headerInfo-labels" sx={headerLabelSx}>
          {t("Bill To Name")}
        </Typography>

        {editMode ? (
          <CustomerAutocompleteField
            readOnly={true}
            limitTags={1}
            id="billToName"
            value={selectedBillTo}
            ChipProps={{ size: "small" }}
            autoSelect={false}
            options={billToOptions}
            placeholder={"Enter Bill To Name"}
            getOptionLabel={(option) => option.sapCustomerName1 ?? option.sapCustomerName ?? ""}
            loading={isBillToSearching}
          />
        ) : (
          <AppTypography variant="body2" className="unedited-mode">
            {selectedBillTo?.sapCustomerName1 ?? selectedBillTo?.sapCustomerName ?? "-"}
          </AppTypography>
        )}
      </Grid>
    </>
  );
};

export default BillToField;

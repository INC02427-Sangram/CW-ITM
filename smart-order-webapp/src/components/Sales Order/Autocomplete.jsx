headerInfo.sapCustomerName === null ? (
    <Autocomplete
      limitTags={1}
      id="multiple-limit-tags"
      // defaultValuevalue={headerInfoEdited.customerName}
      ChipProps={{ size: "small" }}
      onInputChange={(event) =>
        fnHandleChangeForAutocompleteShipToName(event)
      }
      onChange={(event, newValue) => {
        
        const headerInfoEditedClone = { ...headerInfoEdited };
        
        suggestedDropdownFromECCForShipName.forEach(
          (item, index) => {
            if (item.CustomerName === event.target.innerText) {
              // targetindex = index;
              setTargetIndex(index);

              headerInfoEditedClone.sapCustomerName =
                suggestedDropdownFromECCForShipName[index]?.CustomerName;

              headerInfoEditedClone.sapCustomerId =
                suggestedDropdownFromECCForShipName[
                  index
                ]?.CustomerId;
              headerInfoEditedClone.shippingLocation =
                (suggestedDropdownFromECCForShipName[index]?.City ==
                undefined
                  ? ""
                  : suggestedDropdownFromECCForShipName[index]
                      ?.City) +
                " " +
                (suggestedDropdownFromECCForShipName[index]
                  ?.Street == undefined
                  ? " "
                  : suggestedDropdownFromECCForShipName[index]
                      ?.Street) +
                " " +
                (suggestedDropdownFromECCForShipName[index]
                  ?.PostCode == undefined
                  ? " "
                  : suggestedDropdownFromECCForShipName[index]
                      ?.PostCode);

              setHeaderInfoEdited(headerInfoEditedClone);
            }
          }
        );

        if (event.type === "click") {
          // dispatch(updateVendorId(newValue));
        }
      }}
      onBlur={(e) => {
        
      }}
      autoSelect={true}

      options={suggestedDropdownFromECCForShipName}
      getOptionLabel={(option) => {
        return option.CustomerName;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={"customerName"}
          placeholder={t("customerNamePlaceholder")}
          sx={filterAutoCompleteTextfieldSX}
        />
      )}
      sx={filterAutoCompleteSX}
    />
  ) : (
    <Autocomplete
      limitTags={1}
      id="multiple-limit-tags"
      // defaultValuevalue={headerInfoEdited.customerName}
      value={suggestedDropdownFromECCForShipName?.at(targetindex)}
      ChipProps={{ size: "small" }}
      onInputChange={(event) =>
        fnHandleChangeForAutocompleteShipToName(event)
      }
      onChange={(event, newValue) => {
        
        const headerInfoEditedClone = { ...headerInfoEdited };
        
        suggestedDropdownFromECCForShipName.forEach(
          (item, index) => {
            if (item.CustomerName === event.target.innerText) {
              // targetindex = index;
              setTargetIndex(index);

              headerInfoEditedClone.sapCustomerName =
                suggestedDropdownFromECCForShipName[index]?.CustomerName;

              headerInfoEditedClone.sapCustomerId =
                suggestedDropdownFromECCForShipName[
                  index
                ]?.CustomerId;
              headerInfoEditedClone.shippingLocation =
                (suggestedDropdownFromECCForShipName[index]?.City ==
                undefined
                  ? ""
                  : suggestedDropdownFromECCForShipName[index]
                      ?.City) +
                " " +
                (suggestedDropdownFromECCForShipName[index]
                  ?.Street == undefined
                  ? " "
                  : suggestedDropdownFromECCForShipName[index]
                      ?.Street) +
                " " +
                (suggestedDropdownFromECCForShipName[index]
                  ?.PostCode == undefined
                  ? " "
                  : suggestedDropdownFromECCForShipName[index]
                      ?.PostCode);

              setHeaderInfoEdited(headerInfoEditedClone);
            }
          }
        );

        if (event.type === "click") {
          // dispatch(updateVendorId(newValue));
        }
      }}
      onBlur={(e) => {

      }}
      autoSelect={true}
      options={suggestedDropdownFromECCForShipName}
      getOptionLabel={(option) => {
        return option.CustomerName;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={"customerName"}
          placeholder={t("customerNamePlaceholder")}
          sx={filterAutoCompleteTextfieldSX}
        />
      )}
      sx={filterAutoCompleteSX}
    />
  )
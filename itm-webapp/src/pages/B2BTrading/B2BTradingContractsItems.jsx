import React, { useRef, useState } from "react";
import ReusableTile from "../../components/Common/ReusableTile";
import {
  B2BContractItemsStatCards,
  dummyTableData,
} from "../../dummydatas/dummydata";
import { extractMaterialFromData } from "../../utils/contractHelpers";
import B2BTradingFilter, {
  ListView,
} from "../../cw-generated-forms/B2BTradingFilter";
import { Box } from "@mui/material";
import FilterAccordian from "../../components/Common/FilterAccordian";
import requestOptions from "../../utils/fnServices/requestOptions";
import { useNavigate } from "react-router-dom";
import B2BTradingItemsFilter from "../../cw-generated-forms/B2BTradingItemsFilter";

export default function B2BTradingContractsItems() {
  const navigate = useNavigate();

  const filterRef = useRef();

  const contractItemRows = extractMaterialFromData(dummyTableData).map(
    (row, index) => ({
      id: index,
      ...row,
    }),
  );
  const columns = [
    // { key: "serial", label: "#", width: 20 },
    // { key: "actions", label: "Actions", width: 50 },
    { key: "contractId", label: "Contract Id", width: 100 },
    { key: "contractItemId", label: "Contract Item Id", width: 100 },
    { key: "supplier", label: "Supplier", width: 100 },
    { key: "material", label: "Material", width: 100 },
    { key: "deliveryPeriodFrom", label: "Delivery Period From", width: 200 },
    { key: "deliveryPeriodTo", label: "Delivery Period To", width: 200 },
    { key: "salesQuantity", label: "Sales Qty", width: 100 },
    { key: "salesQuantityUnit", label: "Sales Unit", width: 50 },
    // {
    //   key: "salesOverdeliveryTolerance",
    //   label: "Sales Overdelivery Tolerance",
    //   width: 200,
    // },
    // {
    //   key: "salesUnderdeliveryTolerance",
    //   label: "Sales Underdelivery Tolerance",
    //   width: 200,
    // },
    { key: "purchaseQuantity", label: "Purchase Qty", width: 100 },
    { key: "purchaseQuantityUnit", label: "Purchase Unit", width: 100 },
    // {
    //   key: "purchaseOverdeliveryTolerance",
    //   label: "Purchase Overdelivery Tolerance",
    //   width: 200,
    // },
    // {
    //   key: "purchaseUnderdeliveryTolerance",
    //   label: "Purchase Underdelivery Tolerance",
    //   width: 200,
    // },
    { key: "salesPrice", label: "Sales Price", width: 100 },
    { key: "salesPriceCurrency", label: "Sales Price Currency", width: 150 },
    { key: "salesPricePerUnit", label: "Sales Price Per Unit", width: 150 },
    { key: "purchasePrice", label: "Purchase Price", width: 100 },
    {
      key: "purchasePriceCurrency",
      label: "Purchase Price Currency",
      width: 150,
    },
    {
      key: "purchasePricePerUnit",
      label: "Purchase Price Per Unit",
      width: 120,
    },
    { key: "plant", label: "Plant", width: 50 },
    { key: "storageLocation", label: "Storage Location", width: 50 },
    // { key: "expenses", label: "Expenses", width: 50 },
  ];
  const handleClear = () => {
    filterRef.current?.reset();
  };
  const handleSearch = () => {
    const success = filterRef.current?.submit();
    console.log(filterRef.current.getValues());
  };
  return (
    <Box display="flex" gap={2} flexDirection={"column"}>
      <Box
        display="flex"
        gap={2}
        mt={2}
        flexDirection={"column"}
        flexWrap={"wrap"}
      >
        <Box display="flex" gap={2} flexWrap={"wrap"}>
          {B2BContractItemsStatCards.map((card) => (
            <Box
              key={card.label}
              sx={{ flex: "1 1 200px", minWidth: 200 }}
              display="flex"
            >
              <ReusableTile
                title={card.label}
                subtitle={card.value}
                description={card.sub}
              />
            </Box>
          ))}
        </Box>
        <Box display="flex" gap={2} flexWrap={"wrap"}>
          <FilterAccordian
            title="Filter Contracts Items"
            onSearch={handleSearch}
            onClear={handleClear}
            filterFieldsComponent={
              <B2BTradingItemsFilter
                ref={filterRef}
                columns={4}
                showHeader={false}
                showFooter={false}
                requestOptions={requestOptions}
              />
            }
          />
        </Box>
        <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
          <ListView
            data={contractItemRows}
            columns={columns}
            selectable={true}
            // onSelectionChange={setSelectedContractItems}
            // formatValue={formatItemValue}
            onRowClick={(row) =>
             console.log("Row clicked:", row)
            }
          />
        </Box>
      </Box>
    </Box>
  );
}

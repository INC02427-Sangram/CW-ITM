import { Box } from "@mui/material";
import React, { useState } from "react";
import { PurchaseOrderStatCards } from "../../dummydatas/dummydata";
import ReusableTile from "../../components/Common/ReusableTile.jsx";
// import FilterAccordian from "../../components/Common/FilterAccordian.jsx";
import requestOptions from "../../utils/fnServices/requestOptions.js";
// import { ListView } from "../../cw-generated-forms/PurchaseOrderFilter.jsx";
import { useNavigate } from "react-router-dom";

export default function PurchaseOrders() {
  const navigate = useNavigate();
  const [selectedPurchaseOrders, setSelectedPurchaseOrders] = useState([]);
  const [selectedPurchaseOrderData, setSelectedPurchaseOrderData] =
    useState(null);
  return (
    <Box
      display="flex"
      gap={2}
      mt={2}
      flexDirection={"column"}
      flexWrap={"wrap"}
    >
      <Box display="flex" gap={2} flexWrap={"wrap"}>
        {PurchaseOrderStatCards.map((card) => (
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
      {/* <Box display="flex" gap={2} flexWrap={"wrap"}>
        <FilterAccordian
          title="Filter Purchase Orders"
          //   onSearch={handleSearch}
          //   onClear={handleClear}
          filterFieldsComponent={
            <PurchaseOrderFilter
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
          data={purchaseOrderRows}
          columns={purchaseOrderColumns}
          selectable={true}
          onSelectionChange={setSelectedPurchaseOrders}
          formatValue={formatValue}
          onRowClick={(row) => {
            navigate("purchase-order-details", {
              state: { purchaseOrderData: row },
            });
            setSelectedPurchaseOrderData(row);
          }}
        />
      </Box> */}
    </Box>
  );
}

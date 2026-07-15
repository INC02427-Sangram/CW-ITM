import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import ReusableTypography from "../components/Common/ReusableTypography";
import ReusableButtons from "../components/Common/ReusableButtons";
import ReusableTile from "../components/Common/ReusableTile";
import { Add } from "@cw/rds/icons";

const statCards = [
  { label: "Contract Value", value: "€1.95M", sub: "up by 12% vs Last Year" },
  { label: "Total Contracts", value: "4", sub: "+2 this week" },
  { label: "Active Contracts", value: "12", sub: "Currently Operation" },
  { label: "Pending Approval", value: "4", sub: "Contracts Awaiting" },
  { label: "Expiring Soon", value: "3", sub: "Next 30 days" },
  { label: "Expired Contracts", value: "1", sub: "Action Required" },
];

export default function BackToBacktrading() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        height: "100%",
        borderRadius: "10px 0px 0px 0px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "16px",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <ReusableTypography variant="h5" sx={{ fontWeight: 700 }}>
          Back to Back Trading Contract Dashboard
        </ReusableTypography>
        <ReusableButtons
          type="button"
          icon={<Add />}
          onClick={() => console.log("New Contract clicked")}
        >
          New Contract
        </ReusableButtons>
      </Box>

      <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
        <Tab label="Back to Back Trading Contract" />
        <Tab label="Back to Back Trading Order" />
      </Tabs>

      {activeTab === 0 && (
        <Box display="flex" gap={2} mt={2}>
          {statCards.map((card) => (
            <Box key={card.label} flex={1} minWidth={0} display="flex">
              <ReusableTile
                title={card.label}
                subtitle={card.value}
                description={card.sub}
              />
            </Box>
          ))}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <ReusableTypography variant="body1">
            Back to Back Trading Order content goes here.
          </ReusableTypography>
        </Box>
      )}
    </Box>
  );
}

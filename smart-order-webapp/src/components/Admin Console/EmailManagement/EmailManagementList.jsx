import { useMemo } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { CustomTextField } from "../../../UIComponents/CustomTextField";
import { Mail } from "@cw/rds/icons";
import CustomTable from "../../../utility/Custom Components/CustomTable";
import { getEmailManagementColumns } from "../adminTableConfigs";
import { TABLE_CONFIG } from "./emailManagementConfig";
import { useTranslation } from "react-i18next";

/**
 * EmailManagementList Component
 * Displays email list table with search functionality
 */

const EmailManagementList = ({ 
  emailList, 
  filteredEmailList, 
  searchTerm, 
  setSearchTerm,
  handleEdit,
  handleDeleteAction 
}) => {
  const { t } = useTranslation();

  // Transform filtered data for table
  const emailRows = useMemo(() => {
    return (filteredEmailList || []).map((row, index) => ({
      id: `${row.emailId}_${row.countryCode}_${row.salesOrg}`,
      emailId: row.emailId,
      country: row.countryName,
      salesOrg: row.salesOrg,
      recipientType: row.recipientType || "-",
      notificationTypes: Array.isArray(row.notificationTypes)
      ? row.notificationTypes.map((n) => n.label ?? n.notificationTypeCode ?? n)
      : [],
      originalIndex: index,
    }));
  }, [filteredEmailList]);


  return (
    <Grid item xs={12} sx={{ minWidth: 0 }}>
      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-end" }, width: "100%", mb: 1 }}>
        <CustomTextField
          size="small"
          placeholder={t("Search…")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: "100%", sm: 220 },
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              height: 36,
            },
          }}
          InputProps={{ autoComplete: "off" }}
        />
      </Box>

      {/* Email List Table */}
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "8px",
          },
          "& .MuiTablePagination-toolbar": {
            flexWrap: "nowrap",
            overflowX: "auto",
            overflowY: "hidden",
          },
          "& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel": {
            whiteSpace: "nowrap",
          },
        }}
      >
        {emailList.length > 0 ? (
          <Box sx={{ minWidth: { xs: 900, md: "100%" } }}>
            <CustomTable
              rows={emailRows}
              Headercolumns={getEmailManagementColumns(t, handleEdit, handleDeleteAction)}
              maxHeight={TABLE_CONFIG.MAX_HEIGHT}
              paginationModel={{ 
                page: TABLE_CONFIG.INITIAL_PAGE, 
                pageSize: TABLE_CONFIG.PAGE_SIZE 
              }}
              onPaginationModelChange={() => {}}
              rowCount={emailRows.length}
              paginationMode={TABLE_CONFIG.PAGINATION_MODE}
            />
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Mail sx={{ fontSize: 64, color: "action.disabled", mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No emails configured yet
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Use the wizard above to add your first email notification
            </Typography>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default EmailManagementList;

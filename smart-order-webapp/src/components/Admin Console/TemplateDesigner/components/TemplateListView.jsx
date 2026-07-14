import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  CardContent,
} from "@mui/material";
import { Plus } from "@cw/rds/icons";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import TemplateCard from "./TemplateCard";
import { HeaderCard } from "../../../../UIComponents/HeaderCard";
import CustomSelect from "../../../../UIComponents/CustomSelect";
import { AdminControlButton as AdminButton } from "../../../../UIComponents/Button";
import { ButtonTypes } from "../../../../UIComponents/UITypes";
import { useTheme } from "@mui/material/styles";

/**
 * Template List View Component
 * Displays grid of templates with filters
 */
const TemplateListView = ({
  loading,
  filteredTemplates,
  templates,
  notificationTypeFilter,
  setNotificationTypeFilter,
  filterCountryName,
  handleFilterCountryChange,
  filterSalesOrg,
  handleFilterSalesOrgChange,
  countries,
  salesOrgOptions,
  onCreateNew,
  onEdit,
  onDelete,
  getNotificationTypes,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 4, sm: 5, md: 6 },
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <AdminButton
          type={ButtonTypes.SAVE}
          startIcon={<Plus color="#fff" size={"small"}/>}
          onClick={onCreateNew}
        >
          Create New Template
        </AdminButton>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <CustomSelect
            value={filterCountryName || "All"}
            onChange={handleFilterCountryChange}
            placeholder="All Countries"
            options={[
              { key: "All", value: "All" },
              ...countries.map((c) => ({ key: c.countryName, value: c.countryName })),
            ]}
            sx={{ minWidth: { xs: "100%", sm: 160 } }}
          />
          <CustomSelect
            value={filterSalesOrg || "All"}
            disabled={!filterCountryName || filterCountryName === "All"}
            onChange={handleFilterSalesOrgChange}
            placeholder="All Sales Orgs"
            options={[
              { key: "All", value: "All" },
              ...salesOrgOptions.map((o) => ({ key: o, value: o })),
            ]}
            sx={{ minWidth: { xs: "100%", sm: 160 } }}
          />
          <CustomSelect
            value={notificationTypeFilter}
            onChange={(e) => setNotificationTypeFilter(e.target.value)}
            placeholder="Filter by Notification Type"
            options={getNotificationTypes().map(type => ({ key: type, value: type }))}
            sx={{ minWidth: { xs: "100%", sm: 200 } }}
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading templates...</Typography>
        </Box>
      ) : filteredTemplates.length === 0 ? (
        <HeaderCard sx={{ textAlign: "center", py: 6 }}>
          <EmailIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6">
            {templates.length === 0
              ? "No email templates found"
              : `No templates found for "${notificationTypeFilter}"`}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {templates.length === 0
              ? "Create your first email template to get started"
              : "Try selecting a different notification type"}
          </Typography>
          {templates.length === 0 && (
            <AdminButton
              type={ButtonTypes.SAVE}
              startIcon={<AddIcon />}
              onClick={onCreateNew}
            >
              Create Template
            </AdminButton>
          )}
        </HeaderCard>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(3, 1fr)",
            },
            gap: 3,
            width: "100%",
            alignItems: "stretch",
          }}
        >
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TemplateListView;
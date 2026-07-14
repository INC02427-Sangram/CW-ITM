import {
  Box,
  Grid,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ArrowLeftCircle, Mail, Save } from "@cw/rds/icons";
import { HeaderCard } from "../../../../UIComponents/HeaderCard";
import { AdminControlButton as AdminButton } from "../../../../UIComponents/Button";
import { ButtonTypes } from "../../../../UIComponents/UITypes";
import TemplateFormSection from "./TemplateFormSection";
import TemplateStylingSection from "./TemplateStylingSection";
import EmailPreview from "./EmailPreview";

/**
 * Template Designer View Component
 * Designer/Editor view with form and preview
 */
const TemplateDesignerView = ({
  isDesignerLoading,
  isEditing,
  templateId,
  onBackToList,
  templateForm,
  handleFormChange,
  countries,
  handleCountryChange,
  salesOrgOptions,
  handleSalesOrgChange,
  formNotificationTypes,
  placeholderKeys,
  templateConfig,
  handleTemplateChange,
  onSave,
  onPreviewClick,
}) => {
  if (isDesignerLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress size={60} sx={{ color: "#3026B9" }} />
        <Typography variant="h6" sx={{ ml: 2, color: "#3026B9" }}>
          Loading template details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: "100vh",
        marginLeft: { xs: 0, md: "24px" },
        paddingRight: { xs: 0, md: 2 },
        overflowX: "hidden",
      }}
    >
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
        <IconButton
          onClick={onBackToList}
          sx={{ color: "#3026B9" }}
        >
          <ArrowLeftCircle />
        </IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3026B9", wordBreak: "break-word" }}>
            {isEditing ? "Edit Template" : "Create New Template"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditing ? "Modify existing template" : "Design your email template"}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ width: "100%", margin: 0 }}>
        <Grid item xs={12} lg={5}>
          <HeaderCard>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
              >
                <Mail color="#3026B9" />
                Template Configuration
              </Typography>

              <TemplateFormSection
                templateForm={templateForm}
                templateId={templateId}
                handleFormChange={handleFormChange}
                countries={countries}
                handleCountryChange={handleCountryChange}
                salesOrgOptions={salesOrgOptions}
                handleSalesOrgChange={handleSalesOrgChange}
                formNotificationTypes={formNotificationTypes}
                placeholderKeys={placeholderKeys}
                isEditing={isEditing}
              />

              <TemplateStylingSection
                templateConfig={templateConfig}
                handleTemplateChange={handleTemplateChange}
              />

              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <AdminButton
                  action={ButtonTypes.SAVE}
                  startIcon={<Save />}
                  onClick={onSave}
                  disabled={!templateForm.subjectName || !templateForm.richTextContent || !templateForm.notificationType || !templateForm.country || !templateForm.salesOrg}
                  sx={{ minWidth: { xs: "100%", sm: "200px" } }}
                >
                  {isEditing ? "Update" : "Save"} Template
                </AdminButton>
              </Box>
            </CardContent>
          </HeaderCard>
        </Grid>

        <Grid item xs={12} lg={7}>
          <HeaderCard>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                Live Preview
                <Tooltip title="Preview" placement="top">
                  <IconButton
                    size="small"
                    onClick={onPreviewClick}
                    sx={{
                      color: "#3026B9",
                      backgroundColor: "rgba(48, 38, 185, 0.1)",
                      "&:hover": { backgroundColor: "rgba(48, 38, 185, 0.2)" },
                      ml: 1,
                      width: "32px",
                      height: "32px"
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                </Tooltip>
              </Typography>

              <Box
                sx={{
                  border: "2px solid #e0e0e0",
                  borderRadius: "16px",
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  minHeight: "400px",
                  maxHeight: "80vh",
                  overflow: "auto",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  position: "relative",
                  width: "100%",
                  minWidth: 0,

                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },

                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c1c1c1",
                    borderRadius: "8px",
                  },

                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                  },

                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, #3026B9, #DB0034)",
                    borderRadius: "16px 16px 0 0"
                  }
                }}
              >
                {templateForm.subjectName && templateForm.richTextContent ? (
                  <Box
                    key={`${templateForm.subjectName}-${templateForm.body}-${templateConfig.primaryColor}-${templateConfig.secondaryColor}-${templateConfig.fontFamily}-${templateConfig.footerText}-${templateConfig.companyName}-${templateConfig.includeCompanyInfo}`}
                    sx={{ width: "100%", minWidth: 0 }}
                  >
                    <EmailPreview
                      template={{
                        subjectName: templateForm.subjectName,
                        body: templateForm.body,
                        salesOrg: templateForm.salesOrg,
                      }}
                      templateConfig={templateConfig}
                    />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", color: "#666" }}>
                    <PreviewIcon sx={{ fontSize: "48px", color: "#ccc", mb: 1.5 }} />
                    <Typography variant="h6" sx={{ mb: 1, color: "#999" }}>
                      Live Preview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fill in the subject name and email content to see live preview
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </HeaderCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TemplateDesignerView;

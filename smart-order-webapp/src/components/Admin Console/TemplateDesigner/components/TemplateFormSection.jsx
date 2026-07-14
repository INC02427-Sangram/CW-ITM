import {
  Grid,
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PublicIcon from "@mui/icons-material/Public";
import BusinessIcon from "@mui/icons-material/Business";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { CircleInfo } from "@cw/rds/icons";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { QUILL_STYLES, QUILL_MODULES, QUILL_FORMATS } from "../constants/templateConstants";
import { CustomTextField } from "../../../../UIComponents/CustomTextField";
import CustomSelect from "../../../../UIComponents/CustomSelect";
import ImageResize from "quill-image-resize-module-react";


Quill.register("modules/imageResize", ImageResize);

/**
 * Template Form Section Component
 * Handles basic information form fields
 */
const TemplateFormSection = ({
  templateForm,
  templateId,
  handleFormChange,
  countries,
  handleCountryChange,
  salesOrgOptions,
  handleSalesOrgChange,
  formNotificationTypes,
  placeholderKeys,
  isEditing,
}) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
        '& .MuiAccordionSummary-content': { display: "flex", gap: 1, alignItems: "center" }
      }}>
        <CircleInfo size={"small"} />
        <Typography>Basic Information</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="Subject Name"
              value={templateForm.subjectName}
              onChange={(e) => handleFormChange("subjectName", e.target.value)}
              size="small"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomSelect
              fullWidth
              value={templateForm.country}
              onChange={handleCountryChange}
              disabled={isEditing}
              placeholder="Country"
              startAdornment={
                <PublicIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
              }
              options={countries.length === 0
                ? [{ key: "loading", value: "Loading countries..." }]
                : countries.map(country => ({ key: country.countryName, value: country.countryName }))
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomSelect
              fullWidth
              value={templateForm.salesOrg}
              onChange={handleSalesOrgChange}
              disabled={!templateForm.country || isEditing}
              placeholder="Sales Organization"
              options={salesOrgOptions.length === 0

                ? [{ key: "empty", value: "Select a country first" }]
                : salesOrgOptions.map(org => ({ key: org, value: org }))
              }
              startAdornment={
                <BusinessIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
              }
            />
          </Grid>


          <Grid item xs={12}>
            <CustomSelect
              fullWidth
              value={templateForm.notificationType || ""}
              onChange={(e) => {
                const selectedValue = e.target.value;

                const selectedType = formNotificationTypes.find(
                  (type) =>
                    type.value === selectedValue ||
                    type.id === selectedValue ||
                    type.label === selectedValue
                );

                handleFormChange(
                  "notificationType",
                  selectedType?.value || "",
                  selectedType || null
                );
              }}
              disabled={isEditing || !templateForm.salesOrg}
              placeholder="Notification Type"
              options={
                formNotificationTypes.length === 0
                  ? [{ key: "empty", value: "" }]
                  : formNotificationTypes.map((type) => ({
                    key: type.value,
                    value: type.label,
                  }))
              }
              startAdornment={
                <NotificationsIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
              }
            />
          </Grid>

          <Grid item xs={12}>
            {placeholderKeys.length > 0 && (
              <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #eee' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Available Placeholders for this Notification Type:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {placeholderKeys.map((key) => (
                    <Chip
                      key={key}
                      label={key}
                      size="small"
                      variant="outlined"
                      sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              Email Body Content *
            </Typography>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                "& .ql-toolbar": {
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                },
                "& .ql-container": {
                  minWidth: 0,
                },
              }}
            >
              <style>{QUILL_STYLES}</style>
              <ReactQuill
                key={`quill-${templateId || 'new'}-${isEditing}`}
                theme="snow"
                value={templateForm.richTextContent || ""}
                onChange={(value) => handleFormChange("richTextContent", value)}
                placeholder="Write your email content here in normal English... Use the toolbar buttons above to format text."
                modules={{
                  ...QUILL_MODULES,
                  imageResize: {
                    parchment: Quill.import("parchment"),
                  },
                }}
                formats={QUILL_FORMATS}
                style={{
                  height: '200px',
                  marginBottom: '42px'
                }}
              />
            </Box>

            <Box sx={{ mt: 1, display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                💡 Tip: Write your content in normal English. Use the toolbar buttons above to format text. The editor automatically handles formatting and converts to HTML for the backend.
              </Typography>
              {templateForm.richTextContent && (
                <Chip
                  label="Content Ready"
                  size="small"
                  sx={{
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    fontSize: '10px',
                    height: '20px',
                    '& .MuiChip-label': {
                      px: 1,
                    }
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default TemplateFormSection;

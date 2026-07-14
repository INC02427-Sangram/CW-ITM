import React from "react";
import {
  Grid,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Checkbox } from "@cw/rds";
import { TextBlock } from "@cw/rds/icons";
import { FONT_OPTIONS } from "../constants/templateConstants";
import { CustomTextField } from "../../../../UIComponents/CustomTextField";
import CustomSelect from "../../../../UIComponents/CustomSelect";

/**
 * Template Styling Section Component
 * Handles visual styling and typography settings
 */
const TemplateStylingSection = ({ templateConfig, handleTemplateChange }) => {
  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ColorLensIcon sx={{ mr: 1 }} />
          <Typography>Visual Styling</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label="Primary Color"
                type="color"
                value={templateConfig.primaryColor}
                onChange={(e) => handleTemplateChange("primaryColor", e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label="Secondary Color"
                type="color"
                value={templateConfig.secondaryColor}
                onChange={(e) => handleTemplateChange("secondaryColor", e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Company Name"
                value={templateConfig.companyName}
                onChange={(e) => handleTemplateChange("companyName", e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
          '& .MuiAccordionSummary-content': { display: "flex", gap: 1, alignItems: "center" }
        }}>
          <TextBlock size={"small"} />
          <Typography>Typography & Footer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomSelect
                fullWidth
                value={templateConfig.fontFamily}
                onChange={(e) => handleTemplateChange("fontFamily", e.target.value)}
                placeholder="Select Font Family"
                options={FONT_OPTIONS.map(font => ({ key: font, value: font }))}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Footer Text"
                value={templateConfig.footerText}
                onChange={(e) => handleTemplateChange("footerText", e.target.value)}
                size="small"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={templateConfig.includeCompanyInfo}
                    onChange={(e) => handleTemplateChange("includeCompanyInfo", e.target.checked)}
                  />
                }
                label="Include company information"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default TemplateStylingSection;

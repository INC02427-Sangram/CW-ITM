import React from "react";
import {
  Grid,
  CardContent,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Stack } from "@cw/rds";
import SubjectIcon from "@mui/icons-material/Subject";
import PublicIcon from "@mui/icons-material/Public";
import BusinessIcon from "@mui/icons-material/Business";
import { Pencil, Trash } from "@cw/rds/icons";
import { HeaderCard } from "../../../../UIComponents/HeaderCard";
import { TemplateCardStyled } from "../styles/styledComponents";

/**
 * Template Card Component
 * Displays individual template card in grid view
 */
const TemplateCard = ({ template, onEdit, onDelete }) => {
  return (
    <TemplateCardStyled>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                color: "#3026B9",
                fontSize: "15px",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                minHeight: "40px",
                wordBreak: "break-word",
              }}
            >
              {template.subjectName}
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 0.5 }}>
              ID: {template.id}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "text.secondary",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              Notification Type: {template.notificationName}
            </Typography>
          </Box>

          <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(template)}
                sx={{
                  color: "#f57c00",
                  backgroundColor: "#fff8e1",
                  "&:hover": { backgroundColor: "#ffecb3" },
                  width: "24px",
                  height: "24px",
                }}
              >
                <Pencil size={14} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(template)}
                sx={{
                  color: "#d32f2f",
                  backgroundColor: "#ffebee",
                  "&:hover": { backgroundColor: "#ffcdd2" },
                  width: "24px",
                  height: "24px",
                }}
              >
                <Trash size={14} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Box sx={{ mt: "auto", display: "flex", gap: 2, pt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PublicIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
              {template.country}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <BusinessIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
              {template.salesOrg}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </TemplateCardStyled>
  );
};

export default TemplateCard;
import { styled } from "@mui/material/styles";
import { Card, Chip, Fab } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "16px",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },
}));

export const TemplateCardStyled = styled(Card)(({ theme }) => ({
  width: "100%",
  height: "100%",
  minHeight: "170px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  borderRadius: "16px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "1px solid rgba(0,0,0,0.06)",
  backgroundColor: "#F5F4FD",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 8px 24px rgba(48, 38, 185, 0.15)",
    border: "1px solid rgba(48, 38, 185, 0.2)",
  },
  "& .MuiCardContent-root": {
    padding: "16px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
}));

export const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: 24,
  right: 24,
  backgroundColor: "#3026B9",
  color: "white",
  "&:hover": {
    backgroundColor: "#2518A3",
  },
}));

export const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: status === "Active" ? "#e8f5e8" : status === "Draft" ? "#fff3e0" : "#ffebee",
  color: status === "Active" ? "#2e7d32" : status === "Draft" ? "#f57c00" : "#d32f2f",
  fontWeight: "700",
  fontSize: "11px",
  height: "24px",
  borderRadius: "12px",
  border: `1px solid ${status === "Active" ? "#4caf50" : status === "Draft" ? "#ff9800" : "#f44336"}`,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

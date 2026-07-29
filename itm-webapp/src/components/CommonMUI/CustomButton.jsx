import React from "react";
import { Button as MuiButton } from "@mui/material";

export function CustomButton({
  children,
  onClick,
  variant = "outlined",
  size = "small",
  colorHex,
  bgColor,
  hoverBgColor,
  sx = {},
  ...props
}) {
  const isContained = variant === "contained";

  // Default color schemes based on variant
  const defaultTextColor = isContained ? "#FFFFFF" : "#1F2A44";
  const defaultBgColor = isContained ? "#1F2A44" : "transparent";
  const defaultHoverBgColor = isContained 
    ? "#151C2E" // Slightly darker blue for contained hover
    : "rgba(31, 42, 68, 0.04)"; // Subtle tint for outlined/text hover

  // Use explicitly passed props if available, otherwise fall back to variant defaults
  const finalTextColor = colorHex || defaultTextColor;
  const finalBgColor = bgColor || defaultBgColor;
  const finalHoverBgColor = hoverBgColor || defaultHoverBgColor;
  const finalBorderColor = isContained ? "transparent" : finalTextColor;

  return (
    <MuiButton
      variant={variant}
      size={size}
      onClick={onClick}
      sx={{
        color: finalTextColor,
        backgroundColor: finalBgColor,
        borderColor: finalBorderColor,
        textTransform: "none",
        "&:hover": {
          backgroundColor: finalHoverBgColor,
          borderColor: finalBorderColor,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}

export default CustomButton;
import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getReadOnlyFieldSx } from "./styles/getReadOnlyFieldSx";

export const AppTypography = ({
  value,
  children,
  className = "unedited-mode",
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Typography
      variant="body2"
      className={className}
      sx={{
        ...getReadOnlyFieldSx(theme),
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        maxHeight: "10vh",
        overflowY: "auto",
        ...sx
      }}
    >
      {children ?? value ?? "-"}
    </Typography>
  );
};

export default AppTypography;
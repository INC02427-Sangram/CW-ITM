import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const ReusableTypography = ({
  children,
  variant = "body1",
  sx,
  component = "span",
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Typography variant={variant} component={component} sx={sx} {...props}>
      {children ?? t(children)}
    </Typography>
  );
};

export default ReusableTypography;

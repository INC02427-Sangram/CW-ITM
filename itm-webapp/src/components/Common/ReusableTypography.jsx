import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const ReusableTypography = ({
  children,
  variant = "body1",
  sx,
  component = "span",
  translate = true,
  ...props
}) => {
  const { t } = useTranslation();

  const content =
    translate && typeof children === "string" ? t(children) : children;

  return (
    <Typography variant={variant} component={component} sx={sx} {...props}>
      {content}
    </Typography>
  );
};

export default ReusableTypography;

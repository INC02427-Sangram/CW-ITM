import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Translates a sentence by preferring a full-phrase key, then falling back
 * to word-by-word translation (preserving whitespace).
 */
const translateSentence = (sentence, t, i18n) => {
  const trimmed = sentence.trim();
  if (!trimmed) return sentence;

  if (i18n.exists(trimmed)) {
    return t(trimmed);
  }

  return sentence
    .split(/(\s+)/)
    .map((part) => {
      if (!part || /^\s+$/.test(part)) return part;
      return i18n.exists(part) ? t(part) : part;
    })
    .join("");
};

const ReusableTypography = ({
  children,
  variant = "body1",
  sx,
  component = "span",
  translate = true,
  ...props
}) => {
  const { t, i18n } = useTranslation();

  const content =
    translate && typeof children === "string"
      ? translateSentence(children, t, i18n)
      : children;

  return (
    <Typography variant={variant} component={component} sx={sx} {...props}>
      {content}
    </Typography>
  );
};

export default ReusableTypography;

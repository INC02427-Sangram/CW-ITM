import React from "react";
import * as materialIcons from "@mui/icons-material";
import { createElement } from "react";
import * as rdsIcons from "@cw/rds/icons";
import { useTheme } from "@mui/material/styles";
const CustomIcon = (props) => {
  const {
    iconName,
    library = "mui",
    isSelected = false,
    iconColor,
    iconSize = "20px",
    sx = {},
  } = props;

  const theme = useTheme();
  const resolvedColor =
    iconColor && !isSelected
      ? iconColor
      : isSelected
        ? theme.palette.primary.main
        : "inherit";

  let IconComponent;

  if (library === "rds") {
    // Rachana Design System icons
    IconComponent = isSelected
      ? (rdsIcons[`${iconName}Filled`] ?? rdsIcons[iconName])
      : rdsIcons[iconName];
    if (!IconComponent) return null;
    return createElement(IconComponent, {
      // RDS icons support size prop
      size: iconSize,
      style: {
        color: resolvedColor,
        ...sx,
      },
      className: "iconClass",
      onClick: props.onClick,
    });
  } else {
    // default to MUI icons
    const key = isSelected ? iconName : `${iconName}Outlined`;
    IconComponent = materialIcons[key];
    if (!IconComponent) return null;
    return createElement(IconComponent, {
      sx: {
        fontWeight: "900",
        color: (theme) => {
          if (iconColor && !isSelected) {
            return iconColor;
          } else if (isSelected) {
            return theme?.palette?.primary?.main;
          }
          return "inherit";
        },
        fontSize: iconSize,
        ...sx,
      },
      className: "iconClass",
    });
  }
};

export default CustomIcon;

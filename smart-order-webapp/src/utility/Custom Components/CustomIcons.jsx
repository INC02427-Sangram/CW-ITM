import React from "react";
// Can be replaced with you style class
import Icon from "@mui/material/Icon";
import "./CustomIcons.css";
// Import the packages that you need in your project.
// Name the import to something we can easily identify
import * as FontAwesome from "react-icons/fa";
import * as AntIcon from "react-icons/ai";
import * as MaterialIcon from "react-icons/md";
import * as BootstrapIcon from "react-icons/bs";
import * as RemixIcon from "react-icons/ri";
import * as IcoMoon5Icon from "react-icons/io5";
import * as IcoMoonIcon from "react-icons/io";
import * as BoxIcon from "react-icons/bi";
import * as HeroIcon from "react-icons/hi";
import * as GitIcon from "react-icons/go";
import * as Feather from "react-icons/fi";
import * as VSCIcon from "react-icons/vsc";
import * as FlatColor from "react-icons/fc";
 
// { iconSrc, isSelected, onClick }
function CustomIcon(props) {
  const {
    icon = "",
    hoverIcon = "",
    size = "small",
    isSelected = false,
 
    ...other
  } = props;
  return (
    <>
      {isSelected ? (
        <Iconsrc {...other} icon={hoverIcon} />
      ) : (
        <div className={"cwIconContainer"}>
          <span className={"cwOutlineIcon"}>
            <Iconsrc {...other} icon={icon || hoverIcon} />
          </span>
          <span className={"cwFilledIcon"}>
            <Iconsrc {...other} icon={hoverIcon || icon} />
          </span>
        </div>
      )}
    </>
  );
}
export default CustomIcon;
export const Iconsrc = (props) => {
  let iconSrc = "MdDoNotDisturb";
  let {
    icon = MaterialIcon[iconSrc],
    size = "small",
    isSelected = false,
    ...other
  } = props;
 
  // let icon = MaterialIcon[iconSrc];
  if (icon?.split(".").length === 2) {
    iconSrc = icon?.split(".")[1];
    switch (icon?.split(".")[0]) {
      case "FontAwesome":
        icon = FontAwesome[iconSrc];
        break;
      case "AntIcon":
        icon = AntIcon[iconSrc];
        break;
      case "MaterialIcon":
        icon = MaterialIcon[iconSrc];
        break;
      case "BootstrapIcon":
        icon = BootstrapIcon[iconSrc];
        break;
      case "RemixIcon":
        icon = RemixIcon[iconSrc];
        break;
      case "VSCIcon":
        icon = VSCIcon[iconSrc];
        break;
      case "FlatColor":
        icon = FlatColor[iconSrc];
        break;
      case "IcoMoon5Icon":
        icon = IcoMoon5Icon[iconSrc];
        break;
      case "IcoMoonIcon":
        icon = IcoMoonIcon[iconSrc];
        break;
      case "BoxIcon":
        icon = BoxIcon[iconSrc];
        break;
      case "HeroIcon":
        icon = HeroIcon[iconSrc];
        break;
      case "GitIcon":
        icon = GitIcon[iconSrc];
        break;
      case "Feather":
        icon = Feather[iconSrc];
        break;
      //   case "SVGIcons":
      //     icon = SVGIcon[iconSrc];
      //     break;
      default:
        icon = MaterialIcon[iconSrc];
    }
    // icon = React.createElement(icon);
  }
  return (
    <>
      <div style={{ display: "flex" }}>
        {/* <Icon {...other} style={props.style}> {icon}</Icon> */}
        {React.createElement(icon, {
          style: props.style,
          className: props.className,
          onClick: props.onClick,
        })}
      </div>
    </>
  );
};
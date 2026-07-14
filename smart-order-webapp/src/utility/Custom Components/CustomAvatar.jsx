import { Avatar } from "@mui/material";
import "./CustomAvatar.css";
const CustomAvatar = (props) => {
  let avatarName = props.name;
  if (props.name?.split(" ")[0]) {
    avatarName = props.name?.split(" ")[0][0];
  }
  if (props.name?.split(" ")[1]) {
    avatarName = avatarName + props.name?.split(" ")[1][0];
  }
  return (
    <Avatar style={{ width: 36, height: 36 }} className="styleAvartar">
      {avatarName}
    </Avatar>
  );
};
export default CustomAvatar;

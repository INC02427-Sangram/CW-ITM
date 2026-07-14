import { useState, useEffect } from "react";
import CircleIcon from "@mui/icons-material/Circle";
const StatusIcon = ({ status }) => {
  const [currentIcon, setCurrentIcon] = useState(null);
  
  useEffect(() => {
    switch (status) {
      case "CREATED":
      case "Create":
        setCurrentIcon(<CircleIcon sx={{ height: "1.1rem", width: "1.1rem", color: "#4caf50" }} />);
        break;
      case "TO BE REVIEWED":
      case "toBeReviewed":
        setCurrentIcon(<CircleIcon sx={{ height: "1.1rem", width: "1.1rem", color: "#ff9800" }} />);
        break;
      default:
        setCurrentIcon(<CircleIcon sx={{ height: "1.1rem", width: "1.1rem", color: "#9e9e9e" }} />);
    }
  }, [status]);

  return currentIcon;
};

export default StatusIcon;

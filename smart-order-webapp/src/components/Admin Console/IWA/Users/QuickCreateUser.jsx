// import styles from "./QuickCreateUser.module.css";
import { Box } from "@cw/rds";
import "../../../../../node_modules/@cw/quickadduser/dist/assets/style.css"; 
import { useNavigate } from "react-router-dom";

import { QuickAddUser } from "@cw/quickadduser";
import { useDispatch } from "react-redux";
import appEnv from "../../../../config/appEnv";

const QuickCreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onUserActionClick = (action, response) => {
    if (action === "home" || action === "usersummary") {
      navigate("/adminConsole/users");
    }
  };

  const platformConfig = {
    //env: 'dev',
    env: appEnv.PLATFORM_ENV,
    consumingApp: appEnv.CONSUMING_APP,
    platformName: "btp",
  };

  return (
    <Box >
      <QuickAddUser onUserActionClick={onUserActionClick} platformConfig={platformConfig}/>
    </Box>
  );
};

export default QuickCreateUser;
 
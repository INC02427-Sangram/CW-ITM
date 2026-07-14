import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../../../node_modules/@cw/adduser/dist/assets/style.css";
import { AddUser } from "@cw/adduser";
import { useDispatch } from "react-redux";
import appEnv from "../../../../config/appEnv";



const CreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onUserActionClick = (action, response) => {
    if (action === "usersummary") {
      navigate("/adminConsole/users");
    }
    if (response) {
      if(response?.status === "success" || response?.status === "SUCCESS" || response?.status === "Success"){
        return;
      }
    }
  };

  const platformConfig = {
    //env: 'dev',
    env: appEnv.PLATFORM_ENV,
    consumingApp: appEnv.CONSUMING_APP,
    platformName: "btp",
  };

  return (
    <>
      <AddUser onUserActionClick={onUserActionClick} platformConfig={platformConfig}/>
    </>
  );
};

export default CreateUser;
 
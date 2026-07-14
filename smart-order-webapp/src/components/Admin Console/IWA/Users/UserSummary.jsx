import React from "react";
import { UserSummary } from "@cw/usersummary";
import "../../../../../node_modules/@cw/usersummary/dist/assets/style.css";
import { useNavigate } from "react-router-dom";
import appEnv from "../../../../config/appEnv";

const UserSummaryContainer = () => {
    const navigate = useNavigate();

  const dateTimeConfig = {
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24hr",
  };

  const onUserSummaryActionClick = (action, userId) => {
    console.log(action);
    if(action === "quickadduser"){
        navigate("/adminConsole/users/quickAddUser");
    }
    if(action === "adduser"){
        navigate("/adminConsole/users/adduser");
    }
    if(action === "edit"){
        navigate(`/adminConsole/users/edit/${userId}`);
    }
    if(action === "view"){
        navigate(`/adminConsole/users/view/${userId}`);
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
      <div styles={{ padding: "1rem" }}>
        <UserSummary
          onUserSummaryActionClick={onUserSummaryActionClick}
          app={"IWA"}
          dateTimeConfig={dateTimeConfig}
          platformConfig={platformConfig}
        />
      </div>
    </>
  );
};

export default UserSummaryContainer;

/* eslint-disable no-console */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appEnv from "../../../../config/appEnv";
import { CreateGroup } from "@cw/creategroup";
import "../../../../../node_modules/@cw/creategroup/dist/assets/style.css";

const CreateGroupContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const onCreateGroupActionClick = (action, response) => {
    if (action === "groupSummary") {
      navigate("/adminConsole/groups");
    }
    if (response) {
      console.log(response);
    }
  };

  const dateTimeConfig = {
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24hr",
  };

  const platformConfig = {
    //env: 'dev',
    env: appEnv.PLATFORM_ENV,
    consumingApp: appEnv.CONSUMING_APP,
    platformName: "btp",
  };

  return (
    <>
      <CreateGroup
        onCreateGroupActionClick={onCreateGroupActionClick}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </>
  );
};

export default CreateGroupContainer;
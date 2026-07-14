/* eslint-disable no-console */
import React from "react";

import { GroupSummary } from "@cw/groupsummary";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appEnv from "../../../../config/appEnv";
import "../../../../../node_modules/@cw/groupsummary/dist/assets/style.css";


const GroupSummaryContainer = () => {
  const navigate = useNavigate();

  const onGroupSummaryActionClick = (action, groupId) => {
    console.log("Action received:", action);
    if (action === "view") {
      navigate(`/adminConsole/groups/viewGroup/${groupId}`);
    }
    if (action === "edit") {
      navigate(`/adminConsole/groups/editGroup/${groupId}`);
    }
    if (action === "addgroup") {
      navigate("/adminConsole/groups/createGroup");
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
      <GroupSummary
        onGroupSummaryActionClick={onGroupSummaryActionClick}
        app={"IWA"}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </>
  );
};

export default GroupSummaryContainer;
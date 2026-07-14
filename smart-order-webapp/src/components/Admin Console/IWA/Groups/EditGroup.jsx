/* eslint-disable no-console */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../node_modules/@cw/editgroup/dist/assets/style.css";
import { useNavigate, useParams } from "react-router-dom";
import appEnv from "../../../../config/appEnv";

import { EditGroup } from "@cw/editgroup";

const EditGroupContainer = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // eslint-disable-next-line no-shadow
  const onEditGroupActionClick = (action, _groupId, response) => {
    if (action === "groupSummary") {
      navigate("/adminConsole/groups");
    }
    if (response && response?.data?.status != "Error") {
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
      <EditGroup
        groupId={groupId}
        onEditGroupActionClick={onEditGroupActionClick}
        app={"IWA"}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </>
  );
};

export default EditGroupContainer;
/* eslint-disable no-console */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../node_modules/@cw/viewgroup/dist/assets/style.css";
import { useNavigate, useParams } from "react-router-dom";

import { ViewGroup } from "@cw/viewgroup";
import appEnv from "../../../../config/appEnv";

const ViewGroupContainer = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // eslint-disable-next-line no-shadow
  const onViewGroupActionClick = (action, groupId, response) => {
    if (action === "editGroup") {
      if (groupId) {
        navigate(`/adminConsole/groups/editGroup/${groupId}`);
      } else {
        console.log("Missing groupId for edit action.");
      }
    } else if (action === "groupSummary") {
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
    language: "EN",
  };

  return (
    <>
      <ViewGroup
        groupId={groupId}
        onViewGroupActionClick={onViewGroupActionClick}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </>
  );
};

export default ViewGroupContainer;
import React from "react";
import { ViewApplication } from "@cw/viewapplication";
import { useNavigate, useParams } from "react-router-dom";
import appEnv from "../../../../config/appEnv";
import "../../../../../node_modules/@cw/viewapplication/dist/assets/style.css";


function ViewApplicationContainer() {

  const navigate = useNavigate();

  const { applicationId } = useParams();


  const viewApplicationNavigate = (action) => {

    if (action === "home") navigate("/adminConsole/applicationMaster");

    if (action === "edit")

      navigate(`/adminConsole/applicationMaster/editApplication/${applicationId}`);

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

    <ViewApplication

      appId={"IOM"}

      viewApplicationNavigate={viewApplicationNavigate}

      dateTimeConfig={dateTimeConfig}

      platformConfig={platformConfig}

    />

  );

}

export default ViewApplicationContainer; 
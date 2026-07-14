import React from "react";

import { ApplicationSummary } from "@cw/applicationsummary";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appEnv from "../../../../config/appEnv";
import "../../../../../node_modules/@cw/applicationsummary/dist/assets/style.css";


const ApplicationSummaryContainer = () => {

    const navigate = useNavigate();


    const onApplicationSummaryActionClick = (action, applicationId) => {

        if (action === "createApplication")

            navigate("/adminConsole/applicationMaster/createApplication");

        if (action === "view")

            navigate(`/adminConsole/applicationMaster/viewApplication/${applicationId}`);

        if (action === "edit")

            navigate(`/adminConsole/applicationMaster/editApplication/${applicationId}`);

    };



    const dateTimeConfig = { dateFormat: "DD-MM-YYYY", timeFormat: "24hr" };

    const platformConfig = {

        //env: 'dev',
        env: appEnv.PLATFORM_ENV,
        consumingApp: appEnv.CONSUMING_APP,
        platformName: "btp",
    };



    return (

        <ApplicationSummary
            onApplicationSummaryActionClick={onApplicationSummaryActionClick}
            app={"IWA"}
            dateTimeConfig={dateTimeConfig}
            platformConfig={platformConfig}
        />

    );

};

export default ApplicationSummaryContainer;
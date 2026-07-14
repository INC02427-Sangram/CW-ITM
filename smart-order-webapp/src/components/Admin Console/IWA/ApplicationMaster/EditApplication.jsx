import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../node_modules/@cw/editapplication/dist/assets/style.css";
import { useNavigate, useParams } from "react-router-dom";
import appEnv from "../../../../config/appEnv";
import { EditApplication } from "@cw/editapplication";

const EditApplicationContainer = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { applicationId } = useParams();


    const onCreateApplicationActionClick = (action, data) => {

        if (action === "applicationSummary") navigate("/adminConsole/applicationMaster");

        const status = data?.status?.toLowerCase();

        if (status === "success")

            console.log("Application updated successfully");

        if (status === "error")

            console.error(data?.message || "Update failed");

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

            <EditApplication

                dateTimeConfig={dateTimeConfig}

                onCreateApplicationActionClick={onCreateApplicationActionClick}



                appId={"IOM"}

                platformConfig={platformConfig}

            />

        </>

    );

};

export default EditApplicationContainer; 
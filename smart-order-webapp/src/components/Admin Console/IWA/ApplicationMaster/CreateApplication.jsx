import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreateApplication } from "@cw/createapplication";
import appEnv from "../../../../config/appEnv";
import "../../../../../node_modules/@cw/createapplication/dist/assets/style.css";

const CreateApplicationContainer = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const onCreateApplicationActionClick = (action, data) => {

        if (data?.status === "success")

            console.log(data?.message || "Application created successfully");

        if (data?.status === "error")

            console.error(data?.message || "Failed to create");

        if (action === "applicationSummary") navigate("/adminConsole/applicationMaster");

    };



    const platformConfig = {
        //env: 'dev',
        env: appEnv.PLATFORM_ENV,
        consumingApp: appEnv.CONSUMING_APP,  
        platformName: "btp",
    };



    return (

        <div>

            <CreateApplication

                onCreateApplicationActionClick={onCreateApplicationActionClick}

                platformConfig={platformConfig}

            />

        </div>

    );

};

export default CreateApplicationContainer; 
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { TextRules } from "@cw/idm_qa";

const WorkRulesServices = "WorkRulesServices"


export default function DTtextRules(props) {

    const destinationsList = [
        {
            "Description": "",
            "Name": "WorkRulesServices",
            "URL": WorkRulesServices
        },
        {
            "Description": "",
            "Name": "CW_Worktext",
            "URL": WorkRulesServices
        },
        {
            "Description": "",
            "Name": "WorkRuleEngineServices",
            "URL": WorkRulesServices
        },
        {
            "Description": "",
            "Name": "WorkUtilsServices",
            "URL": WorkRulesServices
        }
    ]
    
    const NavbackToList = () => {
        let dt_details = {...props.DTdetails};
        dt_details["DTid"] = "";
        dt_details["ruleName"]= '',
        dt_details["version"]= '',
        props.setShowDT(false);
        navigate("");
    }

    return (
        <Box sx ={{height: "calc(100% - 10.5rem)"}}>
            <TextRules NavBackHandler={() => NavbackToList()} orchestration={true} ruleDetails={props?.DTdetails} destinations={destinationsList} saveHandler={data => console.log(data)} translationDataObjects={[]} />
        </Box>
    )
}
import { Modeling } from '@cw/idm';
import appEnv from '../../../config/appEnv';
import { useSelector } from 'react-redux';
export default function ModellingComp() {

    const destinations = [{
        Name: 'IDMServices',
        URL: 'IDMServices'
    }]

    //For Testing purpose in local put here IDM-jwt-token-utility and change the token in Vite Config also
    const token = ""
    const applicationDetails = {
        "applicationId": "308cb3e4-40c6-4326-bf9d-7d0fd663b76a",
        "name": "IOM",
        "label": "Intelligent Order Management",
        "description": "Intelligent Order Management",
        "status": "Active",
        "createdBy": "Pramod Sudheendra Kumar",
        "createdOn": 1710496623762,
        "updatedBy": "Pramod Sudheendra Kumar",
        "updatedOn": 1710496701031,
        "projectGuide": null,
        "conditionDatasets": [
            {
                "id": "ca4f2c956bd9457280e96466938af6c7",
                "sequence": 0,
                "name": null
            },
            {
                "id": "625c4165d64a459dacf1d1abc43b9819",
                "sequence": 0,
                "name": null
            },
            {
                "id": "fdf67dcc88db4407bd5b12303c452130",
                "sequence": 0,
                "name": null
            },
            {
                "id": "28a59a641f364a5e8d0f160dbe704e0a",
                "sequence": 0,
                "name": null
            },
            {
                "id": "f86e38c2ac154828905aa748b01f9021",
                "sequence": 0,
                "name": null
            },
            {
                "id": "4e64b9a495814b64a867b68c0dce7a78",
                "sequence": 0,
                "name": null
            },
            {
                "id": "a8d45df5-45e0-48e7-9758-fdce5d864cc7",
                "sequence": 1,
                "name": null
            },
            {
                "id": "870da9fe307144d6936dda8ed8f3354f",
                "sequence": 1,
                "name": null
            }
        ],
        "ruleCount": {
            "rcCount": 0,
            "dtCount": 1,
            "trCount": 20
        },
        "recentRule": {
            "createdOn": 1766143901543,
            "ruleLabel": "IOM_Business_Admin_shalwikumari06a5b1fbeb6a4914",
            "ruleName": "IOM_Business_Admin_shalwikumari06a5b1fbeb6a4914941e61e068b0a8de",
            "updatedOn": 1714116156406,
            "ruleType": "TEXT_RULE",
            "ruleVersion": "v1",
            "ruleId": "IOM_TR_000609"
        }
    }
  const userData = useSelector((state) => state.appReducer.userDetails);
  const userDetails = {
    name: `${userData?.firstName} ${userData?.lastName}`,
    emailId: userData?.emailId,
    currentRole: userData?.roles[0],
  };

    return (
        <div style={{ height: "100vh" }}>
            <div style={
                {
                    height: "calc(100% - 10.5rem)",
                    paddingRight: "21px",
                    paddingLeft: "21px",
                    boxSizing: "border-box",
                }
            }>
                <Modeling
                //env={'DEV'} 
                env={appEnv.MODELING_ENV} 
                token={token} 
                destinations={destinations} 
                userDetails={userDetails} 
                applicationDetails={applicationDetails} 
                />
            </div>
        </div>
    );
}
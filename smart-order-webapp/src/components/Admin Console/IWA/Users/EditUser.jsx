import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../../../../../node_modules/@cw/edituser/dist/assets/style.css";
import { EditUser } from "@cw/edituser";
import appEnv from "../../../../config/appEnv";


const EditUserContainer = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // eslint-disable-next-line no-shadow
  const editUserNavigate = (action, _userId, response) => {
    if (action === "home") {
      navigate("/adminConsole/users");
    }
    if (response) {
      if (response?.status === "success" || response?.status === "SUCCESS" || response?.status === "Success") {
        return;
      }
    }
  };

  const userDetailsVisibility = {
    'basic-details': true,
    'official-details': true,
    'data-level-access': true,
    'roles': true,
    'additional-info': true,
    'user-preferences': true,
    'connected-systems': true,
    'activity-log': true
  };

  const attributeMasterAppName = "WORKRULES"

    const dateTimeConfig = {
    dateFormat: 'DD-MM-YYYY',
    timeFormat: '24hr'
  } ;

  const platformConfig = {
    //env: 'dev',
    env: appEnv.PLATFORM_ENV,
    consumingApp: appEnv.CONSUMING_APP,
    platformName: "btp",
  };

  return (
    <>
      <EditUser userId={userId} editUserNavigate={editUserNavigate} app={"IWA"} attributeMasterAppName={attributeMasterAppName}
      userDetailsVisibility={userDetailsVisibility} dateTimeConfig={dateTimeConfig} platformConfig={platformConfig}
      />
    </>
  );
};

export default EditUserContainer;
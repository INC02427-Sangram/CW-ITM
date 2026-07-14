import { useNavigate, useParams } from "react-router-dom";
import { ViewUser } from "@cw/viewuser";
import { useDispatch } from "react-redux";
import "../../../../../node_modules/@cw/viewuser/dist/assets/style.css";
import appEnv from "../../../../config/appEnv";



const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // eslint-disable-next-line no-shadow
  const viewUserNavigate = (action, userId, response) => {
    if (action === "edit") {
      if (userId) {
        navigate(`/adminConsole/users/edit/${userId}`);
      }
    } else if (action === "home") {
      navigate("/adminConsole/users");
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
      <ViewUser userId={userId} viewUserNavigate={viewUserNavigate} app={"IWA"} userDetailsVisibility={userDetailsVisibility} dateTimeConfig={dateTimeConfig} platformConfig={platformConfig} />
    </>
  );
};

export default UserDetails;

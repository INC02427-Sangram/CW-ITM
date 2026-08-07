import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ViewUser } from "@cw/viewuser";

const ViewUserPage = () => {
  const { userId } = useParams();

  const navigate = useNavigate();
  const { preferences } = useSelector((state) => state.user);

  const selectedEnvironment = import.meta.env.VITE_APP_ENV;

  const viewUserNavigate = (action, userId) => {
    if (action === "home") navigate("/userSummary");

    if (action === "edit") navigate(`/editUser/${userId}`);
  };

  const userDetailsVisibility = {
    "basic-details": true,
    "official-details": true,
    "data-level-access": true,

    roles: true,
    "additional-info": true,
    "user-preferences": true,

    "connected-systems": true,
    "activity-log": true,
  };
  const dateTimeConfig = {
    dateFormat: preferences.dateFormat,
    timeFormat: preferences.timeFormat,
    snackbarTime: "5000",
  };

  const platformConfig = {
    env: selectedEnvironment,
    consumingApp: "ITM",

    platformName: "btp",
    platformUrl: "https://cw-iwa-dev.cherrywork.com/IWAApi/",
  };

  return (
    <>
      <ViewUser
        userId={userId}
        viewUserNavigate={viewUserNavigate}
        app="ITM"
        userDetailsVisibility={userDetailsVisibility}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />

      {/* <CustomSnackBar /> */}
    </>
  );
};

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EditUser } from "@cw/edituser";

const EditUserPage = () => {
  const { userId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { preferences } = useSelector((state) => state.user);

  const selectedEnvironment = import.meta.env.VITE_APP_ENV;

  const editUserNavigate = (action, _userId, response) => {
    if (action === "home") navigate("/userSummary");

    if (response) {
      const ok = ["success", "SUCCESS", "Success"].includes(
        response?.status ?? "",
      );

      dispatch(
        // showSnackbar({
        //   message: response?.message ?? "An error occurred",

        //   type: ok ? "success" : "error",
        // }),
      );
    }
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
      <EditUser
        userId={userId}
        editUserNavigate={editUserNavigate}
        app="ITM"
        attributeMasterAppName="WORKRULES"
        userDetailsVisibility={userDetailsVisibility}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />

      {/* <CustomSnackBar /> */}
    </>
  );
};

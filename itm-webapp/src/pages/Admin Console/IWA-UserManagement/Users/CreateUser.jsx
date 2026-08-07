import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AddUser } from "@cw/adduser";

const CreateUserPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { preferences } = useSelector((state) => state.user);

  const selectedEnvironment = import.meta.env.VITE_APP_ENV;

  const onUserActionClick = (action, response) => {
    if (action === "usersummary") navigate("/userSummary");

    if (response) {
      const ok = ["success", "SUCCESS", "Success"].includes(response?.status);

      //   dispatch(
      //     showSnackbar({
      //       message: ok ? response.message : response?.err?.data?.message,

      //       type: ok ? response.status : response?.err?.data?.status,
      //     }),
      //   );
    }
  };

  const platformConfig = {
    env: selectedEnvironment,
    consumingApp: "ITM",
    platformName: "btp",
    // platformUrl: "https://cw-iwa-dev.cherrywork.com/IWAApi/",
  };

  const dateTimeConfig = {
    dateFormat: preferences.dateFormat,
    timeFormat: preferences.timeFormat,
    snackbarTime: "5000",
  };

  return (
    <>
      <AddUser
        onUserActionClick={onUserActionClick}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
      {/* <CustomSnackBar /> */}
    </>
  );
};

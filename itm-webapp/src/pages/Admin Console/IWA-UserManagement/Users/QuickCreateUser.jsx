import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { QuickAddUser } from "@cw/quickadduser";

const QuickCreateUserPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { preferences } = useSelector((state) => state.user);

  const selectedEnvironment = import.meta.env.VITE_APP_ENV;

  const onUserActionClick = (action, response) => {
    if (action === "home" || action === "usersummary") navigate("/userSummary");

    if (response)
      dispatch(
        // showSnackbar({ message: response?.message, type: response?.status }),
      );
  };

  const platformConfig = {
    env: selectedEnvironment,
    consumingApp: "ITM",

    platformName: "btp",
    platformUrl: "https://cw-iwa-dev.cherrywork.com/IWAApi/",
  };

  const dateTimeConfig = {
    dateFormat: preferences.dateFormat,
    timeFormat: preferences.timeFormat,
    snackbarTime: "5000",
  };

  return (
    <Box className={styles.container}>
      <QuickAddUser
        onUserActionClick={onUserActionClick}
        platformConfig={platformConfig}
        dateTimeConfig={dateTimeConfig}
      />
    </Box>
  );
};

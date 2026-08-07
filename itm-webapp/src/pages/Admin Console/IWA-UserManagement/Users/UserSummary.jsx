import { useNavigate } from "react-router-dom";
import { UserSummary } from "@cw/usersummary";

const UserSummaryPage = () => {
  const navigate = useNavigate();

  const selectedEnvironment = String(import.meta.env.VITE_APP_ENV || "");

  const onUserSummaryActionClick = (action, userId) => {
    console.log("action =", action);
    console.log("action type =", typeof action);
    console.log("userId =", userId);
    console.log("userId type =", typeof userId);

    const actionMap = {
      view: () => userId && navigate(`/viewUser/${userId}`),
      edit: () => userId && navigate(`/editUser/${userId}`),
      adduser: () => navigate("/userSummary/createUser"),
      quickadduser: () => navigate("/userSummary/quickCreateUser"),
    };

    if (typeof action === "string") {
      actionMap[action.trim()]?.();
    }
  };

  const dateTimeConfig = {
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24hr",
    snackbarTime: 7000,
  };

  const platformConfig = {
    env: selectedEnvironment,
    consumingApp: "ITM",
    platformName: "btp",
    platformUrl: "https://cw-iwa-dev.cherrywork.com/IWAApi/",
  };

  return (
    <UserSummary
      dateTimeConfig={dateTimeConfig}
      platformConfig={platformConfig}
      onUserSummaryActionClick={onUserSummaryActionClick}
    />
  );
};

export default UserSummaryPage;

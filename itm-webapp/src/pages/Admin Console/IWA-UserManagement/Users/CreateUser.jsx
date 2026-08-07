import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AddUser } from "@cw/adduser";

const USERS_BASE_PATH = "/admin-console/iwa/users";

const CreateUserPage = () => {
  const navigate = useNavigate();
  const { preferences } = useSelector((state) => state.user);

  const selectedEnvironment = import.meta.env.VITE_APP_ENV;

  const onUserActionClick = (action) => {
    if (action === "usersummary" || action === "home") {
      navigate(USERS_BASE_PATH);
    }
  };

  const platformConfig = {
    env: selectedEnvironment,
    consumingApp: "ITM",
    platformName: "btp",
  };

  const dateTimeConfig = {
    dateFormat: preferences.dateFormat,
    timeFormat: preferences.timeFormat,
    snackbarTime: "5000",
  };

  return (
    <AddUser
      onUserActionClick={onUserActionClick}
      dateTimeConfig={dateTimeConfig}
      platformConfig={platformConfig}
    />
  );
};

export default CreateUserPage;

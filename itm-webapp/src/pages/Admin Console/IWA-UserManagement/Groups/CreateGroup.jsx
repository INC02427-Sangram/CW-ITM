import { useNavigate } from "react-router-dom";
import { CreateGroup } from "@cw/creategroup";
import { Box } from "@mui/material";

const GROUPS_BASE_PATH = "/admin-console/iwa/groups";

const CreateGroupPage = () => {
  const navigate = useNavigate();

  const selectedEnvironment = String(import.meta.env.VITE_APP_ENV || "");

  const onCreateGroupActionClick = (action) => {
    if (action === "groupSummary" || action === "home") {
      navigate(GROUPS_BASE_PATH);
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
  };

  return (
    <Box className="outermost-container">
      <CreateGroup
        app="IWA"
        onCreateGroupActionClick={onCreateGroupActionClick}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </Box>
  );
};

export default CreateGroupPage;

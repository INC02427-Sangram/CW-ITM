import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ViewGroup } from "@cw/viewgroup";

const GROUPS_BASE_PATH = "/admin-console/iwa/groups";

const ViewGroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const selectedEnvironment = String(import.meta.env.VITE_APP_ENV || "");

  const onViewGroupActionClick = (action) => {
    if (action === "editGroup" && groupId) {
      navigate(`${GROUPS_BASE_PATH}/editGroup/${groupId}`);
    }

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
      <ViewGroup
        groupId={groupId}
        onViewGroupActionClick={onViewGroupActionClick}
        app="IWA"
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </Box>
  );
};

export default ViewGroupPage;

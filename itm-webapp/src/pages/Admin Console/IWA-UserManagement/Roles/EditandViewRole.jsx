import { Box } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SimpleViewAndEdit } from "@cw/viewandeditrole";
import { MFViewandEdit } from "@cw/mfviewandedit";

const ROLES_BASE_PATH = "/admin-console/iwa/roles";

const EditRolePage = () => {
  const { roleId, roleVersionNo, roleSegment } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedEnvironment = String(import.meta.env.VITE_APP_ENV || "");
  const isEditMode = location.pathname.includes("editRole");
  const status = location.state?.status;

  const dateTimeConfig = {
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24hr",
    snackbarTime: 7000,
  };

  const simpleViewAndEditProps = { isEditMode, roleVersionNo, roleId, status };

  const MFViewandEditProps = {
    isEdit: isEditMode,
    roleId,
    roleVersionNo,
    status,
  };

  const handleNav = (action) => {
    if (action === "roleSummary" || action === "home") {
      navigate(ROLES_BASE_PATH);
    }

    if (action === "editRole") {
      navigate(
        `${ROLES_BASE_PATH}/editRole/${roleId}/${roleVersionNo}/${roleSegment}`,
        { state: { status } },
      );
    }
  };

  const platformConfig = {
    env: selectedEnvironment,
    consumingApp: "ITM",
    platformName: "btp",
  };

  return (
    <Box className="outermost-container">
      {roleSegment?.includes("Simple") ? (
        <SimpleViewAndEdit
          simpleViewAndEditProps={simpleViewAndEditProps}
          onSimpleViewAndEditClick={handleNav}
          dateTimeConfig={dateTimeConfig}
          platformConfig={platformConfig}
          app="IWA"
        />
      ) : (
        <MFViewandEdit
          MFViewandEditProps={MFViewandEditProps}
          onMFViewandEditActionClick={handleNav}
          dateTimeConfig={dateTimeConfig}
          platformConfig={platformConfig}
          app="IWA"
        />
      )}
    </Box>
  );
};

export default EditRolePage;

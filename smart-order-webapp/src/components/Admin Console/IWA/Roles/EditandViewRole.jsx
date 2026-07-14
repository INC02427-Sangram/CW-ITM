/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { SimpleViewAndEdit } from "@cw/viewandeditrole";
import { MFViewandEdit } from "@cw/mfviewandedit";
import "../../../../../node_modules/@cw/viewandeditrole/dist/assets/style.css";
import "../../../../../node_modules/@cw/mfviewandedit/dist/assets/style.css";
import appEnv from "../../../../config/appEnv";

const EditandViewRole = () => {
  const { roleId, roleVersionNo, roleSegment } = useParams();
  const viewRoleLocation = useLocation();
  const navigate = useNavigate();
  const viewRoleStatus = viewRoleLocation.state?.status;
  const appId="IWA";
  
  // Convert isEditMode to state
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Initialize isEditMode based on pathname
  useEffect(() => {
    setIsEditMode(viewRoleLocation.pathname.includes("editRole"));
  }, [viewRoleLocation.pathname]);
  
  const dateTimeConfig = {
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24hr",
  };

  const simpleViewAndEditProps = {
    isEditMode: isEditMode,
    roleVersionNo,
    roleId,
    status: viewRoleStatus
  };

  const onSimpleViewAndEditClick = (action, data) => {
    if (action === "roleSummary") {
      navigate("/adminConsole/roles");
    }
    if (action === "editRole") {
      setIsEditMode(true); // Update state when entering edit mode
      navigate(`/adminConsole/roles/editRole/${roleId}/${roleVersionNo}/${roleSegment}`);
    }
  };

  const MFViewandEditProps = {
    isEdit: isEditMode,
    roleId: roleId,
    roleVersionNo: roleVersionNo,
    status: viewRoleStatus,
  };

  const onMFViewandEditActionClick = (action, data) => {
    if (action === "roleSummary") {
      navigate("/adminConsole/roles");
    }
    if (action === "editRole") {
      setIsEditMode(true); // Update state when entering edit mode
      navigate(`/adminConsole/roles/editRole/${roleId}/${roleVersionNo}/${roleSegment}`);
    }
  };

  const platformConfig = {
    //env: 'dev',
    env: appEnv.PLATFORM_ENV,
    consumingApp: appEnv.CONSUMING_APP,
    platformName: "btp",
  };

  return (
    <div>
      {roleSegment?.includes("Simple") ? (
        <SimpleViewAndEdit 
          simpleViewAndEditProps={simpleViewAndEditProps} 
          onSimpleViewAndEditClick={onSimpleViewAndEditClick} 
          dateTimeConfig={dateTimeConfig} 
          appId={appId}
          platformConfig={platformConfig}
        />
      ) : (
        <MFViewandEdit 
          MFViewandEditProps={MFViewandEditProps} 
          onMFViewandEditActionClick={onMFViewandEditActionClick} 
          dateTimeConfig={dateTimeConfig} 
          appId={appId}
          platformConfig={platformConfig}
        />
      )}
    </div>
  );
};

export default EditandViewRole;
 
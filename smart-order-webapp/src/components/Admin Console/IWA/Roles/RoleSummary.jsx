import React, { useState } from "react";
import "../../../../../node_modules/@cw/rolesummary/dist/assets/style.css";
import { RoleSummary } from "@cw/rolesummary";
import { useNavigate } from "react-router-dom";
import appEnv from "../../../../config/appEnv";

const RoleSummaryContainer = () => {
  const navigate = useNavigate();
  const [_isRoleEditable, setIsRoleEditable] = useState(false);

  const isVisible = {
    isCreateRoleVisible: true,
    isCopyCreateWithReferenceVisible: true,
    isDeleteVisible: true,
    isInActiveAndActiveVisible: true,
    isExportVisible: true,
    isSimpleRoleVisible: true,
    isModuleFeatureRoleVisible: true,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRoleSummaryActionClick = (action, data) => {
    console.log(action);
    if (action === "createRole") {
      navigate("/adminConsole/roles/createRole");
    }
    if (action === "viewRole" || action === "editRole") {
      if (data?.roleId && data?.roleVersionNo && data?.roleSegment) {
        setIsRoleEditable(action === "editRole");
        const path = `/adminConsole/roles/${action}/${data.roleId}/${data.roleVersionNo}/${data.roleSegment}`;
        navigate(path, { state: { status: data?.status } });
      }
    }
  };

  const appId = "IWA";
  const dateTimeConfig = {
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24hr",
  };

  const platformConfig = {
    //env: 'dev',
    env: appEnv.PLATFORM_ENV,
    consumingApp: appEnv.CONSUMING_APP,
    platformName: "btp",
  };

  return (
    <>
      <RoleSummary
        isVisible={isVisible}
        onRoleSummaryActionClick={onRoleSummaryActionClick}
        appId={appId}
        dateTimeConfig={dateTimeConfig}
        platformConfig={platformConfig}
      />
    </>
  );
};

export default RoleSummaryContainer;

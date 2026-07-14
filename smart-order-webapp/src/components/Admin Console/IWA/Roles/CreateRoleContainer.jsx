import React from "react";
import { Box } from "@cw/rds";
import { CreateRole } from "@cw/createrole";
import { useNavigate } from "react-router-dom";
import "../../../../../node_modules/@cw/createrole/dist/assets/style.css";
import appEnv from "../../../../config/appEnv";

const CreateRoleContainer = () => {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslinat/no-explicit-any
  const onCreateRoleActionClick = (action, data) => {
    console.log(action);

    if (action === "roleSummary") {
      navigate("/adminConsole/roles");
    }
  };

  const appId = 'IWA';

  const platformConfig = {
    //env: 'dev',
    env: appEnv.PLATFORM_ENV,
    consumingApp: appEnv.CONSUMING_APP,
    platformName: "btp",
  };

  return (
    <Box>
      <CreateRole
        onCreateRoleActionClick={onCreateRoleActionClick}
        appId={appId}
        platformConfig={platformConfig}
      />
    </Box>
  );
};

export default CreateRoleContainer;
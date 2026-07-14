import React from "react";
import { useSelector } from "react-redux";
import { WorkflowManager } from "@cw/iwm-workflow-builder";

const CustomWorkflowBuilder = () => {
  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const userList = useSelector((state) => state.appReducer.userList);
  const groupList = useSelector((state) => state.appReducer.groupList);
  const token = userDetails?.token || "";
  const userEmailId = userDetails.emailId;
  

  return (
    <WorkflowManager
      theme={"blueTheme"}
      isThemeChangeIcon={false}
      userEmail={userEmailId}
      userList={userList}
      groupList={groupList}
    />
  );
};

export default CustomWorkflowBuilder;

import { ACpackage } from "@cw/idm";
import { useSelector } from "react-redux";

export default function IDMAdminConsole(props) {
  const userData = useSelector((state) => state.appReducer.userDetails);
  const userDetails = {
    name: `${userData?.firstName} ${userData?.lastName}`,
    emailId: userData?.emailId,
    currentRole: userData?.roles[0],
  };
  const token = "";
  const destinations = [
    {
      Name: "IDMServices",
      URL: "IDMServices",
    },
  ];
  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          height: "calc(100% - 10.5rem)",
          padding: "21px",
          boxSizing: "border-box",
        }}
      >
        <ACpackage
          userDetails={userDetails}
          token={token}
          destinations={destinations}
        />
      </div>
    </div>
  );
}

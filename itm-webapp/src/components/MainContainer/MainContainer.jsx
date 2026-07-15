import { Outlet } from "react-router-dom";

const MainContainer = () => {
  return (
    <div className="mainContent">
      <Outlet />
    </div>
  );
};

export default MainContainer;

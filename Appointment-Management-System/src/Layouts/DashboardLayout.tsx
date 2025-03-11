import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "../StyleComponents/dashboardLayout.scss";
type Role = 'admin' | 'doctor' | 'patient'



const userRole:Role = 'patient'
const DashboardLayout = () => {
  

  return (
    <div className="dashboard-container">
      <Sidebar role={userRole} />
      <div className="main-content">
        {/* <Navbar /> */}
        <div className="content">
          <Outlet /> {/* This will render the respective dashboard content */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

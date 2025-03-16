import { Link } from "react-router-dom";
import React from "react";
import '../StyleComponents/dashboardLayout.scss'
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../Toast/ToastMessage";

// Sidebar Menu Items Configuration
const sidebarConfig = {
  admin: [
    { path: "/admin", label: "Dashboard",  },
    { path: "admin/doctorlist", label: "List of Doctors",  },
    { path: "admin/patientlist", label: "List of Patients",  },
  ],
  doctor: [
    { path: "/doctor", label: "Dashboard", },
    { path: "/doctor/appointments", label: "Appointments",  },
    { path: "/doctor/profile", label: "Profile"}
  ],
  patient: [
    { path: "/patient", label: "Dashboard", },
    { path: "/patient/bookings", label: "Book Appointment", },
    { path:"/patient/viewappointments" , label:"View Appointments"}
  ],
};
type SideBarProps={
  role: "admin" | "doctor" | "patient"
}
const Sidebar:React.FC<SideBarProps> = ({ role }) => {
  const navigate = useNavigate();
  const menuItems = sidebarConfig[role] || [];

  const logout=()=>{
    localStorage.removeItem("userRole")
    localStorage.removeItem("token")
    ToastMessage({message:"Logged out",toastType:"info"})
    navigate('/login')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>{role?.charAt(0).toUpperCase() + role.slice(1)} Panel</h2>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>
              
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="logout-btn">
        <Button variant="contained" onClick={logout}>
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

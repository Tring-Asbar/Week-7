import { Link } from "react-router-dom";
import React from "react";
import '../StyleComponents/dashboardLayout.scss'
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../Toast/ToastMessage";
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import HistoryTwoToneIcon from '@mui/icons-material/HistoryTwoTone';

const sidebarConfig = {
  admin: [
    { path: "/admin", label: "Dashboard",icon:<DashboardIcon/>  },
    { path: "admin/adddoctor", label: "Add Doctor",icon:<AddIcon/>  },
    { path: "admin/doctorlist", label: "List of Doctors", icon:<ListIcon/> },
    { path: "admin/patientlist", label: "List of Patients", icon:<ListIcon/> },
  ],
  doctor: [
    { path: "/doctor", label: "Dashboard",icon:<DashboardIcon/> },
    { path: "/doctor/appointments", label: "Appointments",  },
    { path: "/doctor/profile", label: "Profile", icon:<AccountBoxIcon/>}
  ],
  patient: [
    { path: "/patient", label: "Dashboard",icon:<DashboardIcon/> },
    { path: "/patient/bookings", label: "Book Appointment", icon:<EditIcon />},
    { path:"/patient/viewappointments" , label:"View Appointments",icon:<PreviewIcon/>},
    { path:"/patient/history" , label:"History", icon:<HistoryTwoToneIcon/>}
  ],
};
type SideBarProps={
  role: "admin" | "doctor" | "patient"
}
const Sidebar:React.FC<SideBarProps> = ({ role }) => {
  const navigate = useNavigate();
  const menuItems = sidebarConfig[role] || [];
  const name = localStorage.getItem('name')

  const logout=()=>{
    localStorage.removeItem("userRole")
    localStorage.removeItem("token")
    localStorage.removeItem("name")
    localStorage.removeItem("approvedAppointments");

    ToastMessage({message:"Logged out",toastType:"info"})
    navigate('/login')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <PersonIcon fontSize="large"/>
        <h2>{name}</h2>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>
              
              <span>{item.icon}{item.label}</span>
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

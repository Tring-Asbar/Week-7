import { Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "./Login/LoginForm";
import SignUpForm from "./SignUp/SignUpForm";
import Home from "./Pages/Home";
import DashboardLayout from "./Layouts/DashboardLayout";
import AuthLayout from "./Layouts/AuthLayout";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import DoctorsList from "./Pages/Admin/DoctorsList";
import PatientsList from "./Pages/Admin/PatientsList";
import DoctorDashboard from "./Pages/Doctor/DoctorDashboard";
import AppointmentsList from "./Pages/Doctor/AppointmentsList";
import PatientDashboard from "./Pages/Patient/PatientDashboard";
import AppointmentBooking from "./Pages/Patient/AppointmentBooking";
import DoctorProfile from "./Pages/Doctor/DoctorProfile";
import ViewAppointments from "./Pages/Patient/ViewAppointments";
import AddDoctor from "./Pages/Admin/AddDoctor";
import AppointmentHistory from "./Pages/Patient/AppointmentHistory";

function App() {
  const userRole = localStorage.getItem("userRole"); // Check if user is logged in
  // const location = useLocation();
//  localStorage.clear()
  const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <LoginForm /> },
    { path: "/signup", element: <SignUpForm /> },
  ];

  const privateRoutes = [
    { path: "/admin", element: <AdminDashboard />, allowedRoles: ["admin"] },
    { path: "/admin/doctorlist", element: <DoctorsList />, allowedRoles: ["admin"] },
    { path: "/admin/patientlist", element: <PatientsList />, allowedRoles: ["admin"] },
    { path: "/admin/adddoctor", element: <AddDoctor/>, allowedRoles: ["admin"] },
    { path: "/doctor", element: <DoctorDashboard />, allowedRoles: ["doctor"] },
    { path: "/doctor/appointments", element: <AppointmentsList />, allowedRoles: ["doctor"] },
    { path: "/doctor/profile", element:<DoctorProfile/>, allowedRoles :["doctor"]},
    { path: "/patient", element: <PatientDashboard />, allowedRoles: ["patient"] },
    { path: "/patient/bookings", element: <AppointmentBooking />, allowedRoles: ["patient"] },
    { path: "/patient/viewappointments", element:<ViewAppointments/>, allowedRoles: ['patient']},
    { path: "/patient/history", element:<AppointmentHistory/>,allowedRoles:['patient']}
  ];
  // localStorage.clear()
  return (
    <Routes>
      {/* Public Routes - Redirect logged-in users away from login/signup */}
      <Route element={<AuthLayout />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              userRole && (route.path === "/login" || route.path === "/signup" || route.path==='/') ? (
                <Navigate to={`/${userRole}`} replace /> // Redirect logged-in users to their dashboard
              ) : (
                route.element
              )
            }
          />
        ))}
      </Route>

      {/* Private Routes - Ensure access control */}
      <Route element={<DashboardLayout />}>
        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoutes allowedRoles={route.allowedRoles}>
                {route.element}
              </ProtectedRoutes>
            }
          />
        ))}
      </Route>

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

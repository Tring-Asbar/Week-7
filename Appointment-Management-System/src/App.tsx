import './App.scss';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './Login/LoginForm';
import SignUpForm from './SignUp/SignUpForm';
import DoctorDashboard from './Pages/Doctor/DoctorDashboard';
import PatientDashboard from './Pages/Patient/PatientDashboard';
import DashboardLayout from './Layouts/DashboardLayout';
import AuthLayout from './Layouts/AuthLayout';

import AdminDashboard from './Pages/Admin/AdminDashboard';
import ProtectedRoutes from './Routes/ProtectedRoutes';
import DoctorsList from './Pages/Admin/DoctorsList';
import PatientsList from './Pages/Admin/PatientsList';
import AppointmentsList from './Pages/Doctor/AppointmentsList';
import Home from './Pages/Home';
import AppointmentBooking from './Pages/Patient/AppointmentBooking';



function App() {
  const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <LoginForm /> },
    { path: "/signup", element: <SignUpForm /> },
  ];

  const privateRoutes = [

    
    { path: "/admin", element: <AdminDashboard />, allowedRoles: ["admin"] },
    { path: "/admin/doctorlist", element:<DoctorsList/>, allowedRoles: ["admin"] },
    { path: "/admin/patientlist", element: <PatientsList/>, allowedRoles: ["admin"] },
    { path: "/doctor", element: <DoctorDashboard />, allowedRoles: ["doctor"] },
    { path: "/doctor/appointments" , element:<AppointmentsList/> , allowedRoles: ["doctor"]},
    { path: "/patient", element: <PatientDashboard />, allowedRoles: ["patient"] },
    {path: "/patient/bookings", element:<AppointmentBooking/>, allowedRoles:['patient']}
  ];

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Private Dashboard Routes */}
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
      </Routes>
    </>
  );
}

export default App;
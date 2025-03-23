import { Button } from '@mui/material';
import '../StyleComponents/Home.scss'
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/galaxy_logo.png'
// import LoginForm from '../Login/LoginForm';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='home_cover'>
      <div className='left_content'>
        <div className='home_container'>
          <div className='logo'>
            <img src={logo} alt="" width={150} height={150}/>
          </div>
        </div>
  
        <div className='home_content'>
          <p>Online Booking: Patients can view available time slots of doctors and book appointments online.
          Doctor Availability: Real-time update on doctor schedules and availability.
          Appointment Confirmation: Automated SMS or email notifications confirming the appointment.
          Calendar Integration: Syncing appointments with doctors' personal calendars to prevent overbooking.</p>
        </div>

        <div className='home_content'>
          <p>Patients can register by providing their personal details (name, contact information, insurance details, etc.).Book your appointments flexibly</p>
          <Button variant='contained' className='btn-field' onClick={()=>navigate('/signup')}>SignUp</Button>
        </div>

      </div>

      <div className='right_content'>
        <h1>Welcome to Appointment Management System!</h1>
        <p>Book your Appointments flexibly</p>
        <Button fullWidth variant='contained' className='btn_signin' color='inherit' onClick={()=>navigate('/login')}>Sign in with your account</Button>
      </div>
      
    </div>
    
    
  );

}

export default Home
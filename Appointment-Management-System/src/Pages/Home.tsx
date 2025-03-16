import { Button } from '@mui/material';
import '../StyleComponents/Home.scss'
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/galaxy_logo.png'
// import LoginForm from '../Login/LoginForm';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='home_cover'>
    <div className='home_container'>
      <div className='logo'>
        <img src={logo} alt="" width={150} height={150}/>
      </div>
      {/* <div className="home_buttons">
        <Button variant='outlined' className='btn-field'  onClick={()=>navigate('/login')}>Login</Button>
        <Button variant='contained' className='btn-field' onClick={()=>navigate('/signup')}>SignUp</Button>
      </div> */}
      
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
      <Button variant='outlined' className='btn-field'  onClick={()=>navigate('/login')}>Login</Button>
    </div>
    <div>
      
    </div>
   
    </div>
    
    
  );

}

export default Home
import { Button } from '@mui/material';
import '../StyleComponents/Home.scss'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
    <Button variant='outlined'  onClick={()=>navigate('/login')}>Login</Button>
    <Button variant='contained' onClick={()=>navigate('/signup')}>SignUp</Button>
    </>
  );

}

export default Home
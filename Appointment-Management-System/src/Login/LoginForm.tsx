import { useCallback,useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, TextField,FormControl,IconButton,InputLabel,OutlinedInput,InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import '../StyleComponents/UserForm.scss';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../Toast/ToastMessage';
import { useMutation} from '@apollo/client';
import { login_user } from './LoginFormApi';
import Loader from '../Loader';

interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword,setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false); 
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const [login] = useMutation(login_user);

  const onSubmit: SubmitHandler<FormData> = useCallback(async (values) => {
    
    try {
      const { data } = await login({ variables: { input:{ user_email: values.email, user_password: values.password }} });
      console.log(data.login)
      if (data && data.login) {
        localStorage.setItem('token', data.login.token);
        localStorage.setItem('userRole',data.login.role.toLowerCase());
        localStorage.setItem('name',data.login.name)
        console.log(data.login.token)
        const role = localStorage.getItem('userRole')
        setLoading(true);
        setTimeout(() => {
          navigate(`/${role}`);
          window.location.reload();
          ToastMessage({ message: 'Logged in successfully', toastType: 'success' });
        },3000)
      } else {
        ToastMessage({ message: 'Invalid credentials', toastType: 'error' });
      }
    } catch (err) {
      console.error('Login Error:', err);
      ToastMessage({ message: 'An error occurred, please try again', toastType: 'error' });
    }
  }, []);

  const pwd = watch('password');
  useEffect(() => {
    if (pwd.includes(' ')) {
      setValue('password', pwd.replace(/\s/g, ''));
    }
  }, [pwd, setValue]);

  return (
    
    (!loading ? <div className='login'>
      <div>
        <h1>Login</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='fields'>
          <TextField
            variant='outlined'
            label='Email'
            type='text'
            className='field'
            placeholder='Enter email'
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
            })}
          />
          {errors.email && <p className='err-msg'>{errors.email.message}</p>}
        </div>

        <div className="fields">

        <FormControl sx={{  width: '100%' }} variant="outlined" >
          <InputLabel htmlFor="outlined-adornment-password" className='field'>Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter Password'
            className='field'
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {errors.password && <p className='err-msg'>{errors.password.message}</p>}
        </FormControl>

        </div>

        <div className='fields'>
          <Button variant='contained' className='field' type='submit'>
            Submit
          </Button>
          <p className='footer'>
            Don't have an account?{' '}
            <span className='highlight' onClick={() => navigate('/signup')}>
              SignUp
            </span>
          </p>
        </div>
      </form>
    </div> : <Loader />)
    
  );
};

export default LoginForm;

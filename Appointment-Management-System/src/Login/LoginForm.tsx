import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import '../StyleComponents/UserForm.scss';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../Toast/ToastMessage';
import bcrypt from 'bcryptjs';

interface FormData {
  email: string;
  password: string;
}

import { useLazyQuery, gql } from '@apollo/client';

const get_User_By_Email = gql`
  query GetUserByEmail($user_email: String!) {
    getUserByEmail(user_email: $user_email) {
      user_name
      user_email
      user_password
      user_role
    }
  }
`;

const LoginForm = () => {
  const navigate = useNavigate();

  const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const [getUserByEmail] = useLazyQuery(get_User_By_Email);

  const onSubmit: SubmitHandler<FormData> = useCallback(async (values) => {
    console.log('User Data:', values);

    try {
      const { data } = await getUserByEmail({ variables: { user_email: values.email } });
      if (data && data.getUserByEmail) {
        const user = data.getUserByEmail;

        // Compare the entered password with the hashed password stored in the database
        const isPasswordCorrect = await bcrypt.compare(values.password, user.user_password);

        if (isPasswordCorrect) {
          //  localStorage.setItem('token', user.token);
          localStorage.setItem('userRole', user.user_role.toLowerCase());

          console.log('User Role:', user.user_role);
          //  console.log('JWT Token:', user.token);
          
         
          navigate('/patient');
          window.location.reload();
          ToastMessage({ message: 'Logged in successfully', toastType: 'success' });
        } else {
          ToastMessage({ message: 'Incorrect Password', toastType: 'error' });
        }
      } else {
        ToastMessage({ message: 'User not found', toastType: 'error' });
      }
    } catch (err) {
      console.error('Error fetching user:', err);
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
    <div className='login'>
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
        <div className='fields'>
          <div className='row'>
            <TextField
              variant='outlined'
              label='Password'
              type='password'
              className='field'
              placeholder='Enter Password'
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
          </div>

          {errors.password && <p className='err-msg'>{errors.password.message}</p>}
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
    </div>
  );
};

export default LoginForm;

import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm, isEmail, isNotEmpty } from '@mantine/form';
import { IconArrowLeft, IconAt, IconLoader2, IconLock } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { USER_API_END_POINT } from '../../utils/constant.js';
import { setLoading, setUser } from '../../Slices/Userslice.tsx';

const Login = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail('Invalid email address'),
      password: isNotEmpty('Password is required'),
    },
  });

  const { loading, user } = useSelector((store: any) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate('/');
        notifications.show({
          title: 'Login Successful',
          message: res.data.message,
          withBorder: true,
          className: '!border-blue-500',
        });
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        title: 'Login Failed',
        message: (error.response.data.message),
        color: 'red',
        withBorder: true,
        className: '!border-red-500',
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen sm-mx:bg-white bg-gray-100">
      <div className="w-1/2 md-mx:w-3/4 sm-mx:w-full px-20 bs-mx:px-10 sm-mx:px-5 flex flex-col justify-center gap-3 bg-white p-8 rounded-lg sm-mx:border shadow-lg">
        <div className="my-5 inline-block">
          <Button
            leftSection={<IconArrowLeft size={20} />}
            onClick={() => navigate('/')}
            color="blue.4"
            variant="light"
          >
            Back
          </Button>
        </div>
        <div className="text-2xl font-semibold">Login</div>

        <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4">
          <TextInput
            withAsterisk
            leftSection={<IconAt size={16} />}
            label="Email"
            placeholder="Your email"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            withAsterisk
            leftSection={<IconLock size={18} stroke={1.5} />}
            label="Password"
            placeholder="Password"
            {...form.getInputProps('password')}
          />

          {loading ? (
            <Button className="w-full my-4">
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" autoContrast variant="filled" className="w-full my-4">
              Login
            </Button>
          )}
        </form>

        <div className="mx-auto">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
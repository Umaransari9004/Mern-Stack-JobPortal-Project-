import { Anchor, Button, Group, PasswordInput, Radio, TextInput } from '@mantine/core';
import { useForm, isEmail, isNotEmpty, matchesField } from '@mantine/form';
import { IconArrowLeft, IconAt, IconLoader2, IconLock, IconMailForward } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { USER_API_END_POINT } from '../../utils/constant.js';
import { setLoading } from '../../Slices/Userslice.tsx';

const Signup = () => {

  const [signupDone, setSignupDone] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmpassword: '',
      role: '',
    },
    validate: {
      name: isNotEmpty('Name is required'),
      email: isEmail('Invalid email'),
      password: (value) => (
        value.length < 8 
          ? 'Password must be at least 8 characters' 
          : !/[A-Z]/.test(value) 
          ? 'Password must contain at least one uppercase letter' 
          : !/[0-9]/.test(value) 
          ? 'Password must contain at least one number' 
          // : !/[^A-Za-z0-9]/.test(value) 
          // ? 'Password must contain at least one special character' 
          : null
      ),
      confirmpassword: matchesField('password', 'Passwords do not match'),
      role: isNotEmpty('Please select a role'),
    },
  });

  const { loading, user } = useSelector((store: any) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        setRegisteredEmail(values.email);
        setSignupDone(true);
        notifications.show({
          title: 'Account Created',
          message: res.data.message,
          withBorder: true,
          className: '!border-blue-500',
        });
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        title: 'Registration Failed',
        message: (error.response.data.message),
        color: 'red',
        withBorder: true,
        className: '!border-red-500',
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Resend verification email
  const handleResend = async () => {
    try {
      setResendLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/resend-verification`, 
        { email: registeredEmail },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        notifications.show({
          title: 'Email Sent!',
          message: res.data.message,
          withBorder: true,
          className: '!border-blue-500',
        });
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to resend email.',
        color: 'red',
        withBorder: true,
        className: '!border-red-500',
      });
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen sm-mx:bg-white bg-gray-100">
      <div className="w-1/2 sm-mx:w-full px-20 bs-mx:px-10 sm-mx:px-5 flex flex-col justify-center gap-3 bg-white p-8 sm-mx:p-4 rounded-lg sm-mx:border shadow-lg">

      {signupDone ? (
          /* ── Check Your Email Success Screen ── */
          <>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <IconMailForward size={32} className="text-blue-500" />
              </div>
              <div className="text-2xl font-semibold mb-2">Check Your Email</div>
              <p className="text-gray-500 mb-2">
                We've sent a verification link to:
              </p>
              <p className="text-blue-500 font-semibold mb-4">{registeredEmail}</p>
              <p className="text-gray-400 text-sm mb-6">
                Click the link in your email to verify your account. The link will expire in 24 hours.
              </p>

              <div className="flex flex-col gap-3 items-center">
                <Button variant="filled" color="blue" onClick={() => navigate('/login')}>
                  Go to Login
                </Button>

                {resendLoading ? (
                  <Button variant="light" color="gray" disabled>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </Button>
                ) : (
                  <Button variant="light" color="gray" onClick={handleResend}>
                    Didn't receive it? Resend Email
                  </Button>
                )}
              </div>
            </div>

            <div className="text-center mt-4 ">
              Have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:underline">
                Login
              </Link>
            </div>
          </>
        ) : (
          /* ── Signup Form ── */
          <>
        <div className="my-5 inline-block">
          <Button 
          size="sm"
            leftSection={<IconArrowLeft size={20} />} 
            onClick={() => navigate('/')} 
            color="blue.4" 
            variant="light"
          >
            Back
          </Button>
        </div>
        
        <div className="text-2xl font-semibold mb-4">Create Account</div>

        <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-2">
          <TextInput
            withAsterisk
            label="Full Name"
            placeholder="Your Name"
            {...form.getInputProps('name')}
          />

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

          <PasswordInput
            withAsterisk
            leftSection={<IconLock size={18} stroke={1.5} />}
            label="Confirm Password"
            placeholder="Confirm Password"
            {...form.getInputProps('confirmpassword')}
          />

          <Radio.Group
            label="Select Role"
            withAsterisk
            {...form.getInputProps('role')}
          >
          <div className="flex gap-6 ">
            <Group mt="xs">
              <Radio value="student" label="Applicant" className="py-4 px-6 hover:bg-blue-100 border-blue-100 border rounded-lg has-[:checked]:!border-blue-500 sm-mx:px-4 sm-mx:py-2 xsm-mx:p-2" />
              <Radio value="employer" label="Employer" className="py-4 px-6 hover:bg-blue-100 border-blue-100 border rounded-lg has-[:checked]:!border-blue-500 sm-mx:px-4 sm-mx:py-2 xsm-mx:p-2" />
            </Group>
          </div>
          </Radio.Group>

          {loading ? (
            <Button fullWidth className="mt-4">
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" fullWidth variant="filled" className="mt-4">
              Sign Up
            </Button>
          )}
        </form>

        <div className="text-center mt-4 ">
          Have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Signup;


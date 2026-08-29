import { Button, TextInput } from '@mantine/core';
import { useForm, isEmail } from '@mantine/form';
import { IconArrowLeft, IconAt, IconLoader2, IconMailForward } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { USER_API_END_POINT } from '../../utils/constant.js';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail('Please enter a valid email address'),
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        setEmailSent(true);
        notifications.show({
          title: 'Email Sent',
          message: res.data.message,
          withBorder: true,
          className: '!border-blue-500',
        });
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error?.response?.data?.message || 'Something went wrong.',
        color: 'red',
        withBorder: true,
        className: '!border-red-500',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen sm-mx:bg-white bg-gray-100">
      <div className="w-1/2 md-mx:w-3/4 sm-mx:w-full px-20 bs-mx:px-10 sm-mx:px-5 flex flex-col justify-center gap-3 bg-white p-8 rounded-lg sm-mx:border shadow-lg">
        <div className="my-5 inline-block">
          <Button
            leftSection={<IconArrowLeft size={20} />}
            onClick={() => navigate('/login')}
            color="blue.4"
            variant="light"
          >
            Back to Login
          </Button>
        </div>

        {emailSent ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <IconMailForward size={32} className="text-green-600" />
            </div>
            <div className="text-2xl font-semibold mb-2">Check Your Email</div>
            <p className="text-gray-500 mb-6">
              We've sent a password reset link to <strong>{form.values.email}</strong>. 
              The link will expire in 15 minutes.
            </p>
            <Button variant="light" color="blue.4" onClick={() => setEmailSent(false)}>
              Didn't receive it? Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="text-2xl font-semibold">Forgot Password?</div>
            <p className="text-gray-500 text-sm">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4 mt-2">
              <TextInput
                withAsterisk
                leftSection={<IconAt size={16} />}
                label="Email"
                placeholder="Your registered email"
                {...form.getInputProps('email')}
              />

              {loading ? (
                <Button className="w-full my-4">
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </Button>
              ) : (
                <Button type="submit" variant="filled" className="w-full my-4">
                  Send Reset Link
                </Button>
              )}
            </form>
          </>
        )}

        <div className="mx-auto">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

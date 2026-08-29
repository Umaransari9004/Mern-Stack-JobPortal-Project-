import { Button, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconLoader2, IconLock, IconCircleCheck } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { USER_API_END_POINT } from '../../utils/constant.js';

const ResetPassword = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value) =>
        value.length < 8
          ? 'Password must be at least 8 characters'
          : !/[A-Z]/.test(value)
          ? 'Password must contain at least one uppercase letter'
          : !/[0-9]/.test(value)
          ? 'Password must contain at least one number'
          : null,
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/reset-password/${token}`,
        values,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setResetDone(true);
        notifications.show({
          title: 'Password Reset Successful',
          message: res.data.message,
          withBorder: true,
          className: '!border-green-500',
        });
      }
    } catch (error: any) {
      notifications.show({
        title: 'Reset Failed',
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

        {resetDone ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <IconCircleCheck size={32} className="text-green-600" />
            </div>
            <div className="text-2xl font-semibold mb-2">Password Reset!</div>
            <p className="text-gray-500 mb-6">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Button variant="filled" color="blue" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        ) : (
          <>
            <div className="text-2xl font-semibold">Set New Password</div>
            <p className="text-gray-500 text-sm">
              Enter your new password below. Make sure it's at least 8 characters with an uppercase letter and a number.
            </p>

            <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4 mt-2">
              <PasswordInput
                withAsterisk
                leftSection={<IconLock size={18} stroke={1.5} />}
                label="New Password"
                placeholder="Enter new password"
                {...form.getInputProps('password')}
              />

              <PasswordInput
                withAsterisk
                leftSection={<IconLock size={18} stroke={1.5} />}
                label="Confirm New Password"
                placeholder="Confirm new password"
                {...form.getInputProps('confirmPassword')}
              />

              {loading ? (
                <Button className="w-full my-4">
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
                </Button>
              ) : (
                <Button type="submit" variant="filled" className="w-full my-4">
                  Reset Password
                </Button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

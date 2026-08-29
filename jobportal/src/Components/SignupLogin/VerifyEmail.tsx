import { Button, TextInput } from '@mantine/core';
import { useForm, isEmail } from '@mantine/form';
import { IconLoader2, IconCircleCheck, IconCircleX, IconMailForward } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { USER_API_END_POINT } from '../../utils/constant.js';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const hasVerified = useRef(false); // Prevent double call in StrictMode

  const form = useForm({
    initialValues: { email: '' },
    validate: { email: isEmail('Please enter a valid email') },
  });

  // Auto-verify on page load
  useEffect(() => {
    // Prevent React StrictMode from calling verify twice
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verify = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/verify-email/${token}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setStatus('success');
          notifications.show({
            title: 'Email Verified!',
            message: res.data.message,
            withBorder: true,
            className: '!border-green-500',
          });
        }
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(
          error?.response?.data?.message || 'Verification failed. The link may be invalid or expired.'
        );
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  // Resend verification email
  const handleResend = async (values: any) => {
    try {
      setResendLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/resend-verification`, values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        setResendSent(true);
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

  return (
    <div className="flex items-center justify-center min-h-screen sm-mx:bg-white bg-gray-100">
      <div className="w-1/2 md-mx:w-3/4 sm-mx:w-full px-20 bs-mx:px-10 sm-mx:px-5 flex flex-col justify-center gap-3 bg-white p-8 rounded-lg sm-mx:border shadow-lg">

        {/* Loading State */}
        {status === 'loading' && (
          <div className="text-center py-12">
            <IconLoader2 size={48} className="animate-spin text-blue-400 mx-auto mb-4" />
            <div className="text-xl font-semibold text-slate-700">Verifying your email...</div>
            <p className="text-gray-500 mt-2">Please wait a moment.</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <IconCircleCheck size={32} className="text-green-600" />
            </div>
            <div className="text-2xl font-semibold mb-2">Email Verified!</div>
            <p className="text-gray-500 mb-6">
              Your email has been verified successfully. You can now log in to your account.
            </p>
            <Button variant="filled" color="blue" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <IconCircleX size={32} className="text-red-500" />
            </div>
            <div className="text-2xl font-semibold mb-2">Verification Failed</div>
            <p className="text-gray-500 mb-6">{errorMessage}</p>

            {resendSent ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                  <IconMailForward size={20} />
                  New verification email sent! Check your inbox.
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-3">
                  Enter your email to receive a new verification link:
                </p>
                <form onSubmit={form.onSubmit(handleResend)} className="flex flex-col gap-3 max-w-sm mx-auto">
                  <TextInput
                    placeholder="Your email address"
                    {...form.getInputProps('email')}
                  />
                  {resendLoading ? (
                    <Button>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                    </Button>
                  ) : (
                    <Button type="submit" variant="filled">
                      Resend Verification Email
                    </Button>
                  )}
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

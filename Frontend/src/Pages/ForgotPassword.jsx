import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './ForgotPassword.css';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      return handleError('Email is required');
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setStep(2);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError('Failed to send OTP!');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      return handleError('OTP and new password are required');
    }
    if (newPassword.length < 4) {
      return handleError('Password must be at least 4 characters');
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError('Failed to reset password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300 forgot-animated'>
        <div className='text-center mb-8'>
          <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 text-sm font-bold'>
            {step === 1 ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}
          </p>
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleSendOTP} className='space-y-5'>
            <div className='space-y-1 form-field'>
              <label htmlFor="email" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                name='email'
                autoFocus
                autoComplete='email'
                placeholder='Enter your email address'
                value={email}
                className='w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 input-animated'
              />
            </div>
            <button 
              type='submit' 
              className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed form-button'
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
            <div className='text-center text-sm text-gray-600 dark:text-gray-400 form-link font-bold'>
              Remember your password?{' '}
              <Link to="/login" className='font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300'>
                Sign In
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className='space-y-5'>
            <div className='space-y-1 form-field'>
              <label htmlFor="otp" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>OTP Code</label>
              <input
                onChange={(e) => setOTP(e.target.value)}
                type='text'
                name='otp'
                autoFocus
                placeholder='Enter 6-digit OTP'
                value={otp}
                maxLength={6}
                className='w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 input-animated'
              />
            </div>
            <div className='space-y-1 form-field'>
              <label htmlFor="newPassword" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>New Password</label>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                type='password'
                name='newPassword'
                placeholder='Create a new password'
                value={newPassword}
                className='w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 input-animated'
              />
            </div>
            <button 
              type='submit' 
              className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed form-button'
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
            <div className='text-center text-sm form-link font-bold'>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300 bg-transparent border-none cursor-pointer font-semibold"
              >
                Back to Email
              </button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default ForgotPassword;
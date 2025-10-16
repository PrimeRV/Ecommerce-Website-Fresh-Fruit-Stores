import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Login.css';

function OTPLogin() {
  const [step, setStep] = useState(1); // 1: Username/Password, 2: OTP
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginStep1 = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError('Email and password are required');
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/auth/login-step1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });
      
      const result = await response.json();
      if (result.success) {
        handleSuccess('OTP sent to your email!');
        setSessionToken(result.sessionToken);
        setStep(2);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError('Login failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (!otp) {
      return handleError('OTP is required');
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionToken,
          otp,
          email: loginInfo.email
        })
      });
      
      const result = await response.json();
      if (result.success) {
        handleSuccess('Login successful!');
        localStorage.setItem('token', result.jwtToken);
        localStorage.setItem('loggedInUser', result.name);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError('OTP verification failed!');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: loginInfo.email })
      });
      
      const result = await response.json();
      if (result.success) {
        handleSuccess('OTP resent to your email!');
        setSessionToken(result.sessionToken);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError('Failed to resend OTP!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300 login-animated'>
        <div className='text-center mb-8'>
          <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
            {step === 1 ? 'Secure Login' : 'Verify OTP'}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 text-sm font-bold'>
            {step === 1 ? 'Enter credentials for OTP verification' : 'Enter the OTP sent to your email'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleLoginStep1} className='space-y-5'>
            <div className='space-y-1 form-field'>
              <label htmlFor="email" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>Email Address</label>
              <input
                onChange={handleChange}
                type='email'
                name='email'
                autoFocus
                autoComplete='email'
                placeholder='Enter your email address'
                value={loginInfo.email}
                className='w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 input-animated'
              />
            </div>
            <div className='space-y-1 form-field'>
              <label htmlFor="password" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>Password</label>
              <input
                onChange={handleChange}
                type='password'
                name='password'
                autoComplete='current-password'
                placeholder='Enter your password'
                value={loginInfo.password}
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
          </form>
        ) : (
          <form onSubmit={handleOTPVerification} className='space-y-5'>
            <div className='space-y-1 form-field'>
              <label htmlFor="otp" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>Enter OTP</label>
              <input
                onChange={(e) => setOTP(e.target.value)}
                type='text'
                name='otp'
                autoFocus
                placeholder='Enter 6-digit OTP'
                value={otp}
                maxLength={6}
                className='w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 input-animated text-center text-2xl tracking-widest'
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
                  Verifying...
                </>
              ) : (
                'Verify & Login'
              )}
            </button>
            <div className='flex justify-between items-center'>
              <button
                type="button"
                onClick={resendOTP}
                className='text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300 font-semibold'
                disabled={loading}
              >
                Resend OTP
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors duration-300'
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        <div className='text-center text-sm text-gray-600 dark:text-gray-400 form-link font-bold mt-6'>
          Don't have an account?{' '}
          <Link to="/signup" className='font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300'>
            Sign Up
          </Link>
        </div>
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

export default OTPLogin;
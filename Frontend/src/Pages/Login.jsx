import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Login.css';

function Login() {
  
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [useOTP, setUseOTP] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [otp, setOTP] = useState('');
  const [sessionToken, setSessionToken] = useState('');

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Mask password in console for security
    const displayValue = name === 'password' ? '*'.repeat(value.length) : value;
    console.log(name, displayValue);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  }
  
  // Show masked password in console
  const maskedLoginInfo = {
    ...loginInfo,
    password: loginInfo.password ? '*'.repeat(loginInfo.password.length) : ''
  };
  console.log('loginInfo -> ', maskedLoginInfo);
  const handleLogin = async (e) => {
    e.preventDefault();
    const {email, password} = loginInfo;
    if(!email || !password){
      return handleError('All fields are required');
    }
    setLoading(true);
    try{
      if (useOTP && otpStep === 1) {
        try {
          const response = await fetch('http://localhost:8000/auth/login-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginInfo)
          });
          
          if (response.status === 404) {
            handleError('OTP login not available. Using regular login instead.');
            setUseOTP(false);
            // Continue with regular login
          } else {
            const result = await response.json();
            if(result.success){
              handleSuccess('OTP sent to your email!');
              setSessionToken(result.sessionToken);
              setOtpStep(2);
              return;
            } else {
              handleError(result.message);
              return;
            }
          }
        } catch (otpError) {
          handleError('OTP service unavailable. Using regular login.');
          setUseOTP(false);
        }
      }
      
      if (!useOTP || otpStep === 1) {
        const url = "http://localhost:8000/auth/login";
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(loginInfo)
        });
        const result = await response.json();
        const { success, message, jwtToken, name } = result;
        if(success){
          handleSuccess(message);
          localStorage.setItem('token', jwtToken);
          localStorage.setItem('loggedInUser', name);
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          handleError(message);
        }
      }
    } catch (err) {
      handleError('Login failed!');
    } finally {
      setLoading(false);
    }
  }

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if(!otp) return handleError('OTP is required');
    setLoading(true);
    try{
      const response = await fetch('http://localhost:8000/auth/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken, otp, email: loginInfo.email })
      });
      const result = await response.json();
      if(result.success){
        handleSuccess('Login successful!');
        localStorage.setItem('token', result.jwtToken);
        localStorage.setItem('loggedInUser', result.name);
        setTimeout(() => navigate('/'), 1000);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError('OTP verification failed!');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300 login-animated'>
        <div className='text-center mb-8'>
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
            {useOTP && otpStep === 2 ? 'Verify OTP' : 'Welcome Back'}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 text-sm font-bold'>
            {useOTP && otpStep === 2 ? 'Enter the OTP sent to your email' : 'Sign in to your account'}
          </p>
        </div>
        <div className='flex justify-center mb-6'>
          <div className='bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex'>
            <button type='button' onClick={() => {setUseOTP(false); setOtpStep(1);}} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${!useOTP ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-md' : 'text-gray-600 dark:text-gray-400'}`}>Quick Login</button>
            <button type='button' onClick={() => {setUseOTP(true); setOtpStep(1);}} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${useOTP ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-md' : 'text-gray-600 dark:text-gray-400'}`}>🔐 OTP Login</button>
          </div>
        </div>

        {useOTP && otpStep === 2 ? (
          <form onSubmit={handleOTPVerification} className='space-y-5'>
            <div className='space-y-1 form-field'>
              <label className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>Enter OTP</label>
              <input onChange={(e) => setOTP(e.target.value)} type='text' autoFocus placeholder='Enter 6-digit OTP' value={otp} maxLength={6} className='w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 input-animated text-center text-2xl tracking-widest' />
            </div>
            <button type='submit' className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed form-button' disabled={loading}>
              {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Verifying...</>) : ('Verify & Login')}
            </button>
            <div className='text-center'><button type="button" onClick={() => setOtpStep(1)} className='text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors duration-300 font-semibold'>Back to Login</button></div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className='space-y-5'>
            <div className='space-y-1 form-field'>
              <label htmlFor="email" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>Email Address</label>
              <input
                  onChange = {handleChange}
                  type='email'
                  name='email'
                  autoComplete='email'
                  placeholder='Enter your email address'
                  value = {loginInfo.email}
                  className='w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 input-animated'
              />
            </div>
            <div className='space-y-1 form-field'>
              <label htmlFor="password" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>Password</label>
              <input
                  onChange = {handleChange}
                  type='password'
                  name='password'
                  autoComplete='current-password'
                  placeholder='Enter your password'
                  value= {loginInfo.password}
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
                  {useOTP && otpStep === 1 ? 'Sending OTP...' : 'Signing In...'}
                </>
              ) : (
                useOTP && otpStep === 1 ? 'Send OTP' : 'Sign In'
              )}
            </button>
          </form>
        )}
        
        <div className='text-center text-sm text-gray-600 dark:text-gray-400 form-link font-bold mt-6'>
          Don't have an account?{' '}
          <Link to="/signup" className='font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300'>
            Sign Up
          </Link>
        </div>
        <div className='text-center text-sm form-link font-bold mt-4'>
          <Link to="/forgot-password" className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300">
            Forgot Password?
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
  )
}

export default Login;



//Testing
// function Signup() {
//   return (
//     <div className="container text-center mt-10">
//       <h1 className="text-3xl font-bold text-green-600">Signup Page Rendered ✅</h1>
//     </div>
//   );
// }

// export default Signup;
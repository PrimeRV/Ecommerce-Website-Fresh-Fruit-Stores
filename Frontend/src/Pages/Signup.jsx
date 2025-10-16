import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Signup.css';

function Signup() {
  
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Mask password in console for security
    const displayValue = name === 'password' ? '*'.repeat(value.length) : value;
    console.log(name, displayValue);
    const copySignupInfo = { ...signupInfo};
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  }
  
  // Show masked password in console
  const maskedSignupInfo = {
    ...signupInfo,
    password: signupInfo.password ? '*'.repeat(signupInfo.password.length) : ''
  };
  console.log('signupInfo -> ', maskedSignupInfo);
  const handleSignup = async (e) => {
    e.preventDefault();
    const {name, email, password} = signupInfo;
    if(!name || !email || !password){
      return handleError('All fields are required');
    }
    setLoading(true);
    try{
      const url = "http://localhost:8000/auth/signup";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupInfo)
      });
      const result = await response.json();
      const { success, message } = result;
      if(success){
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError('Signup failed!');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300 signup-animated'>
        <div className='text-center mb-8'>
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>Create Account</h1>
          <p className='text-gray-600 dark:text-gray-400 text-sm font-bold'>Join us for fresh fruits delivery</p>
        </div>
        <form onSubmit={handleSignup} className='space-y-5'>
            <div className='space-y-2 form-field'>
              <label htmlFor="name" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>Full Name</label>
              <input
                  onChange = {handleChange}
                  type='text'
                  name='name'
                  autoFocus
                  autoComplete='name'
                  placeholder='Enter your full name'
                  value = {signupInfo.name}
                  className='w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 input-animated'
              />
            </div>
            <div className='space-y-2 form-field'>
              <label htmlFor="email" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>Email Address</label>
              <input
                  onChange = {handleChange}
                  type='email'
                  name='email'
                  autoComplete='email'
                  placeholder='Enter your email address'
                  value = {signupInfo.email}
                  className='w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 input-animated'
              />
            </div>
            <div className='space-y-2 form-field'>
              <label htmlFor="password" className='block text-base font-bold text-gray-700 dark:text-gray-300 mb-2'>Password</label>
              <input
                  onChange = {handleChange}
                  type='password'
                  name='password'
                  autoComplete='new-password'
                  placeholder='Create a strong password'
                  value= {signupInfo.password}
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
            <div className='text-center text-sm text-gray-600 dark:text-gray-400 form-link font-bold'>
              Already have an account?{' '}
              <Link to="/login" className='font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300'>
                Sign In
              </Link>
            </div>
        </form>
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

export default Signup;



//Testing
// function Signup() {
//   return (
//     <div className="container text-center mt-10">
//       <h1 className="text-3xl font-bold text-green-600">Signup Page Rendered ✅</h1>
//     </div>
//   );
// }

// export default Signup;
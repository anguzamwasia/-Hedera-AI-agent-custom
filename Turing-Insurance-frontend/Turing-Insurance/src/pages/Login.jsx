import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import pic1 from '../assets/pic1.jpg';

console.log('auth:', auth); // should NOT be undefined
console.log('googleProvider:', googleProvider); // should NOT be undefined

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch {
      setErrors({ api: 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch {
      setErrors({ api: 'Google sign-in failed. Please try again.' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F4F7FA] px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0">
        <img src={pic1} alt="Background" className="w-full h-full object-cover blur-md brightness-75" />
        <div className="absolute inset-0 bg-white opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 shadow-xl rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-[#0052CC] mb-6 text-center">Login to Your Account</h2>

        {errors.api && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{errors.api}</div>}

        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 mb-4 text-sm font-medium hover:bg-gray-50 transition"
        >
          {googleLoading ? (
            <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
          ) : (
            <>
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOHI2JLXYQ0StQ1vzNLvULyckAUF1uIUnoxg&s" 
                alt="Google" 
                className="h-4 w-4" 
              />
              Continue with Google
            </>
          )}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#333] font-medium mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#00B8D9]'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[#333] font-medium mb-1 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none ${
                errors.password ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#00B8D9]'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#0052CC] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#003e99] transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-sm text-center text-[#333] mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00B8D9] font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
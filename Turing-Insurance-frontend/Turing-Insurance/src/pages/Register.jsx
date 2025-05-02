import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import pic1 from '../assets/pic1.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Here you would typically save additional user data to your database
      console.log('User registered:', userCredential.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        default:
          errorMessage = err.message;
      }
      
      setErrors({ api: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F4F7FA] px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={pic1} alt="Background" className="w-full h-full object-cover blur-md brightness-75" />
        <div className="absolute inset-0 bg-white opacity-30"></div>
      </div>

      {/* Registration form */}
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 shadow-xl rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-[#0052CC] mb-6 text-center">Create an Account</h2>

        {errors.api && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[#333] font-medium mb-1 text-sm">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none ${
                errors.fullName ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#00B8D9]'
              }`}
              placeholder="John Doe"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
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
              placeholder="example@mail.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
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
              placeholder="At least 6 characters"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[#333] font-medium mb-1 text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#00B8D9]'
              }`}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#0052CC] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#003e99] transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center text-[#333] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00B8D9] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
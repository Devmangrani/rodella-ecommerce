import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth';

const Signup = () => {
  // const context = useContext(MyContext);
  // const { loading, setLoading } = context;
  

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Create user with Firebase Auth using helper function
      const userCredential = await doCreateUserWithEmailAndPassword(
        formData.email, 
        formData.password
      );
      
      // Update user profile with first and last name
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });
      
      console.log('User created successfully:', userCredential.user);
      
      // Store user data in localStorage (optional, as Firebase handles auth state)
      localStorage.setItem('userData', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        uid: userCredential.user.uid
      }));
      
      // Set authToken for PrivateRoute
      localStorage.setItem('authToken', userCredential.user.accessToken || 'authenticated');
      
      // Dispatch custom event to notify other components of auth state change
      window.dispatchEvent(new Event('authStateChanged'));
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle Firebase auth errors
      let errorMessage = 'An error occurred during signup';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrors({ email: 'This email is already registered. Please use a different email or try logging in.' });
          break;
        case 'auth/weak-password':
          setErrors({ password: 'Password is too weak. Please choose a stronger password.' });
          break;
        case 'auth/invalid-email':
          setErrors({ email: 'Please enter a valid email address.' });
          break;
        case 'auth/operation-not-allowed':
          setErrors({ general: 'Email/password accounts are not enabled. Please contact support.' });
          break;
        case 'auth/network-request-failed':
          setErrors({ general: 'Network error. Please check your internet connection and try again.' });
          break;
        default:
          setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setErrors({}); // Clear any previous errors
      
      const result = await doSignInWithGoogle();
      
      if (result && result.user) {
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify({
          firstName: result.user.displayName?.split(' ')[0] || result.user.email.split('@')[0],
          lastName: result.user.displayName?.split(' ')[1] || 'User',
          email: result.user.email,
          uid: result.user.uid
        }));
        
        // Set authToken for PrivateRoute
        localStorage.setItem('authToken', result.user.accessToken || 'authenticated');
        
        // Dispatch custom event to notify other components of auth state change
        window.dispatchEvent(new Event('authStateChanged'));
        
        navigate('/dashboard');
      } else {
        throw new Error('Authentication failed - no user data received');
      }
    } catch (error) {
      console.error('Google signup error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        setErrors({ general: 'Google signup was cancelled. Please try again.' });
      } else if (error.code === 'auth/popup-blocked') {
        setErrors({ general: 'Popup was blocked by browser. Please allow popups and try again.' });
      } else if (error.code === 'auth/cancelled-popup-request') {
        setErrors({ general: 'Signup was cancelled. Please try again.' });
      } else {
        setErrors({ general: 'Google signup failed. Please try again or use email/password signup.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        <div className="text-center animate-fade-in-down">
          <h2 className="text-3xl font-bold text-white mb-2 animate-slide-in-left">
            New here?
          </h2>
          <p className="text-neutral-400 animate-slide-in-right animation-delay-100">
            Create your account to continue
          </p>
        </div>

        <div className="card p-8 animate-scale-in animation-delay-200 hover:shadow-2xl transition-all duration-300">
          {/* Display general errors */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center px-4 py-3 border border-neutral-600 rounded-lg bg-neutral-800 hover:bg-neutral-700 hover:scale-105 hover:border-neutral-500 transition-all duration-300 mb-6 animate-fade-in animation-delay-300 group"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-white font-medium group-hover:text-gray-100 transition-colors duration-300">Sign up with Google</span>
          </button>

          <div className="relative mb-6 animate-fade-in animation-delay-400">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-800 text-neutral-400">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in animation-delay-500">
            <div className="grid grid-cols-2 gap-4 animate-slide-in-up animation-delay-600">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-300 mb-2 transition-colors duration-300">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-neutral-900 border rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent focus:scale-105 transition-all duration-300 hover:bg-neutral-850 ${
                    errors.firstName ? 'border-red-500 animate-shake' : 'border-neutral-600'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-300 mb-2 transition-colors duration-300">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-neutral-900 border rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent focus:scale-105 transition-all duration-300 hover:bg-neutral-850 ${
                    errors.lastName ? 'border-red-500 animate-shake' : 'border-neutral-600'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="animate-slide-in-left animation-delay-700">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2 transition-colors duration-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-neutral-900 border rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent focus:scale-105 transition-all duration-300 hover:bg-neutral-850 ${
                  errors.email ? 'border-red-500 animate-shake' : 'border-neutral-600'
                }`}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.email}</p>
              )}
            </div>

            <div className="animate-slide-in-right animation-delay-800">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2 transition-colors duration-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-neutral-900 border rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent focus:scale-105 transition-all duration-300 hover:bg-neutral-850 ${
                  errors.password ? 'border-red-500 animate-shake' : 'border-neutral-600'
                }`}
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.password}</p>
              )}
            </div>

            <div className="animate-slide-in-left animation-delay-900">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2 transition-colors duration-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-neutral-900 border rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent focus:scale-105 transition-all duration-300 hover:bg-neutral-850 ${
                  errors.confirmPassword ? 'border-red-500 animate-shake' : 'border-neutral-600'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start animate-fade-in animation-delay-1000">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 mt-1 bg-neutral-900 border-neutral-600 rounded focus:ring-neutral-600 focus:ring-2 transition-all duration-300 hover:scale-110"
              />
              <div className="ml-3">
                <label htmlFor="agreeToTerms" className="text-sm text-neutral-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-white hover:text-neutral-300 hover:scale-105 transition-all duration-300 underline">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-white hover:text-neutral-300 hover:scale-105 transition-all duration-300 underline">
                    Privacy Policy
                  </Link>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.agreeToTerms}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-black bg-white hover:bg-neutral-100 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in animation-delay-1100 group"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center animate-fade-in animation-delay-1200">
            <p className="text-neutral-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-white hover:text-neutral-300 hover:scale-105 transition-all duration-300 inline-block"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 
'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/page';
interface FormErrors {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
}

const LoginCreateAccount = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isClient, setIsClient] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [fromServer, setFromServer] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [createData, setCreateData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validateLoginForm = () => {
    const newErrors: FormErrors = {};
    if (!loginData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCreateForm = () => {
    const newErrors: FormErrors = {};
    if (!createData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!createData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(createData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!createData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!createData.password) {
      newErrors.password = 'Password is required';
    } else if (createData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const createAccountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const loginHandlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    
    setIsLoading(true);
    setFromServer('');
    try {
      const response = await fetch('/api/user_auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();
      if (!response.ok) {
        setFromServer(data.error);
      } else {
        // Store the token in localStorage
        localStorage.setItem('token', data.user.token);
        router.push('/user');
        setFromServer(data.message);
      }
    } catch (error) {
      setFromServer('An error occurred while logging in. Please try again.');
    }
    setIsLoading(false);
  };

  const createAccountHandlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateCreateForm()) return;
    
    setIsLoading(true);
    setFromServer('');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData)
      });
      const data = await response.json();
      if (!response.ok) {
        setFromServer(data.error);
      } else {
        setFromServer(data.message);
        setCreateData({
          name: '',
          email: '',
          username: '',
          password: '',
        });
        setIsLogin(true); // Switch to login form after successful registration
      }
    } catch (error) {
      setFromServer('An error occurred while creating your account. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Navbar />
      {isClient && !isLogin && (
        <div style={{ backgroundColor: 'hsl(215.3, 25%, 26.7%)' }} className="mt-16 flex justify-center items-center h-screen pb-4">
          <form onSubmit={createAccountHandlerSubmit} className="bg-white p-4 m-3 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Create an Account</h2>
            {fromServer && (
              <p className={`text-center text-md mt-4 mb-4 animate-bounce ${
                fromServer.includes('successfully') ? 'text-green-600' : 'text-red-600'
              }`}>
                {fromServer}
              </p>
            )}
            <div className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  onChange={createAccountHandler}
                  value={createData.name}
                  placeholder="Your full name"
                  className={`p-2 border rounded-md focus:outline-none focus:ring-2 w-full ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  onChange={createAccountHandler}
                  value={createData.email}
                  placeholder="Your email"
                  className={`p-2 border rounded-md focus:outline-none focus:ring-2 w-full ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="username"
                  onChange={createAccountHandler}
                  value={createData.username}
                  placeholder="Username (UGR/XXXX/XX)"
                  className={`p-2 border rounded-md focus:outline-none focus:ring-2 w-full ${
                    errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  onChange={createAccountHandler}
                  value={createData.password}
                  placeholder="Enter your password"
                  className={`p-2 border rounded-md focus:outline-none focus:ring-2 w-full ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full mt-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                isLoading 
                  ? 'bg-blue-500 text-white opacity-50 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create an account'
              )}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <a href="#" onClick={() => setIsLogin(true)} className="text-blue-600 hover:underline">
                Login here
              </a>
            </p>
          </form>
        </div>
      )}

      {isClient && isLogin && (
        <div style={{ backgroundColor: 'hsl(215.3, 25%, 26.7%)' }} className="mt-16 flex justify-center items-center h-screen bg-gray-100">
          <form onSubmit={loginHandlerSubmit} className="bg-white m-3 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to your account</h2>
            {fromServer && (
              <p className={`text-center text-md mt-4 mb-4 animate-bounce ${
                fromServer.includes('successful') ? 'text-green-600' : 'text-red-600'
              }`}>
                {fromServer}
              </p>
            )}
            <div className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={loginHandler}
                  placeholder="Username (UGR/XXXX/XX)"
                  className={`p-3 border rounded-md focus:outline-none focus:ring-2 w-full ${
                    errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={loginHandler}
                  placeholder="Enter your password"
                  className={`p-3 border rounded-md focus:outline-none focus:ring-2 w-full ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                isLoading 
                  ? 'bg-blue-500 text-white opacity-50 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              I have no account?{' '}
              <a href="#" onClick={() => setIsLogin(false)} className="text-blue-600 hover:underline">
                Create account here
              </a>
            </p>
          </form>
        </div>
      )}

      <footer>
        <p className="text-center text-white p-10 bg-black font-bold text-xl">{new Date().getFullYear()} &copy; Tech Club</p>
      </footer>
    </div>
  );
};

export default LoginCreateAccount;
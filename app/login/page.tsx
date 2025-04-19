'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/page';

const LoginCreateAccount = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isClient, setIsClient] = useState(false);
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
  useEffect(() => {
    setIsClient(true);
  }, []);

  const loginHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const createAccountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const loginHandlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Creating account with data:', createData);
  };
  const  createAccountHandlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Creating account with data:', { ...createData, password: '[REDACTED]' });
    try {
      console.log('Sending request to /api/users...');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData)
      });   
      console.log('Response status:', response.status);
            let data;
      try {
        const text = await response.text();
        console.log('Response text:', text);
                try {
          data = JSON.parse(text);
          console.log('Response data:', data);
        } catch (parseError) {
          console.error('Error parsing response as JSON:', parseError);
          alert('Server returned an invalid response. Please try again later.');
          return;
        }
      } catch (textError) {
        console.error('Error reading response text:', textError);
        alert('Error reading server response. Please try again later.');
        return;
      }
      
      if (!response.ok) {
        const errorMessage = data.error || data.details || 'Failed to create account';
        console.error('Server error:', errorMessage);
        alert(`Error: ${errorMessage}`);
        return;
      }
            console.log('Account created successfully');
      alert('Account created successfully!');
      setCreateData({
        name: '',
        email: '',
        username: '',
        password: ''
      });
    } catch (error) {
      console.error('Error creating account:', error);
      alert('An error occurred while creating your account. Please try again.');
    }
  };
  return (
    <div>
      <Navbar />
      {isClient && !isLogin && (
        <div style={{ backgroundColor: 'hsl(215.3, 25%, 26.7%)' }} className="mt-16 flex justify-center items-center h-screen pb-4">
          <form onSubmit={createAccountHandlerSubmit} className="bg-white p-4 m-3 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Create an Account</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                onChange={createAccountHandler}
                value={createData.name}
                placeholder="Your full name"
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                onChange={createAccountHandler}
                value={createData.email}
                placeholder="Your email"
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="username"
                onChange={createAccountHandler}
                value={createData.username}
                placeholder="Username (UGR/XXXX/XX)"
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                onChange={createAccountHandler}
                value={createData.password}
                placeholder="Enter your password"
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create an account
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
          <form onSubmit={loginHandlerSubmit} className="bg-white p-8 m-3 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to your account</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={loginHandler}
                placeholder="Username (UGR/XXXX/XX)"
                required
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={loginHandler}
                placeholder="Enter your password"
                required
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
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
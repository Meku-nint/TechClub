'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface FormData {
  email: string;
  password: string;
}
interface FormErrors {
  email?: string;
  password?: string;
}

const AdminLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Login failed');
      } else {
        localStorage.setItem('adminToken', data.token);
        router.push('/adminPageLogin/adminPage');
      }
    } catch {
      setErrorMessage('An error occurred while logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Admin Login</h2>
        
        {errorMessage && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center'>
            {errorMessage}
          </div>
        )}
        
        <div className='flex flex-col gap-4'>
          <div>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Your email'
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
            )}
          </div>
          
          <div>
            <input 
              type='password'
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter your password'
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.password && (
              <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
            )}
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
      </form>
    </div>
  );
}

export default AdminLogin;
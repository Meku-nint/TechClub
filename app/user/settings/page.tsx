'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserNavbar from '../user_nav/page';

interface UserData {
  name: string;
  email: string;
  username: string;
}

const Settings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNameForm, setShowNameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    newName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.newName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update name');
      }

      const data = await response.json();
      setUserData(prev => prev ? { ...prev, name: data.name } : null);
      setShowNameForm(false);
      setFormData(prev => ({ ...prev, newName: '' }));
      alert('Name updated successfully!');
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      setShowPasswordForm(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <UserNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <UserNavbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Name</p>
              <div className="flex items-center justify-between">
                <p className="text-lg">{userData?.name}</p>
                <button
                  onClick={() => setShowNameForm(!showNameForm)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {showNameForm ? 'Cancel' : 'Change'}
                </button>
              </div>
              {showNameForm && (
                <form onSubmit={handleNameChange} className="mt-2">
                  <input
                    type="text"
                    value={formData.newName}
                    onChange={(e) => setFormData(prev => ({ ...prev, newName: e.target.value }))}
                    placeholder="Enter new name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>
            
            <div>
              <p className="text-gray-600">Email</p>
              <p className="text-lg">{userData?.email}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Username</p>
              <p className="text-lg">{userData?.username}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Password</p>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-blue-500 hover:text-blue-700"
              >
                {showPasswordForm ? 'Cancel' : 'Change'}
              </button>
            </div>
            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
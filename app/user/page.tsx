'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserNavbar from './user_nav/page';

interface UserData {
  name: string;
  email: string;
  username: string;
  token: string;
  _id: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  status: 'present' | 'absent';
}

interface AttendanceData {
  attendanceRecords: AttendanceRecord[];
  statistics: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendancePercentage: number;
  };
}

const User = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [attendanceToken, setAttendanceToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const router = useRouter();

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

  const fetchAttendance = async () => {
    try {
      const response = await fetch('/api/attendance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch attendance');
      }
      
      const data = await response.json();
      setAttendanceData(data);
      setShowAttendance(true);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setShowAttendance(false);
    }
  };

  const markAttendance = async () => {
    try {
      if (!showTokenInput) {
        setShowTokenInput(true);
        return;
      }

      if (!attendanceToken) {
        alert('Please enter the attendance token');
        return;
      }

      setIsMarkingAttendance(true);
      
      // First, create the attendance record (default status: absent)
      const createResponse = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: attendanceToken })
      });
      
      if (!createResponse.ok) {
        const error = await createResponse.json();
        if (error.error === "Invalid attendance token") {
          alert('The attendance token you entered is incorrect. Please check and try again.');
        } else if (error.error === "No attendance posted for today") {
          alert('No attendance has been posted for today yet.');
        } else if (error.error === "Attendance already marked for today") {
          alert('You have already marked your attendance for today.');
        } else {
          throw new Error(error.error || 'Failed to mark attendance');
        }
        setAttendanceToken('');
        return;
      }

      // Then, update the status to present
      const updateResponse = await fetch('/api/attendance', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: attendanceToken })
      });
      
      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        if (error.error === "Invalid attendance token") {
          alert('The attendance token you entered is incorrect. Please check and try again.');
        } else {
          throw new Error(error.error || 'Failed to update attendance status');
        }
        setAttendanceToken('');
        return;
      }
      
      // Refresh attendance data after marking
      await fetchAttendance();
      setAttendanceToken('');
      setShowTokenInput(false);
      alert('Attendance marked successfully!');
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      alert(error.message || 'Failed to mark attendance');
      setAttendanceToken('');
      setShowTokenInput(false);
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  const attendanceDetail = () => {
    if (!showAttendance || !attendanceData) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-600">No attendance data available</p>
        </div>
      );
    }

    const { attendanceRecords, statistics } = attendanceData;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Your Attendance History</h3>
          <button
            onClick={markAttendance}
            disabled={isMarkingAttendance}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isMarkingAttendance ? 'Marking...' : 'Mark Today\'s Attendance'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-gray-600">Present Days</p>
            <p className="text-2xl font-bold text-green-600">{statistics.presentDays}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-gray-600">Absent Days</p>
            <p className="text-2xl font-bold text-red-600">{statistics.absentDays}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">Attendance Percentage</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                statistics.attendancePercentage >= 50 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${statistics.attendancePercentage}%` }}
            ></div>
          </div>
          <p className="text-right mt-2 font-medium">
            {statistics.attendancePercentage.toFixed(1)}%
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Recent Attendance Records</h4>
          {attendanceRecords.map((record) => (
            <div
              key={record._id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <span className="text-gray-600">
                {new Date(record.date).toLocaleDateString()}
              </span>
              <span
                className={`px-3 py-1 rounded-full ${
                  record.status === 'present'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleNavbarClick = () => {
    fetchAttendance();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-4">
        <UserNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-4">
        <UserNavbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-4">
      <UserNavbar />
      <div className="sm:max-w-4xl sm:mx-auto w-full mt-24 p-6 bg-white rounded-xl shadow-md flex sm:flex-row flex-col gap-6 items-start border border-gray-200">
        <img
          src="/images/profile.jpeg"
          alt="Profile"
          width={200}
          height={200}
          className="rounded-lg shadow-md object-cover h-48 w-48"
        />
        <div className="text-gray-700">
          <h2 className="text-2xl font-semibold mb-2">Full Name: {userData?.name}</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {userData?.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Username:</span> {userData?.username}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">User ID:</span> {userData?._id}
            </p>
            <p className=''>welcome to aau tech club</p>
          </div>
        </div>
      </div>

      <h1 className="sm:text-4xl text-3xl font-semibold text-center text-gray-800 mt-16 mb-6 tracking-tight">
        Your Attendance Overview
      </h1>
      <p className="text-lg text-gray-700 text-blue-900 animate-bounce animate-pulse sm:w-1/2 w-3/4 mx-auto">
        Don't forget if your attendance falls below 50%, you will be automatically removed from the boot camp{' '}
        <a 
          href='#' 
          className='underline text-red-700 cursor-pointer' 
          onClick={(e) => {
            e.preventDefault();
            fetchAttendance();
          }}
        >
          see your attendance information
        </a>
      </p>

      {showAttendance && attendanceData && (
        <div className="sm:max-w-4xl sm:mx-auto w-full mt-8 p-6 bg-white rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Your Attendance Details</h2>
            <div className="flex items-center space-x-4">
              {showTokenInput && (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={attendanceToken}
                    onChange={(e) => setAttendanceToken(e.target.value)}
                    placeholder="Enter today's attendance token"
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500">
                    Enter the token provided by your instructor
                  </p>
                </div>
              )}
              <button
                onClick={markAttendance}
                disabled={isMarkingAttendance}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isMarkingAttendance ? 'Marking...' : showTokenInput ? 'Submit Token' : 'Mark Today\'s Attendance'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-green-600">{attendanceData.statistics.presentDays}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-gray-600">Absent Days</p>
              <p className="text-2xl font-bold text-red-600">{attendanceData.statistics.absentDays}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">Attendance Percentage</p>
              <p className="font-medium">
                {attendanceData.statistics.attendancePercentage.toFixed(1)}%
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  attendanceData.statistics.attendancePercentage >= 50 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${attendanceData.statistics.attendancePercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Attendance History</h3>
            <div className="max-h-96 overflow-y-auto">
              {attendanceData.attendanceRecords.map((record) => (
                <div
                  key={record._id}
                  className="flex justify-between items-center p-3 border rounded-lg mb-2"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-gray-500">
                      {new Date(record.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex w-3/4 mx-auto gap-4 pt-8 mb-8">
        <div className="flex-1 bg-green-100 border border-green-400 text-green-800 rounded-xl shadow-lg p-6 text-center">
          <p className="text-4xl font-bold">
            {attendanceData?.statistics?.attendancePercentage.toFixed(1) || '0'}%
          </p>
          <p className="text-lg font-medium mt-2">Overall Attendance</p>
        </div>
        <div className="flex-1 bg-red-100 border border-red-400 text-red-800 rounded-xl shadow-lg p-6 text-center">
          <p className="text-4xl font-bold">
            {attendanceData?.statistics?.absentDays || '0'}
          </p>
          <p className="text-lg font-medium mt-2">Total Absences</p>
        </div>
      </div>

      <footer>
        <p className='text-center text-white sm:p-10 p-5 bg-gray-700 font-bold text-xl'>
          {new Date().getFullYear()} &copy; Tech Club
        </p>
      </footer>
    </div>
  );
};

export default User;
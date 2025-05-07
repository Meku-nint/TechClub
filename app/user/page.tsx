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
interface attendanceRecords{ 
createdAt:string
length:string
_id:string;
token:string;
}
interface AttendanceRecord {
  present: number;
  absent: number;
  _id: string;
  date: string;
  status: 'present' | 'absent';
}

const User = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<attendanceRecords| null>(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [Token, setToken] = useState('');
  const [fillAttendance,setFillAttendance]=useState(false);
  const [error, setError] = useState('');
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
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
          headers: { 'Authorization': `Bearer ${token}` }
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
    const attendanceFetch = async () => {
      try {
        const response = await fetch('/api/attendance/fetch', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Failed to fetch attendance');
        }
        const data = await response.json(); 
        setAttendanceRecords(data.lastRecord);           
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    }
    attendanceFetch();
  }, [router]);
  useEffect(() => {
    const presentCount = attendanceData.filter(records => records.status === 'present').length;
    const absentCount = attendanceData.filter(records=> records.status === 'absent').length;
    setPresent(presentCount);
    setAbsent(absentCount);
  }, [attendanceData]);

  const fetchAttendance = async () => {
    try {
      const response = await fetch('/api/attendance', {
        headers: { 'Authorization': `Bearer ${userData?._id}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        return;
      }

      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

 
  const Attended = async (e: React.FormEvent) => {
    e.preventDefault();
   
    if(Token!== attendanceRecords?.token){
      alert('Please enter a valid token');
      return;
    }
    try {
      const response = await fetch('/api/attended', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${userData?._id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userData?._id,
          attendanceID: attendanceRecords?._id})
      });
      const data = await response.json();
      alert(data.message);
      if (!response.ok) throw new Error(data.message || 'Failed to update');
    } catch (err) {
      console.error(err);
    }
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
      
      <div className="sm:max-w-4xl sm:mx-auto w-full mt-24 p-6 bg-blue-100 rounded-xl shadow-md flex sm:flex-row flex-col gap-6 items-start border border-gray-200">
        <img
          src="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Profile"
          className="rounded-lg shadow-md object-cover h-60 w-full"
        />
        <div className="text-gray-700">
          <h2 className="text-xl font-semibold mb-2">Full Name: {userData?.name}</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Email:</span> {userData?.email}</p>
            <p><span className="font-semibold">Username:</span> {userData?.username}</p>
            <p>Welcome to Tech Club</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 tracking-tight mb-4">
          Your Attendance Overview
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Don’t forget — if your attendance falls below <span className="font-semibold text-red-600">50%</span>, 
          you will be automatically removed from the boot camp.
        </p>
        <p
        
          onClick={(e) => {
            e.preventDefault();
            fetchAttendance();
            setShowAttendance(!showAttendance);
          }}
          className="py-5 cursor-pointer text-2xl bg-gray-300 "
        >
          See your attendance information detail
        </p>
      </div>
      {showAttendance && (
        <div className="sm:w-2/3 w-full mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Attendance Records</h2>
          {attendanceData.map((record) => (
            <div key={record._id} className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-700">{new Date(record.date).toDateString()}</span>
              <span
                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                  record.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {record.status}
              </span>
            </div>
          ))}
            <div className="flex w-3/4 mx-auto gap-4 pt-8 mb-8">
        <div className="flex-1 bg-green-100 border border-green-400 text-green-800 rounded-xl shadow-lg p-6 text-center">
          <p className="text-lg font-medium mt-2">Total Present: {present}</p>
        </div>
        <div className="flex-1 bg-red-100 border border-red-400 text-red-800 rounded-xl shadow-lg p-6 text-center">
          <p className="text-lg font-medium mt-2">Total Absences: {absent}</p>
        </div>
      </div>
        </div>
        
      )} 
<div className="flex flex-col items-center justify-center bg-gray-100 p-4">
  <div
    onMouseOver={fetchAttendance}
    className="flex items-center justify-center w-80 h-30 rounded-md shadow-lg bg-amber-600  overflow-hidden"
    style={{
      background: `conic-gradient(#4CAF50 ${present / (present + absent) * 100}%, #f44336 0)`,
    }}
  >
    <span className="text-center text-xl font-bold text-gray-800">
      {`Overall Attendance: ${((present / (present + absent)) * 100).toFixed(2)}%`}
    </span>
  </div>
</div>
{fillAttendance && (
  <div>
    {attendanceRecords ? (
      <form className="flex flex-col w-1/2 mx-auto max-w-sm bg-white rounded-t-2xl shadow-lg overflow-hidden"
      onSubmit={Attended}
      >
        <p className="text-lg font-bold text-white text-right px-5 py-3 bg-blue-500 rounded-t-2xl">
          Date: {attendanceRecords.createdAt.slice(0, 10)}
        </p>
        <p className="text-lg font-bold text-black text-right px-5 py-3">
          Length: {attendanceRecords.length}
        </p>
        <div className="flex flex-col gap-3 p-5">
          <input
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter OTP"
            type="text"onChange={(e) => setToken(e.target.value)}
          />
          <button
            className="w-full py-3 bg-amber-500 rounded-lg text-white font-semibold hover:bg-amber-600 active:bg-black active:text-white transition-all duration-200"
          >
            Present
          </button>
        </div>
      </form>
    ) : (
      <div className="text-center text-gray-500">No records found</div>
    )}
  </div>
)}


<div className='flex flex-col items-center justify-center w-cover'>
  <p className="text-lg font-bold text-gray-700 ml-auto px-5 bg-amber-500 py-3 rounded-t-lg cursor-pointer hover:bg-amber-600 active:bg-black active:text-white"
   onClick={(e) => {
    fetchAttendance();
    setFillAttendance(!fillAttendance);
  }}
  >fill attendance</p>
</div>
      <footer>
        <p className="text-center text-white sm:p-10 p-5 bg-gray-700 font-bold text-xl">
          {new Date().getFullYear()} &copy; Tech Club
        </p>
      </footer>
    </div>
  );
};
export default User;
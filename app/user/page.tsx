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
interface attendanceRecorded{ 
  createdAt: string;
  length: string;
  _id: string;
  token: string;
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
  const [attendanceRecords, setAttendanceRecords] = useState<attendanceRecorded | null>(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [Token, setToken] = useState('');
  const [fillAttendance, setFillAttendance] = useState(false);
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
         // throw new Error('Failed to fetch user data');
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
   
  }, []);
   
  useEffect(() => {
    const presentCount = attendanceData.filter(records => records.status === 'present').length;
    const absentCount = attendanceData.filter(records => records.status === 'absent').length;
    setPresent(presentCount);
    setAbsent(absentCount);
  }, [attendanceData]);

  const fetchAttendance = async () => {
    try {
      const response = await fetch('/api/attendance', {
        headers: { 'Authorization': `Bearer ${userData?._id}` }
      });
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid JSON response");
      }
  
      const data = await response.json();
      if (!response.ok) {
        return ;
      }
  
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };
  
    const attendanceFetch = async () => {
      try {
        const response = await fetch('/api/attendance/fetch', { method: 'GET' });
        if (!response.ok) {
          return;
        }
        const data = await response.json(); 
        setAttendanceRecords(data);           
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };
    attendanceFetch();
  const Attended = async (e: React.FormEvent) => {
    e.preventDefault();

    if(Token !== attendanceRecords?.token){
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
          attendanceID: attendanceRecords?._id
        })
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
      
      <div>
        <div className="flex sm:flex-row justify-center gap-4 sm:gap-8 mt-18 w-9/10 mx-auto">
          <img src="/images/image.png" alt="User Avatar" className="w-1/2 rounded-lg shadow-md" />
          <img src="/images/img.jpg" alt="User Avatar" className="w-1/2 rounded-lg shadow-md" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 tracking-tight mb-4">
          Your Attendance Overview
        </h1>
        <p className="text-lg text-gray-600 mb-6 bg-amber-50 p-4 rounded-lg shadow-md">
  Dear <strong>{userData?.name}</strong>,
  <br />
  We hope you are making the most out of your experience in the Tech Club. Please be reminded that maintaining consistent attendance is crucial for your successful participation in the boot camp. As a part of our commitment to providing a focused and productive environment, we kindly ask that you ensure your attendance remains above <span className="font-semibold text-red-600">50%</span>.
  <br />
  Should your attendance fall below this threshold, it will result in automatic removal from the program, as we want to ensure every participant fully benefits from the opportunities provided. We trust that you will remain committed to your learning journey and contribute to the success of the team.
  <br />
  Thank you for your dedication, and don't hesitate to reach out if you have any questions or concerns regarding your attendance or the program.
</p>
    <div className="py-5 cursor-pointer text-2xl bg-gray-300 rounded-lg shadow-md hover:bg-gray-350 text-center font-semibold text-gray-800 transition duration-300"
    >        <p className='sm:w-2/3 w-7/8 mx-auto text-lg hover:text-white hover:bg-gray-400 border-2  p-3 m-3'
          onClick={(e) => {
            e.preventDefault();
            fetchAttendance();
            setShowAttendance(!showAttendance);
          }}
        >
          See your attendance information detail
        </p>

      {showAttendance && (
        <div className="sm:w-2/3 w-full mx-auto bg-white h-96 overflow-y-auto  shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Attendance Records <strong className="text-red-600 px-2 text-2xl bg-black rounded-xl" onClick={() => setShowAttendance(false)}>X</strong></h2>
          {attendanceData.map((record) => (
            <div key={record._id} className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className=" text-black text-sm font-medium">{new Date(record.date).toDateString()}</span>
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
 {fillAttendance && (
  <div className="w-full sm:w-2/3 mx-auto bg-black text-white shadow-lg p-6">
    {attendanceRecords ? (
      
      <form
        
        className="flex flex-col gap-6"
        onSubmit={Attended}
      >
        <div className="flex justify-between items-center">
          <p className=" text-white text-sm font-medium">
            Date : {attendanceRecords.createdAt.slice(0, 10)}
          </p>
          <p className=" text-white text-sm font-medium">
            End: {attendanceRecords.length} <strong className="text-red-600 px-2 text-2xl bg-white rounded-xl" onClick={() => setFillAttendance(false)}>X</strong>
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl shadow-md">
          <input
            id="token"
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-black"
            placeholder="Enter OTP"
            type="text"
            onChange={(e) => setToken(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 rounded-lg text-white font-semibold hover:bg-amber-600 active:bg-black active:text-white transition-all duration-200"
          >
            Mark as Present
          </button>
        </div>
      </form>
    ) : (
      <div className="text-center text-gray-500">No records found</div>
    )}
  </div>
)}

      </div>

      </div>
      <div className="flex flex-col items-center justify-center w-cover">
        <p
          className="text-lg font-bold text-gray-700 ml-auto px-5 bg-amber-500 py-3 rounded-t-lg cursor-pointer hover:bg-amber-600 active:bg-black active:text-white"
          onClick={(e) => {
            attendanceFetch();
            setFillAttendance(!fillAttendance);
          }}
        >
          Fill Attendance
        </p>
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

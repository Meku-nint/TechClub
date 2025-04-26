'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Attendance = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [users, setUsers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittedAttendance, setSubmittedAttendance] = useState([]);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/adminPageLogin');
      return;
    }

    fetchUsers();
  }, [router]);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceForDate();
    }
  }, [selectedDate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      // Initialize attendance records for all users as absent
      setAttendanceRecords(data.map(user => ({
        userId: user._id,
        status: 'absent'
      })));
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceForDate = async () => {
    try {
      const response = await fetch(`/api/manual-attendance?date=${selectedDate}`);
      if (!response.ok) throw new Error('Failed to fetch attendance');
      const data = await response.json();
      if (data.length > 0) {
        setAttendanceRecords(data);
        setSubmittedAttendance(data);
      } else {
        // Reset to all absent if no attendance record exists for the date
        setAttendanceRecords(users.map(user => ({
          userId: user._id,
          status: 'absent'
        })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = (userId, isPresent) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.userId === userId ? { ...record, status: isPresent ? 'present' : 'absent' } : record
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('You must be logged in to save attendance');
        return;
      }

      const response = await fetch('/api/manual-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedDate,
          records: attendanceRecords
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save attendance');
      }
      
      alert('Attendance saved successfully!');
      setSubmittedAttendance(attendanceRecords);
      fetchAttendanceForDate(); // Refresh the attendance data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save attendance');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="m-0 p-0">
        <h1 className="text-3xl font-semibold text-center text-gray-800 bg-gray-700 p-6 fixed w-full mb text-white">
          Fill Students Attendance
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-24">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="date" className="block text-lg font-medium text-gray-700">Select Date</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => {
                    const record = attendanceRecords.find(r => r.userId === user._id);
                    return (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.studentId || 'No ID'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={record?.status === 'present'}
                              onChange={(e) => handleStatusChange(user._id, e.target.checked)}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                              {record?.status === 'present' ? 'Present' : 'Absent'}
                            </span>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Attendance
            </button>
          </form>

          {/* Display submitted attendance summary */}
          {submittedAttendance.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Attendance Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">Present: {submittedAttendance.filter(r => r.status === 'present').length}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                  <p className="text-red-800 font-medium">Absent: {submittedAttendance.filter(r => r.status === 'absent').length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white text-center p-6 mt-8">
        <p className="font-bold text-xl">{new Date().getFullYear()} &copy; Tech Club</p>
      </footer>
    </div>
  );
};

export default Attendance; 
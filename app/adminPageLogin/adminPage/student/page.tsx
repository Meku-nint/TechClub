'use client';
import { useEffect, useState } from 'react';
interface Student {
  _id: string;
  name: string;
  username: string;
  studentId: string;
  attendance: {
    present: number;
    total: number;
    percentage: number;
  };
}
  interface AttendanceRecord {
    present: number;
    absent: number;
    _id: string;
    userId:string;
    date: string;
    status: 'present' | 'absent';
  }
  
  const ManageStudent = () => {
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showAttendance, setShowAttendance] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      fetchStudents();
    }, []);
  
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        setError('Error loading students');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleDelete = async (studentId: string) => {
      if (!confirm('Are you sure you want to delete this student?')) return;
  
      try {
        const response = await fetch(`/api/students?id=${studentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete student');
        }
        fetchStudents();
      } catch (error) {
        alert('Error deleting student');
        console.error('Error:', error);
      }
    };
  
    const fetchAttendance = async (userId: string) => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          alert('No authorization token found!');
          return;
        }
  
        const response = await fetch(`/api/attendance?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userId}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          return;
        }
  
        const data = await response.json();
        setAttendanceData(data); 
        console.log('Attendance data:', data);
      } catch (error) {
      }
  
      setShowAttendance((prevState) => !prevState); 
    };
  
    const filteredStudents = students.filter(student => {
      const name = student.name || '';
      const studentId = student.studentId || '';
      
      return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             studentId.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-4xl">
          <input
            type="search"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full ">
            {filteredStudents.map((student) => (
              <div key={student._id} className="bg-white shadow-md rounded-xl p-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-800 capitalize">{student.name || 'No Name'}</p>
                  <p className="text-xl text-stone-950 ">{student.username || 'No ID'}</p>
                  <div className="mt-2">
                    <button className="p-3 m-5 bg-amber-400 cursor-pointer hover:bg-amber-500" onClick={() => fetchAttendance(student._id)}>
                      See him attendance
                    </button>
{showAttendance && attendanceData.length >0&&attendanceData[0].userId==student._id&& (
  <div className="attendance-info mt-4">
    <h3>Attendance Records</h3>
    <div className="attendance-container border border-black w-full h-40 overflow-y-auto">
      <div >
      {attendanceData.map((record) => (
        <div key={record._id} className="attendance-record">
          <div className="flex justify-between outline-0 mb-3 bg-gray-200">
            <p className="font-semibold p-2">{record.date.slice(0, 10)}</p>
            <p className="font-semibold p-2 text-blue-500">Status: {record.status}</p>
          </div>
        </div>
      ))}
      <p className="font-bold p-2 text-red-500">
        Total absent: {attendanceData.reduce((total, record) => record.status === 'absent' ? total + 1 : total, 0)}
      </p>
      <p className="font-bold p-2 text-green-500">
        Total present: {attendanceData.reduce((total, record) => record.status === 'present' ? total + 1 : total, 0)}
      </p>
      <p className="font-bold p-2 bg-black text-white">
        Percentage: {((attendanceData.reduce((total, record) => record.status === 'present' ? total + 1 : total, 0)) / attendanceData.length) * 100}%
      </p>
    </div>
  </div>
  </div>
)}
      </div>
            <button
                    onClick={() => handleDelete(student._id)}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
             </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredStudents.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No students found</p>
          )}
        </div>
      </div>
    );
  };
export default ManageStudent;
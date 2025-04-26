'use client';
import { useEffect, useState } from 'react';

interface Student {
  _id: string;
  name: string;
  studentId: string;
  attendance: {
    present: number;
    total: number;
    percentage: number;
  };
}
const ManageStudent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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

      // Refresh the student list
      fetchStudents();
    } catch (error) {
      alert('Error deleting student');
      console.error('Error:', error);
    }
  };

  const filteredStudents = students.filter(student => {
    // Safely check if name and studentId exist before using toLowerCase
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div key={student._id} className="bg-white shadow-md rounded-xl p-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800 capitalize">{student.name || 'No Name'}</p>
                <p className="text-sm text-gray-600">{student.studentId || 'No ID'}</p>
                <div className="mt-2">
                  <p className="text-lg font-semibold">
                    Attendance: {student.attendance.present}/{student.attendance.total}
                  </p>
                  <p className={`text-xl font-bold ${
                    student.attendance.percentage >= 80 ? 'text-green-600' : 
                    student.attendance.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {student.attendance.percentage}%
                  </p>
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
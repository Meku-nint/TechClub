"use client";
import { useEffect, useState } from "react";
const FillAttendance = () => {
  const [attendance, setAttendance] = useState([{
    userName: "",
    date: "",
    status: "",
    userId: "",
    attendanceID: ""
  }]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/userAttendance', {
          method: 'GET',
         
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Could not fetch users.');
        }
        setAttendance(data);
      } catch {
        console.log("Error fetching attendance data");
      }
    };
    fetchUsers();
  }, [attendance]);
  const attendanceHandler = async (userId: string, attendanceID: string) => {
    try {
      const response = await fetch('/api/attended', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          attendanceID,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update attendance.');
      }
  
      const data = await response.json();
      console.log('Attendance updated successfully:', data);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };
  const makeAbsent=async(userId:string,attendanceID:string)=>{
    try {
      const response = await fetch('/api/absent', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          attendanceID,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update attendance.');
      }
  
      const data = await response.json();
      console.log('Attendance updated successfully:', data);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  }
  return (
    
    <div className="sm:w-2/3 mx-auto container p-4 px-auto bg-gray-50 rounded-lg shadow-2xl mt-10">  
      <p className="text-lg text-gray-600 mb-4 bg-amber-700 p-2 text-center fixed top-0 left-0 right-0"><span className="font-bold">Date: {attendance.length > 0 && attendance[0].date.slice(0, 10)}</span></p>
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Fill Attendance</h1>
      <table className="w-full table-auto bg-white justify-center  rounded-lg shadow-md border border-gray-200">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="px-6 py-4 text-left font-medium">Full Name</th>
            <th className="px-6 py-4 text-left font-medium">Present</th>
            <th className="px-6 py-4 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((user) => (
            <tr key={user.userName} className="hover:bg-gray-100 transition-all duration-300">
              <td className="px-6 py-4 border-t">{user.userName}</td>
              <td className="px-6 py-4 border-t flex items-center justify-start">
                <input type="checkbox" className="mr-4 text-2xl  form-checkbox text-green-500" onChange={()=>attendanceHandler(user.userId,user.attendanceID)}/> Present
              </td>
              <td className="px-6 py-4 border-t">
                {user.status === "present" ? (
                  <button className="text-green-500 font-semibold"onDoubleClick={()=>makeAbsent(user.userId,user.attendanceID)}>Attended</button>
                ) : (
                  <span className="text-red-500 font-semibold">Not Attended</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default FillAttendance;

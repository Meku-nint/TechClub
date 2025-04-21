'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ManageStudent from './student/page'
const AdminPage = () => {
  const [showManageStudent, setShowManageStudent] = useState(false);
  const [addStudent, setAddStudent] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const [responseFromServer, setResponseFromServer] = useState("");
  const[postAttendance,setPostAttendance]= useState(false)
  const addAdminHandler=()=>{
    const email =prompt("Admin email");
    const password =prompt("Admin password");
  }
  const allowStudentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseFromServer("");
  
    try {
      const response = await fetch("/api/allows", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId: studentId })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMessage = data.error || data.details || "Failed to allow student.";
        setResponseFromServer(errorMessage);
      } else {
        setResponseFromServer(data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseFromServer("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <nav className="fixed w-full flex sm:flex-row flex-col sm:items-center justify-between bg-black text-white sm:p-6 p-4">
        <Link href="/">
          <Image src="/images/logo.png" alt="AAU Tech Club" width={100} height={100} className="rounded-lg hidden sm:block shadow-lg" />
        </Link>
        <ul className="flex flex-col sm:flex-row sm:gap-6 gap-1 pl-4 sm:items-center list-none m-0 pr-8">
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="/adminPageLogin/adminPage">Home</Link>
          </li>
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href=""onClick={addAdminHandler}>Add Admin</Link>
          </li>
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="">Logout</Link>
          </li>
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="/adminPageLogin/fillAttendance">Attendance</Link>
          </li>
        </ul>
      </nav>
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6 pt-53 sm:pt-23 tracking-tight bg-red-100 p-13">
            Welcome to Admin Page
          </h1>
      <div className="p-8">
        <Image
          src="/images/aau.jpg"
          alt="Tech Club"
          width={1000}
          height={400}
          className="rounded-lg shadow-lg mx-auto"
        />
        <div>
          <div className="w-full flex gap-4 justify-center text-center mb-2 mt-10 bg-gray-400 p-5">
            <button
              onClick={() =>{ setShowManageStudent(!showManageStudent)
                setAddStudent(false);
                setPostAttendance(false);
              }}
              className="w-1/3 sm:w-1/5 cursor-pointer text-xl font-bold  bg-blue-300 hover:bg-blue-600 text-white sm:px-10 sm:py-5 transition-all duration-300"
            >Manage students (club members)
            </button>
            <button onClick={() =>{ setAddStudent(!addStudent)
                setShowManageStudent(false);
                setPostAttendance(false);
              }}
             className="w-1/3 sm:w-1/5 cursor-pointer text-xl font-bold  bg-blue-300 hover:bg-blue-600 text-white sm:px-10 sm:py-5 rounded-[0%] transition-all duration-300"
            >Add student to club (add members)</button>
            <button onClick={() =>{ setPostAttendance(!postAttendance)
                setShowManageStudent(false);
                setAddStudent(false);
              }}
             className="w-1/3 sm:w-1/5 cursor-pointer text-xl font-bold  bg-blue-300 hover:bg-blue-600 text-white sm:px-10 sm:py-5  transition-all duration-300"
            >post event and attendance</button>
          </div>
          {showManageStudent && (  
                            
    <div className="flex flex-col items-center justify-center bg-gray-100">
              <ManageStudent />
            </div>
          )}
            <div className="flex flex-col items-center justify-center py-12 bg-gray-100">
  {addStudent && (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6 w-full max-w-md">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Allow users to register to the club</h1>
    <form onSubmit={allowStudentHandler}>
      <p className='text-red-500 mb-4 text-xl animate-bounce '>{responseFromServer}</p>
      <input 
        type="text" required onChange={(e) => setStudentId(e.target.value)}
        placeholder="Enter student ID (UGR/XXXX/XX)" 
        className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
<button
  className={`bg-blue-500 text-white px-4 py-2 rounded-lg transition hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-400' : ''}`}
  type="submit">
            Allow to Register
      </button>

      </form>
    </div>
  )}

  {postAttendance && (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Post Attendance</h1>
      <input 
        type="date" 
        className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
       <input 
        type="time" 
        className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
        Post
      </button>
    </div>
  )}
</div>
        </div>
      </div>
      <footer>
        <p className='text-center text-white p-10 bg-gray-700 font-bold text-xl'>{new Date().getFullYear()} &copy;Tech Club</p>
      </footer>
    </div>
  );
};
export default AdminPage;
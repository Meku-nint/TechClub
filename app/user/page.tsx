'use client'
import React from 'react';
import UserNavbar from './user_nav/page';

const User = () => {
    const attendanceDetail=()=>{

    }
  return (
    <div className="min-h-screen bg-gray-100 pt-4">
      <UserNavbar />
      <div className="max-w-4xl mx-auto mt-24 p-6 bg-white rounded-xl shadow-md flex gap-6 items-start border border-gray-200 ">
        <img
          src="/images/profile.jpeg"
          alt="Tech Club"
          width={200}
          height={100}
          className="rounded-lg shadow-md object-cover h-48 w-48"
        />
        <div className="text-gray-700">
          <h2 className="text-xl font-semibold mb-2">John Doe</h2>
          <p className="leading-relaxed">
            This page is dedicated to tracking user attendance. Participants are required to attend both in-person and live sessions consistently. If a user misses a live session, they will be marked as absent. Additionally, if a participant's overall attendance falls below 50%, they will be automatically removed from the bootcamp. Please ensure you attend all sessions regularly to maintain your status.
          </p>
        </div>
      </div>
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mt-16 mb-6 tracking-tight">
  Your Attendance Overview
</h1>
<p className="text-lg text-gray-700 text-center text-blue-900 animate-bounce animate-pulse w-1/2 mx-auto">Don't forget if your attendance falls below 50%, you will be automatically removed from the boot camp <a href='#' className='underline text-red-700 'onClick={attendanceDetail}>see your attendance information</a></p>
    <div className="flex w-1/2 mx-auto gap-6 pt-8">
  <div className="flex-1 bg-green-100 border border-green-400 text-green-800 rounded-xl shadow-lg p-6 text-center">
    <p className="text-4xl font-bold">80%</p>
    <p className="text-lg font-medium mt-2">Present</p>
  </div>
  <div className="flex-1 bg-red-100 border border-red-400 text-red-800 rounded-xl shadow-lg p-6 text-center">
    <p className="text-4xl font-bold">20%</p>
    <p className="text-lg font-medium mt-2">Absent</p>
  </div>
</div>
<footer>
        <p className='text-center text-black-600 mt-10 p-10 bg-gray-600 '>{new Date().getFullYear()} &copy;Tech Club</p>
      </footer>
    </div>
  );
};
export default User;
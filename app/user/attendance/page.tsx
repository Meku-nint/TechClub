import React from 'react';
import UserNavbar from '../user_nav/page';

const Attendance = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-12">
      <UserNavbar />
      <div className="flex flex-col  justify-center max-w-sm mx-auto mt-26 bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Fill Your Attendance
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {new Date().toDateString()}
        </p>

        <form className="space-y-6">
          <input
            type="text"
            placeholder="Enter Daily Code"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            required
            defaultValue=""
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              Choose attendance status
            </option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Submit
          </button>
        </form>
      </div>

      <footer className="mt-26 sm:p-12 p-5 text-center bg-gray-500 text-white text-2x  w-full bottom-0 left-0">
        {new Date().getFullYear()} &copy; Tech Club
      </footer>
    </div>
  );
};

export default Attendance;

'use client'
import React from 'react'

const Attendance = () => {
  return (
    <div className=" min-h-screen flex flex-col justify-between bg-gray-50">
      <div className=" m-0 p-0">
        <h1 className="text-3xl font-semibold text-center text-gray-800 bg-gray-700 p-6 fixed w-full mb text-white">FillStudents Attendance</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-24">
          <form>
            <div className="mb-6">
              <label htmlFor="date" className="block text-lg font-medium text-gray-700">Select Date</label>
              <input
                type="date"
                id="date"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <ul className="space-y-4">
              {['John Dani', 'Jane Smith', 'David White', 'Alice Brown'].map((name, index) => (
                <li key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-gray-800">{name}</p>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                    <span>Present</span>
                  </label>
                </li>
              ))}
            </ul>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      <footer className="bg-gray-800 text-white text-center p-6 mt-8">
        <p className="font-bold text-xl">{new Date().getFullYear()} &copy; Tech Club</p>
      </footer>
    </div>
  )
}

export default Attendance;

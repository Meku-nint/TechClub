import React from 'react'
const ManageStudent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <input
                  type="search"
                  placeholder="Search student"
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="searchInput"
                />
                  <div className=''>
  <ul className="flex flex-wrap gap-4 w-3/4 mx-auto p-5 justify-center">
  <li className="bg-white shadow-md rounded-xl p-4 w-48 text-center justify-center">
    <p className="text-xl font-bold text-green-600">80%</p>
    <p className="capitalize text-gray-700">john dani</p>
    <button className=" mt-2 text-sm text-red-500 hover:text-red-700 ">Delete</button>
  </li>
  <li className="bg-white shadow-md rounded-xl p-4 w-48 text-center">
    <p className="text-xl font-bold text-green-600">80%</p>
    <p className="capitalize text-gray-700">john dani</p>
    <button className="mt-2 text-sm text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
  </li>
  <li className="bg-white shadow-md rounded-xl p-4 w-48 text-center">
    <p className="text-xl font-bold text-green-600">80%</p>
    <p className="capitalize text-gray-700">john dani</p>
    <button className="mt-2 text-sm text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
  </li>
  <li className="bg-white shadow-md rounded-xl p-4 w-48 text-center">
    <p className="text-xl font-bold text-green-600">80%</p>
    <p className="capitalize text-gray-700">john dani</p>
    <button className="mt-2 text-sm text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
  </li>
  <li className="bg-white shadow-md rounded-xl p-4 w-48 text-center">
    <p className="text-xl font-bold text-green-600">80%</p>
    <p className="capitalize text-gray-700">john dani</p>
    <button className="mt-2 text-sm text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
  </li>
  <li className="bg-white shadow-md rounded-xl p-4 w-48 text-center">
    <p className="text-xl font-bold text-green-600">80%</p>
    <p className="capitalize text-gray-700">john dani</p>
    <button className="mt-2 text-sm text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
  </li>
  <li className="bg-white shadow-md rounded-xl p-4 w-48 text-center">
    <p className="text-xl font-bold text-green-600">80%</p>
    <p className="capitalize text-gray-700">john dani</p>
    <button className="mt-2 text-sm text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
  </li>
  <li className="bg-white shadow-md rounded-xl p-4 w-48 text-center">
    <p className="text-xl font-bold text-green-600">80%</p>
    <p className="capitalize text-gray-700">john dani</p>
    <button className="mt-2 text-sm text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
  </li>
</ul>

                </div>
              </div>

            
  )
}
export default ManageStudent;
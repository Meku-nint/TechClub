'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
const AdminLogin = () => {
    const router=useRouter()
    const loginHandler=()=>{
        router.push('/adminPageLogin/adminPage')
    }
  return (
    <div className=' flex justify-center items-center h-screen bg-gray-100'>
    <form onSubmit={loginHandler} className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
      <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Login as admin</h2>
     <div className='flex flex-col gap-4'>
       <input 
          type="text"
          placeholder='Your email'
          className='p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input 
          type='password'
          placeholder='Enter your password'
          className='p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />            
      </div>
        <button
        className='w-full mt-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
        Submit
      </button>
    </form>
  </div>
  )
}

export default AdminLogin
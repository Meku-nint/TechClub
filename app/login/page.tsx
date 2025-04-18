'use client'
import React from 'react'
import Navbar from '../navbar/page'
const LoginCreateAccount = () => {
    const [isLogin, setIsLogin] = React.useState(true);
    const loginHandler=()=>{
        
    }
  return (
    <div>
      <Navbar />
        {!isLogin &&<div className='mt-16 flex justify-center items-center h-screen bg-gray-100 pb-4'>
            <form className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
          <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Create an Account</h2>
                    <div className='flex flex-col gap-4'>
            <input 
              type='text'
              placeholder='Your full name'
              className='p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input 
              type='email'
              placeholder='Your email'
              className='p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input 
              type="text"
              placeholder='Username (UGR/XXXX/XX)'
              className='p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input 
              type='password'
              placeholder='Enter your password'
              className='p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input 
              type="password"
              placeholder='Confirm password'
              className='p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
            <button
            type="submit" 
            className='w-full mt-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
            Submit
          </button>
          <p className='text-center text-sm text-gray-600 mt-4'>
            Already have an account? <a href="#"onClick={() => setIsLogin(true)} className='text-blue-600 hover:underline'>Login here</a>
          </p>
        </form>
            </div>}
        
      {isLogin && (
         <div className='mt-16 flex justify-center items-center h-screen bg-gray-100'>
         <form className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
           <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Login to your account</h2>
          <div className='flex flex-col gap-4'>
            <input 
               type="text"
               placeholder='Username (UGR/XXXX/XX)'
               className='p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
             />
             <input 
               type='password'
               placeholder='Enter your password'
               className='p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
             />            
           </div>
             <button  onClick={loginHandler}
             type="submit" 
             className='w-full mt-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
             Submit
           </button>
           <p className='text-center text-sm text-gray-600 mt-4'>
             I have no account? <a href="#"onClick={() => setIsLogin(false)} className='text-blue-600 hover:underline'>Create account here</a>
           </p>
         </form>
       </div>
      )}
       <footer>
        <p className='text-center text-white p-10 bg-gray-700 font-bold text-xl'>{new Date().getFullYear()} &copy;Tech Club</p>
      </footer>
    </div>
  )
}
export default LoginCreateAccount;
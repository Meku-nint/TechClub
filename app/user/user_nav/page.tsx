import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const UserNavbar = () => {
  return (
    <div className="m-0 z-50 p-0 w-full fixed top-0">
      <nav className="flex items-center justify-between bg-black text-white p-4">
      <Link href="/"><Image src="/images/logo.png" alt="AAU Tech Club" width={100} height={100} className="rounded-lg shadow-lg" /></Link>
        <ul className="flex gap-6 items-center list-none m-0 pr-8">
         <li className="text-lg  hover:text-blue-400 transition-colors duration-300">
            <Link href="/user">Home</Link>   
          </li>
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="/user/attendance">Attendance</Link>
          </li>        
          <li className="text-lg  hover:text-blue-400 transition-colors duration-300">
            <Link href="/setting">Setting</Link>   
          </li>
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="#logout">logout</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
export default UserNavbar;
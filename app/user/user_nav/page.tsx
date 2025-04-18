'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const UserNavbar = () => {
  const [changeName, setChangeName] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "full_name") {
      var name=prompt("Enter your full name");
      var password = prompt("Enter your password");
       if (name && password) {
        console.log("Name:", name);
        console.log("Password:", password);
      }
    } else if (selectedValue === "password") {
      var password = prompt("Enter your old password");
      var newPassword = prompt("Enter your new password");
      if (password && newPassword) {
        console.log("Old Password:", password);
        console.log("New Password:", newPassword);
      }
    }
  };

  return (
    <div className="m-0 z-50 p-0 w-full fixed top-0">
      <nav className="flex items-center justify-between bg-black text-white p-4">
        <Link href="/user">
          <Image src="/images/logo.png" alt="AAU Tech Club" width={100} height={100} className="rounded-lg shadow-lg" />
        </Link>
        <ul className="flex gap-6 items-center list-none m-0 pr-8">
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="/user">Home</Link>
          </li>
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="/user/attendance">Attendance</Link>
          </li>
          <li className="hover:text-blue-400 transition-colors duration-300">
            <select
              className='text-lg hover:text-blue-400 transition-colors duration-300 max-w-20'
              onChange={(e) => handleSelectChange(e)}
              defaultValue=""
            >
              <option disabled value="" className=''>Setting</option>
              <option value="full_name" className='text-xl text-black mb-2 ml-4'>Change Name</option>
              <option value="password" className='text-xl text-black mb-2 ml-4'>Change password</option>
            </select>
          </li>
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="#logout">Logout</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
export default UserNavbar;
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const Navbar = () => {
  return (
    <div className="m-0 z-50 p-0 p-0 w-full fixed top-0 ">
      <nav className="flex items-center justify-between bg-black text-white pt-4 pb-4">
      <Link href="/"><Image src="/images/logo.png" alt="AAU Tech Club" width={100} height={100} className="rounded-lg shadow-lg" /></Link>
        <ul className="flex gap-3 items-center list-none m-0 pr-8">
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="/">Home</Link>
          </li>
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="#about">About</Link>
          </li>
          <li className="text-lg hover:text-blue-400 transition-colors duration-300">
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
export default Navbar;
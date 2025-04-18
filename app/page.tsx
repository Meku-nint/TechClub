import Navbar from './navbar/page'
import Image from 'next/image'

const Home = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      <Navbar />
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mt-16 sm:mt-20">
        Welcome to    Tech Club
      </h1>
      <div className="flex justify-center mt-8 sm:mt-12">
        <Image
          src="/images/aau.jpg"
          alt="   Tech Club"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
      
      <div className="mx-4 sm:mx-12 mt-16">
        <h3 className="text-3xl font-bold text-center text-gray-800 mt-10">
          This is about us, and you can also contact us here
        </h3>
        <p className="text-lg text-gray-700 text-center mt-6 px-2 sm:px-4">
          Tech Club is a group of students who are interested in technology and want to learn more about it.
          It helps students in various aspects related to technology and encourages them to expand their knowledge.
        </p>
        <div className="mt-8 space-y-4 px-4 sm:px-12" id='about'>
          <h4 className="text-xl font-semibold text-gray-800">We help students in the following ways:</h4>
          <ul className="list-inside list-disc text-gray-700 space-y-2">
            <li>Helping students learn more about technology</li>
            <li>Providing resources and tools for tech learning</li>
            <li>Building a community for tech enthusiasts</li>
          </ul>
        </div>
        <div className="mt-12 px-4 sm:px-12">
          <h4 className="text-xl font-semibold text-gray-800">Contact Us</h4>
          <ul className="text-gray-700 space-y-2 mt-4">
            <li><span className="font-semibold">Email:</span> 0x6Kb@example.com</li>
            <li><span className="font-semibold">Phone:</span> 123-456-7890</li>
            <li><span className="font-semibold">Address:</span> 123 Main St, Anytown, USA</li>
            <li><span className="font-semibold">Website:</span> <a href="https://www.example.com" className="text-blue-600 hover:text-blue-800">www.example.com</a></li>
          </ul>
        </div>
      </div>
      <footer>
        <p className='text-center text-white p-10 bg-gray-700 font-bold text-xl'>{new Date().getFullYear()} &copy;Tech Club</p>
      </footer>
    </div>
  )
}
export default Home

import Navbar from './navbar/page'
import Image from 'next/image'
const Home = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-800 pt-2">
      <Navbar />
      <h1 className="sm:text-4xl sm:font-extrabold text-center text-green-600 mt-16 sm:mt-20 mt-25 tracking-tight text-3xl ">
        Welcome to  Tech Club
      </h1>
      <div className="flex flex-col sm:flex-row justify-center mt-8 sm:mt-12 gap-4">
        <Image
          src="/images/aau.jpg"
          alt="   Tech Club"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      <details className='bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300'><summary className="cursor-pointer font-semibold text-lg text-blue-700 mb-2">General Event Announcement
        <img src="https://thumbs.dreamstime.com/b/important-announcement-news-label-megaphone-vector-illustration-important-announcement-news-label-megaphone-334602537.jpg" alt="megaphone" width={800} height={800} 
        className="inline-block ml-2" />
      </summary>
      <p className='text-blue-700'>
📢 General Event Announcement
🚀 Tech Club Presents: Innovation Bootcamp 2025!
Join us for an exciting 3-day bootcamp packed with hands-on workshops, inspiring talks, and networking opportunities in the world of tech! Whether you're into web development, AI, or design—there's something for everyone.
🗓 Date: May 10–12, 2025
📍 Location: AAU Main Campus, Tech Hall
🎯 Open to: All students & tech enthusiasts
🎟 Entry: Free (Registration Required)
👉 Register now: example.com/register
        </p>
      </details>
        
      </div>
      <div>
  <h3 className='text-2xl  text-center text-gray-600 mt-8 sm:mt-12'>We prepare bootcamps for students in the following areas</h3>
  <div className="w-5/6 mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  <details className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
    <summary className="cursor-pointer font-semibold text-lg text-blue-700 mb-2">Web Development   <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvGCDR5nBpsRnjkCoIccrnqoKpDSYUTG7MLA&s"
      alt="Web Development"
      className="rounded-lg shadow-md my-2 w-full h-42 object-cover"
    /></summary>
    <p className="text-sm text-gray-700">
      Learn how to build modern, responsive websites using HTML, CSS, JavaScript, and frameworks like React.
    </p>
  </details>
  <details className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
    <summary className="cursor-pointer font-semibold text-lg text-blue-700 mb-2">Machine Learning  <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGigd_NY1WcWkvNaTAHUg01r1ygHnaBcbDbQ&s"
      alt="Machine Learning"
      className="rounded-lg shadow-md my-2 w-full h-42 object-cover"
    /></summary>
   
    <p className="text-sm text-gray-700">
      Dive into the world of AI with hands-on experience in building ML models using Python and TensorFlow.
    </p>
  </details>

  <details className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
    <summary className="cursor-pointer font-semibold text-lg text-blue-700 mb-2">Graphic Design <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL1X3B8SduPdRwvqWiUy6HxfWoAA9k6zdAqg&s"
      alt="Graphic Design"
      className="rounded-lg shadow-md my-2 w-full h-42 object-cover"
    /></summary>
    
    <p className="text-sm text-gray-700">
      Master visual storytelling by designing graphics using tools like Photoshop, Illustrator, and Canva.
    </p>
  </details>
  <details className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
    <summary className="cursor-pointer font-semibold text-lg text-blue-700 mb-2">Others  <img
      src="https://pixel77.com/wp-content/uploads/2018/10/1934823-e1540532501723.jpg"
      alt="Graphic Design"
      className="rounded-lg shadow-md my-2 w-full h-42 object-cover"
    /></summary>
   
    <p className="text-sm text-gray-700 mt-2">
      We also offer training in cybersecurity, mobile app development, UI/UX design, and more.
    </p>
  </details>
</div>
</div>

<div className="mx-4 sm:mx-12 mt-16" id="about">
  <div className='flex flex-col items-center bg-gray-300 p-10'>
  <h3 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mt-10">
    About Us & Contact
  </h3>

  <p className="text-lg text-gray-600 text-center mt-6 max-w-3xl mx-auto sm:text-xl">
    Tech Club is a student-led initiative focused on fostering curiosity and growth in the world of technology.
    We empower learners through hands-on experiences, resources, and a vibrant community of tech enthusiasts.
  </p>
  </div>
  
  <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 sm:p-10">
    <h4 className="text-2xl font-semibold text-gray-800 mb-4">How We Support Students</h4>
    <ul className="list-disc list-inside text-gray-700 space-y-3 text-base sm:text-lg">
      <li >Helping students deepen their understanding of tech topics</li>
      <li>Providing curated resources and tools for learning</li>
      <li>Building a collaborative and supportive tech community</li>
    </ul>
  </div>
  <div className="mt-12 bg-gray-50 rounded-2xl shadow-md pb-6 sm:p-10">
    <h4 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h4>
    <ul className="mt-12 bg-white rounded-2xl shadow-lg p-6 sm:p-10 w-86 sm:w-full space-y-2">
    <li className="flex items-start gap-4">
    <span className="font-semibold w-24">Email:</span>
    <a
      href="mailto:3s2Tt@example.com"
      className="text-blue-600 hover:text-blue-800 underline break-all"
    >
      3s2Tt@example.com
    </a>
  </li>
  <li className="flex items-start gap-3">
    <span className="font-semibold w-24">Telegram:</span>
    <a
      href="https://t.me/TechClubAAU"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline break-all"
    >
      https://t.me/TechClubAAU
    </a>
  </li>
  <li className="flex items-start gap-3">
    <span className="font-semibold w-24">Phone:</span>
    <span>123-456-7890</span>
  </li>
  <li className="flex items-start gap-3">
    <span className="font-semibold w-24">Address:</span>
    <span>123 Main St, Anytown, USA</span>
  </li>
</ul>
  </div>
</div>
      <footer>
        <p className='text-center text-white sm:p-10 p-6 bg-gray-700 font-bold text-xl'>{new Date().getFullYear()} &copy;Tech Club</p>
      </footer>
    </div>
  )
}
export default Home;
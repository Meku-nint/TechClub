'use client'
import React, { useState } from 'react';
const SetEventAndHomePage = () => {
  const [showEvent, setShowEvent] = useState(true);
  const [isLoading,setIsLoading]=useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    telegram: '',
    phone: '',
    location: '',
    prove:'1221'
  });
  const [event, setEvent] = useState({
    description: '',
    address: ''
  });
  const handleEventChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const adminInfoHandler=async(e:React.FormEvent<HTMLFormElement>)=>{ 
    e.preventDefault();
    setIsLoading(true);
    try {
        const response=await fetch('/api/admininfo',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactInfo)
        })
        const data=await response.json();
        if(!response.ok){
            alert(data.error);
        }
        else{
            alert (data.message);
        }
    } catch  {
        alert ("There is problem");
    }
  }
  const eventSubmitHandler=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setIsLoading(true);
    try {
        const response=await fetch('/api/event',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        const data=await response.json();
        if(!response.ok){
            alert(data.error);
        }
        else{
            alert (data.message);
        }
    } catch  {
        alert ("There is problem");
    }
    setIsLoading(false);
    setEvent({
        description:'',
        address:''
    })
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="sm:text-4xl text-3xl font-semibold text-center text-gray-800 mb-6 tracking-tight">
        Set Event and Home Page
      </h1>

      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          className={`w-1/2 py-3 rounded-md text-white font-semibold transition duration-300 ${
            showEvent ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-200 hover:bg-blue-600'
          }`}
          onClick={() => setShowEvent(true)}
        >
          Set Event
        </button>
        <button
          className={`w-1/2 py-3 rounded-md text-white font-semibold transition duration-300 ${
            !showEvent ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-200 hover:bg-blue-600'
          }`}
          onClick={() => setShowEvent(false)}
        >
          Set Contact Info
        </button>
      </div>

      {showEvent ? (
        <form className="flex flex-col gap-4" onSubmit={eventSubmitHandler}>
          <textarea
            name="description"
            className="w-full h-28 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event description"
            value={event.description}
            onChange={handleEventChange}
            required
          ></textarea>
          <textarea
            name="address"
            className="w-full h-20 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter links for registration if any"
            value={event.address}
            onChange={handleEventChange}
          ></textarea>
          <button className={`w-full mt-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                ${isLoading 
                  ? 'bg-blue-500 text-white opacity-50 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                }`}> Post Event
          </button>
        </form>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={adminInfoHandler}>
          <input
            type="email"required
            name="email"
            value={contactInfo.email}
            onChange={handleContactChange}
            placeholder="Club administrator email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="telegram"required
            value={contactInfo.telegram}
            onChange={handleContactChange}
            placeholder="Club Telegram address"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="phone"required
            value={contactInfo.phone}
            onChange={handleContactChange}
            placeholder="Admin contact"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="text"required
            name="location"
            value={contactInfo.location}
            onChange={handleContactChange}
            placeholder="Club address"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full mt-4 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            Save Contact Info
          </button>
        </form>
      )}
    </div>
  );
};
export default SetEventAndHomePage;
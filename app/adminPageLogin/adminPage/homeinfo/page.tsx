import React, { useState } from 'react';

const SetEventAndHomePage = () => {
  const [showEvent, setShowEvent] = useState(true);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="sm:text-4xl text-3xl font-semibold text-center text-gray-800 mb-6 tracking-tight">
        Set Event and Home Page
      </h1>

      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          className={`w-1/2 py-3 rounded-md text-white font-semibold transition duration-300 ${
            showEvent
              ? 'bg-blue-700 hover:bg-blue-800'
              : 'bg-blue-200 hover:bg-blue-600'
          }`}
          onClick={() => setShowEvent(true)}
        >
          Set Event
        </button>
        <button
          className={`w-1/2 py-3 rounded-md text-white font-semibold transition duration-300 ${
            !showEvent
              ? 'bg-blue-700 hover:bg-blue-800'
              : 'bg-blue-200 hover:bg-blue-600'
          }`}
          onClick={() => setShowEvent(false)}
        >
          Set Contact Info
        </button>
      </div>

      {showEvent ? (
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full h-28 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event description"
            required
          ></textarea>
          <textarea
            className="w-full h-20 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter links for registration if any"
          ></textarea>
          <button className="w-full mt-4 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            Post Event
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Club administrator email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Club Telegram address"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Admin contact"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Club address"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full mt-4 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            Save Contact Info
          </button>
        </div>
      )}
    </div>
  );
};
export default SetEventAndHomePage;
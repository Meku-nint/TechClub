'use client'
import React, { useEffect, useState } from 'react'

interface User {
  _id: string
  name: string
  email: string
  username: string
}

interface AttendanceRecord {
  userId: string
  status: 'present' | 'absent'
}

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [users, setUsers] = useState<User[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [submittedAttendance, setSubmittedAttendance] = useState<AttendanceRecord[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceForDate()
    }
  }, [selectedDate])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
      // Initialize attendance records for all users as absent
      setAttendanceRecords(data.map((user: User) => ({
        userId: user._id,
        status: 'absent'
      })))
    } catch (err) {
      setError('Failed to load users')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAttendanceForDate = async () => {
    try {
      const response = await fetch(`/api/attendance?date=${selectedDate}`)
      if (!response.ok) throw new Error('Failed to fetch attendance')
      const data = await response.json()
      if (data.length > 0) {
        setAttendanceRecords(data)
        setSubmittedAttendance(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusChange = (userId: string, isPresent: boolean) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.userId === userId ? { ...record, status: isPresent ? 'present' : 'absent' } : record
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: selectedDate,
          records: attendanceRecords
        })
      })

      if (!response.ok) throw new Error('Failed to save attendance')
      
      alert('Attendance saved successfully!')
      setSubmittedAttendance(attendanceRecords)
      fetchAttendanceForDate() // Refresh the attendance data
    } catch (err) {
      setError('Failed to save attendance')
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="m-0 p-0">
        <h1 className="text-3xl font-semibold text-center text-gray-800 bg-gray-700 p-6 fixed w-full mb text-white">
          Fill Students Attendance
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-24">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="date" className="block text-lg font-medium text-gray-700">Select Date</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <ul className="space-y-4">
              {users.map((user) => {
                const record = attendanceRecords.find(r => r.userId === user._id)
                return (
                  <li key={user._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm">
                    <div>
                      <p className="text-lg font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={record?.status === 'present'}
                        onChange={(e) => handleStatusChange(user._id, e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span>Present</span>
                    </label>
                  </li>
                )
              })}
            </ul>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </form>

          {/* Display submitted attendance */}
          {submittedAttendance.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Attendance Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">Present: {submittedAttendance.filter(r => r.status === 'present').length}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                  <p className="text-red-800 font-medium">Absent: {submittedAttendance.filter(r => r.status === 'absent').length}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Attendance Details</h3>
                <ul className="space-y-2">
                  {users.map((user) => {
                    const record = submittedAttendance.find(r => r.userId === user._id)
                    return (
                      <li key={user._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">{user.name}</span>
                        <span className={`font-medium ${record?.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                          {record?.status === 'present' ? 'Present' : 'Absent'}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white text-center p-6 mt-8">
        <p className="font-bold text-xl">{new Date().getFullYear()} &copy; Tech Club</p>
      </footer>
    </div>
  )
}

export default Attendance

import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import dateFormat from '../../lib/dateFormat'
import { useAppContext } from '../../context/AppContext'

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const {axios, getToken, user} = useAppContext()

  const getAllBookings = async () => {
    try {
      const token = await getToken();
      const {data} = await axios.get("/api/admin/all-bookings", {
        headers: {Authorization: `Bearer ${token}`}
      })
      if (data.success && data.bookings) {
        setBookings(data.bookings)
      } else {
        setBookings([])
      }
    } catch(error) {
      console.error(error)
      setBookings([])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if(user) {
      getAllBookings()
    }
  }, [user])

  return !isLoading ? (
    <>
      <div className="px-4 md:px-8 py-6">
        <Title text1="List" text2="Bookings" />
        <div className="max-w-4xl mt-8 overflow-x-auto rounded-md shadow">
          <table className="w-full border-collapse text-nowrap">
            <thead>
              <tr className="bg-primary/80 text-left text-white">
                <th className="p-3 font-medium pl-5">User Name</th>
                <th className="p-3 font-medium">Movie Name</th>
                <th className="p-3 font-medium">Show Time</th>
                <th className="p-3 font-medium">Seats</th>
                <th className="p-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings && bookings.length > 0 ? (
                bookings.map((item, index) => (
                  <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
                    <td className='p-2 min-w-45 pl-5'>{item?.user?.name || 'N/A'}</td>
                    <td className='p-2'>{item?.show?.movie?.title || 'N/A'}</td>
                    <td className='p-2'>{item?.show?.showDateTime ? dateFormat(item.show.showDateTime) : 'N/A'}</td>
                    <td className='p-2'>{item?.bookedSeats ? Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ") : 'N/A'}</td>
                    <td className='p-2'>{currency} {item?.amount || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4">No bookings available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  ) : <Loading />
}

export default ListBookings


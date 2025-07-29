import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import dateFormat from '../../lib/dateFormat'

const ListBookings = () => {

const currency = import.meta.env.VITE_CURRENCY

const [bookings, setBookings] = useState([])
const [isLoading, setIsLoading] = useState(true)

const getAllBookings = async () =>{
  setBookings(dummyBookingData)
  setIsLoading(false) 
}
useEffect(()=>{
  getAllBookings()
},[])

  return !isLoading ? (
    <>
         <div className="px-4 md:px-8 py-6"> {/* Added padding */}
        <Title text1="List" text2="Bookings" />
        <div className="max-w-4xl mt-8 overflow-x-auto rounded-md shadow"> {/* Increased margin-top */}
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
                {bookings.map((item,index) =>(
                  <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
                      <td className='p-2 min-w-45 pl-5'>{item.user.name}</td>
                      <td className='p-2'>{item.show.movie.title}</td>
                      <td className='p-2'>{dateFormat(item.show.showDateTime)}</td>
                      <td className='p-2'>{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</td>
                      <td className='p-2'>{currency} {item.amount}</td>
                  </tr>
                ))}
            </tbody>
            </table>
    
      </div>
      </div>
    </>
  ):<Loading />
}

export default ListBookings


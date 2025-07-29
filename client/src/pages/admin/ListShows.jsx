import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import dateFormat from '../../lib/dateFormat';

const ListShows = () => {
    const currency = import.meta.env.VITE_CURRENCY

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true)

    const getAllShows = async () => {
        try {
            setShows([{
                movie: dummyShowsData[0],
                showDateTime: "2025-06-30T02:30:00.000Z",
                showPrice: 59,
                occupiedSeats: {
                    A1: "user_1",
                    B1: "user_2",
                    C1: "user_3"
                }
            }])
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllShows();
    }, [])

    return !loading ? (
        <>
          <div className='px-6 md:px-16 lg:px-36 '>
  <Title text1="List" text2="Shows" />

  <div className='mt-6 rounded-lg overflow-x-auto bg-[#1f1f1f] shadow-md'>
    <table className='w-full text-sm text-left text-white border-collapse'>
      <thead className='bg-primary/20'>
        <tr>
          <th className='px-8 py-4 font-semibold whitespace-nowrap'>Movie Name</th>
          <th className='px-8 py-4 font-semibold whitespace-nowrap'>Show Time</th>
          <th className='px-8 py-4 font-semibold whitespace-nowrap'>Total Bookings</th>
          <th className='px-8 py-4 font-semibold whitespace-nowrap'>Earnings</th>
        </tr>
      </thead>
     <tbody className='text-sm font-light'> 
  {shows.map((show, index) => (
    <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
      <td className='px-8 py-4 whitespace-nowrap'>{show.movie.title}</td>
      <td className='px-8 py-4 whitespace-nowrap'>{dateFormat(show.showDateTime)}</td>
      <td className='px-8 py-4 whitespace-nowrap'>{Object.keys(show.occupiedSeats).length}</td>
      <td className='px-8 py-4 whitespace-nowrap'>
        {currency} {Object.keys(show.occupiedSeats).length * show.showPrice}
      </td>
    </tr>
  ))}
</tbody>
    </table>
  </div>
</div>
        </>
    ) : <Loading />
}

export default ListShows

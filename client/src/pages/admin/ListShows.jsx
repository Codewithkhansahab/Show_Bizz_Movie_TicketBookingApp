import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import dateFormat from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const ListShows = () => {
    const currency = import.meta.env.VITE_CURRENCY

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true)
    const {axios,getToken, user} = useAppContext()


    const getAllShows = async () => {
        try {
            const token = await getToken();
            console.log("Fetching shows with token:", token);
            const {data} = await axios.get("/api/admin/all-shows",{
              headers :{Authorization : `Bearer ${token}`}
            })
            console.log("API response:", data);
            if (data.success && data.shows) {
                setShows(data.shows);
                console.log("Shows data set:", data.shows);
            } else {
                console.error("API returned success=false or no shows data");
                setShows([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching shows:", error);
            toast.error("Error in fetching shows");
            setLoading(false);
        }
    }

    useEffect(() => {
      console.log("useEffect triggered, user:", user);
      if(user){
        console.log("User is available, calling getAllShows");
        getAllShows();
      } else {
        console.log("User is not available, not calling getAllShows");
      }
    }, [user])

    console.log("Rendering component, loading:", loading, "shows:", shows);

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
  {shows && shows.length > 0 ? (
    shows.map((show, index) => (
      <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
        <td className='px-8 py-4 whitespace-nowrap'>{show.movie ? show.movie.title : 'N/A'}</td>
        <td className='px-8 py-4 whitespace-nowrap'>{show.showDateTime ? dateFormat(show.showDateTime) : 'N/A'}</td>
        <td className='px-8 py-4 whitespace-nowrap'>{show.occupiedSeats ? Object.keys(show.occupiedSeats).length : 0}</td>
        <td className='px-8 py-4 whitespace-nowrap'>
          {currency} {(show.occupiedSeats ? Object.keys(show.occupiedSeats).length : 0) * (show.showPrice || 0)}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className='px-8 py-4 text-center'>No shows available</td>
    </tr>
  )}
</tbody>
    </table>
  </div>
</div>
        </>
    ) : <Loading />
}

export default ListShows

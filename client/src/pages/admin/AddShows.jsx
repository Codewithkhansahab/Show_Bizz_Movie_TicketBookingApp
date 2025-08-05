import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react'
import kConverter from '../../lib/kConverter'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const AddShows = () => {
  const {axios,getToken, user,image_base_url} = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [selectedMovies, setSelectedMovies] = useState(null)
  const [dateTimeSelection, setDateTimeSelection] = useState({})
  const [dateTimeInput, setDateTimeInput] = useState("")
  const [showPrice, setShowPrice] = useState("")
  const [addingShow , setAddingShow] = useState(false)


  const fetchNowPlayingMovies = async () => {
    try{
      const {data} = await axios.get('/api/show/now-playing',{
        headers: {Authorization : `Bearer ${await getToken()}`}
      })
      if(data.success){
        setNowPlayingMovies(data.movies)
      }
    }

    catch(error){
      console.log('error fetching movies ',error)
      toast.error('error in fetching movie')
    }
  }

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return
    const [date, time] = dateTimeInput.split("T")
    if (!date || !time) return

    setDateTimeSelection((prev) => {
      const times = prev[date] || []
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] }
      }
      return prev
    })

    setDateTimeInput("") // Clear input after adding
  }

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time)
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [date]: filteredTimes,
      }
    })
  }

  const handleSubmit =async () =>{

    try{
      setAddingShow(true)
      if(!selectedMovies || Object.keys(dateTimeSelection).length === 0 || !showPrice){
          return toast.error('Please select movies, add date and time and enter show price')
      }
      const showsInput = Object.entries(dateTimeSelection).map(([date,time])=>({date,time}));
      const payload = {
        movieId:selectedMovies,
        showsInput, 
        showPrice:Number(showPrice)
      }

      const {data} = await axios.post('/api/show/add',payload,{
        headers:{Authorization : `Bearer ${await getToken()}`}
      })
      if(data.success){
        toast.success('Show added successfully')
        setSelectedMovies(null)
        setDateTimeSelection({})
        setShowPrice("")
      }
      else{
        toast.error(data.message)
      }

    }
    catch(error){
      console.log(error)
      toast.error("error occured try again")
    }

  }

  useEffect(() => {
    if(user){

      fetchNowPlayingMovies()
    }
  }, [user])

  return nowPlayingMovies.length > 0 ? (
    <>
      <div className="px-4 md:px-8 py-6">
        {/* Page Title */}
        <Title text1="Add" text2="Shows" />

        {/* Section Heading */}
        <h2 className='mt-10 mb-4 text-xl font-semibold text-gray-400'>Now Playing Movies</h2>

        {/* Movie Cards */}
        <div className='overflow-x-auto pb-4'>
          <div className='flex flex-wrap gap-4'>
            {nowPlayingMovies.map((movie) => (
              <div
                onClick={() => setSelectedMovies(movie.id)}
                key={movie.id}
                className="relative max-w-40 cursor-pointer hover:-translate-y-1 transition duration-300"
              >
                <div className='rounded-lg overflow-hidden shadow-md'>
                  <img
                    src={image_base_url+movie.backdrop_path}
                    alt=""
                    className='w-full h-60 object-cover brightness-90'
                  />
                  <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                    <p className='flex items-center gap-1 text-gray-400'>
                      <StarIcon className='w-4 h-4 text-primary fill-primary' />
                      {movie.vote_average.toFixed(1)}
                    </p>
                    <p className='text-gray-300'>
                      {kConverter(movie.vote_count)} Votes
                    </p>
                  </div>
                </div>
                {selectedMovies === movie.id && (
                  <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded'>
                    <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Show Price */}
        <div className='mt-8'>
          <label htmlFor="showPrice" className='block text-sm font-medium mb-2'>Show Price</label>
          <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>
            <p className='text-gray-400 text-sm'>{currency}</p>
            <input
              id="showPrice"
              type="number"
              min={0}
              value={showPrice}
              onChange={(e) => setShowPrice(e.target.value)}
              placeholder='Enter Show Price'
              className='outline-none text-sm'
            />
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="mt-6">
          <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-2">
            Select Date and Time
          </label>

          <div className="inline-flex gap-3 items-center border border-gray-300 p-2 rounded-lg shadow-sm">
            <input
              id="datetime"
              type="datetime-local"
              value={dateTimeInput}
              onChange={(e) => setDateTimeInput(e.target.value)}
              className="outline-none border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <button
              onClick={handleDateTimeAdd}
              className="bg-primary text-white px-4 py-2 text-sm rounded-md hover:bg-primary/90 transition duration-200"
            >
              Add Time
            </button>
          </div>

          {/* Display Selected Times Below Add Time Button */}
          {Object.keys(dateTimeSelection).length > 0 && (
            <div className='mt-4'>
              <h2 className='mb-2 text-sm text-gray-700 font-medium'>Selected Date-Time</h2>
              <ul className='space-y-3'>
                {Object.entries(dateTimeSelection).map(([date, times]) => (
                  <li key={date}>
                    <div className='font-medium text-gray-800'>{date}</div>
                    <div className='flex flex-wrap gap-2 mt-1 text-sm'>
                      {times.map((time) => (
                        <div key={time} className='border border-primary px-2 py-1 flex items-center rounded'>
                          <span>
                            {new Date(`${date}T${time}`).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <DeleteIcon
                            onClick={() => handleRemoveTime(date, time)}
                            width={15}
                            className='ml-2 text-red-500 hover:text-red-700 cursor-pointer'
                          />
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Add Show Button */}
        <button onClick={handleSubmit} disabled={addingShow} className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'>
          Add Show
        </button>
      </div>
    </>
  ) : <Loading />
}

export default AddShows

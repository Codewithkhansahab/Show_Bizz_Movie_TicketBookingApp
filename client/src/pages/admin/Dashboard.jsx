import { ChartLineIcon, CircleDollarSign, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import BlurCircle from '../../components/BlurCircle'
import dateFormat from '../../lib/dateFormat'
import { toast } from 'react-toastify'
import { useAppContext } from '../../context/AppContext'

const Dashboard = () => {
      const {axios,getToken, user,image_base_url} = useAppContext()


    const currency = import.meta.env.VITE_CURRENCY

    const [dashboardData ,setDashboardData] = useState({
        totalBookings : 0,
        totalRevenue : 0,
        activeShows : [],
        totalUser : 0
    })

    const [loading, setLoading] = useState(true)

    const dashboardCards =[
        {title : "Total Bookings",value : dashboardData.totalBookings || "0",icon:ChartLineIcon},
        {title : "Total Revenue",value : currency + (dashboardData.totalRevenue || "0"),icon:CircleDollarSignIcon},
        {title : "Active Shows",value : (dashboardData.activeShows && dashboardData.activeShows.length) || "0",icon:PlayCircleIcon},
        {title : "Total Users",value : dashboardData.totalUser || "0",icon:UserIcon}
    ]

    const fetchDashBoardData = async ()=>{
      try{
        const {data} = await axios.get('/api/admin/dashboard' ,{
          headers : {Authorization : `Bearer ${await getToken()}`}
        })
        if(data.success){
          setDashboardData(data.dashboardData) 
          setLoading(false)
        }else{
          console.log(data.message)
          toast.error(data.message)
          setLoading(false)
        }
      }
      catch(error){
        console.error(error)
        toast.error("error in fetching dashboard data")
        setLoading(false)
      }
    }

    useEffect(()=>{
      if(user){
        fetchDashBoardData();
      }
    },[user]);

  return !loading ? (
  <>
    <div className='w-full px-4 md:px-10 flex flex-col gap-6 relative'>
      {/* Title on top */}
      <Title text1="Admin" text2="Dashboard" />

      {/* Cards below the title */}
      <div className='absolute z-0'>
        <BlurCircle top='100px' left='10' />
      </div>

      <div className='flex gap-4 flex-wrap z-10'>
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className='flex items-center justify-between h-20 px-4 py-2 bg-primary/10 border border-primary/20 rounded-md w-64'
          >
            <div>
              <h1 className='text-sm'>{card.title}</h1>
              <p className='text-xl font-medium mt-1'>{card.value}</p>
            </div>
            <card.icon className='w-6 h-6' />
          </div>
        ))}
      </div>

      {/* Active Shows Section */}
      <p className='mt-10 text-lg font-medium z-10'>Active Shows</p>

      <div className='relative flex flex-wrap gap-6 mt-4 max-w-5xl z-10'>
        <BlurCircle top='100px' left='10%' />
        {dashboardData.activeShows && dashboardData.activeShows.map((show) => (
          <div key={show._id} className='w-55 h-[340px] rounded-lg overflow-hidden pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300'>

            <img
              src={image_base_url + (show.movie ? show.movie.poster_path : '')}
              alt=""
              className='h-60 w-full object-cover'
            />
            <p className='font-medium p-2 truncate'>{show.movie ? show.movie.title : ''}</p>
            <div className='flex items-center justify-between px-2'>
              <p className='text-lg font-medium'>
                {currency} {show.showPrice || 0}
              </p>
              <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                <StarIcon className='w-4 h- text-primary fill-primary' />
                {show.movie && show.movie.vote_average ? show.movie.vote_average.toFixed(1) : '0.0'}
              </p>
            </div>
            <p className='px-2 pt-2 text-gray-500'>
              {show.showDateTime ? dateFormat(show.showDateTime) : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  </>
) : (
  <Loading />
)
}

export default Dashboard

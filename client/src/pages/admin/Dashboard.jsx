import { ChartLineIcon, CircleDollarSign, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import BlurCircle from '../../components/BlurCircle'
import dateFormat from '../../lib/dateFormat'

const Dashboard = () => {

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
        {title : "Total Revenue",value : currency + dashboardData.totalRevenue || "0",icon:CircleDollarSignIcon},
        {title : "Active Shows",value : dashboardData.activeShows.length || "0",icon:PlayCircleIcon},
        {title : "Total Users",value : dashboardData.totalUser || "0",icon:UserIcon}
    ]

    const fetchDashBoardData = async ()=>{
         setDashboardData(dummyDashboardData)
         setLoading(false)
    }
     
    useEffect(()=>{
        fetchDashBoardData();
    },[]);

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
        {dashboardData.activeShows.map((show) => (
          <div key={show._id} className='w-55 h-[340px] rounded-lg overflow-hidden pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300'>

            <img
              src={show.movie.poster_path}
              alt=""
              className='h-60 w-full object-cover'
            />
            <p className='font-medium p-2 truncate'>{show.movie.title}</p>
            <div className='flex items-center justify-between px-2'>
              <p className='text-lg font-medium'>
                {currency} {show.showPrice}
              </p>
              <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                <StarIcon className='w-4 h- text-primary fill-primary' />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>
            <p className='px-2 pt-2 text-gray-500'>
              {dateFormat(show.showDateTime)}
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
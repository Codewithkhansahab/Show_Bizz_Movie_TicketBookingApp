import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeaderSection = () => {
    const navigate = useNavigate()
  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/saiyaara2.jpeg")] bg-cover bg-center h-screen '>
        {/* <img src={assets.marvelLogo} alt="" className='max-h-11 lg:h-11 mt-20'/> */}
        <h1 className='text-5xl md"text-[70px] md:leading-18 font-semibold max-w-110 text-black'>Saiyara <br /> </h1>
        <div className='flex items-center gap-4 text-black'>
            <span>Love | Art | Talent</span>
            <div className='flex items-center gap-1'>
                <CalendarIcon className='w-4.5 h-4.5'/>2025
            </div>
            <div className='flex items-center gap-1'>
                <ClockIcon className='w-4.5 h-4.5'/>2h 8m
            </div>
        </div>
        <p className='max-w-md text-black'>
            In a post world where ride on wheels and consume each oher to survive, two people meet in london and tyr to stop a conspirancy
        </p>
        <button onClick={()=>navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
            Explore Movies
            <ArrowRight className='w-5 h-5'/>
        </button>
    </div>
  )
}

export default HeaderSection
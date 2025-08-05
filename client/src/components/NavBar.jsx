import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import {MenuIcon, SearchIcon, TicketPlus, XIcon} from "lucide-react"
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'

const NavBar = () => {
    const [isOpen,setIsOpen] = useState(false)
    const {user} = useUser()
    const {openSignIn} = useClerk()
    const navigate = useNavigate()
    const {favoriteMovies} = useAppContext()

  return (
    <div className='fixed top-2 left-0 z-50 w-full h-30 backdrop-blur-md bg-black/40 py-4 rounded-full'>
      <div className='w-full flex items-center justify-between px-6 md:px-16 lg:px-36'>
        <Link onClick={()=>scrollTo(0,0)} to={'/'} className='max-md:flex-1'>
            <img src={assets.image} width={'10px'} alt="" className='w-36 h-auto'/>
        </Link>
        
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-8 px-8 py-2 rounded-full bg-white/5 border border-white/10'>
            <Link onClick={()=>scrollTo(0,0)} to="/">Home</Link>
            <Link onClick={()=>scrollTo(0,0)} to="/movies">Movies</Link>
            { favoriteMovies.length > 0 && <Link onClick={()=>scrollTo(0,0)} to="/favorite">Favorite</Link>}
            <Link onClick={()=>scrollTo(0,0)} to="/">Theatres</Link>
            <Link onClick={()=>scrollTo(0,0)} to="/">Releases</Link>
        </div>
        
        <div className='flex items-center gap-4 md:gap-8'>
            <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />

            {
                !user ? ( 
                  <button 
                    onClick={openSignIn} 
                    className='px-4 py-1.5 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
                  >
                    Login
                  </button>
                ) : (
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label='My Bookings' labelIcon={<TicketPlus width={15} />} onClick={()=>navigate('/my-bookings')} />
                        </UserButton.MenuItems>
                    </UserButton>
                )
            }
            
            <MenuIcon className='md:hidden w-8 h-8 cursor-pointer' onClick={()=>setIsOpen(true)}/>
        </div>
      </div>
      
      {/* Mobile Navigation Overlay */}
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-lg transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <XIcon className='absolute top-6 right-6 w-8 h-8 cursor-pointer' onClick={()=>setIsOpen(false)}/>
        
        <div className='flex flex-col items-center gap-8 text-lg font-medium'>
            <Link onClick={()=>{scrollTo(0,0);setIsOpen(false)}} to="/">Home</Link>
            <Link onClick={()=>{scrollTo(0,0);setIsOpen(false)}} to="/movies">Movies</Link>
            { favoriteMovies.length > 0 && <Link onClick={()=>{scrollTo(0,0);setIsOpen(false)}} to="/favorite">Favorite</Link>}
            <Link onClick={()=>{scrollTo(0,0);setIsOpen(false)}} to="/">Theatres</Link>
            <Link onClick={()=>{scrollTo(0,0);setIsOpen(false)}} to="/">Releases</Link>
            
            {!user && (
              <button 
                onClick={openSignIn} 
                className='mt-4 px-8 py-2.5 bg-primary hover:bg-primary-dull transition rounded-full font-medium'
              >
                Login
              </button>
            )}
        </div>
      </div>
    </div>
  )
}

export default NavBar
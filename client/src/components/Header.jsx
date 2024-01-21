import { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import {useSelector} from 'react-redux'

const Header = () => {
    const [isMenuOpen,setisMenuOpen] = useState(false);
    const handleMenuToggle = ()=>{
        setisMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setisMenuOpen(false);
    };

    const {currentUser} = useSelector(state=> state.persistedReducer.user)

    const navigate = useNavigate()
    const location = useLocation()

    const [searchTerm,setSearchTerm] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // here window.locatiin.search take current url and what user search and send in query string
        // and then (URLSearchParams) search according to it what user search and send in query string
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        // urlParams.toString() this means that query is in differnt type sometime number,boolean etc
        // so convert into string
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    useEffect(()=>{
        // yh is lya k agr hm url ma searchTerm ko change kryn to search bar ma word change ni ga blky gaib 
        // ho jy ga to es lya hm useEffect ma url ko get kiya jo b change ki us ma wo change krny ky bad or
        // search ho jy ga or search bar wo word b aa jy ga  (searchTerm) ky through.
        const urlParams = new URLSearchParams(location.search)
        const searchTermForUrl = urlParams.get('searchTerm')
        if (searchTermForUrl) {
            setSearchTerm(searchTermForUrl)
        }
        
    },[location.search])

    

  return (
    <>
        
   <header className={`max-w-screen-2xl container mx-auto absolute z-10 xl:px-24 px-10 py-1
         `}>
            <div className={`flex justify-between items-center}`}>
                <Link to='/'>
                    <h1 className='font-bold text-lg sm:text-xl flex flex-wrap mt-4 md:mt-2'>
                        <span className='text-slate-500'>Real</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </Link>
                {/* bg-tranparent yhan mtlb is k sm sy choti devices pr transparent ho ga or (sm) 
                    sy ly kr bari devices pr yh (bg-slate-100) ho ga */}
                <form onSubmit={handleSubmit} className='bg-slate-50 md:bg-slate-100 p-3 rounded-lg flex 
                    items-center'>
                    <input 
                        type='text'
                        placeholder='Search...'
                        className='bg-transparent focus:outline-none  w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}    
                    />
                    <button>
                        <FaSearch className='text-slate-600'/>
                    </button>
                </form>
                {/* Large devices (hidden md:flex gap-4*/}
                <ul className='hidden md:flex items-center gap-4 font-semibold text-slate-700'>
                    <Link to='/'>
                        <li className=' hover:underline'>
                            Home
                        </li>
                    </Link>
                    <Link to='/about'>
                        <li className='hover:underline'>
                            About
                        </li>
                    </Link>
                    <Link to='/profile'>
                        {
                            currentUser ?(
                                    <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} 
                                    alt='profile' />
                                ): (
                                <li className='bg-black text-white p-2 px-4 rounded-md'>
                                    SigIn
                                </li>) 
                        }
                    </Link>    
                </ul>
                
                {/* Mobile Menu */}
                <div className='block md:hidden mt-3'>
                    <button onClick={handleMenuToggle} className='border border-black rounded-md p-2'>
                        {
                            isMenuOpen ? 
                                <FaXmark className='w-7 h-7 text-primary'/> :
                                <FaBarsStaggered className='w-7 h-7 text-primary'/>
                        }
                        
                    </button>
                </div>
                
            </div>
            {/* Navitems for mobile */}
            <div className={`block md:hidden px-4 py-5 mt-2 bg-slate-300 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
                <ul>
                    <Link to='/' onClick={closeMenu} className={({ isActive })=>
                                isActive ? "active" : ""
                    }>
                       <li className='p-4 text-center text-lg border-b rounded-xl hover:opacity-95 duration-300 hover:text-black cursor-pointer border-gray-600'>
                            Home
                        </li>
                    </Link>
                        <Link to='/about' onClick={closeMenu}>
                            <li className='p-4 text-center text-lg border-b rounded-xl hover:opacity-95 duration-300 hover:text-black cursor-pointer border-gray-600'>
                                About
                            </li>
                        </Link>
                        <Link to='/profile' onClick={closeMenu} >
                        {
                            currentUser ?(
                                <li className='p-4 grid place-content-center text-lg border-b rounded-xl hover:opacity-95 duration-300 hover:text-black 
                                    cursor-pointer border-gray-600'>
                                    <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} 
                                        alt='profile' />
                                </li>
                                    
                                ): (
                                <li className='p-4 text-center text-lg border-b rounded-xl hover:opacity-95 duration-300 hover:text-black cursor-pointer border-gray-600'>
                                    SigIn
                                </li>) 
                        }
                        </Link> 
                        
                </ul>
            </div>
        </header>
    </>
  )
}

export default Header

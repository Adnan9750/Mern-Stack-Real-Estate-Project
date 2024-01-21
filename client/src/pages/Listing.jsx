import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import { useSelector } from 'react-redux'
import Contact from '../components/Contact'
// import 'swiper/css'

const Listing = () => {

    const {currentUser} = useSelector((state)=> state.persistedReducer.user)

    SwiperCore.use([Navigation])
    const [listData, setListData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [copied,setCopied] = useState(false)
    const [contact,setContact] = useState(false)
    // console.log(listData);
    const params = useParams()

    useEffect(()=>{
        const fetchListing = async () =>{
            try {
                setLoading(true)
                const res = await axios.get(`https://mern-real-estate-fpt2.onrender.com/api/listing/getList/${params.listId}`)
                setListData(res.data)
                setLoading(false)
                setError(false)
                // console.log(res);
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchListing();
    },[params.listId])

  return (
    <>
        <main className='relative pt-16'>
            {loading && <p className='text-center my-7 text-2xl'>loading...</p>}
            {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
            {
                listData && !loading && !error && (
                <div className=''>
                    <Swiper navigation>
                        {
                            listData.imageUrls.map((img_url)=>{
                                return (
                                    <SwiperSlide key={img_url}>
                                        <div className='h-[440px]' 
                                        style={{background:`url(${img_url}) center no-repeat`,backgroundSize: 'cover'}}
                                        alt='image'></div>
                                    </SwiperSlide>
                                )
                                
                            })
                        }
                    </Swiper>
                    {/* Link copy section and share to other */}
                    <div className='fixed top-[13%] right-[3%] z-10 border w-12 h-12 
                    rounded-full flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare 
                            className='text-slate-500'
                            onClick={()=>{
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true)
                                setTimeout(()=>{
                                    setCopied(false) 
                                },2000)
                            }}
                        />
                    </div>
                    {/* copied true ha agr to Link Copied! show ho ga */}
                    {
                        copied && (
                            <p className='fixed top-[23%] right-[5%] z-10  rounded-md bg-slate-100 p-2'>
                                Link Copied!
                            </p>
                        )
                    }
                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-5 gap-5'>
                        <p className='text-2xl font-semibold text-slate-700 font-serif'>
                            {listData.name} - ${' '}
                            {
                                listData.offer ?
                                    listData.discountPrice.toLocaleString('en-US')
                                    : listData.regularPrice.toLocaleString('en-US')
                            }
                            {/* this below part mean that jb rent or offer ho gi tb (/month) ay ga */}
                            {listData.type === 'rent' && ' /month'}
                        </p>
                        {/* for address */}
                        <p className='flex items-center gap-2 text-slate-600 text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listData.address}
                        </p>
                        {/* for button */}
                        <div className='flex flex-wrap gap-4'>
                            <p className='bg-red-900 w-full max-w-[150px] text-white text-center p-1 rounded-md'>
                                {listData.type === 'rent' ? "For Rent" : "For Sale"}
                            </p>
                            {
                                listData.offer && (
                                    <p className='bg-green-900 w-full max-w-[150px]
                                    text-white text-center p-1 rounded-md'>
                                        ${listData.regularPrice - listData.discountPrice} Off
                                    </p>
                                )
                            }
                        </div>
                        <p className='text-slate-800'>
                            <span className='text-black font-semibold'>Description - {' '}</span>
                            {listData.description}
                        </p>
                        <ul className='flex items-center flex-wrap gap-4 sm:gap-6 text-green-900 font-semibold text-sm'>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaBed className='text-lg' />
                                {
                                    listData.bedrooms > 1 ? `${listData.bedrooms} beds`:
                                    `${listData.bedrooms} bed`
                                }
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaBath className='text-lg' />
                                {
                                    listData.bathrooms > 1 ? `${listData.bathrooms} baths`:
                                    `${listData.bathrooms} bath`
                                }
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaParking className='text-lg' />
                                {
                                    listData.parking ? "Parking Spot" : "No Parking"
                                }
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaChair className='text-lg' />
                                {
                                    listData.furnished ? "Furnished" : "Unfurnished"
                                }
                            </li>
                        </ul>
                        {/* jb khud owner dekhay ga to usy button ni nzr ay ga mgr koi or bnda dekhay ga to usy nzr
                        ay ga button or contact landlord pr jb click kry ga to contact button 
                        gaib ho jy ga*/}
                        {
                            currentUser && listData.userRef !== currentUser._id && !contact &&(
                                <button onClick={()=>setContact(true)} className='bg-slate-700 text-white 
                                uppercase rounded-lg p-3 hover:opacity-95'>
                                    Contact Landlord
                                </button>       
                            )
                        }
                        {/* jb contact landord pr click kr ly ga tb fr usy contact wla show ho ga  */}
                        {
                            contact && <Contact listing={listData}/>
                        }
                    </div>
                    
                </div>
            )}
        </main>
    </>
  )
}

export default Listing

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCircleArrowRight } from "react-icons/fa6";
import { IoIosArrowRoundForward } from "react-icons/io";
import axios from 'axios';
// import Swiper from 'swiper';
import {Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules';
import 'swiper/css'
import ListingItem from '../components/ListingItem';

const Home = () => {

  const [offerListing,setOfferListing] = useState([])
  const [saleListing,setSaleListing] = useState([])
  const [rentListing,setRentListing] = useState([])

  SwiperCore.use([Navigation])

  useEffect(()=>{
    const fetchOfferListings = async () =>{
      const res = await axios.get('http://localhost:8000/api/listing/search?offer=true&limit=4')
      setOfferListing(res.data)
      fetchRentListings()
    }
    const fetchRentListings = async () =>{
      const res = await axios.get('http://localhost:8000/api/listing/search?type=rent&limit=4')
      setRentListing(res.data)
      fetchSaleListings()
    }
    const fetchSaleListings = async () =>{
      const res = await axios.get('http://localhost:8000/api/listing/search?type=sale&limit=4')
      setSaleListing(res.data)
    }
    fetchOfferListings()
  },[])

  return (
    <>
        <div className=' pt-20'>
          {/* <section className='relative w-full min-h-screen md:h-screen flex md:block flex-col justify-center'>
            <img priority fill quality={100} src='/hero7.png' alt='hero_pic'
              className='pointer-events-none select-none'
              style={{objectFit: 'cover', objectPosition: '75%'}}
            />
            <div className='relative z-10 pt-32 md:pt-0 md:top-1/4 lg:top-1/3 max-w-7xl mx-auto'>
              <div className='max-w-2xl px-4 flex flex-col gap-8 md:max-xl:bg-white/30 md:max-xl:rounded'>
                <h1 className='-ml-1 text-3xl md:text-4xl font-semibold'>Embark on your effortless
                  <span className='text-blue-600'> dream
                  </span>
                  <br/>
                  home journey.
                </h1>
                <p className='text-gray-700 text-sm max-w-xl'>
                  The Real Estate platform is your ultimate destination for discovering your ideal living space
                  <br/>
                  Explore our extensive collection of properties tailored just for you
                </p>
              </div>
              <Link to={'/search'} className='bg-slate-900  text-white p-2 rounded-md font-bold text-xs sm:text-sm'>
                Discover Now
              </Link>
            </div>
          </section> */}
            <img src='/hero7.png' className='hidden md:inline   absolute right-5 top-7 '/>
          <div className='relative  flex flex-col flex-wrap gap-6 py-28 px-12 md:px-8 max-w-6xl mx-auto'>
            <h1 className='text-slate-700 font-bold text-3xl md:text-4xl lg:text-5xl'>Embark on your effortless 
              <span className='text-blue-600'> dream
              </span>
              <br/>
              home journey.
            </h1>
            <div className='text-blue-500 text-xs sm:text-sm'>
              The Real Estate platform is your ultimate destination for discovering your ideal living space
              <br/>
              Explore our extensive collection of properties tailored just for you
            </div>
            <div className='flex items-center gap-2'>
              <Link to={'/search'} className='bg-slate-900 text-white p-2 rounded-md font-bold text-xs sm:text-sm'>
                Discover Now
              </Link>
            </div>
          </div>
          {/* swiper */}
          <Swiper navigation className='mt-1 md:mt-[115px]'>
            {
              offerListing && offerListing.length > 0 && 
              offerListing.map((listing)=>{
                return (
                  <SwiperSlide>
                    <div className='h-[500px]' key={listing._id}
                    style={{background:`url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize:"cover"}}></div>
                  </SwiperSlide>
                )
              })
            }
          </Swiper>
          {/* listing result for offer,rent and sale */}
          <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
            {
              offerListing && offerListing.length > 0 && (
                <div>
                  <div className='my-3'>
                    <h2 className='text-2xl text-slate-600 font-semibold'>Recent Offers</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                      Show More offers
                    </Link>
                  </div>
                  {/* cards */}
                  <div className='flex flex-wrap sm:justify-center gap-4'>
                    {
                      offerListing.map((listingData)=>{
                        return (
                          <ListingItem listing={listingData} key={listingData._id} />
                        )
                      })
                    }
                  </div>
                </div>
              )
            }
            {/* rent listing */}
            {
              rentListing && rentListing.length > 0 && (
                <div>
                  <div className='my-3'>
                    <h2 className='text-2xl text-slate-600 font-semibold'>Recent Offers for Rent</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                      Show more places 
                    </Link>
                  </div>
                  {/* cards */}
                  <div className='flex flex-wrap sm:justify-center gap-4'>
                    {
                      rentListing.map((listingData)=>{
                        return (
                          <ListingItem listing={listingData} key={listingData._id} />
                        )
                      })
                    }
                  </div>
                </div>
              )
            }
            {/*  sell listing */}
            {
              saleListing && saleListing.length > 0 && (
                <div>
                  <div className='my-3'>
                    <h2 className='text-2xl text-slate-600 font-semibold'>Recent Offers for Sale</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                      Show more places 
                    </Link>
                  </div>
                  {/* cards */}
                  <div className='flex flex-wrap sm:justify-center gap-4'>
                    {
                      saleListing.map((listingData)=>{
                        return (
                          <ListingItem listing={listingData} key={listingData._id} />
                        )
                      })
                    }
                  </div>
                </div>
              )
            }
          </div>
        </div>
    </>
  )
}

export default Home

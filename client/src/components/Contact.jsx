import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = ({listing}) => {

    const [landlord,setLandLord] = useState(null)
    const [message,setMessage] = useState('')

    useEffect(()=>{
        const fetchLandLord = async ()=>{
            const res = await axios.get(`https://mern-real-estate-fpt2.onrender.com/api/user/${listing.userRef}`,{withCredentials:true})
            // console.log(res);
            setLandLord(res.data)
        }
        fetchLandLord();
    },[listing.userRef])

  return (
    <>
        {
            landlord && (
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{landlord.username}
                    </span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span> </p>
                    <textarea 
                        name='message' 
                        id='message'
                        value={message}
                        onChange={(e)=>setMessage(e.target.value)}
                        placeholder='Enter your message'
                        className='w-full border p-3 rounded-lg'
                    ></textarea>
                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} 
                        className='bg-slate-700 text-white p-3 rounded-lg text-center font-semibold uppercase'>
                        Send Message
                    </Link>
                </div>
            )
        }
    </>
  )
}

export default Contact

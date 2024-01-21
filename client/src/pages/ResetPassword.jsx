import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const ResetPassword = () => {
    const {id,token} = useParams()
    const [formData,setFormData] = useState({})
    // console.log(formData);
    const handleChange = (e) => {
        const {id,value} = e.target
        setFormData({
            ...formData,
            [id] : value
        })
    }

    const formSubmit = async (e) => {
        e.preventDefault()

        const res = await axios.post(`https://mern-real-estate-fpt2.onrender.com/api/user/reset-password/${id}/${token}`,formData)
        // console.log(res);
    }

  return (
    <>
      <div className='relative pt-32 max-w-lg mx-auto'>
        <h1 className='text-2xl font-semibold text-center my-4'>Reset Password</h1>
        <form className='flex flex-col gap-4' onSubmit={formSubmit}>
            <input type='password' 
                id='password' 
                placeholder='password' 
                className='p-3 border'
                onChange={handleChange}    
            />
            <input type='password' 
                id='confirmPassword' 
                placeholder='Confirm Password' 
                className='p-3 border' 
                onChange={handleChange}
            />
            <button type='submit' className='bg-blue-800 text-white p-3 rounded-lg'>Send</button>
        </form>
      </div>
    </>
  )
}

export default ResetPassword

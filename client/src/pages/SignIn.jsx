import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signinSuccess } from '../redux/user/userSlice'
import GoogleOAuth from '../components/GoogleOAuth'


const SignIn = () => {
  const [formData,setformData] = useState({})
  const [message,setMessage] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e)=>{
    const {id,value} = e.target
    setformData({
      ...formData,
      [id]:value
    })
  }

  const formSubmit = async (e)=>{
    e.preventDefault()

    const res = await axios.post("http://localhost:8000/api/auth/signin",formData,{ withCredentials: true })
    document.getElementById('submit-form').reset()

    if(res.status === 200){
      setMessage(res.data.message)
      dispatch(signinSuccess(res.data.userData))
        setTimeout(()=>{
        navigate('/')
      },1000)  
    }
    
    // if(res.status !== 200 ){
    //    setMessage(res.data.message)
    // }
    // console.log(res.data.message);
    // console.log(res.data.userData);
  }

  return (
    <>
        <div className="relative pt-20 grid lg:grid-cols-2  lg:gap-1">
          <div className='w-full'>
           <img src='/signin.png' className='hidden lg:inline  absolute left-10 top-24 '/>
          </div>
          <div className='relative flex flex-col gap-6 p-2  max-w-lg w-full mx-auto  '>
            <h1 className='text-3xl text-center font-semibold my-5'>Sign In</h1>
            <form className='flex flex-col gap-4' id='submit-form' onSubmit={formSubmit}>
                <input type='email' placeholder='email' id='email' className='border p-3 rounded-lg' 
                  onChange={handleChange}
                />
                <input type='password' placeholder='password' id='password' className='border p-3 rounded-lg' 
                  onChange={handleChange}
                /> 
                <button  className='bg-slate-700 text-white p-3 rounded-lg 
                  uppercase hover:opacity-95 disabled:opacity-80'>
                    Sign In
                </button>
                <GoogleOAuth/>
            </form>
            <div className='flex gap-2 mt-5 mb-4'>
                <p>Dont have an account?</p>
                <Link to='/sign-up'>
                  <span className='text-blue-700'>Sign Up</span>
                </Link>
            </div>
            <Link to='/forgotpasswordemail'>
              <span className='text-blue-500'>Forgot Password?</span>
            </Link>
            {
              message ? <p className='text-red-500'>{message}</p> : ''
            }
          </div>
        </div>
    </>
  )
}

export default SignIn

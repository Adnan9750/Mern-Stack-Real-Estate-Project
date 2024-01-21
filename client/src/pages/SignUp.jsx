import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useRegisterUserMutation } from '../services/userAuthApi'
import GoogleOAuth from '../components/GoogleOAuth'


const SignUp = () => {

  const [formData,setformData] = useState({})
  const navigate = useNavigate()
  // const [error,setError] = useState(null)
  // const [loading,setloading] = useState(false)

  const handleChange = (e) =>{
    const {id,value} = e.target
    setformData({
      ...formData,
      [id]:value
    })
  }

  // const [registerUser] = useRegisterUserMutation()

  const handleSubmit = async (e)=>{
    e.preventDefault()
    // const res = await registerUser(formData)
    // console.log(res);
    // try {

      const res = await axios.post('http://localhost:8000/api/auth/signup',formData)
      document.getElementById('submit-form').reset()
      setTimeout(()=>{
        navigate('/sign-in')
      },1000)
      console.log(res.data);
    // } catch (error) {
    //   setloading(false);
    //   setError(error.message)
    // }
    
    
  }

  return (
    <>
      {/* <div className=" bg-[url('/signup.jpg')] bg-center bg-cover w-[100vw] h-[91vh]"> */}
        <div className='relative pt-14 p-3 max-w-lg  mx-auto '>
          <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
          <form className='flex flex-col gap-4' id='submit-form' onSubmit={handleSubmit}>
              <input type='text' placeholder='username' id='username' className='border p-3 rounded-lg' 
                onChange={handleChange}
              />
              <input type='email' placeholder='email' id='email' className='border p-3 rounded-lg' 
                onChange={handleChange}
              />
              <input type='password' placeholder='password' id='password' className='border p-3 rounded-lg' 
                onChange={handleChange}
              /> 
              <button  className='bg-slate-700 text-white p-3 rounded-lg 
                uppercase hover:opacity-95 disabled:opacity-80'>
                  Sign Up
              </button>
              <GoogleOAuth/>
          </form>
          <div className='flex gap-2 mt-5'>
              <p>Have an account?</p>
              <Link to='/sign-in'>
                <span className='text-blue-700'>Sign in</span>
              </Link>
          </div>
        </div>
      {/* </div> */}
    </>
  )
}

export default SignUp

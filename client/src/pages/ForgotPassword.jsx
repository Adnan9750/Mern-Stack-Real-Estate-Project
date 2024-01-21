import axios from 'axios';
import { useState } from 'react';

const ForgotPassword = () => {

    const [emailMsg,setEmailMsg] = useState('')

    const formSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget)
        const actualData = {
            email : data.get('email'),
        }

        const res = await axios.post("http://localhost:8000/api/user/reset-password-email",actualData)
        console.log(res);
        setEmailMsg(res.data)
    }

  return (
    <>
      <div className='relative pt-32 max-w-lg mx-auto'>
        {/* <div className='max-w-lg mx-auto bg-black'>
            <div className='w-full'> */}
                <form className='flex flex-col gap-4' onSubmit={formSubmit}>
                    <h1 className='text-2xl text-center font-semibold my-4'>Forgot Password</h1>
                    <input type='email' id='email' name='email' placeholder='Your Email' 
                        className='border p-3 rounded-lg' />
                    <button type='submit' className='bg-blue-900 text-white p-3 rounded-lg uppercase font-semibold'>
                        Send
                    </button>
                </form>
                {
                  emailMsg && 
                  <p className='text-green-600 mt-5'>{emailMsg}</p>
                }
            {/* </div>
        </div> */}
      </div>
    </>
  )
}

export default ForgotPassword

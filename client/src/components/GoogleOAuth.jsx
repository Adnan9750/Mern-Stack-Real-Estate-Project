import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { signinSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const GoogleOAuth = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogle = async ()=>{
        try {
            const googleProvider = new GoogleAuthProvider()
            // this app is export from firebase.js file 
            const auth = getAuth(app)
            // using this it show us a (PopUp) of google signin where user can signin. And this data is send
            // to backend and saved in database 
            const result = await signInWithPopup(auth,googleProvider)
            // console.log(result);
            const res = await axios.post('https://mern-real-estate-fpt2.onrender.com/api/auth/google',{
                name:result.user.displayName,
                email:result.user.email,
                photo:result.user.photoURL
            },{ withCredentials: true })
            dispatch(signinSuccess(res.data))
            navigate('/')
            // console.log(res);
        } catch (error) {
            console.log('conuld not signin with google',error);
        }
    }
  return (
    <>
        <button type='button' className='bg-red-700 text-white p-3 uppercase rounded-lg hover:opacity-95'
                onClick={handleGoogle}
            >
            Continue with google
        </button>
    </>
  )
}

export default GoogleOAuth

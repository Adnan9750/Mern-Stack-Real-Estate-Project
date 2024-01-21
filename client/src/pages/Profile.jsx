import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase"
import axios from "axios"
import { deleteUserSuccess, signoutUserSuccess, updateUserSuccess } from "../redux/user/userSlice"
import {Link} from "react-router-dom"

const Profile = () => {

  const fileRef = useRef(null)
  const {currentUser} = useSelector(state => state.persistedReducer.user)
  const dispatch = useDispatch()

  const [file,setfile] = useState(undefined)
  const [profilePercent,setProfilePercent] = useState(0)
  const [fileUploadError,setFileUploadError] = useState(false)
  const [listingError,setListingError] = useState(false)
  const [userListing,setUserListing] = useState([])
  const [formData,setFormData] = useState({})
 
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  // for profile uploading
  const handleFileUpload = (file)=>{
    // this (app) export from firebase.js file. 
    const storage = getStorage(app)
    const filename = new Date().getTime() + file.name
    const storageRef = ref(storage,filename)
    const uploadTask = uploadBytesResumable(storageRef,file)
    
    // this is for upload percentage that how much percent our profile is uploded.
    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProfilePercent(Math.round(progress))
        // console.log('Upload is' + progress + '% done');
        },
        (error)=>{
          setFileUploadError(true)
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL)=>{
            setFormData({...formData, avatar:downloadURL })
          })
        }
    )
  }

  const handleChange = (e)=>{
    // const {id,value} = e.target
    setFormData({
      ...formData , [e.target.id]: e.target.value
    })
  }

  // form submit for updation
  const formSubmit = async (e)=>{
    e.preventDefault()
    const res = await axios.post(`http://localhost:8000/api/user/update/${currentUser._id}`,formData,
      { withCredentials: true })
      dispatch(updateUserSuccess(res.data))
    //  console.log(res.data); 
  }

  // delete account
  const handleDelete = async ()=>{
    const res = await axios.delete(`http://localhost:8000/api/user/delete/${currentUser._id}`,
    { withCredentials: true })
    dispatch(deleteUserSuccess(res.data))
  }

  // for signout
  const handleSignOut = async ()=>{
    const res = await axios.get('https://mern-real-estate-fpt2.onrender.com/api/auth/signout',{ withCredentials: true })
    dispatch(signoutUserSuccess(res.data))
  } 
  // list showing
  const handleShowListing = async ()=>{
    try {
      setListingError(false)
      const res = await axios.get(`http://localhost:8000/api/user/listing/${currentUser._id}`,
      { withCredentials: true })
      setUserListing(res.data)
      // console.log(res);
    } catch (error) {
      setListingError(true)
    }
  }
  // delete listing
  const handleDeleteList = async (listId) =>{
    const res = await axios.delete(`http://localhost:8000/api/listing/delete/${listId}`,
    {withCredentials : true})
    // console.log(res);
    if (res.status === 200){
      setUserListing((prevData)=> prevData.filter((listing)=> listing._id !== listId ))
    }
  }

  return (
    <>
      <div className='relative pt-14 p-2 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-4'>Profile Page</h1>
        <form className="flex flex-col gap-3" onSubmit={formSubmit}>

          <input 
            onChange={(e)=>setfile(e.target.files[0])} 
            type="file" 
            ref={fileRef} 
            hidden accept="image/*" 
            />
          <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile"
            className='rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center'
          />
          <p className="text-sm text-center">
            {
              fileUploadError ? (
                <span className="text-red-700">
                  Error Uploading Image (Image must be less than 2 mb)
                </span>) :
                 profilePercent > 0 && profilePercent < 100 ? (
                  <span className="text-slate-700">
                    {`Uploading ${profilePercent} `}
                  </span>) :
                  profilePercent === 100 ? (
                    <span className='text-green-700'>Image Uploaded Successfully</span>)
                : ""
            }
          </p>
          
          <input 
            type="text" 
            placeholder="username" 
            defaultValue={currentUser.username}
            id="username" 
            className='border p-3 rounded-lg'
            onChange={handleChange} 
            />
          <input 
            type="email" 
            placeholder="email" 
            defaultValue={currentUser.email}
            id="email" 
            className='border p-3 rounded-lg'
            onChange={handleChange}
            />
          <input 
            type="password" 
            placeholder="password" 
            id="password" 
            className='border p-3 rounded-lg'
            onChange={handleChange}
            />
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Update
          </button>
          <Link className="bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95"
            to='/create-listing'>
            Create Listing
          </Link>
        </form>

        <div className="flex justify-between mt-4">
          <span className='text-red-700 cursor-pointer font-medium text-lg' onClick={handleDelete}>
            Delete account
          </span>
          <span className='text-red-700 cursor-pointer font-medium text-lg' onClick={handleSignOut}>
            Signout
          </span>
        </div>
        <button onClick={handleShowListing} className='text-green-700 w-full font-semibold'>
          Show Listings
        </button>
        <p className='text-red-700 mt-2' >{listingError ? 'Error showing Listing' : ''}</p>

        {/* Listing of user is shown */}
        {
          userListing && userListing.length > 0 && 
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl text-center font-semibold mt-7">Your Listing</h1>
            {
              userListing.map((currList) => {
                return (
                <div key={currList._id} className="border rounded-lg p-3 flex justify-between items-center gap-4" >
                  <Link to={`/listing/${currList._id}`}>
                    <img 
                      src={currList.imageUrls} 
                      alt="listing pic"
                      className='h-16 w-16 object-contain' />
                  </Link>
                  <Link to={`/listing/${currList._id}`}
                    className='text-slate-700 font-semibold flex-1 hover:underline truncate'>
                    <p>{currList.name}</p>
                  </Link>
                  <div className='flex flex-col'>
                    <button onClick={()=>handleDeleteList(currList._id)}
                      className='text-red-700 uppercase font-semibold'>
                        delete
                    </button>
                    <Link to={`/update-listing/${currList._id}`}>
                     <button className='text-green-700 uppercase font-semibold'>edit</button>
                    </Link>

                  </div>
                </div>
              )})
            }
          </div>
        }
      </div>
      

    </>
  )
}

export default Profile

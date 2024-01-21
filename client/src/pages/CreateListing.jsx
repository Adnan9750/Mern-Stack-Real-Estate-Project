import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useState } from 'react'
import { app } from '../firebase'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CreateListing = () => {

    const {currentUser} = useSelector(state => state.persistedReducer.user)

    const navigate = useNavigate()
    const [error,setError] = useState({
        status:false,
        message:''
    })
    const [file,setFiles] = useState([])
    const [formData,setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,
    })

    const [uploading,setUploading] = useState(false)
    const [creating,setCreating] = useState(false)

    // Image upload part implementattion
    const handleImageSubmit = async ()=>{
        setUploading(true)
        if(file.length > 0 && file.length < 7){
            const urls=[];
            for(let i = 0 ; i < file.length ; i++){
                const url = await storeImage(file[i])
                urls.push(url)
            }
            setFormData({
                ...formData ,
                imageUrls : formData.imageUrls.concat(urls)
            })
            setUploading(false)
        }
    }
    // Image storage part
    const storeImage = async (file)=>{
        // this is for storage in firebase
        const storage = getStorage(app);
        const filename = new Date().getTime() + file.name;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // uploadTask file that we select upload on page
        await uploadTask
        // this downloadURL mean this return url of image to up wherw storeImage function is called
        // and then that url is push in array 
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        return downloadURL
    }

    // for delete the pics that upload
    const handleDelete = (id)=>{
        setFormData({
            ...formData,
             imageUrls : formData.imageUrls.filter((_,index)=>{
                 return index!== id
             })
        })
    }
    
    // onChange event part implementation
    const handleChange = (e)=>{
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                // here type is the type in formData means that id jo ho gi wo (type) ma chali jy gi
                type:e.target.id
            })
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.checked
            })
        }
        // here type is type of input tag
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    // form submittion part
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.imageUrls.length < 1){
            return setError({status:true , message:'You must upload atleast single image'})
        }
        if(formData.regularPrice < formData.discountPrice){
            return setError({status:true , message:'Discount price must be less than regular price'})
        }
        const res = await axios.post('https://mern-real-estate-fpt2.onrender.com/api/listing/create/',
            {
                ...formData,
                userRef: currentUser._id
            },
            {withCredentials:true}
        )
        navigate(`/listing/${res.data._id}`)
        // console.log(res);

    }

  return (
    <>
        <main className='relative p-3 pt-14 max-w-4xl mx-auto '>
            <h1 className='text-3xl font-semibold text-center my-5'>Create a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                {/* form section */}
                <div className='flex flex-col gap-4 flex-1'>
                    <input 
                        type='text'
                        placeholder='Name' 
                        className='border p-3 rounded-lg' 
                        id='name' required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea 
                        type='text' 
                        placeholder='Description' 
                        className='border p-3 rounded-lg' 
                        id='description' required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input 
                        type='text' 
                        placeholder='Address' 
                        className='border p-3 rounded-lg' 
                        id='address' required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' id='sale'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.type === 'sale'}    
                             />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' id='rent'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.type === 'rent'}
                             />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' id='parking'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' id='furnished'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' id='offer' 
                                className='w-5' 
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-4'>
                        <div className='flex items-center gap-2'>
                            <input 
                                type='number' 
                                id='bedrooms' 
                                min='1' max='10' required
                                className='p-2 border border-gray-300 rounded-lg' 
                                onChange={handleChange}
                                value={formData.bedrooms}
                            />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input 
                                type='number' 
                                id='bathrooms' 
                                min='1' max='10' required
                                className='p-2 border border-gray-300 rounded-lg' 
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input 
                            type='number' 
                            id='regularPrice' 
                            min='50' max='1000000' 
                            required
                            className='p-2 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.regularPrice}
                        />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>($ / Month)</span>
                            </div>

                        </div>

                        {
                            formData.offer && 
                            <div className='flex items-center gap-2'>
                            <input 
                                type='number' 
                                id='discountPrice' 
                                min='0' max='1000000' 
                                required
                                className='p-2 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.discountPrice} 
                            />
                            <div className='flex flex-col items-center'>
                                <p>Discount Price</p>
                                <span className='text-xs'>($ / Month)</span>
                            </div>
                        </div>

                        }

                    </div>
                </div>
                {/* Images upload section */}
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-700 ml-2'>
                            The first image will be the cover (max 6)
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input 
                            className='p-3 border border-gray-300 rounded w-full' 
                            type='file' id='images' accept='image/*' multiple
                            onChange={(e)=>setFiles(e.target.files)}    
                         />
                        <button 
                            disabled={uploading} 
                            type='button' 
                            className='border border-green-700 p-2 text-green-700 
                            rounded uppercase hover:shadow-lg'
                            onClick={handleImageSubmit} >
                            {   uploading ? 'Uploading' : 'Upload' }
                        </button>
                    </div>
                    {
                        formData.imageUrls.length >0 && formData.imageUrls.map((imageURL,index)=>{
                            return (
                                <div className='flex justify-between p-3 border items-center' key={index}>
                                    <img 
                                        src={imageURL} 
                                        alt='image' 
                                        className='w-20 h-20 object-contain rounded-lg'
                                    />
                                    <button type='button' className='p-3 text-red-700 uppercase hover:opacity-75'
                                        onClick={()=>handleDelete(index)}>
                                        Delete
                                    </button>
                                </div>
                            )
                        })
                    }
                    {/* for showing error */}
                    {
                        error.status ? <p className='text-red-700' >{error.message}</p> : ''
                    }
                    <button
                        disabled={creating || uploading} 
                        className='p-3 bg-slate-700 text-white 
                        rounded-lg uppercase hover:opacity-95'>
                        {
                            creating ? 'Creating...' : 'Create Listing'
                        }
                    </button>
                    
                </div>
            </form>
        </main>
    </>
  )
}

export default CreateListing

// const handleImageSubmit = (e)=>{
//     if(files.length > 0 && files.length < 7){
//         const promises = []
//         for( let i=0; i < files.length ; i++){
//             promises.push(storeImage(files[i]))
//         }
//         Promise.all(promises).then((urls)=>{
//             setFormData({...formData,imageUrls: formData.imageUrls.concat(urls)});
//         })
//     }
// }

// const storeImage = async (file)=>{
//     return new Promise((resolve,reject)=>{
//         const storage = getStorage(app)
//         const filename = new Date().getTime() + file.name
//         const storageRef = ref(storage,filename)
//         const uploadTask = uploadBytesResumable(storageRef,file)

//         uploadTask.on(
//             "state_changed",
//             (snapshot)=>{
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//                 console.log(`Upload ${[progress]}`);
//             },
//             (error)=>{
//                 reject(error)
//             },
//             ()=>{
//                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
//                     resolve(downloadURL)
//                 });
//             }
//         )
//     })
// }
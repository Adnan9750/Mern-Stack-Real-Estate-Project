import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

const SearchList = () => {

    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [searchListing,setSearchListing] = useState([])
    const [showMore,setShowMore] = useState(false)
    const [sideBarData,setSideBarData] = useState({
        searchTerm:'',
        type:'all',
        offer:false,
        parking:false,
        furnished:false,
        sort:'createdAt',
        order:'desc'
    })

    const handleChange = (e) =>{
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
            setSideBarData({
                ...sideBarData,
                type: e.target.id
            })
        }
        if(e.target.id === 'searchTerm'){
            setSideBarData({
                ...sideBarData , searchTerm:e.target.value
            })
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSideBarData({
                ...sideBarData ,
                // in below line first e-target.checked means value is true (boolean type)
                // and in second e-target.checked means value is true (in string true)
                // so that if value true in is boolean or string it does give any error.
                [e.target.id] : e.target.checked
                // [e.target.id] : e.target.checked || e.target.checked === 'true' ? 'true' : 'false' 
            })
        }
        if(e.target.id === 'sort_order'){
            // here we split value to specify sort and order
            const sort = e.target.value.split('_')[0] || 'createdAt'
            const order = e.target.value.split('_')[1] || 'desc'
            setSideBarData({...sideBarData , sort , order})
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()   
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm',sideBarData.searchTerm)
        urlParams.set('type',sideBarData.type)
        urlParams.set('parking',sideBarData.parking)
        urlParams.set('furnished',sideBarData.furnished)
        urlParams.set('offer',sideBarData.offer)
        urlParams.set('sort',sideBarData.sort)
        urlParams.set('order',sideBarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }
    // show more listing after click on (Show More) button
    const ShowMoreListing = async () =>{
        const numberOfListing = searchListing.length;
        const startIndex = numberOfListing
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('startIndex',startIndex)
        const searchQuery = urlParams.toString()
        const res = await axios(`https://mern-real-estate-fpt2.onrender.com/api/listing/search?${searchQuery}`)
        if(res.data < 9){
            setShowMore(false)
        }
        setSearchListing([...searchListing,...res.data])
    }
    // we use this useEffect because in upper search input what word we are searching for in not shown
    // that word in left side left search input and also for search according to we user want to search 
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')
        
        if(
            searchTermFromUrl || 
            typeFromUrl || 
            parkingFromUrl || 
            furnishedFromUrl ||
            sortFromUrl ||
            orderFromUrl ||
            offerFromUrl
        ){
            setSideBarData({
                searchTerm:searchTermFromUrl,
                type:typeFromUrl || 'all',
                parking:parkingFromUrl === true ? true : false,
                furnished:furnishedFromUrl === true ? true : false,
                offer:offerFromUrl === true ? true : false,
                sort:sortFromUrl || 'createdAt',
                order:orderFromUrl || 'desc'
            })
        }
        // fetch listing data according to search (query string)
        const fetchSearchListings = async () =>{
            setLoading(true)
            setShowMore(false)
            const searchQuery = urlParams.toString()
            const res = await axios(`https://mern-real-estate-fpt2.onrender.com/api/listing/search?${searchQuery}`)
            if(res.data.length > 8){
                setShowMore(true)
            }else{
                setShowMore(false)
            }
            setSearchListing(res.data)
            setLoading(false)
            // console.log(res.data);
        };

        fetchSearchListings()

    },[location.search])

  return (
    <>
     <div className='flex flex-col sm:flex-row absolute mt-5'>
        <div className='p-7 my-10 border-b-2 sm:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input 
                        type='text'
                        id='searchTerm'
                        placeholder='Search...'
                        className='border rounded-lg p-3 w-full'
                        value={sideBarData.searchTerm}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <label className='font-semibold'>Type :</label>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='all'
                            className = 'w-5'
                            onChange={handleChange}
                            checked={sideBarData.type === 'all'}
                        />
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='rent'
                            className = 'w-5'
                            onChange={handleChange}
                            checked={sideBarData.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='sale'
                            className = 'w-5'
                            onChange={handleChange}
                            checked={sideBarData.type === 'sale'}
                        />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='offer'
                            className = 'w-5'
                            onChange={handleChange}
                            checked={sideBarData.offer}
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='parking'
                            className = 'w-5'
                            onChange={handleChange}
                            checked={sideBarData.parking}
                        />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='furnished'
                            className = 'w-5'
                            onChange={handleChange}
                            checked={sideBarData.furnished}
                        />
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                        <select id='sort_order'
                            className='border rounded-lg p-3'
                            onChange={handleChange}
                            defaultValue={'createdAt_desc'}
                        >
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                </div>
                <button className='bg-slate-700 text-white text-center p-3 
                        rounded-lg uppercase font-semibold'>
                    Search
                </button>
            </form>
        </div>
        {/* listings show section */}
        <div className='flex-1 my-10'>
            <h1 className='text-3xl text-slate-700 font-semibold p-3 mt-5'>Listing Results:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {
                    !loading && searchListing.length === 0 && (
                        <p className='text-xl text-slate-700'>No List Found</p>
                    )
                }
                {
                    loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                    )
                }
                {/* for showing listing item (cards) */}
                {
                    !loading && searchListing && searchListing.map((listing_item)=>(
                            <ListingItem key={listing_item._id} listing={listing_item}/>
                        ))
                }
                {
                    showMore && (
                        <button onClick={ShowMoreListing}
                        className='text-green-700 hover:underline mt-2 font-semibold text-lg w-full text-center'>
                            Show More
                        </button>
                    )
                }
            </div>
        </div>
     </div> 
    </>
  )
}

export default SearchList

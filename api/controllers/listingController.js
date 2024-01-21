import ListingModel from "../models/listingModel.js"

// create a new list and store in database
export const createListing = async (req,res)=>{
    try {
            
            //     // const imageUrls = req.files['imagesUrls'].filename 
                // const imageUrls = req.files['imageUrls'].map((file) => file.filename);
                
            const listing = await ListingModel.create(req.body);
            return res.status(200).json(listing)
        
    } catch (error) {
        res.json(error)
    }
}

// delete specific list data from database
export const deleteListing = async (req,res) =>{
    try {
        const listing = await ListingModel.findById(req.params.id)

        if(!listing){
            return res.status(404).json('No Listing found')
        }

        if(req.user.userId !== listing.userRef){
            return res.status(401).json("Unauthorized access you can't delete anything")
        }

        await ListingModel.findByIdAndDelete(req.params.id)
        return res.status(200).json('Listing deleted successfully')    

    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server Error');
    }   
}

// update specific list data
export const updateListing = async (req,res) =>{
    const listing = await ListingModel.findById(req.params.id)
    if(!listing){
        return res.status(404).json('Listing Not Found')
    }
    if(req.user.userId !== listing.userRef){
        return res.status(401).json('Unauthorized Access can only update your own listing')
    }
    const updatedListing = await ListingModel.findByIdAndUpdate(req.params.id, req.body,{new:true})
    return res.status(200).json(updatedListing)
}

// get specific list data
export const getListing = async (req,res,next) =>{
    try {
        const listing = await ListingModel.findById(req.params.id)
        if(!listing){
            return res.status(404).json('Listing Not Found')
        }
        return res.status(200).json(listing)   
    } catch (error) {
        next(error)
    }
}

export const searchListing = async (req,res,next) =>{
    try {
        // (parseInt) function convert string to number
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        // agr offer undefined ho ya false hmain sari list milain gi beshak us ma
        // offer true ho ya false but agr hm ny offer click kr lya (means true) than 
        // sirf wohi list ayn gi jn ma offer ho gi (means true)
        // $in operator ka use krny ka mtlb offer ma true ya false jo b data ho ga 
        // ya true ya false ya dano tra ka yh sn bj dy ga. 
        let offer = req.query.offer;
        if(offer === undefined || offer === false){
            offer = {$in: [false,true]}
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished === false){
            furnished = {$in:[false,true]}
        }

        let parking = req.query.parking;
        if(parking === undefined || parking === false){
            parking = {$in:[false,true]}
        }

        let type = req.query.type;
        if(type === undefined || type === 'all'){
            type = {$in:['sale','rent']}
        }
        // searchTerm means the word by which we want to search
        const searchTerm = req.query.searchTerm || '';
        // this sort means if we select low to high than showus according to that otherwise show 
        // us according to '-createdAt'
        const sort = req.query.sort || 'createdAt' ;
        // this desending or asending order
        const order = req.query.order || 'desc'

        const listing = await ListingModel.find({
            // here this $regex operator is used to search for the word in the name of listing 
            // this is search operator of mongoDB
            // $option: 'i' means case if i type word in lowerCase or upperCase i doesn't matter it search. 
            name:{$regex: searchTerm , $options: 'i'},
            offer,
            furnished,
            parking,
            type,
        }).sort({
            [sort]: order
        }).limit(limit).skip(startIndex)

        return res.status(200).json(listing)

    } catch (error) {
        next(error)
    }
}
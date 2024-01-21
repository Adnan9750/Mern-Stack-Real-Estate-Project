import express from 'express'
import { createListing, deleteListing, getListing, searchListing, updateListing } from '../controllers/listingController.js'
import { verifyUser } from '../utils/verifyUser.js'
const router = express.Router()

// router.use('/create',upload.fields([{name: 'imageUrls',maxCount:7}]))

router.post('/create',verifyUser,createListing)
router.delete('/delete/:id',verifyUser,deleteListing)
router.post('/update/:id',verifyUser,updateListing)
// yh single list js bndy ny login kr ky bnai ho gi us ko show krny ky lya ha
router.get('/getList/:id',getListing)

router.get('/search',searchListing)

export default router
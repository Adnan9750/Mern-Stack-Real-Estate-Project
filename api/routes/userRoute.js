import express from 'express'
import { deleteUser, getListing, getUser, resetPassword, sendUserPasswordResetEmail, updateUser } from '../controllers/userController.js'
import { verifyUser } from '../utils/verifyUser.js'
const router = express.Router()

// router.get('/test',(req,res)=>{
//     res.send('Assalam-u-Alaikum Pakistan')
// })
router.post('/update/:id',verifyUser,updateUser)
router.delete('/delete/:id',verifyUser,deleteUser)

router.get('/listing/:id',verifyUser, getListing)
// user ka data get ho ga jsy(username,email)
router.get('/:id',verifyUser,getUser)

router.post('/reset-password-email',sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token',resetPassword)

export default router
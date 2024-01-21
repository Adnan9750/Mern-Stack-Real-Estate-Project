import express from 'express'
import { googleSignIn, signin, signout, signup } from '../controllers/authController.js'
const router = express()

router.post("/signup",signup)
router.post("/signin",signin)
router.post("/google",googleSignIn)
router.get("/signout",signout)

export default router
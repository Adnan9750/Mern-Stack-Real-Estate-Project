import ListingModel from "../models/listingModel.js"
import UserModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'

// user update his account 
export const updateUser = async (req,res)=>{
    if(req.user.userId !== req.params.id){
        return res.status(401).json('Unauthorized access can only update your own account')
    }
    try {
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password,10)
        }

        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar
            }
        },{new:true})
        const {password, ...rest} = updatedUser._doc
        // const user = await UserModel.findByIdAndUpdate({_id:id},req.body,{new:true})
        res.status(200).json(rest)
    } catch (error) {
        res.json({'message':error})
    }
}

// user delete his account
export const deleteUser = async (req,res)=>{

    if(req.user.userId !== req.params.id){
        return res.status(401).json('Unauthorized access can only delete your own account')
    }
    await UserModel.findByIdAndDelete({_id:req.params.id})
    // Clear the access_token cookie
    res.clearCookie('access_token',{ httpOnly: true, secure: false })
    res.status(200).json('User has been Deleted')
}

// user get his listing 
export const getListing = async (req,res)=>{
    
    if(req.user.userId !== req.params.id){
        return res.status(401).json('Unauthorized access can only access your own listings')
    }

    const listings = await ListingModel.find({ userRef: req.params.id })
    return res.status(200).json(listings)
}
// user ka data send ho ga
export const getUser = async (req,res,next)=>{
    try {
        const user = await UserModel.findById(req.params.id)
        
        if(!user){
            return res.status(404).json('User not found')
        }
        
        const {password,...rest} = user._doc
        return res.status(200).json(rest)   

    } catch (error) {
        next(error)
    }
}
// forgot password email send part
export const sendUserPasswordResetEmail = async (req,res) => {
    const {email} = req.body
    if(email){
        const user = await UserModel.findOne({email: email})
        if(user){
            const secret = user._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({userId : user._id},secret,{expiresIn: '15m'})
            const link = `http://localhost:5173/resetpassword/${user._id}/${token}`
            
            const transportor = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user : process.env.NODEMAILER_EMAIL,
                    pass : process.env.NODEMAILER_PASS
                },
                tls:{
                    rejectUnauthorized:true,
                }
             })
            //  email send
            let info = await transportor.sendMail({
                from : process.env.NODEMAILER_EMAIL,
                to : user.email,
                subject : "Real Estate - Reset Password Link",
                html : `<a href="${link}" >Click Here</a> to reset your password`
            })

            res.status(200).json("Password Reset Email Sent... Please Check your email")

        }
    }else{
        res.status(200).json("No email exists")
    }
}

export const resetPassword = async (req, res) => {
    const {password,confirmPassword} = req.body
    const {id,token} = req.params
    const user = await UserModel.findById(id)
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try {
        jwt.verify(token,new_secret)
        if(password && confirmPassword){
            if(password !== confirmPassword){
                res.json("Password and Confirm Password Doesn't match")
            }else{
                const hashed_password = await bcrypt.hash(password,10)
                await UserModel.findByIdAndUpdate(user.id,{$set:{password:hashed_password}})
                res.status(200).json('Password Changed Successfully ')
            }      
        }else{
            res.json('All fields are required')
        }
    } catch (error) {
        
    }
}
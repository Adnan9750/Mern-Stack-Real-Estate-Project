import UserModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signup = async (req,res,next)=>{
    const {username,email,password} = req.body
    try {
    const salt = 10;
    const hashPassword = await bcrypt.hash(password,salt)
    const user = new UserModel({username,email, password:hashPassword})
        await user.save()
        res.status(201).json('User created successfully')
    } catch (error) {
        next(error)
    }
}

export const signin = async (req,res,next)=>{
    try {
        const {email,password} = req.body
        const validUser = await UserModel.findOne({email:email})

        if (validUser != null ){
            const matchPassowrd = await bcrypt.compare(password,validUser.password)

            if((validUser.email === email) && matchPassowrd){

                const jwttoken = jwt.sign ( {userId:validUser._id} , process.env.JWT_SECRET_KEY)
                // we should send without password so we remove by password and the rest of data
                const {password:password, ...rest} = validUser._doc;
                // (access_token) is my cookie name 
                res
                .cookie('access_token', jwttoken , { httpOnly: true, secure: false , SameSite: 'None'})
                .status(200)
                .json({"message":"Login Successfully","userData":rest});

            }else{
                return res.status(401).json('Invalid Credentials')
            } 
        }else{
            return res.status(404).json('User Not Found')
        }
    } catch (error) {
        next(error)
    }
}
// sign using google account
export const googleSignIn = async (req,res,next)=>{
    try {
        const user = await UserModel.findOne({email:req.body.email})
        if(user){
            const jwttoken = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY)
            const {password:password, ...rest} = user._doc
            res
                .cookie('access_token',jwttoken,{httpOnly:true , secure: false})
                .status(200)
                .json(rest)
        }else{
            // 'toString(36)' means that 0-9 digits and alphabets from a-z and slice(-8) means last 8 letters
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = await bcrypt.hash(generatePassword,10)
            const newUser = new UserModel({
                username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password:hashedPassword,
                avatar:req.body.photo
            })
            await newUser.save()
            const jwttoken = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY)
            const {password:password, ...rest} = user._doc
            res
                .cookie('access_token',jwttoken,{ httpOnly: true, secure: false })
                .status(200)
                .json(rest)
        }
    } catch (error) {
        next(error)
    }
}

export const signout = async (req,res)=>{
    res.clearCookie('access_token',{httpOnly:true,secure:false})
    res.status(200).json('User has been loged out')
}

import jwt from "jsonwebtoken";

export const verifyUser = (req,res,next) =>{
    const token = req.cookies.access_token;

    if(!token){
        return res.status(401).json('No token! Unauthorized User')
    }

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err) return res.status(401).json('Unauthorized User')

        // console.log('Decoded user:', user);

        // req.userID = user.userId,
        // req.user = {
        //     id: user.userid,
        // };
        
        req.user = user
        next()
    });

}
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
// import mongoose from 'mongoose'
import {connDB }from './db/connDB.js'
import userRouter from './routes/userRoute.js'
import authRouter from './routes/authRoute.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import listingrouter from './routes/listingRoute.js'
const port = process.env.PORT
import path from 'path'

app.use(express.urlencoded({
    extended:false
}))

// Database Connection
connDB()

const __dirname = path.resolve();

app.use(express.json())

// app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, // Allow cookies to be sent from the frontend
}));

app.use(cookieParser())

app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})

// Routes
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/listing',listingrouter)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
})



//Error handling
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})
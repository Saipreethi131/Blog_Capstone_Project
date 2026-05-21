import exp from 'express'
import {config} from 'dotenv'
import {connect} from 'mongoose'
import {userapp} from "./APIs/UserAPI.js"
import {authorapp} from "./APIs/AuthorAPI.js"
import {commonapp} from "./APIs/CommonAPI.js"
import {adminApp} from "./APIs/AdminAPI.js"
import cookieParser from "cookie-parser"
import cors from "cors"

config()
const app=exp()

let frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
if (frontendOrigin.endsWith('/')) {
  frontendOrigin = frontendOrigin.slice(0, -1);
}

app.use(cors({
  origin: (origin, callback) => {
    // If no origin (e.g. mobile apps, postman, server-to-server), allow it
    if (!origin) return callback(null, true);
    // Dynamically allow the request's exact origin to prevent CORS errors on Vercel/Render
    return callback(null, true);
  },
  credentials: true // allows cookies to be sent back and forth
}));


app.use(exp.json())
app.use(cookieParser())
app.use('/user-api',userapp)
app.use('/author-api',authorapp)
app.use('/common-api',commonapp)
app.use('/admin-api',adminApp)



//connect to database
const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("Database server connected")
        //assign port 
   const port=process.env.PORT || 5000
   app.listen(port,()=>console.log(`server listening on ${port}...`))

    }catch(err){
        console.log("error in DB connect",err)
    }
}
connectDB();

//******** ERROR HANDLING MIDDLEWARE*******/
//to handle invalid path
app.use((req,res,next)=>{
   // res.status(404).json({message:"Invalid path"}) 
    res.status(404).json({message:`path ${req.url} is invalid`}) 
})
//to handle errors
app.use((err,req,res,next)=>{
    
    console.log(err.name, err.code)
    if (err.code === 11000) {
        return res.status(400).json({message:"Email already exists"})
    }
    if(err.name==="ValidationError")
    {
       return res.status(400).json({message:err.message})
    }
    if(err.name==="CastError")
    {
       return res.status(400).json({message:err.message})
    }
    //server side errors
    res.status(500).json({message:err.message || "Server side errors"})
  
})

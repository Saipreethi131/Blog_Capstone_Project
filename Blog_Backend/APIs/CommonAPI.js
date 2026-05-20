import exp from 'express'
import {usermodel} from '../Models/UserModel.js'
import {hash,compare} from 'bcrypt'
import jwt from 'jsonwebtoken'
import {verifyToken} from "../Middleware/verifyToken.js"
import {upload} from "../config/multer.js"
import {uploadToCloudinary} from "../config/cloudinaryUpload.js"
const {sign}=jwt
export const commonapp =exp.Router()


//         *****Route for REGISTRATION *****
commonapp.post("/register", upload.single('profileImage'), async(req,res,next)=>{
    try {
        const newUser = req.body
        //check the role of user (only users and author can register not admin)
        let allowedroles=["user","author"]
        if(!allowedroles.includes(newUser.role))
        {
           return res.status(400).json({message:"Invalid Role"})
        }
        
        let profileImageUrl = "";
        if (req.file) {
            try {
                const uploadResult = await uploadToCloudinary(req.file.buffer);
                profileImageUrl = uploadResult.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload failed:", uploadError);
                return res.status(400).json({
                    message: "Profile image upload failed. The server's Cloudinary credentials might be invalid or expired. You can try registering without an image."
                });
            }
        }

        //hash password and replace normal password with hashed password
        newUser.password=await hash(newUser.password,12)
        
        //create new user document
        const newUserDoc = new usermodel({
            role: newUser.role,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: newUser.password,
            profileImageUrl: profileImageUrl
        })
        //save document
        await newUserDoc.save()
        //send res
        res.status(201).json({message:"User Created"})
    } catch (err) {
        next(err)
    }
})


//          **** ROUTE TO LOGIN *****
//login- submit credentials and get the token
commonapp.post("/login",async(req,res)=>{
    //get user credentials from body of t he request
    const {email,password}=req.body; //destructuring
    //find user by email
    const user=await usermodel.findOne({email:email});
    //if user not found
    if(!user)
    {
        return res.status(400).json({message:"Invalid Email"});
    }
    //Compare password
    const isMatched=await compare(password,user.password);
    //if passwords dont match
    if(!isMatched)
    {
        return res.status(400).json({message:"Invalid password"});
    }
    //create JWT TOKEN
    const signedtoken=sign({id:user._id,email:email,role:user.role},
        process.env.SECRET_KEY,
        {expiresIn:"1h"});
 //set Token to res header as httponly cookie
 res.cookie("token",signedtoken,{
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
 });
 //remove password from the user document before sending the response
 let userobj=user.toObject();
 delete userobj.password;
 res.status(201).json({message:"Login succesfull",payload:userobj})
})



//  ***ROUTE FOR LOGOUT ***
//logout -delete the token
//synchronous function (no asynchronous operations)
commonapp.get("/logout",(req,res)=>{
    //delete the token from cookie storage
    res.clearCookie("token",{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax"
    })
    //send res
    res.status(200).json({message:"Logout Success"})
});


//       ****** CHANGE PASSWORD ******
commonapp.put("/password",verifyToken("user","author","admin"),async(req,res)=>{
    //check current password and new password are same
    const {currentpassword,newpassword}=req.body
    //if passwords matched 
    if(currentpassword === newpassword)
    {
        return res.status(400).json({message:"Current and new password cant be the same"});
    }
    //get current password of user/author/admin
    const useremail=req.user.email

    const userdocument = await usermodel.findOne({email:useremail})
    const currhashpassword = userdocument.password
    //check the current password of req and user are not same
    //Compare password
    const isMatched=await compare(currentpassword,currhashpassword);
    //if passwords dont match
    if(!isMatched)
    {
        return res.status(400).json({message:"Invalid password"});
    }
    //hash new password
    const hashnewpassword =await hash(newpassword,12)
    //replace current password of user with hashed new password
    userdocument.password = hashnewpassword
    //save
    await userdocument.save()
    const safeUser = userdocument.toObject()
    delete safeUser.password
    //send res
    res.status(200).json({message:"Password Updated successfully",payload:safeUser})
})

//  ***ROUTE FOR AUTH CHECK ***
commonapp.get("/check-auth", verifyToken("user", "author", "admin"), async (req, res, next) => {
    try {
        const user = await usermodel.findById(req.user.id).select("-password").lean()
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ message: "Authenticated", payload: user })
    } catch (err) {
        next(err)
    }
})

//  ***ROUTE FOR FORGOT PASSWORD ***
commonapp.post("/forgot-password", async (req, res, next) => {
    try {
        const { email, newpassword } = req.body
        if (!email || !newpassword) {
            return res.status(400).json({ message: "Email and new password are required" })
        }
        const userdocument = await usermodel.findOne({ email: email })
        if (!userdocument) {
            return res.status(404).json({ message: "User not found with this email" })
        }

        // Hash new password
        const hashnewpassword = await hash(newpassword, 12)
        userdocument.password = hashnewpassword
        await userdocument.save()

        res.status(200).json({ message: "Password reset successfully" })
    } catch (err) {
        next(err)
    }
})


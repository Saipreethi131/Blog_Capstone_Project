import {Schema,model}from 'mongoose'

const userSchema= new Schema({
    firstName:{
        type:String,
        required:[true,'First name is required']
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:[true,"Email already existing"]
    },
    password:{
        type:String,
        required:[true,"Password Required"]
    },
    role:{
        type:String,
        enum:["user","author","admin"],
        //checks if the entered value falls in this category otherwise sends error
        required:[true,"{value} is an Invalid role"]
    },
    profileImageUrl:{
        type:String
    },
    isUserActive:{
        type:Boolean,
        default:true
    }
},{
        timestamps:true,
        versionKey:false,
        strict:"throw"
})

//create model
export const usermodel =model("user",userSchema)
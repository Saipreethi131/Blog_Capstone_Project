import {Schema,model,Types} from 'mongoose'

//comment:{comment:"",user:""}
const commentSchema=new Schema({
    user:{
        type:Types.ObjectId,
        ref:"user",
        required:[true,"User Id required"],
    },
    comment:
    {
        type:String,
        required:[true,"Add a comment"]
    }
});

const articleSchema =new Schema({
    author:{
        type:Types.ObjectId ,//reference of UserModel
        //ObjectId("54tgjkfn4568954340t549") //objectid and strings are different
        ref:"user" ,//name of the user model
        required:[true,"Author Id is required"],
    },
    title:{
        type:String,
        required:[true,"Title is required"]
    },
    category:{
        type:String,
        required:[true,"category is required"],
    },
    content:{
        type:String,
        required:[true,"category is required"],
    },
    likes:{
        type:[Types.ObjectId],
        ref:"user",
        default:[]
    },
    comments:[{type:commentSchema,default:[]}],
    isArticleActive:{
        type:Boolean,
        default:true
    },
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})


export const articleModel=model("article",articleSchema)
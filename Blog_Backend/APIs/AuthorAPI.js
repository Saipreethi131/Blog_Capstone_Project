import exp from 'express'
export const authorapp =exp.Router()
import {articleModel} from "../Models/ArticleModel.js"
import {usermodel} from "../Models/UserModel.js"
import {verifyToken} from "../Middleware/verifyToken.js"

// ********CREATE ARTICLE(protected route)*********
//since only author can create article

authorapp.post("/create",verifyToken("author"),async(req,res,next)=>{
    try {
        //get articleobj from client
        const articleobj=req.body

         //check author
        let author=await usermodel.findById(articleobj.author)
        if(!author)
        {
            return res.status(404).json({message:"Invalid Author"})
        }
       //console.log(author.email)
    /*to check if logged in author is only publishing the article 
      by comparing email id*/
        let user=req.user //decoded token (logged in user details)
        if(author.email!==user.email){
            return res.status(403).json({message:"You are not authorized"})
        }
        //create article document
        const articledoc =new articleModel(articleobj)
        //save
        await articledoc.save();
        //send res
        res.status(201).json({message:"Article published"})
    } catch(err) {
        next(err)
    }
})

//****** READ OWN ARTICLES ******
authorapp.get("/article",verifyToken("author"),async(req,res,next)=>{
    try {
        let authorIDoftoken =req.user?.id

        let articleslist = await articleModel.find({author:authorIDoftoken})
            .populate("author", "firstName lastName email profileImageUrl")
            .populate("comments.user", "firstName lastName email profileImageUrl")
        res.status(200).json({message:"Articles",payload:articleslist})
    } catch(err) {
        next(err)
    }
})

//***** UPDATE OWN ARTICLE ******
authorapp.put("/article",verifyToken("author"),async(req,res,next)=>{
    try {
        //get authorid form decoded token
        console.log(req.user)
        const authorid=req.user?.id;
        //get modified article from request 
        //destructured
        const {articleId,title,category,content}=req.body;
        const updatedArticle =await articleModel.findOneAndUpdate(
            {_id:articleId,author:authorid},
            {$set:{title,category,content}},
            {new:true},
        ).populate("author", "firstName lastName email profileImageUrl")
         .populate("comments.user", "firstName lastName email profileImageUrl")
        if(!updatedArticle)
        {
            return res.status(403).json({message:"Not authorized to edit article"})
        }
        //send res
        res.status(200).json({message:"Article UPDATED",payload:updatedArticle})
    } catch(err) {
        next(err)
    }
})

// ******DELETE or RESTORE ARTICLE BY ID****

authorapp.patch("/article",verifyToken("author"),async(req,res,next)=>{
    try {
        //get author id from decoded token
        const authorid=req.user?.id;
        const {articleId,isArticleActive}=req.body
        //get article by id
        const articleOfDB =await articleModel.findOne({
            _id:articleId,author:authorid })
        if(!articleOfDB)
        {
            return res.status(404).json({message:"Article not found"})
        }
        //check status
        if(isArticleActive===articleOfDB.isArticleActive){
            return res.status(200).json({message:"Article already in same state"})
        }
        articleOfDB.isArticleActive=isArticleActive 
        await articleOfDB.save()

        const populatedArticle = await articleModel.findById(articleOfDB._id)
            .populate("author", "firstName lastName email profileImageUrl")
            .populate("comments.user", "firstName lastName email profileImageUrl")

        res.status(200).json({message:"Article Modified",payload:populatedArticle})
    } catch(err) {
        next(err)
    }
})
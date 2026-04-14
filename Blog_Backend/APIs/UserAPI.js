import exp from 'express'
export const userapp =exp.Router()
import {articleModel} from "../Models/ArticleModel.js"
import {verifyToken} from "../Middleware/verifyToken.js"

//***** READ ARTICLES OF ALL AUTHORS *****
userapp.get("/articles",verifyToken("user"),async(req,res)=>{
    //read articles 
    let articleslist = await articleModel.find({isArticleActive:true})
    //send res
    res.status(200).json({message:"Articles",payload:articleslist})
})

//***** ADD COMMENT TO AN ARTICLE *****
userapp.put("/article",verifyToken("user"),async(req,res)=>{
    //get req from body
    const {articleId,comment}=req.body
    let article = await articleModel.findOne({_id:articleId,isArticleActive:true})
    if(!article)
    {
        return res.status(400).json({message:"Article not found"})
    }
    //get user ID
    const userId = req.user.id
    //add comment to comments array of article document
    article.comments.push({user:userId,comment:comment})
    //save
    await article.save();
    //send res
    res.status(200).json({message:"Comment added successfully"})
})








/* Two types Of Attack
1.Crosssite Scripting XSS
2.CSRF request */
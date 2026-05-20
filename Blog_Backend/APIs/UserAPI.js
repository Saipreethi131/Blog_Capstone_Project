import exp from 'express'
export const userapp =exp.Router()
import {articleModel} from "../Models/ArticleModel.js"
import {verifyToken} from "../Middleware/verifyToken.js"

//***** READ ARTICLES OF ALL AUTHORS *****
userapp.get("/articles",verifyToken("user"),async(req,res,next)=>{
    try {
        //read articles populated with comments' users and author
        let articleslist = await articleModel.find({isArticleActive:true})
            .populate("author", "firstName lastName email profileImageUrl")
            .populate("comments.user", "firstName lastName email profileImageUrl")
        //send res
        res.status(200).json({message:"Articles",payload:articleslist})
    } catch(err) {
        next(err)
    }
})

//***** READ SINGLE ARTICLE BY ID *****
userapp.get("/article/:id",verifyToken("user","author"),async(req,res,next)=>{
    try {
        const {id}=req.params
        let articleObj = await articleModel.findOne({_id:id,isArticleActive:true})
            .populate("author", "firstName lastName email profileImageUrl")
            .populate("comments.user", "firstName lastName email profileImageUrl")
        if(!articleObj)
        {
            return res.status(404).json({message:"Article not found"})
        }
        res.status(200).json({message:"Article",payload:articleObj})
    } catch(err) {
        next(err)
    }
})

//***** ADD COMMENT TO AN ARTICLE *****
userapp.put("/article",verifyToken("user"),async(req,res,next)=>{
    try {
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
    } catch(err) {
        next(err)
    }
})

//***** TOGGLE LIKE ON AN ARTICLE *****
userapp.put("/article/like", verifyToken("user", "author", "admin"), async (req, res, next) => {
    try {
        const { articleId } = req.body
        const userId = req.user.id
        
        let article = await articleModel.findOne({ _id: articleId, isArticleActive: true })
        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }
        
        // Initialize likes array if undefined (backward compatibility)
        if (!article.likes) {
            article.likes = []
        }
        
        const userIndex = article.likes.indexOf(userId)
        let message = ""
        
        if (userIndex === -1) {
            article.likes.push(userId)
            message = "Article liked successfully"
        } else {
            article.likes.splice(userIndex, 1)
            message = "Article unliked successfully"
        }
        
        await article.save()
        
        // Populate and return updated details
        const updatedArticle = await articleModel.findById(articleId)
            .populate("author", "firstName lastName email profileImageUrl")
            .populate("comments.user", "firstName lastName email profileImageUrl")
            
        res.status(200).json({ message, payload: updatedArticle })
    } catch (err) {
        next(err)
    }
})

/* Two types Of Attack
1.Crosssite Scripting XSS
2.CSRF request */
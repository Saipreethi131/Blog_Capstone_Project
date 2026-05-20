//***** READ ALL USERS AND AUTHORS (EMAIL) *****
import exp from 'express'
export const adminApp=exp.Router()
import {usermodel} from '../Models/UserModel.js'
import {verifyToken} from '../Middleware/verifyToken.js'

adminApp.get('/users',verifyToken('admin'),async(req,res,next)=>{
	try {
		const usersAndAuthors = await usermodel
			.find({role:{$in:['user','author']}},{email:1,firstName:1,lastName:1,role:1,isUserActive:1})
			.lean()
		res.status(200).json({message:'Users and authors',payload:usersAndAuthors})
	} catch(err) {
		next(err)
	}
})

adminApp.patch('/user-status',verifyToken('admin'),async(req,res,next)=>{
	try {
		const {email,isUserActive} = req.body

		const userOrAuthor = await usermodel.findOne({
			email:email,
			role:{$in:['user','author']}
		})

		if(!userOrAuthor)
		{
			return res.status(404).json({message:'User/Author not found'})
		}

		if(userOrAuthor.isUserActive===isUserActive)
		{
			return res.status(200).json({message:'User already in same state'})
		}

		userOrAuthor.isUserActive=isUserActive
		await userOrAuthor.save()

		res.status(200).json({message:'User status updated',payload:{email:userOrAuthor.email,isUserActive:userOrAuthor.isUserActive}})
	} catch(err) {
		next(err)
	}
})
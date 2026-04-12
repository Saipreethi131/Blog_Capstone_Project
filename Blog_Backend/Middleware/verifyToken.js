import jwt from 'jsonwebtoken'
const {verify}=jwt
import {config} from 'dotenv'
config()

//verifyToken is a function that returns the middleware
/*it takes role as the argument and checks both role and 
validity of token*/
export const verifyToken=(...allowedroles)=>{
    return(req,res,next)=>{
         try{
        //get token from cookie
        const token=req.cookies?.token;
        //check token existed or not
        if(!token)
        {
            return res.status(401).json({message:"please login First"})
        }
        //validate token(decode the token)
        let decodedtoken =verify(token,process.env.SECRET_KEY);

        //check if the role is same as role in decodedtoken
        if(!allowedroles.includes(decodedtoken.role)){
            return res.status(403).json({message:"You are not authorized"})
        }

        //add decoded token
        req.user=decodedtoken;
      // console.log(decodedtoken)
        next();
    }catch(err){
        res.status(401).json({message:"Invalid token"})
    }
    }
}
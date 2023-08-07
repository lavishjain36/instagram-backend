const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../keys.js");
const mongoose=require("mongoose");

//import user Model from MongoDB
const User=mongoose.model("User");


//Middleware function for authentication and authorization
const authenticateUser=async(req,res,next)=>{
    try {
        //extract the authorization header from the request
        const {authorization}=req.headers;
        //check if the authorization header is missing or incorrect
        if(!authorization||!authorization.startsWith("Bearer ")){
            return res.status(401).json({error:"You are not Authorized User.Please Logged in First"})
        }

        //Extract JWT token from authorized header by removing and replaced with token
        const token=authorization.replace("Bearer ","");

        //verify the jWT token using JWT_SECRET Key
        const payload=await jwt.verify(token,JWT_SECRET);

        //Extract the id ->use id from token payload
        const {_id}=payload;

        //query for mongodb database to find the user with extracted _id
        const userdata=await User.findById(_id);

        //if the user is not found->
        if(!userdata){
            return res.status(401).json({error:"You are not authorized user.You must login first "})
        }

        req.user=userdata;

        //call next function to proceed with next middleware in path or router handlers
        next();

    } catch (error) {
        return res.status(401).json({error:"You must loggedin first."})
    }
}


module.exports=authenticateUser;
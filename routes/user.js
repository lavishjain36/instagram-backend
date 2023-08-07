const express=require('express');
const router=express.Router();
const mongoose=require("mongoose");
const User=mongoose.model("User");
const bcrypt=require('bcryptjs');//import of bcrypt
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require("../keys.js");
const authenticateUser = require('../middleware/loginCheck.js');


// router.get('/restricted',authenticateUser,(req,res)=>{
//     //any logic that comes under will not execute
//     res.send("<h1>Hello People<h1>");
// })


// router.get('/about',(req,res)=>{
//     console.log("About Page");
//     res.send("About Page")
// })


//Router to handle http request-post for signup
router.post("/signup",(req,res)=>{
    // extract name,email and password  and req.body 
    const {name,email,password}=req.body;
    if(!email||!password||!name){
        return res.status(422).json({error:"Please add all parameter as required."})
    }
    //check if user already exist with same email id -in db

    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User is already exist in the Database with this email."})
        }
        //if the user doesn't available in db, store the user in db with 
        //create a new instance of the user object 
        bcrypt.hash(password,15)
        .then(hashpassword=>{
            const user=new User({
                email,
                password:hashpassword,
                name
            });

            user.save()
            .then(user=>{
                res.json({message:"Registration Sucessfully completed"})
            }).catch(error=>{
                console.log(error)
            })
        }).catch(error=>{
            console.log(error)
        })
    })
})
        


//Router to handle http request-post for sign
router.post("/signin",authenticateUser,(req,res)=>{
    //get the email id and password from req.body
    const {email,password}=req.body;
    if(!email||!password){
        return res.status(422).json({error:"please include email id or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email id and password."})
        }
        //compare logic 
        //enter one password from req.body and another from db 
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //get the user details from the database 
                //create a JWT token as payload data with JWT_SECRET
                const token=jwt.sign({_id:savedUser},JWT_SECRET)  
                const {_id,name,email}=savedUser;
                // res.json({msg:"Login Successfully..."});
                res.json({token:token,user:{_id,name,email}});
            }else{
                return res.status(422).json({error:"Invalid emailid or password."})
            }
        }).catch(error=>{
            console.log(error);
        })
    }).catch(error=>{
        console.log(error);
    })
});

module.exports=router;
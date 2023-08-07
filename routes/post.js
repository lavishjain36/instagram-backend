const express=require("express");
const router=express.Router();
const mongoose=require('mongoose');
const authenticateUser = require("../middleware/loginCheck");
const Post=mongoose.model("Post");


//define a Get  route 
router.get('/allpost',(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .then(post=>{
        res.json({post});
    }).catch(error=>{
         console.log(error);
    })
})


//Create an endpoints->createpost->
router.post("/createpost",authenticateUser,(req,res)=>{

    //extract  the title body and photo from the req.body
    const {title,body,pic}=req.body;

    //check if all fields are present in req.body or not
    if(!title||!body||!pic){
        return res.status(422).json({error:"Please fill all the fields."})
    }
    //create a new POst instance with data 
    //make password as undefined 
    req.user.password=undefined;
    
    const post=new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })

    //save the new post to the database
    post.save()
    .then(result=>{
        //send the newly created post a json response
        res.json({post:result})
    })
    .catch(error=>{
        console.log(error)
    })

})

//Routes which require the user to be logged in ->middleware
router.get("/mypost",authenticateUser,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost});
    }).catch(error=>{
        console.log(error)
    })
})

    

module.exports=router;
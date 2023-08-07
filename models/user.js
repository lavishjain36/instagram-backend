//design schema
//import mongoose libraray 
const mongoose=require('mongoose');

//create a mongoose schema with ->userSchema
const userSchema=new mongoose.Schema({
 
    //define the properties of 
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
})

//create a model name 'User' ->userSchema
mongoose.model("User",userSchema);
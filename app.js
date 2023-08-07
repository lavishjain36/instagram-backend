// import of modules and set up of the express application 
const  express=require("express");//import of express package
const app=express();//instance of express app
const mongoose=require("mongoose");
const cors=require("cors");
app.use(cors());//using middle cors in your app

const {MONGOURI}=require("./keys");

//port number
const PORT=5000;

//connect to mongodb using mongoose
mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

//add listener for mongodb connection with status
mongoose.connection.on('connected',()=>{
    console.log("Connection successfull to mongodb database....")
})

mongoose.connection.on('error',()=>{
    console.log("Error in connection to Mongodb Database",err)
})

//require and register Mongoose models


require('./models/user');
require('./models/post');
app.use(express.json());
app.use(require('./routes/user'))
app.use(require("./routes/post"))
mongoose.model('User');
mongoose.model('Post');

app.listen(PORT,()=>{
    console.log("Server is Listening on port :",PORT);
})
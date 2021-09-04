// require("dotenv").config();
const express= require("express");
const validator= require(("validator"));
const mongoose= require(("mongoose"));
const path= require("path");
const hbs= require("hbs");
const { json } =  require("express");
const bcrypt= require("bcryptjs");
const cookieParser= require("cookie-parser")
const auth = require("./src/middleware/auth")


//connecting to mongodb and requiring mongdb scheme 
require("../blogapp/src/db/conn")
const newUser= require("../blogapp/src/models/index")

const app= express();
// const staticPath= path.join(__dirname, "/public");
// console.log(staticPath);
// app.use("/login", express.static(staticPath));

// using hbs
const templatePath= path.join(__dirname, "/templates");

app.set("view engine", "hbs");
app.set("views", templatePath);

//for getting data
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

// console.log(process.env.SECRET_KEY)
//routes

app.get("/login" , (req,res)=>{
    res.render("views/login");
})

app.get("/profile",auth , (req,res)=>{
    res.render("views/profile",{
        profilename:`${req.user.username}`
    });
})

app.get("/logout",auth , (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((currentelement)=>{
            return currentelement.token !==req.token
        })
        res.clearCookie("loginjwt")
        req.user.save();
        console.log("Logout");
        res.redirect("/login");
        
    } catch (error) {
        res.status(500).send(err);
        
    }
})


app.get("/" , (req,res)=>{
    res.redirect("/login");
})

app.get("/signup" , (req,res)=>{
    res.render("views/signup");
})

app.get("/home",auth , (req,res)=>{
    res.render("views/index",{Name:`${req.user.username}`});
})

//create a new user in our database
app.post("/signup" ,async (req,res)=>{
    try{
        // console.log(req.body)
        const passwordHash = await bcrypt.hash(req.body.password, 4)
        const addUser= new newUser({
            name:req.body.fname,
            username:req.body.username, 
            email:req.body.email,
            password:passwordHash
        })
        //jwt token
        const token= await addUser.generateAuthToken();

        //adding token to cookies
        res.cookie("jwt",token, {
            // expires:
            httpOnly:true
        });
       

        const registered= await addUser.save()
        res.redirect("/login")
        // res.status(201).render("views/login")
        // res.send(req.body)
    }
    catch(err){
        console.log(err);
        res.status(401).send(err);
    }
})

//login a registered user
app.post("/login", async (req,res)=>{
    try{
        const email= req.body.email;
        const password= req.body.password;
        
        
        // console.log(`${email} and password is ${password}`)
        const userEmail= await newUser.findOne({email:email})
        const checkPassword= await bcrypt.compare(password,userEmail.password)

        const token= await userEmail.generateAuthToken();

        // console.log(token);

        //adding token to cookies
        res.cookie("loginjwt",token, {
            // expires:
            httpOnly:true
        });
        // console.log(res.cookie.loginjwt)  it will use in secret pages

        if (checkPassword){
            
            res.redirect("/home")
            // res.render("views/index")
        }else{
            res.send("Password is not correct")
        }
    }
    catch(err){
        res.status(401).send(err);
    }
    
})








// hashing using bcrypt

// const bcrypt= require("bcryptjs")

// const securePassword = async (password)=>{

//     const passwordHash= await bcrypt.hash(password, 4);
//     console.log(passwordHash);
// }

// securePassword("Harsh@123")









const port= 7000
app.listen(port, ()=>{
    console.log(`Server is created on port ${port}`)
})
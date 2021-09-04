const jwt= require("jsonwebtoken");
const newUser= require("../models/index")

const auth = async (req, res, next)=>{

    try{
         const token= req.cookies.loginjwt;
         const verifyUSer= jwt.verify(token,process.env.SECRET_KEY);
        //  console.log(verifyUSer);
        const user= await newUser.findOne({_id:verifyUSer._id});
        console.log(user)

        req.token= token;
        req.user= user;
         next();
    }
    catch(err){
        res.status(401).send(err);
    }
}

module.exports = auth;
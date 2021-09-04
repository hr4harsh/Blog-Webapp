require("dotenv").config();
const mongoose = require("mongoose");
const validator= require("validator")
const jwt= require("jsonwebtoken")

//schema
const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenth: 3,
        maxlength: 30
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true

    },
    date :{
        type: Date,
        default : Date.now
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]


})



//moddleware
//generating tokens
registerSchema.methods.generateAuthToken= async function(){
    try{
       
        const token= jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY );
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token

    }
    catch(err){
        console.log("the error is "+err);


    }
}

//models
const newUser= new mongoose.model("Users",registerSchema)

module.exports= newUser;
//mongo connect
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_CONNECT)
.then(()=>{console.log("Database connected successfully")})
.catch((err)=>{console.log(err)});
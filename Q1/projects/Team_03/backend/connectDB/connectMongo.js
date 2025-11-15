const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ quiet: true });
const MONGO_URI = process.env.MONGO_URI

const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("monogodb connected");
    }catch(err){
        console.log("mongodb connection failed" + err.message);  
    }
};

module.exports = connectDB;
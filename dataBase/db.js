const { log } = require('console');
const mongoose= require('mongoose');

const connectDB= async ()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/TranFi_Learning');
        console.log("Connected to the Database");
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {connectDB};
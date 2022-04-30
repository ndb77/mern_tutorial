const mongoose = require('mongoose')

// all mongoose methods will return a promise, which is why we use async
const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        // the colors package enables the terminal output to be in different colors
        console.log(`MongoDB CONNECTED: ${conn.connection.host}`.cyan.underline)
    }catch(error){
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB
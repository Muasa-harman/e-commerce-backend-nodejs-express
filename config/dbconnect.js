const { default: mongoose } = require("mongoose")
const dotenv = require('dotenv').config();

const dbconnect = () =>{
    try {
        const connect = mongoose.connect(process.env.MONGO_URL)
        console.log('db connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbconnect;
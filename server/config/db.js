const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../credentials/.env")}); //dir수정

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongoDB Connect: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB
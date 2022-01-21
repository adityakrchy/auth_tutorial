const mongoose = require("mongoose")
require("dotenv").config()
const mongoURL = process.env.mongoURL
mongoose.connect(mongoURL).then(() => {
    console.log("Connected to database")
}).catch(err => {
    console.log("Error: " + err)
})

module.exports = mongoose
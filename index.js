const express = require("express")
const app = express()
require("dotenv").config()
const authUser = require("./routes/auth")
const notes = require("./routes/notes")
const connectToDB = require("./connection")
const port = process.env.PORT || 3000

app.use(express.json())
app.use("/auth", authUser)
app.use("/notes", notes)

app.get("/", (req, res) => {
    res.json({message:"Hello World"})
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})
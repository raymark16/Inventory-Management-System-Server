const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const connectDB = require('./DBConn/dbConn')
const auth = require('./Routes/Auth')
//PORT Number
const port = process.env.PORT || 5000

//DB connection
connectDB()

//middleWare
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(cookieParser())
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')))

//Route
app.use('/', auth)


// Server Listen
app.listen(port, () => console.log(`Server running on port ${port}`))
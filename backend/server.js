const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()

const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')


// this is enabled through dotenv
// the PORT number is coming from the .env file 
const port = process.env.PORT || 5000

// brought in form the config folder
// this function makes the connection to mongoDB server using credentials within .env file
connectDB()
const app = express()

// an inbuilt express function that recognizes incoming Request objects as JSON objects
// middleware
// this allows us to use .json() on res and req within the goalController
app.use(express.json())

// inbuilt method that recognizes incoming request objects as strings or arrays
// middleware
app.use(express.urlencoded({extended:false}))

// Tells the app what to do when an API request is made on the app at the endpoint /api/goals
// Sends request to /goalRoutes
app.use('/api/goals',require('./routes/goalRoutes'))
app.use('/api/users',require('./routes/userRoutes'))


//Overwrites the errorHandler default settings
app.use(errorHandler)
app.listen(port,()=>console.log(`Server started on port ${port}`))

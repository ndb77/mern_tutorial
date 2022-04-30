// Middleware is a stack of functions that will execute whenever there 
// is a request made to the server

// Middleware can make changes to the request and response object

const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// goes to the outside folder first then navigates to userModel to set User = userModel.js
const User = require('../models/userModel')

// 
const protect = asyncHandler(async (req,res,next) => {
    let token


    // We can access the headers of the HTML file by using req.headers
    // We first check that an authorization header exists and that the authorization header starts with "bearer"
    // An authoriation header will be formatted as "Bearer authTokenInfo"
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Get token from header
            // split will split up the authorization by the space (' ')
            token = req.headers.authorization.split(' ')[1]
            //verify token
            // This uses the secret phrase to decrypt the token that is provided by the user
            // If the user provides a valid token, it will get decrypted 
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            // get user from the token and assign it to req.user
            // this enables us to use this req.user variable for all protected routes
            // we don't want req.user.password, so we are omitting that
            req.user = await User.findById(decoded.id).select("-password")
            //calling the next piece of middleware
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not Authorized')
        }
    }
    if(!token){
        res.status(401)
        throw new Error("No token, not authorized")
    }
})

module.exports = {protect};
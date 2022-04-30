// Endpoint for ../api/users

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
// @desc    Register user
// @route   POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req,res) =>{
    // these are variables that are required by User which is expected to be provided in the body
    const {name,email,password} = req.body
    if(!name||!email|!password){// if these things aren't included
        res.status(400) // bad request
        throw new Error("Please Add all Fields")
    }

    //check if user exists already
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new error("User Already Exists")
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    // the password comes from the form(POSTMAN)
    // the hash function uses the password and the salt(a randomly 10 char generated string) to create a hashed password
    // that can only be decrypted if a secret phrase is provided - the secret is the 
    const hashedPassword = await bcrypt.hash(password,salt)

    // create user
    // when the user is created, only the hashed password is stored
    // in order to generate a user, all 3 parts need to be present
    // Additionally an "Undefined error" will be thrown if the the name or email 
    // the hashed password is stored in the database, which means that even the database owners can't see the password
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    // if the user created is valid:
    // create a generated token for the user
    // the generatedToken contains the payload of the user's id
    if (user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid User Data")
    }
    res.json({message:'Register User'})
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public

// this matches the username and password
const loginUser =  asyncHandler(async (req,res) =>{
    

    // retrieving the email and password that are sent in the body of the request
    const {email,password} = req.body

    // Look in the User database and attempt to match the email in the body of the request 
    const user = await User.findOne({email})

    // takes the user data provided and tries to compare 
    // if :  if the hashed password matches the plain-text password (passed through the bcrypt function)
    // then : respond with the user information(id,name,email, and
    //      a generated token associated with the user id and password )
    // else: throw an error 
    if(user&&(await bcrypt.compare(password,user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            // see method below for generateToken
            // basically, it encrypts id and name using a secret key
            token: generateToken(user._id)
        })
    }else{{
        res.status(400)
        throw new Error("Invalid Credentials")
    }}
    res.json({message:'Login User'})
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private

const getMe =  asyncHandler(async (req,res) =>{
    // you can only access this route if the correct credentials were given
    // req.user was set in the authMiddleWare
    // User is the class that interacts with the mongoose database
    
    // without using the await function, it will provide access to the route but it will not be populated with anything
    // this is because the User function is retrieving information from the database, which takes time to respond to the database request
    
    const {_id,name,email} = await User.findById(req.user.id)
    res.status(200).json({
        id:_id,
        name,
        email,
    })
})


// @desc    Get user data
// @route   GET /api/users/me
// @access  Private

// Generate JWT token
const generateToken = (id) =>{
    // takes a payload(which is the data)
    // we set the payload of the JWT token and sign it with our secret key
    // this encrypts the message such that people can verify that it came from the server using our public key
    // however they cannot see the message itself
    // we can retrieve the payload information through the authMiddleware file when using jwt.verify()
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d',
    })
}


module.exports={
    registerUser,
    loginUser,
    getMe
}
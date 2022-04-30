
// mongoose database will return a promise
// either async/await or .then/.catch async programming can be used 
// here we use async/await, which requires us to have try/catch
// if we choose to use error handlers instead of try/catch, we can use express-async-handler
// this package wraps our async functions
// it is a simple function that just passes errors to the error handler
const asyncHandler = require('express-async-handler')

// sets the Goal object based on model in models/goalModel
// Goal is a mongoose object so it has special functions available to it through
// This is essentially the interface with the goals part database
const Goal = require('../models/goalModel')
const User = require("../models/userModel")
// @ desc Get goals
// @route GET /api/goals
// @access Private

const getGoal = asyncHandler(async(req,res) =>{
    // Goal is accessible from the Goal class above
    const goals = await Goal.find({user: req.user.id})//returning the whole database
    res.status(200).json(goals)
})
// @ desc Set goals
// @route POST /api/goals
// @access Private

// This accepts an object being sent by the app to the server
// what is accepted is held in req.body
// res.json is the response that is sent from the server to the app
const setGoal = asyncHandler(async(req,res) =>{

    // checking to see if there is any valid data sent
    // req.body.text is enabled through express.json() and express.urlencoded()
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
        // res.status(400).json({message:'Please add a text field'})
    }

    // This creates a new goal within the database
    // text is one of the required params of the Goal object(set by the goal_model)
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal)
})

// @ desc update goals
// @route UPDATE /api/goals/:id
// @access Private

const updateGoal = asyncHandler(async(req,res) =>{

    // look within the Goal database and search for goals that contain
    // the id provided from req.params.id(/:id within the api URL)
    const goal = await Goal.findById(req.params.id)

    // if it's not a null...
    if(!goal){
        res.status(400)
        throw new Error('goal not found')
    }

    const user = await User.findById(req.user.id)
    
    // checking for user
    if(!user){
        res.status(404)
        throw new Error('User not found')
    }

    // we don't want to allow other people to update each other's goals
    // therefore we want to check that goal user id is the same as the id that is logged in
    // making sure that the logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error("User not authorized")
    }

    // looks through the Goal database and updates the goal with the given id
    // new: if it doesn't exist, create it
    const updated_goal = await Goal.findByIdAndUpdate(req.params.id,req.body,{new: true})
    // respond with the updated goal using the .json package(provided from express.json() in the server.js file)
    res.status(200).json(updated_goal)
})
// @ desc delete goals
// @route DELETE /api/goals/:id
// @access Private

const deleteGoal = asyncHandler(async(req,res) =>{
    const goal = await Goal.findById(req.params.id)
    const user = await User.findById(req.user.id)
    
    // checking for user
    if(!user){
        res.status(404)
        throw new Error('User not found')
    }

    // we don't want to allow other people to update each other's goals
    // therefore we want to check that goal user id is the same as the id that is logged in
    // making sure that the logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error("User not authorized")
    }

    if(!goal){
        res.status(400)
        throw new Error('goal not found')
    }
    
    await goal.remove() // findByIdAndDelete(id, data to return,{new:true})
    res.status(200).json(
        {
            message:'Deleted Goal',
            id: req.params.id
        })
})


// This allows you to pass functions from goalController to other areas of the project
// These functions below are being used by goalRoutes in router.get('url',function)
module.exports = {
    getGoal,
    setGoal,
    updateGoal,
    deleteGoal
}


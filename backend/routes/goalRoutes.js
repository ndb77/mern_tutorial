
const express = require('express')
const {protect} = require("../middleware/authMiddleware")

//
const router = express.Router()

// comes from the goalController
// these functions process the request and provide a response
const {getGoal,setGoal,updateGoal,deleteGoal} = require('../controllers/goalController')


// CRUD: Create, Read, Update, Delete


//Tells the app how to handle a POST request - CREATE
router.post('/',protect,setGoal)

//Tells the app how to handle a GET request -  READ
// use the information from the GET request in the getGoal function found in goalController
//when the api request is '/' and a GET request, respond with whatever getGoal responds with 
router.get('/',protect,getGoal)

//Tells the app how to handle a UPDATE request, requires id to update - UPDATE
router.put('/:id',protect,updateGoal)

//Tells the app how to handle a DELETE request
router.delete('/:id',protect, deleteGoal)

module.exports = router

const express = require('express')
const router = express.Router()
//sending request to userController
const{registerUser, loginUser, getMe} = require('../controllers/userController')

const {protect} = require("../middleware/authMiddleware")
// adding a user
router.post('/',registerUser)

//
router.post('/login',loginUser)


router.get('/me',protect,getMe)

module.exports = router
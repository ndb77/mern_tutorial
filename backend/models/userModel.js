const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name']
    },
    email:{
        type: String,
        required: [true, 'Please add an e-mail'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Please enter your password']
    },
},{
    timestamps: true
})

module.exports = mongoose.model('User',userSchema)
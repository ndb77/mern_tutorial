const mongoose = require('mongoose')

// Defines what a goal should look like
const goalSchema = mongoose.Schema(
    {
        user:{
            // creates one of those gibberish _ids
            type: mongoose.Schema.Types.ObjectId,
            required: true,

            // sets User as the reference
            // this way, every goal will be associated with a User
            ref: 'User',
        },
        text: {
            type: String,
            required: [true,'Please add a text value']
        }
    },
    {
        //mongodb automatically fills this part in
    timestamps: true
})

module.exports = mongoose.model('Goal',goalSchema)
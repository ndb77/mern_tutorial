

//
const errorHandler = (err,req,res,next) => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)

    res.json({
        message: err.message,

        // the stack is returned only if the .env NODE_ENV is set to production
        stack: process.env.NODE_ENV === 'production' ? null: err.stack
    })
    
}

module.exports = {
    errorHandler,
}
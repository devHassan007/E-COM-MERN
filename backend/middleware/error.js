const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Wrong Mongodb Id Error
    if(err.name === "CastError"){
        const message = `Resource not found. InValid_Id ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //Handling Mongoose Validation Error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }
    //JsonWebToken Error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid. Try Again!!!`;
        err = new ErrorHandler(message,400);
    }
    //JsonWebToken Expired Error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is expired. Try Again!!!`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({ // Corrected this line
        success: false,
        message: err.message, //or we can use here the stack keyword which will tell use where the error occure
    });
};

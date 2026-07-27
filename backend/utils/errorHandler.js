class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent class's constructor
        this.statusCode = statusCode;

        // Captures the current stack trace and associates it with this error object
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;


//Error is the built in Node class for the error
//super is the constructor of the class Error with which we inherate

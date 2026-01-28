class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = ErrorHandler

// NOTE: If you don't use Error.captureStackTrace, you will get unnecessary stack traces in your error logs. Which is not very useful for debugging.
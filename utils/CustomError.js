import i18next from 'i18next';

class CustomError extends Error {
    constructor(statusCode, messageKey, language = 'en') {
        // Fetch the translated message using i18next based on the language
        const message = i18next.t(messageKey, { lng: language });
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = true; // Mark as operational error
        Error.captureStackTrace(this, this.constructor); // Capture stack trace
    }
}

class NotFoundError extends CustomError {
    constructor(messageKey = 'errors.resourceNotFound', language = 'en') {
        super(404, messageKey, language);
    }
}

class ValidationError extends CustomError {
    constructor(messageKey = 'errors.invalidInput', language = 'en') {
        super(400, messageKey, language);
    }
}

class InternalServerError extends CustomError {
    constructor(messageKey = 'errors.internalServerError', language = 'en') {
        super(500, messageKey, language);
    }
}

export { CustomError, NotFoundError, ValidationError, InternalServerError };

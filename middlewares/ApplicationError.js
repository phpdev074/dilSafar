
class ApplicationError extends Error {
    constructor(message, { httpCode = 500, originalError = null, ...additionalInfos } = {}) {
        super(message);
        this.name = 'ApplicationError';
        this.httpCode = httpCode;
        this.originalError = originalError;
        this.additionalInfos = additionalInfos;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApplicationError);
        }
    }
}

export default ApplicationError;

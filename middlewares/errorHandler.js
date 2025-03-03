import mongoose from 'mongoose';

import { sendResponse } from '../utils/responseHelper.js';
import ApplicationError from './ApplicationError.js';

export function handleErrors(err, req, res, next) {
    console.error('Error message:', err.message); // Log the error message
    console.error('Error stack:', err.stack);     // Log the error stack trace

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return sendResponse(req,res, 400, false, 'Invalid JSON format');
    }

    if (err instanceof mongoose.Error.ValidationError) {
        // Extract and format validation errors
        const errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
        // Create a consolidated error message
        const message = errors.map(e => `${e.field} is required`).join(', ');
        return sendResponse(req, res, 422, false, message, errors);
    }

    if (err instanceof mongoose.Error.CastError) {
        return sendResponse(req, res, 400, false, 'Invalid data type', { message: err.message });
    }


    if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return sendResponse(req,res, 404, false, 'Document not found', { message: err.message });
    }

    if (err instanceof ApplicationError) {
        return sendResponse(req, res, err.httpCode, false, err.message, {
            originalError: process.env.NODE_ENV === 'development' ? err.originalError : undefined,
            ...err.additionalInfos
        });
    }

    // For other types of errors
    return sendResponse(req,res, 500, false, 'An unexpected error occurred', {
        originalError: process.env.NODE_ENV === 'development' ? err : undefined
    });
}
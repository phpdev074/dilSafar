import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/responseHelper.js";

export const authJwt = async (req, res, next) => {
    try {
        if (!req.header("Authorization")) {
            return sendResponse(req, res, 401, "Please_authenticate", {});
        }
        const token = req.header("Authorization").replace("Bearer ", "");

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded",decoded)
        req.user = decoded;

        next();

    } catch (error) {
        console.error("JWT Verification Error:", error);

        // Check if error is an instance of jwt errors
        if (error instanceof Error && jwt && jwt.ExpiredJwtError) {
            if (error instanceof jwt.ExpiredJwtError) {
                return sendResponse(req, res, 401, "token_expired", {});
            }

            if (error instanceof jwt.JsonWebTokenError) {
                return sendResponse(req, res, 401, "invalid_token", {});
            }

            if (error instanceof jwt.NotBeforeError) {
                return sendResponse(req, res, 401, "token_not_active", {});
            }
        }

        // Default fallback for unknown errors
        return sendResponse(req, res, 401, "enter_valid_token", {});
    }
}

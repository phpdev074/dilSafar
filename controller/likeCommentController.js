import mongoose from "mongoose";
import models from "../models/index.js"
import { sendResponse } from "../utils/responseHelper.js"
import { postServices } from "../services/postServices.js";

export const LikeCreate = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { postId } = req.body;

        const existingLike = await models.Like.findOne({ userId, postId });

        if (existingLike) {
            const reponse = await models.Like.findOneAndDelete({ userId, postId })
            return sendResponse(req, res, 400, "You unliked this post", reponse);
        }

        await models.Like.create({ userId, postId });

        const mathcData = {
            _id: new mongoose.Types.ObjectId(postId)
        }

        const responseData = await postServices(userId, mathcData)

        return sendResponse(req, res, 200, "You liked this post", responseData[0]);
    } catch (error) {
        next(error);
    }
};


export const getListPostLike = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const mathcData = {
            _id: new mongoose.Types.ObjectId("67b5698de5a32ec130a86c6e")
        }
        const response = await postServices(userId, mathcData)
        return sendResponse(req, res, 200, "liked this post", response);
        // res.json(response);
    } catch (error) {
        next(error);
    }
};



export const commentCreate = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { postId, content } = req.body;

        await models.Comment.create({ userId, postId, content });

        const mathcData = {
            _id: new mongoose.Types.ObjectId(postId)
        }

        const responseData = await postServices(userId, mathcData)

        return sendResponse(req, res, 200, "You commented this post", responseData[0]);
    } catch (error) {
        next(error);
    }
};

export const getComments = async (req, res, next) => {
    try {
        const { postId, page = 1, limit = 10 } = req.query;

        if (!postId) {
            return sendResponse(req, res, 400, "postId is required");
        }
        
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        const skip = (pageNumber - 1) * pageSize;

        const response = await models.Comment.find({ postId })
            .populate({ path: "userId", select: "name image" })
            .skip(skip) 
            .limit(pageSize); 

        const totalComments = await models.Comment.countDocuments({ postId });

        const totalPages = Math.ceil(totalComments / pageSize);

        return sendResponse(req, res, 200, "Comments retrieved successfully", {
            totalComments,
            totalPages,
            currentPage: pageNumber,
            pageSize: pageSize,
            comments: response,
        });

    } catch (error) {
        next(error);
    }
}
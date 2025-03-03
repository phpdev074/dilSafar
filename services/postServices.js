import mongoose from "mongoose";
import models from "../models/index.js";

export const postServices = async (userId, matchData, page = 1, limit = 10) => {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    return await models.Post.aggregate([
        {
            $match: matchData,
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "postId",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "postId",
                as: "comments"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $lookup: {
                from: "votes",
                let: { postId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$postId", "$$postId"] },
                                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                                ],
                            },
                        },
                    },
                ],
                as: "votes",
            },
        },
        {
            $addFields: {
                likeCount: { $size: "$likes" },
                commentCount: { $size: "$comments" },
                isLikedByUser: {
                    $in: [new mongoose.Types.ObjectId(userId), "$likes.userId"]
                },
                likedUserId: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$likes",
                                as: "like",
                                cond: { $eq: ["$$like.userId", new mongoose.Types.ObjectId(userId)] }
                            }
                        },
                        0
                    ]
                },
                latestComments: {
                    $slice: ["$comments", -3]
                }
            }
        },
        {
            $sort: { createdAt: -1 } 
        },
        {
            $skip: skip 
        },
        {
            $limit: pageSize 
        },
        {
            $project: {
                likes: 0,
                comments: 0
            }
        }
    ]);
};

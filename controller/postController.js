import mongoose from 'mongoose';
import models from '../models/index.js'
import { sendResponse } from '../utils/responseHelper.js';
import { postServices } from '../services/postServices.js';

export const createPost = async (req, res, next) => {
  try {
    const post = await models.Post.create(req.body);
    sendResponse(req, res, 200, "Post created succesfully!!!!",req.body);
  }
  catch (error) {
    next(error);
  }
}

export const getPostByUserId = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;  
    const skip = (page - 1) * limit;  

    if (!userId) {
      return sendResponse(req, res, 400, "User ID is required", {});
    }

    const posts = await models.Post.find({ userId })
      .skip(skip) 
      .limit(limit); 

    const totalPosts = await models.Post.countDocuments({ userId });

    const totalPages = Math.ceil(totalPosts / limit);

    if (posts.length === 0) {
      return sendResponse(req, res, 404, "No posts found for this user", {});
    }

    sendResponse(req, res, 200, "Posts retrieved successfully", {
      posts,  
      pagination: {
        totalPosts, 
        totalPages,  
        currentPage: page,  
        postsPerPage: limit,  
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPostDetails = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id) {
      return sendResponse(req, res, 400, "Id is required");
    }
    const response = await models.Post.findById(id);
    if (!response) {
      return sendResponse(req, res, 404, "Post not found");
    }
    sendResponse(req, res, 200, "Post get succesfully", response);
  }
  catch (error) {
    next(error);
  }
}
export const getAllPost = async (req, res, next) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit; 

    const posts = await models.Post.find()
      .skip(skip) 
      .limit(limit); 

    const totalPosts = await models.Post.find();
    console.log("totalPosts",totalPosts)
    const totalPages = Math.ceil(totalPosts / limit);

    if (!posts || posts.length === 0) {
      return sendResponse(req, res, 404, "No posts found");
    }

    sendResponse(req, res, 200, "Posts retrieved successfully", {
      totalPosts,
      pagination: {
        totalPages,
        currentPage: page,
        postsPerPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.query;

    const user = await models.Post.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return sendResponse(req, res, 404, "Post not found", {});
    }
    sendResponse(req, res, 200, "Post updated", user);
  }
  catch (error) {
    next(error);
  }
}
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.query;

    const post = await models.Post.findByIdAndDelete(id);

    if (!post) {
      return sendResponse(req, res, 404, "Post not found", {});
    }

    sendResponse(req, res, 200, "Post deleted", post);
  } catch (error) {
    next(error);
  }
};
export const getListPost = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, categoryId, fileType, userId } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageLimit;

    const query = {};
    if (categoryId) query.categoryId = new mongoose.Types.ObjectId(categoryId);
    if (fileType) query.fileType = fileType;

    const posts = await models.Post.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageLimit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $addFields: {
          "user.name": "$user.name",
          "user.image": "$user.image",
          "user.email": "$user.email"
        }
      },
      {
        $project: {
          userId: 0,
          "user.password": 0,
          "user.phone": 0,
          "user.dob": 0,
          "user.gender": 0,
          "user.seeMyProfile": 0,
          "user.shareMyPost": 0,
          "user.createdAt": 0,
          "user.updatedAt": 0,
          "user.__v": 0,
          "user.isNotification": 0
        }
      },
      { $unwind: { path: "$options", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "posts",
          let: { optionId: "$options._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$optionId", { $ifNull: ["$votes.optionId", []] }]
                }
              }
            },
            {
              $project: {
                _id: 0,
                optionId: "$votes.optionId",
                userId: "$votes.userId"
              }
            }
          ],
          as: "voteData"
        }
      },
      {
        $addFields: {
          votes: "$voteData" // Correctly set the votes field
        }
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          categoryId: { $first: "$categoryId" },
          content: { $first: "$content" },
          fileType: { $first: "$fileType" },
          createdAt: { $first: "$createdAt" },
          startTime: { $first: "$startTime" },
          endTime: { $first: "$endTime" },
          location: { $first: "$location" },
          files: { $first: "$files" },
          options: {
            $push: {
              _id: "$options._id",
              name: "$options.name",
              image: "$options.image",
              voteCount: { $size: "$voteData" },
              votes: "$votes"
            }
          }
        }
      }

    ]);

    const totalCount = await models.Post.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageLimit);

    sendResponse(req, res, 200, "Get posts with vote counts and votes details", {
      data: posts,
      page: pageNumber,
      limit: pageLimit,
      totalCount,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};
export const pollingVote = async (req, res, next) => {
  try {
    const { pollId } = req.params; // Poll ID from URL parameter
    const { userId, optionId } = req.body; // User and option IDs from request body

    // Validate poll and option IDs
    if (!mongoose.Types.ObjectId.isValid(pollId) || !mongoose.Types.ObjectId.isValid(optionId)) {
      return sendResponse(req, res, 400, "Invalid poll or option ID.");
    }

    // Find the poll by ID
    const poll = await models.Post.findById(pollId).populate("userId");
    if (!poll || poll.fileType !== 'poll') {
      return sendResponse(req, res, 400, "Poll not found.");
    }

    // Ensure option exists in the poll options
    const validOption = poll.options.some(option => option._id.toString() === optionId);
    if (!validOption) {
      return sendResponse(req, res, 400, "Invalid option ID.");
    }


    const voteIndex = poll.votes.findIndex(v => v.userId.toString() === userId);

    if (voteIndex !== -1) {

      poll.votes[voteIndex].optionId = optionId;
    } else {

      poll.votes.push({ userId, optionId });
    }


    await poll.save();
    const user = poll.userId;

    // Count votes per option
    poll.options.forEach(option => {
      option.voteCount = poll.votes.filter(vote => vote.optionId.toString() === option._id.toString()).length;
    });


    // Format the response data
    const responseData = {
      _id: poll._id,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      categoryId: poll.categoryId,
      content: poll.content,
      fileType: poll.fileType,
      createdAt: poll.createdAt,
      startTime: poll.startTime,
      endTime: poll.endTime,
      location: poll.location,
      files: poll.files,
      options: poll.options.map(option => ({
        _id: option._id,
        name: option.name,
        image: option.image,
        voteCount: poll.votes.filter(vote => vote.optionId.toString() === option._id.toString()).length,
        votes: poll.votes.filter(vote => vote.optionId.toString() === option._id.toString()),
      })),

    };

    // Send success response with formatted data
    return sendResponse(req, res, 200, "Vote recorded successfully!", responseData);
  } catch (error) {
    next(error); // Handle any error that occurs
  }
};
export const getPollDetails = async (req, res, next) => {
  try {
    const { pollId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return sendResponse(req, res, 400, "Invalid poll ID.");
    }

    const poll = await models.Post.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(pollId), fileType: "poll" } }, // Find poll by ID
      {
        $lookup: { // Populate poll creator details
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $addFields: {
          "user.name": "$user.name",
          "user.image": "$user.image"
        }
      },
      { $project: { userId: 0, "user._id": 0 } }, // Hide unnecessary fields
      { $unwind: { path: "$options", preserveNullAndEmptyArrays: true } }, // Unwind options array
      {
        $lookup: { // Count votes per option
          from: "posts",
          let: { optionId: "$options._id" },
          pipeline: [
            { $match: { $expr: { $in: ["$$optionId", { $ifNull: ["$votes.optionId", []] }] } } },
            { $project: { _id: 0, optionId: "$votes.optionId" } }
          ],
          as: "voteData"
        }
      },
      {
        $lookup: { // Populate voter details (name & image)
          from: "users",
          localField: "votes.userId", // Matching userId for voters
          foreignField: "_id",
          as: "voters"
        }
      },
      {
        $unwind: { path: "$votes", preserveNullAndEmptyArrays: true } // Ensure each vote is processed
      },
      {
        $addFields: { // Add voter details to each vote
          "votes.voter": {
            $let: {
              vars: {
                voter: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$voters",
                        as: "voter",
                        cond: { $eq: ["$$voter._id", "$votes.userId"] }
                      }
                    },
                    0
                  ]
                }
              },
              in: {
                name: "$$voter.name",
                image: { $ifNull: ["$$voter.image", null] } // Make image optional, fallback to null
              }
            }
          }
        }
      },
      {
        $group: { // Group everything back
          _id: "$_id",
          user: { $first: "$user" },
          categoryId: { $first: "$categoryId" },
          content: { $first: "$content" },
          startTime: { $first: "$startTime" },
          endTime: { $first: "$endTime" },
          createdAt: { $first: "$createdAt" },
          totalVotes: { $sum: { $cond: [{ $isArray: "$votes" }, { $size: "$votes" }, 0] } }, // Fix for non-array issues
          options: {
            $push: {
              _id: "$options._id",
              name: "$options.name",
              image: "$options.image",
              voteCount: {
                $cond: [{ $isArray: "$voteData" }, { $size: "$voteData" }, 0] // Ensure voteData is an array
              }
            }
          },
          votes: { // List of users who voted with their details
            $push: {
              userId: "$votes.userId",
              optionId: "$votes.optionId",
              voter: "$votes.voter" // Include voter details with name and image
            }
          }
        }
      }
    ]);

    if (!poll || poll.length === 0) {
      return sendResponse(req, res, 404, "Poll not found.");
    }

    return sendResponse(req, res, 200, "Poll details fetched successfully!", poll[0]);
  } catch (error) {
    next(error);
  }
};
export const VotePollesNew = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const { userId, optionId } = req.body;

    if (!userId) {
      userId = req.user.userId
    }

    // Validate pollId and optionId
    if (!mongoose.Types.ObjectId.isValid(pollId) || !mongoose.Types.ObjectId.isValid(optionId)) {
      return sendResponse(req, res, 400, "Invalid poll or option ID.");
    }

    // Find the poll
    const poll = await models.Post.findById(pollId);
    if (!poll || poll.fileType !== 'poll') {
      return sendResponse(req, res, 400, "Poll not found.");
    }

    // Ensure poll is active
    // const now = new Date();
    // if (now < new Date(poll.startTime) || now > new Date(poll.endTime)) {
    //   return sendResponse(req, res, 400, "Poll is not active.");
    // }

    // Ensure the option exists in the poll
    const validOption = poll.options.some(option => option._id.toString() === optionId);
    if (!validOption) {
      return sendResponse(req, res, 400, "Invalid option ID.");
    }

    // Check if the user has already voted in this poll
    const existingVote = await models.Vote.findOne({ postId: pollId, userId });

    if (existingVote) {
      // If the user has voted before, we check if the vote is for the same option
      if (existingVote.optionId.toString() === optionId) {
        return sendResponse(req, res, 200, "You have already voted for this option.");
      }

      // Decrease the vote count for the previous option they voted for
      const prevOptionIndex = poll.options.findIndex(option => option._id.toString() === existingVote.optionId.toString());
      if (prevOptionIndex !== -1) {
        await models.Post.updateOne(
          { _id: pollId },
          { $inc: { [`options.${prevOptionIndex}.voteCount`]: -1 } }
        );
      }

      // Update the user's vote
      existingVote.optionId = optionId;
      await existingVote.save();

      // Increment the vote count for the new option
      const newOptionIndex = poll.options.findIndex(option => option._id.toString() === optionId);
      if (newOptionIndex !== -1) {
        await models.Post.updateOne(
          { _id: pollId },
          { $inc: { [`options.${newOptionIndex}.voteCount`]: 1 } }
        );
      }
    } else {
      const newVote = new models.Vote({
        userId,
        postId: pollId,
        optionId,
      });
      await newVote.save();

      const newOptionIndex = poll.options.findIndex(option => option._id.toString() === optionId);
      if (newOptionIndex !== -1) {
        await models.Post.updateOne(
          { _id: pollId },
          { $inc: { [`options.${newOptionIndex}.voteCount`]: 1 } }
        );
      }
    }

    const matchData = {
      _id: new mongoose.Types.ObjectId(pollId)
    }
    const posts = await postServices(userId, matchData)

    return sendResponse(req, res, 200, "Vote recorded successfully!", posts[0]);
  } catch (error) {
    next(error);
  }
};
export const postListing = async (req, res, next) => {
  try {
    const { userId, fileType, page = 1, limit = 10, categoryId } = req.query;

    if (!userId) {
      userId = req.user.userId;
    }

    let matchConditions = {};

    if (categoryId) {
      matchConditions.categoryId = new mongoose.Types.ObjectId(categoryId)
    }

    if (fileType) {
      matchConditions.fileType = fileType;
    }

    const [posts, totalCount] = await Promise.all([
      postServices(userId, matchConditions, page, limit),
      models.Post.countDocuments(matchConditions)
    ]);

    return sendResponse(req, res, 200, "Posts retrieved successfully!", {
      data: posts,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getProfileData = async (req, res, next) => {
  try {
    const { fileType, page = 1, limit = 10, type } = req.query;
    const { userId } = req.user;

    const query = { userId };
    if (fileType) {
      query.fileType = fileType;
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    let posts = await models.Post.find(query)
      .skip(skip)
      .limit(pageSize);

    if (type) {
      posts = posts.filter(post => {
        let filteredFiles = [];
        // If the type is 'image'
        if (type === 'image') {
          // Check if the post has any image files
          const hasImage = post.files.some(file => file.type === 'image');
          // If the post has image files
          if (hasImage) {
            // Return both image and video files if they exist
            filteredFiles = post.files.filter(file => file.type === 'image' || file.type === 'video');
          } else {
            // If the post has only video files, exclude it
            return false;
          }
        } else if (type === 'video') {
          // If the type is 'video', only include posts that have video files and exclude posts that have any image files
          if (post.files.some(file => file.type === 'image')) {
            // Exclude the post if it contains any image files
            return false;
          }
          // Return only video files
          filteredFiles = post.files.filter(file => file.type === 'video');
        } else {
          // If no type is specified, return all files
          filteredFiles = post.files;
        }

        // If filtered files exist, return the post with those files
        if (filteredFiles.length > 0) {
          post.files = filteredFiles;
          return true;  // Include this post in the result
        }

        return false;  // Exclude this post if no files match the condition
      }).map(post => {
        return {
          ...post.toObject(),
          files: post.files
        };
      });
    }


    return sendResponse(req, res, 200, "Posts retrieved successfully!", {
      posts: posts,
      totalPosts: posts.length,
      totalPages: Math.ceil(posts.length / pageSize),
      currentPage: pageNumber,
    });

  } catch (error) {
    next(error);
  }
};



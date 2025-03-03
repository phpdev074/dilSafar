import models from '../models/index.js';
import { sendResponse } from '../utils/responseHelper.js';

export const faq = async (req, res, next) => {
  try {
    const { question, answer } = req.body;

    // Check if both question and answer are provided
    if (!question || !answer) {
      return sendResponse(req, res, 400, "Question and answer are required", {});
    }

    const response = await models.FAQ.create({ question, answer });

    console.log(response);  // Log the response to see the created document

    sendResponse(req, res, 200, "FAQ created successfully", response);  // Send the success response
  } catch (error) {
    next(error);  // If any error occurs, pass it to the next middleware (error handler)
  }
};


export const getFaqInfo = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const response = await models.FAQ.find()
      .skip(skip)
      .limit(limit);

    const totalFAQs = await models.FAQ.countDocuments();

    sendResponse(
      req,
      res,
      200,
      "FAQ fetched successfully",
      {
        data: response,
        totalItems: totalFAQs,
        totalPages: Math.ceil(totalFAQs / limit),
        currentPage: page,
      }
    );
  } catch (error) {
    next(error);
  }
};


export const updateFaqInfo = async (req, res, next) => {
  const { id, question, answer } = req.body;

  try {
    if (!id) {
      return sendResponse(req, res, 400, "ID, question, and answer are required", {});
    }

    const response = await models.FAQ.findOneAndUpdate(
      { _id: id },
      { question, answer },
      { new: true }
    );

    if (!response) {
      return sendResponse(req, res, 400, "FAQ not found", {});
    }

    sendResponse(req, res, 200, "FAQ updated successfully", response);
  } catch (error) {
    next(error);
  }
};


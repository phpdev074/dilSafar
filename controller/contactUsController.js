import models from '../models/index.js'
import { sendResponse } from '../utils/responseHelper.js';

export const contact_us = async (req, res, next) => {
  try {
    const { email, title, description } = req.body;

    if (!email || !title || !description) {
      return sendResponse(req, res, 400, "Email, title, description are required", {});
    }

    const newPage = new models.Contact_Us({
      email,
      title,
      description,
    });

    const response = await newPage.save();

    sendResponse(req, res, 200, "Contact_Us created successfully", response);
  } catch (error) {
    next(error);
  }
};
export const getContactUsInfo = async (req, res, next) => {

  try {
    const response = await models.Contact_Us.find({});
    if (response.length === 0) {
      return sendResponse(req, res, 400, "ContactUs not found", {});
    }

    sendResponse(req, res, 200, "ContactUs fetched successfully", response);
  } catch (error) {
    next(error);
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.query;

    const post = await models.Contact_Us.findByIdAndDelete(id);

    if (!post) {
      return sendResponse(req, res, 404, "ContactUs not found", {});
    }

    sendResponse(req, res, 200, "ContactUs deleted");
  } catch (error) {
    next(error);
  }
};


export const createfeedBack = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return sendResponse(req, res, 400, " title, description are required", {});
    }

    const newFeedBack = new models.FeedBack({
      ...req.body
    });

    const response = await newFeedBack.save();

    sendResponse(req, res, 200, "Thank you for giving me feedback", response);
  } catch (error) {
    next(error);
  }
};

export const getFeedBack = async (req, res, next) => {
  try {
    const response = await models.FeedBack.find();
    if (response.length === 0) {
      return sendResponse(req, res, 400, "ContactUs not found", {});
    }

    sendResponse(req, res, 200, "FeedBack fetched successfully", response);
  } catch (error) {
    next(error);
  }
};


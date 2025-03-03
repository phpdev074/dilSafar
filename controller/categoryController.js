import models from "../models/index.js";
import { sendResponse } from "../utils/responseHelper.js";

export const createCategory = async (req, res, next) => {
  try {
    const user = await models.Category.create(req.body);
    sendResponse(req, res, 200, "Category created succesfully", user);
  } catch (error) {
    next(error);
  }
};
export const getDetailCategory = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id) {
      return sendResponse(req, res, 400, "Id is required");
    }
    const response = await models.Category.findById(id);
    if (!response) {
      return sendResponse(req, res, 404, "Category not found");
    }
    sendResponse(req, res, 200, "Category get succesfully", response);
  } catch (error) {
    next(error);
  }
};
export const getListCategory = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    const skip = (pageNumber - 1) * pageLimit;

    const response = await models.Category.find(filter)
      .skip(skip)
      .limit(pageLimit)
      .exec();

    const totalCount = await models.Category.countDocuments(filter);

    const totalPages = Math.ceil(totalCount / pageLimit);

    sendResponse(req, res, 200, "Get category list", {
      data: response,
      page: pageNumber,
      limit: pageLimit,
      totalCount,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.query;

    const post = await models.Category.findByIdAndDelete(id);

    if (!post) {
      return sendResponse(req, res, 404, "ContactUs not found", {});
    }

    sendResponse(req, res, 200, "ContactUs deleted");
  } catch (error) {
    next(error);
  }
};

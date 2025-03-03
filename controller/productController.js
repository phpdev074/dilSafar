import models from "../models/index.js";
import { sendResponse } from "../utils/responseHelper.js";

export const createProduct = async (req, res, next) => {
  try {
    const { title, image,description,price } = req.body;

    const user = await models.Product.create(req.body);

    sendResponse(req, res, 200, "Product created succesfully", user);
  } catch (error) {
    next(error);
  }
};
export const getDetailProduct = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id) {
      return sendResponse(req, res, 400, "Id is required");
    }
    const response = await models.Product.findById(id);
    if (!response) {
      return sendResponse(req, res, 404, "Product not found");
    }
    sendResponse(req, res, 200, "Product get succesfully", response);
  } catch (error) {
    next(error);
  }
};
export const getListProduct = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    const skip = (pageNumber - 1) * pageLimit;

    const response = await models.Product.find(filter)
      .skip(skip)
      .limit(pageLimit)
      .exec();

    const totalCount = await models.Product.countDocuments(filter);

    const totalPages = Math.ceil(totalCount / pageLimit);

    sendResponse(req, res, 200, "Get Product list", {
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
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.query;

    const post = await models.Product.findByIdAndDelete(id);

    if (!post) {
      return sendResponse(req, res, 404, "Product not found", {});
    }

    sendResponse(req, res, 200, "Product deleted");
  } catch (error) {
    next(error);
  }
};

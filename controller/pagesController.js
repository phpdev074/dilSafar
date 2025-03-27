import models from '../models/index.js'
import { sendResponse } from '../utils/responseHelper.js';  

export const pages = async (req, res, next) => {
  try {
    const { type, title, description } = req.body;

    if (!type || !title || !description) {
      return sendResponse(req, res, 400, "Type, title, description are required", {});
    }
     
    const response = await models.Page.create({
      type,
      title,
      description,
    }); 

    sendResponse(req, res, 200, "Page created successfully", response);
  } catch (error) {
    next(error);  
  }
};
export const getPageInfo = async (req, res, next) => {
  const { type } = req.body; 
  console.log(req.query)
  try {
    if (!type) {
      return sendResponse(req, res, 400, "Type is required", {});
    }

    const response = await models.Page.findOne({ type });

    if (!response) {
      return sendResponse(req, res, 400, "Page not found", {});
    }

    sendResponse(req, res, 200, "Page fetched successfully", response);
  } catch (error) {
    next(error);  
  }
};  
export const updatePageInfo = async (req, res, next) => {
    const { type, title, description } = req.body;
  
    try {
   
      if (!type || !title || !description) {
        return sendResponse(req, res, 400, "Type, title, and description are required", {});
      }
  
      const response = await models.Page.findOneAndUpdate(
        { type }, 
        { title, description },  
        { new: true }  
      );
  
      if (!response) {
        return sendResponse(req, res, 400, "Page not found", {});
      }
  
      sendResponse(req, res, 200, "Page updated successfully", response);
    } catch (error) {
      next(error);  
    }
};

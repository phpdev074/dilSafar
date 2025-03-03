import { sendResponse } from "../utils/responseHelper.js";

export const fileUpdload = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const uploadedFiles = req.files.files; 

    const filesArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];

    const uploadedFileUrls = []; 

    for (const file of filesArray) {
      await new Promise((resolve, reject) => {
        file.mv('./public/uploads/' + file.name, (err) => {
          if (err) {
            reject(err);
          }
          uploadedFileUrls.push(`/public/uploads/${file.name}`);
          resolve();
        });
      });
    }

    return sendResponse(req, res, 200, 'Files uploaded successfully', { urls: uploadedFileUrls }
    );

  } catch (error) {
    next(error);
  }
};

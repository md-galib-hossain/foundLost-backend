import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { foundItemCategoryService } from "./itemcategory.service";
import AppError from "../../errors/AppError";

const createFoundItemCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization 
    if (!token) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found !');
      }
    const result = await foundItemCategoryService.createFoundItemCategoryIntoDB(req.body,token);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Found item category created successfully",
      data: result,
     
    });
  }
);



export const itemCategoryController = {
    createFoundItemCategory,

};

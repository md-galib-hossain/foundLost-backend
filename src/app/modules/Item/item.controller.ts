import { NextFunction, Request, RequestHandler, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { foundItemService } from "./item.service";
import { itemFilterableFields } from "./item.constant";

const createFoundItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization 
    if (!token) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Authentication token not found !');
      }
    const result = await foundItemService.createFoundItemIntoDB(req.body,token);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Found item reported successfully",
      data: result,
     
    });
  }
);

const getFoundItems = catchAsync(async (req, res) => {
  const filters = pick(req.query, itemFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await foundItemService.getFoundItemsfromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Found items retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

export const itemCategoryController = {
    createFoundItem,getFoundItems

};
